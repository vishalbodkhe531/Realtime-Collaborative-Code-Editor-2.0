"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type UserContextType = {
    username: string | null;
    roomId: string | null;
    code: string;
    language: string;

    setUsername: (username: string | null) => void;
    setRoomId: (roomId: string | null) => void;
    setCode: (code: string) => void;
    setLangInContext: (language: string) => void;

    resetRoom: () => void;
};


const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserContextProvider({ children }: { children: ReactNode }) {
    const [username, setUsername] = useState<string | null>(null);
    const [roomId, setRoomId] = useState<string | null>(null);
    const [code, setCode] = useState("");
    const [language, setLangInContext] = useState("javascript");

    const resetRoom = () => {
        setUsername(null);
        setRoomId(null);
    };
    

    return (
        <UserContext.Provider
            value={{
                username,
                roomId,
                code,
                language,
                setUsername,
                setRoomId,
                setCode,
                setLangInContext,
                resetRoom,
            }}
        >
            {children}
        </UserContext.Provider>
    );
}

export function useUserContext() {
    const context = useContext(UserContext);

    if (!context) {
        throw new Error("useUserContext must be used within UserContextProvider");
    }

    return context;
}
