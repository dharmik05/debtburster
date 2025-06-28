import { useState } from "react";
import ChatBox from "./ChatBox";
// import DataContext from "@/context/DataContext";

interface ChatIconProps {
  userData: any;
}

const ChatIcon: React.FC<ChatIconProps> = ({ userData }) => {
  console.log("ChatIcon props:", userData );
  const [isChatOpen, setIsChatOpen] = useState(false);
  return (
    <>
      <div className="chat-icon" onClick={() => setIsChatOpen(!isChatOpen)}>
        💬
      </div>
      {/* <DataContext.Provider value={{aiPlan, setAiPlan}}> */}
        {isChatOpen && (
          <ChatBox userData={userData}/>
        )}
      {/* </DataContext.Provider> */}
    </>
  );
};

export default ChatIcon;
