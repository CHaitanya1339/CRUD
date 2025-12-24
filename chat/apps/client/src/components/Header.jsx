import React, { useState } from "react";
import user from "../assets/user.png";

export default function Header({
  isUserLoggedIn,
  userName,
  activeUsers,
  totalUsers,
}) {
  const [showUsers, setShowUsers] = useState(false);

  if (!isUserLoggedIn) return null;

  return (
    <header className="relative p-4 font-bold text-lg flex items-center justify-between rounded-lg shadow-lg bg-white m-2">
      <div>
        <p className="text-sm pb-2">Realtime Chat Application</p>

        {activeUsers?.userNames?.length > 0 &&
          (activeUsers.userNames.length > 1 ? (
            <p className="text-xs">
              {activeUsers.userNames.length} are typing...
            </p>
          ) : (
            <p className="text-xs">{activeUsers.userNames[0]} is typing...</p>
          ))}
      </div>

      <div className="text-right relative">
        <div className="user flex items-center justify-end gap-2">
          <span className="text-sm">{userName}</span>
          <img src={user} width={24} height={24} alt="User avatar" />
        </div>

        <div className="participants mt-1 relative">
          <button
            className="text-xs text-green-800"
            onClick={() => setShowUsers((prev) => !prev)}
          >
            {showUsers ? "Hide Participants" : "View Participants"}
          </button>

          {showUsers && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-50">
              <ul className="max-h-40 overflow-y-auto text-xs">
                {totalUsers.map((u, index) => (
                  <li
                    key={index}
                    className="px-3 py-2 hover:bg-gray-100 cursor-default"
                  >
                    {u}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
