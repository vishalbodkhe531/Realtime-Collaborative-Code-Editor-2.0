"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { X } from "lucide-react"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { handleJoinForm } from "@/hooks/useJoinAction";
import { AlertDialogCancel, AlertDialogContent, AlertDialogTitle } from "@/components/ui/alert-dialog";


const JoinSchema = z.object({
    username: z
        .string()
        .min(3, "Username must be at least 3 characters")
        .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),

    roomId: z.string().min(3, "Room ID must be at least 3 characters"),
});

type JoinValues = z.infer<typeof JoinSchema>;

export default function JoinForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const form = useForm<JoinValues>({
        resolver: zodResolver(JoinSchema),
        defaultValues: {
            username: "",
            roomId: "",
        },
    });

    const roomIdValue = form.watch("roomId");

    function generateRoomId() {
        const id =
            typeof crypto !== "undefined" && crypto.randomUUID
                ? crypto.randomUUID()
                : `room-${Date.now().toString(36)}`;

        form.setValue("roomId", id.slice(0, 8));
        setCopied(false);
    }

    function handleCopy() {
        if (!roomIdValue) return;

        navigator.clipboard.writeText(roomIdValue).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }

    async function onSubmit(values: JoinValues) {
        setLoading(true);

        const res = await handleJoinForm(values);

        if (!res.success && res.errorType === "validation") {
            res.errors.forEach((issue: any) => {
                form.setError(issue.path[0], { message: issue.message });
            });

            setLoading(false);
            return;
        }

        if (!res.success) {
            form.setError("username", { message: res.error || "Something went wrong" });
            setLoading(false);
            return;
        }

        router.push("/editor");
    }

    return (
        <div className="">
            <Card className="relative w-full max-w-lg dark:bg-card shadow-2xl border border-gray-200 dark:border-border">
                <CardHeader className="relative">
                    <CardTitle className="text-center font-semibold text-gray-800 dark:text-gray-100">
                        Join CollabCode
                    </CardTitle>

                    {/* <AlertDialogCancel asChild>
                        <Button
                            variant="secondary"
                            size="icon"
                            className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </AlertDialogCancel> */}
                    <AlertDialogContent>
                        <CardHeader className="relative">
                            <AlertDialogTitle className="text-center font-semibold">
                                Join CollabCode
                            </AlertDialogTitle>

                            <AlertDialogCancel asChild>
                                <Button
                                    variant="secondary"
                                    size="icon"
                                    className="absolute right-4 top-1/2 -translate-y-1/2"
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            </AlertDialogCancel>
                        </CardHeader>

                        <JoinForm />
                    </AlertDialogContent>

                </CardHeader>


                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-semibold text-gray-700 dark:text-gray-300">
                                            Username
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Your display name"
                                                className="bg-white dark:bg-background
                               text-gray-800 dark:text-gray-100
                               placeholder-gray-400 dark:placeholder-gray-500
                               border-gray-300 dark:border-border"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="roomId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-semibold text-gray-700 dark:text-gray-300">
                                            Room ID
                                        </FormLabel>

                                        <div className="flex gap-2">
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Enter or generate room ID"
                                                    className="bg-white dark:bg-background
                                 text-gray-800 dark:text-gray-100
                                 placeholder-gray-400 dark:placeholder-gray-500
                                 border-gray-300 dark:border-border"
                                                />
                                            </FormControl>

                                            <Button
                                                type="button"
                                                onClick={generateRoomId}
                                                className="bg-blue-100 text-blue-700 hover:bg-blue-200
                               dark:bg-blue-900/40 dark:text-blue-300 dark:hover:bg-blue-900/60 cursor-pointer"
                                            >
                                                Auto
                                            </Button>

                                            <Button
                                                type="button"
                                                onClick={handleCopy}
                                                disabled={!roomIdValue}
                                                className="bg-green-100 text-green-700 hover:bg-green-200
                               dark:bg-green-900/40 dark:text-green-300 dark:hover:bg-green-900/60 cursor-pointer"
                                            >
                                                {copied ? "Copied!" : "Copy"}
                                            </Button>
                                        </div>

                                        <FormMessage />
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                            Share this Room ID to collaborate.
                                        </p>
                                    </FormItem>
                                )}
                            />

                            <div className="flex gap-2">
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-orange-500 text-white hover:bg-orange-600 cursor-pointer"
                                >
                                    {loading ? "Joining..." : "Join Room"}
                                </Button>

                                <Button
                                    type="button"
                                    onClick={() => form.reset()}
                                    className="bg-gray-200 text-gray-800 hover:bg-gray-300
                         dark:bg-muted dark:text-gray-200 dark:hover:bg-muted/80 cursor-pointer"
                                >
                                    Clear
                                </Button>
                            </div>

                        </form>
                    </Form>

                    <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        <span className="block">Don’t have collaborators?</span>
                        <span className="block">Generate a Room ID and share it.</span>
                    </div>
                </CardContent>
            </Card>
        </div>

    );
}
