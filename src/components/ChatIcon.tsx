import { useState } from "react";

const ChatIcon = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  return (
    <>
      <div className="chat-icon" onClick={() => setIsChatOpen(!isChatOpen)}>
        💬
      </div>

      {isChatOpen && (
        <div className="figma-chatbox">
          <div className="chat-message incoming">
            Hey, How can I help you today?
          </div>
          <p>dfiun</p>
          <p>dfiun</p>
          <p>dfiun</p>
          <input
            className="chat-input"
            type="text"
            placeholder="Type your message.."
          />
        </div>
      )}
    </>
  );
};

export default ChatIcon;
