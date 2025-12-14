"use client";

import { CollaborativeEditor } from "@/components/CollaborativeEditor";
import { Room } from "@/utils/Room";
import React, { useEffect, useState } from "react";

const EditorPage = () => {
    const [username, setUsername] = useState<string | null>(null);
    const [roomId, setRoomId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchSession() {
            try {
                const res = await fetch("/api/me");
                const data = await res.json();
                setUsername(data.username);
                setRoomId(data.roomId);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchSession();
    }, []);

    if (loading) return <div className="text-white">Loading editor...</div>;
    if (!username || !roomId) return <div className="text-white">Please join a room first.</div>;

    return (
        <Room>
            <CollaborativeEditor username={username} roomId={roomId} />
        </Room>
    );
};

export default EditorPage;
