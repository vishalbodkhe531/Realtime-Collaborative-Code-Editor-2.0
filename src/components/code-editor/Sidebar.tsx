"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ExistingUserPanel } from "./ExistingUserPanel ";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";




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



            {/* <div className="p-2 border-t border-border">
                <Button
                    onClick={onExit}
                    className="w-full bg-orange-500 text-white hover:bg-red-600 cursor-pointer"
                >
                    Exit Room
                </Button>
            </div> */}
            <div className="p-2 border-t border-border">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="w-full bg-orange-500 text-white hover:bg-red-600 cursor-pointer">
                            Exit Room
                        </Button>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Save your work?</DialogTitle>
                            <DialogDescription>
                                You can save this code file for later or delete it permanently.
                            </DialogDescription>
                        </DialogHeader>

                        {/* Save Form */}
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium">File Name *</label>
                                <Input placeholder="example.tsx" />
                            </div>

                            <div>
                                <label className="text-sm font-medium">Description</label>
                                <Textarea placeholder="Optional description..." />
                            </div>
                        </div>

                        <DialogFooter className="flex justify-between gap-2">
                            <Button variant="outline" className="cursor-pointer">
                                Cancel
                            </Button>

                            <Button variant="destructive" className="cursor-pointer">
                                Delete & Exit
                            </Button>

                            <Button className="bg-green-600 hover:bg-green-700 text-white cursor-pointer">
                                Save & Exit
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

            </div>
        </div>

    );
}


