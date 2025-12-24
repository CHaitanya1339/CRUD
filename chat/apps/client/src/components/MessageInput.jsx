import React from "react";
import sendIcon from "../assets/send.png";

export default function MessageInput({
  isUserLoggedIn,
  setCurrentMessage,
  broadCastMessage,
  currentMessage,
  listenAndUpdateTypingEvents,
}) {
  return (
    <>
      {isUserLoggedIn ? (
        <div className="p-2 font-bold text-lg flex flex-row items-center justify-between rounded-lg shadow-lg bg-white m-2">
          <textarea
            className="
    w-full
    p-3
    text-sm
    font-medium
    leading-6
    
    rounded-md
  "
            placeholder="Type a message..."
            name="message"
            value={currentMessage}
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = `${e.target.scrollHeight}px`;
              setCurrentMessage(e.target.value);
            }}
            onFocus={() => listenAndUpdateTypingEvents(true)}
            onBlur={() => listenAndUpdateTypingEvents(false)}
          />
          <button onClick={broadCastMessage}>
            <img src={sendIcon} width={48} height={48}></img>
          </button>
        </div>
      ) : null}
    </>
  );
}
