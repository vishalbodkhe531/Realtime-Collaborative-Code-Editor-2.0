"use client";

import { ReactNode, useEffect, useState } from "react";
import { RoomProvider } from "@liveblocks/react/suspense";
import { ClientSideSuspense } from "@liveblocks/react";
import Loading from "../components/code-editor/Loading";

export function Room({ children }: { children: ReactNode }) {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRoomFromCookie() {
      try {
        const res = await fetch("/api/me");
        const data = await res.json();

        if (data.roomId) {
          setRoomId(data.roomId);
        } else {
          console.warn("No roomId found in cookies");
        }
      } catch (err) {
        console.error("Failed to fetch session:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchRoomFromCookie();
  }, []);

  if (loading) return <Loading />;
  if (!roomId) return <div className="text-white p-4">No room found</div>;

  return (
    <RoomProvider
      id={`liveblocks:examples:${roomId}`}
      initialPresence={{ cursor: null }}
    >
      <ClientSideSuspense fallback={<Loading />}>
        {children}
      </ClientSideSuspense>
    </RoomProvider>
  );
}
