"use client";

import { ExistingUserPanel } from "./ExistingUserPanel ";

import ExitForm from "./ExitForm";

interface SidebarProps {
    roomId: string;
    username: string;
    onExit: () => void;
}

export function Sidebar({ roomId, username, onExit }: SidebarProps) {
    return (
        <div className="flex flex-col w-64 border-l border-border bg-background">
            <div className="flex-1 overflow-auto p-3">
                <ExistingUserPanel
                    currentRoomId={roomId}
                    currentUser={username}
                />
            </div>

            <div className="p-3 border-t border-border">
                <ExitForm />
            </div>
        </div>


    );
}


