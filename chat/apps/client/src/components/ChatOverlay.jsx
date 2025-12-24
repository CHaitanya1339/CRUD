import { useEffect } from "react";

export default function ChatOverlay({
  isUserLoggedIn,
  setUserName,
  messages,
  userName,
  joinTeam,
}) {
  useEffect(() => {
    const chatContainer = document.querySelector(".chat-container");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
      // Hide scrollbar
      chatContainer.style.scrollbarWidth = "none";
      chatContainer.style.msOverflowStyle = "none";
    }
  }, [messages]);
  return (
    <>
      {isUserLoggedIn ? (
        <div
          className="
          chat-container
flex-1
overflow-y-auto
p-2
scroll-pb-4
"
        >
          {messages &&
            messages.map((message, index) => {
              if (message.type === "notification") {
                return (
                  <div key={index} className="flex justify-center mb-2">
                    <div
                      className={` text-white px-3 py-2 rounded-lg text-sm ${
                        message.state === "joined"
                          ? "bg-green-600"
                          : "bg-orange-300"
                      }`}
                    >
                      {message.userName} {message.state} the chat!
                    </div>
                  </div>
                );
              } else {
                return (
                  <div
                    key={index}
                    className={`flex mb-2 ${
                      message.type === "sender"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                        message.type === "sender"
                          ? "bg-blue-400 text-white"
                          : "bg-white text-gray-900"
                      }`}
                    >
                      <strong>
                        {message.sender === userName
                          ? "You  "
                          : `${message.sender} `}
                      </strong>
                      <br />
                      {message.content}
                    </div>
                  </div>
                );
              }
            })}
        </div>
      ) : (
        <div className="h-auto w-auto p-4 m-auto rounded-lg shadow-lg border-zinc-700 border bg-white">
          <p className="align-middle text-lg mb-2 font-bold">
            Welcome to Real Time Chat Application
          </p>
          <p className="text-md">What do we call you!</p>
          <div className="flex justify-between gap-10 mt-2">
            <input
              className="m-0 text-gray-500 border-b-2 border-gray-300 focus:border-blue-400 outline-none px-2 py-1 w-full"
              placeholder="Enter your name"
              name="name"
              type="text"
              onChange={(e) => {
                setUserName(e.target.value);
              }}
            />
            <button
              disabled={userName.length === 0}
              onClick={() => {
                joinTeam();
              }}
            >
              <span
                className={`m-auto text- p-2 rounded-xl text-white bg-green-600 ${
                  userName.length === 0 ? "opacity-50" : ""
                }`}
              >
                Join
              </span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
