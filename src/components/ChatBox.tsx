import { useState, useEffect, useRef, useContext } from "react";
import DataContext from "@/context/DataContext";

interface Message {
    role: "user" | "assistant" | "system";
    content: string;
}

interface ChatBoxProps {
    userData: any;
}

const ChatBox: React.FC<ChatBoxProps> = ({ userData }) => {
    const [userInput, setUserInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([
        { role: "assistant", content: "Hey, How can I help you today?"}
    ]);

    const context = useContext(DataContext);
    if (!context) {
        throw new Error("ChatBox must be used within a DataContext.Provider");
    }

    const { aiPlan, setAiPlan } = context;


    const conversationRef = useRef<HTMLDivElement>(null);

     useEffect(() => {
        if (conversationRef.current) {
        conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async() => {
        const u = userInput;
        setUserInput("");
        if (u.trim() === "") return;

        const newUserMessage: Message = {  role: "user", content: u };
        setMessages((prevMessages) => [...prevMessages, newUserMessage]);

        try {
            const prompt = [
                {
                    role: "system",
                    content: `You are a helpful financial assistant. You need to help user with their ai generated plan. If user ask something take in account ai plan:${aiPlan} and user info :${JSON.stringify(userData)}.`
                },
                ...messages,
                newUserMessage
            ];

            const response = await fetch("/api/conversation", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: prompt })
            });

            const data = await response.json();

            if(!data.reply) throw new Error("No reply from server");

            const newBotMessage: Message = { role: "assistant", content: data.reply };
            setMessages((prevMessages) => [...prevMessages, newBotMessage]);
            

            setUserInput("");

        } catch (error) {
            const errorMessage: Message = {
                role: "assistant",
                content: "Sorry, something went wrong. Please try again."
            };
            setMessages((prevMessages) => [...prevMessages, errorMessage]);
        }

        
    };


    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSendMessage();
        }
    };

  return (
    <>  
        <div className="figma-chatbox">
            <div className="conversation" ref={conversationRef}>
            {messages.map((message, index) => (
                <div
                key={index}
                className={`chat-message ${
                    message.role === "user" ? "outgoing" : "incoming"
                }`}
                >
                <pre id="ai-res">{message.content}</pre>
                </div>
            ))}
            </div>


            <div className="chat-input-container">
                <input
                className="chat-input"
                type="text"
                placeholder="Type your message.."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={handleKeyPress}
                />
                <button className="chat-send-button" onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    </>
  );
};

export default ChatBox;
