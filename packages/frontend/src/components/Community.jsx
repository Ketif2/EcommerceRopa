import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import DOMPurify from "dompurify"; // Importar DOMPurify
import { useChat } from "../context/ChatContext";
import { useAuth } from "../context/AuthContext";

const socket = io("http://localhost:3000");

const Community = () => {
  const [message, setMessage] = useState("");
  const { chatHistory, setChatHistory } = useChat();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      socket.emit("setUserData", { username: user.username });

      socket.on("chatMessage", (msg) => {
        setChatHistory((prev) => [...prev, msg]);
      });

      return () => {
        socket.off("chatMessage");
      };
    }
  }, [user, setChatHistory]);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("chatMessage", message);
      setMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-[#141D26] p-4 border-b border-[#233446]">
        <span className="text-[#E0E1D1]">
          Connected as: {user?.username || "Unknown"}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col space-y-2">
        {chatHistory.length > 0 ? (
          chatHistory.map((msg, index) => (
            <div
              key={index}
              className={`p-2 rounded-lg shadow max-w-xs ${
                msg.username === user.username
                  ? "bg-[#C41E5C] self-end"
                  : "bg-[#233446] self-start"
              } text-[#E0E1D1]`}
            >
              <div className="text-sm opacity-75 mb-1">{msg.username}</div>
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(msg.text),
                }}
              ></div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400">No messages yet...</div>
        )}
      </div>

      <div className="p-4 bg-[#141D26] shadow flex">
        <input
          type="text"
          className="flex-1 border border-[#E0E1D1] rounded p-2 bg-[#233446] text-[#E0E1D1]"
          placeholder="Write a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button
          onClick={sendMessage}
          className="ml-2 bg-[#C41E5C] text-white p-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Community;