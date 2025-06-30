import { useState } from "react";
import ChatBox from "./ChatBox";

interface ChatIconProps {
  userData: any;
}

const ChatIcon: React.FC<ChatIconProps> = ({ userData }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  return (
    <>
      <div className="chat-icon" onClick={() => setIsChatOpen(!isChatOpen)}>
        💬
      </div>
        {isChatOpen && (
          <ChatBox userData={userData}/>
        )}
    </>
  );
};

export default ChatIcon;
