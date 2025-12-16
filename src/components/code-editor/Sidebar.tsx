"use client";

import { Button } from "@/components/ui/button";
import { ExistingUserPanel } from "./ExistingUserPanel ";

interface SidebarProps {
    roomId: string;
    username: string;
    onExit: () => void;
}

export function Sidebar({ roomId, username, onExit }: SidebarProps) {
    return (
        <div className="flex flex-col w-64 border-l border-border bg-muted/40">
            <div className="flex-1 overflow-auto p-2">
                <ExistingUserPanel currentRoomId={roomId} currentUser={username} />
            </div>

            <div className="p-2 border-t border-border">
                <Button
                    onClick={onExit}
                    className="w-full bg-orange-500 text-white hover:bg-red-600 cursor-pointer"
                >
                    Exit Room
                </Button>
            </div>
        </div>

    );
}
