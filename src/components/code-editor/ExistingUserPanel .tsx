"use client";

import { useEffect, useState } from "react";
import { Avatar } from "./Avatar";
import { TypingIndicator } from "./TypingIndicator";
import { AvatarsProps, Member } from "@/types/appTypes";

export function ExistingUserPanel({ currentRoomId, currentUser }: AvatarsProps) {
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    if (!currentRoomId) return;

    const fetchMembers = async () => {
      const res = await fetch(`/api/users?roomId=${currentRoomId}`);
      const data = await res.json();
      const mapped = (data.members || []).map((name: string) => ({
        name,
        picture: `https://api.dicebear.com/7.x/identicon/svg?seed=${name}`,
        isTyping: false,
      }));

      setMembers(mapped);
    };

    fetchMembers();
    const interval = setInterval(fetchMembers, 5000);
    return () => clearInterval(interval);
  }, [currentRoomId]);

  return (
    <div className="w-full max-w-xs bg-white dark:bg-gray-900 p-4 border-l border-gray-300 dark:border-gray-700 overflow-auto shadow-sm">
      <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">
        Users in Room
      </h3>

      <ul className="space-y-3">
        {members.map((user, i) => {
          const isCurrent = user.name === currentUser;
          return (
            <li
              key={i}
              className={`flex items-center gap-3 p-2 rounded-lg transition
            ${isCurrent
                  ? "bg-gray-50 dark:bg-gray-800 border border-green-300 dark:border-green-600"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
            >
              <div className="relative">
                <Avatar
                  picture={user.picture!}
                  name={user.name}
                  isCurrent={isCurrent}
                />
                {user.isTyping && <TypingIndicator />}
              </div>

              <span
                className={`text-sm truncate max-w-[120px]
              ${isCurrent
                    ? "font-semibold text-green-700 dark:text-green-400"
                    : "font-medium text-gray-700 dark:text-gray-300"
                  }`}
              >
                {user.name} {isCurrent && "(You)"}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

