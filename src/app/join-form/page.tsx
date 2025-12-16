"use client";

import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { handleJoinForm } from "@/hooks/useJoinAction";

const JoinSchema = z.object({
    username: z
        .string()
        .min(3, "Username must be at least 3 characters")
        .regex(
            /^[a-zA-Z0-9_]+$/,
            "Username can only contain letters, numbers, and underscores"
        ),
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
            form.setError("username", {
                message: res.error || "Something went wrong",
            });
            setLoading(false);
            return;
        }

        router.push("/editor");
    }

    return (
        <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="Your display name" {...field} />
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
                                <FormLabel>Room ID</FormLabel>

                                <div className="flex gap-2">
                                    <FormControl>
                                        <Input placeholder="Enter or generate room ID" {...field} />
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
                            </FormItem>
                        )}
                    />

                    <div className="flex gap-2">
                        <Button type="submit" disabled={loading} className="flex-1 cursor-pointer">
                            {loading ? "Joining..." : "Join Room"}
                        </Button>

                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => form.reset()}
                            className="cursor-pointer"
                        >
                            Clear
                        </Button>
                    </div>
                </form>
            </Form>

            <p className="mt-4 text-center text-sm text-muted-foreground">
                Generate a Room ID and share it with collaborators.
            </p>
        </CardContent>
    );
}
