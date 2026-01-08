"use client"

import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import { DialogFooter } from "../ui/dialog";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

import { useUserContext } from "@/context/userContext";
import { exitFormSchema, exitFormSchemaType } from "@/validation/formsValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { saveFile } from "@/hooks/useExitRoom";
import { useState } from "react";


const ExitForm = () => {
    const { username, roomId, code, language, resetRoom } = useUserContext();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);


    const form = useForm<exitFormSchemaType>({
        resolver: zodResolver(exitFormSchema),
        defaultValues: {
            fileName: "",
            description: ""
        },
    })


    const onSubmit = async (data: exitFormSchemaType) => {
        if (!roomId || !username) {
            toast.error("Missing room data");
            return;
        }

        setIsLoading(true);

        try {
            const payload = {
                name: data.fileName,
                description: data.description,
                code,
                language,
                roomId,
                username,
            };

            const result = await saveFile(payload);

            if (!result?.success) {
                toast.error("Failed to save file");
                return;
            }

            toast.success("File saved successfully");
            resetRoom();
            router.push("/");

        } catch (error) {
            toast.error("Network error");
        }
    };


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
                        Leave Room
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
                        You’re about to leave this room. Before exiting, you can save the current code for future reference or permanently delete it.
                    </p>
                </div>

                <div className="space-y-4 border-t px-6 py-0">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="fileName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>File Name *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="ex : sort-array" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Choose a clear and descriptive name so you can easily identify this file later.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Add a short note about what this file contains (optional)"
                                                className="resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Optional details to help you remember the purpose or context of this file.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <DialogFooter className="border-t px-6 py-4">
                                <div className="flex w-full items-center justify-end gap-2">
                                    <Button type="button" disabled={isLoading} onClick={() => router.push("/")} className="bg-red-600 hover:bg-red-700 cursor-pointer text-white"
                                    >
                                        {isLoading ? "Processing..." : "Delete File & Exit"}
                                    </Button>

                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="bg-green-600 text-white hover:bg-green-700 cursor-pointer disabled:opacity-60"
                                    >
                                        {isLoading ? "Saving..." : "Save File & Exit"}
                                    </Button>
                                </div>
                            </DialogFooter>
                        </form>
                    </Form>
                </div>
            </AlertDialogContent>
        </AlertDialog >

    )
};

export default ExitForm;

