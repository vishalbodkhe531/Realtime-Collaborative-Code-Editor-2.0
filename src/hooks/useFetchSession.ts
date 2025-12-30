"use client";

import { useEffect, useState } from "react";

export const useFetchSession = () => {
    const [username, setUsername] = useState<string | null>(null);
    const [roomId, setRoomId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const res = await fetch("/api/me");
                const data = await res.json();

                setUsername(data.username);
                setRoomId(data.roomId);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchSession();
    }, []);

    return { username, roomId, loading };
};
