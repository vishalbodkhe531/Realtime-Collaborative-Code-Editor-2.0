import React from "react";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog"
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { DialogFooter } from "../ui/dialog";
import { X } from "lucide-react";

const ExitForm = () => {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button className="w-full bg-orange-500 text-white hover:bg-orange-600 transition-colors cursor-pointer">
                    Exit Room
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent className="border py-3 shadow-[0_0_20px_rgba(255,255,255,0.4)]">
                <div className="flex items-center justify-between border-b px-6 py-0">
                    <AlertDialogTitle className="text-base font-semibold">
                        Exit Room
                    </AlertDialogTitle>

                    <AlertDialogCancel asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                            <X className="h-4 w-4 cursor-pointer" />
                        </Button>
                    </AlertDialogCancel>
                </div>

                <div className="px-6 py-0">
                    <p className="text-sm text-muted-foreground">
                        Save this code file for later or delete it permanently before leaving the room.
                    </p>
                </div>

                <div className="space-y-4 border-t px-6 py-0">
                    <div className="space-y-1">
                        <label className="text-sm font-medium">File Name *</label>
                        <Input placeholder="example.tsx" />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium">Description</label>
                        <Textarea
                            placeholder="Optional description..."
                            className="resize-none"
                        />
                    </div>
                </div>

                <DialogFooter className="border-t  px-6 py-4">
                    <div className="flex w-full items-center justify-end gap-2">
                        <Button className="bg-red-600 hover:bg-red-700 cursor-pointer text-white">
                            Delete & Exit
                        </Button>

                        <Button className="bg-green-600 text-white hover:bg-green-700 cursor-pointer">
                            Save & Exit
                        </Button>
                    </div>
                </DialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
};

export default ExitForm;
