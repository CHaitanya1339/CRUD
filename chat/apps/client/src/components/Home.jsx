import React, { useState, useEffect, useRef } from "react";
import Header from "./Header.jsx";
import ChatOverlay from "./ChatOverlay.jsx";
import MessageInput from "./MessageInput.jsx";
import { io } from "socket.io-client";

export default function Home() {
  const socket = useRef(null);

  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userNames, setUserNames] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");

  const [activeUsers, setActiveUsers] = useState({
    userNames: [],
  });

  const listenAndUpdateTypingEvents = (isTyping) => {
    if (!socket.current || !isUserLoggedIn) return;

    socket.current.emit("typing_status_update", {
      userName,
      isTyping,
    });
  };

  /* ---------------- MESSAGE ---------------- */
  const broadCastMessage = () => {
    if (!currentMessage.trim() || !socket.current) return;

    const messageData = {
      content: currentMessage,
      sender: userName,
    };

    socket.current.emit("send_message", messageData);

    setMessages((prev) => [...prev, { ...messageData, type: "sender" }]);
    setCurrentMessage("");
  };

  const joinTeam = () => {
    if (!userName.trim() || !socket.current) return;
    socket.current.emit("join", { userName: userName });
  };

  useEffect(() => {
    socket.current = io("http://localhost:8081");
    const s = socket.current;

    s.on("connect", () => {
      console.log("Client connected");
    });

    s.on("join_success", () => {
      setIsUserLoggedIn(true);
    });

    s.on("join_error", ({ message }) => {
      alert(message);
    });

    s.on("users_changed", (data) => {
      setUserNames(Array.isArray(data) ? data : []);
    });

    s.on("user_joined", ({ userName }) => {
      setMessages((prev) => [
        ...prev,
        { type: "notification", state: "joined", userName },
      ]);
    });

    s.on("user_left", ({ userName }) => {
      setMessages((prev) => [
        ...prev,
        { type: "notification", state: "left", userName },
      ]);

      setActiveUsers((prev) => ({
        userNames: prev.userNames.filter((u) => u !== userName),
      }));
    });

    s.on("typing_data", (data) => {
      setActiveUsers({
        userNames: Array.isArray(data?.userNames) ? data.userNames : [],
      });
    });

    s.on("receive_message", (data) => {
      setMessages((prev) => [...prev, { ...data, type: "receiver" }]);
    });

    return () => {
      s.removeAllListeners();
      if (s.connected) s.disconnect();
    };
  }, []);

  return (
    <div className="h-screen w-full max-w-sm mx-auto flex flex-col bg-gray-100 border rounded-lg shadow-lg overflow-hidden">
      <Header
        isUserLoggedIn={isUserLoggedIn}
        userName={userName}
        activeUsers={activeUsers}
        totalUsers={userNames}
      />

      <ChatOverlay
        isUserLoggedIn={isUserLoggedIn}
        setUserName={setUserName}
        messages={messages}
        userName={userName}
        joinTeam={joinTeam}
      />

      <MessageInput
        isUserLoggedIn={isUserLoggedIn}
        currentMessage={currentMessage}
        setCurrentMessage={setCurrentMessage}
        broadCastMessage={broadCastMessage}
        listenAndUpdateTypingEvents={listenAndUpdateTypingEvents}
      />
    </div>
  );
}
