"use client";

import { useEffect, useState } from "react";

type Member = {
  name: string;
  picture?: string;
  isTyping?: boolean;
};

type AvatarsProps = {
  currentRoomId: string;
  currentUser: string;
};


export function Avatars({ currentRoomId, currentUser }: AvatarsProps) {
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
    <div className="w-full max-w-xs bg-white p-4 border-l border-gray-300 overflow-auto shadow-sm">
      <h3 className="text-lg font-semibold mb-3 text-gray-800">Users in Room</h3>

      <ul className="space-y-3">
        {members.map((user, i) => {
          const isCurrent = user.name === currentUser;
          return (
            <li
              key={i}
              className={`flex items-center gap-3 p-2 rounded-lg transition ${isCurrent
                ? "bg-gray-50 border border-green-300"
                : "hover:bg-gray-100"
                }`}
            >
              <div className="relative">
                <Avatar picture={user.picture!} name={user.name} isCurrent={isCurrent} />
                {user.isTyping && <TypingIndicator />}
              </div>
              <span
                className={`text-sm truncate max-w-[120px] ${isCurrent ? "font-semibold text-green-700" : "font-medium text-gray-700"
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

export function Avatar({
  picture,
  name,
  isCurrent = false,
}: {
  picture: string;
  name: string;
  isCurrent?: boolean;
}) {
  return (
    <div
      className={`relative w-10 h-10 rounded-full overflow-hidden border-2 ${isCurrent
        ? "border-green-400 shadow-md shadow-green-400/50"
        : "border-gray-400"
        }`}
    >
      <img src={picture} alt={name} className="w-full h-full object-cover" />
    </div>
  );
}

function TypingIndicator() {
  return (
    <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-purple-500 rounded-full animate-pulse shadow-lg shadow-purple-500/50"></span>
  );
}
