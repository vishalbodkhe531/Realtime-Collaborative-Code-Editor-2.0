"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
        <div className="min-h-screen flex items-center justify-center select-none bg-gray-100 p-4 text-gray-900">
            <Card className="w-full max-w-lg bg-white shadow-2xl border border-gray-200">
                <CardHeader>
                    <CardTitle className="text-center text-gray-800 font-semibold">Join CollabCode</CardTitle>
                </CardHeader>

                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700 font-semibold">Username</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Your display name"
                                                className="mt-1 bg-white text-gray-800 placeholder-gray-400 border-gray-300"
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
                                        <FormLabel className="text-gray-700  font-semibold">Room ID</FormLabel>
                                        <div className="flex gap-2 mt-1">
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Enter existing room or generate one"
                                                    className="mt-1 bg-white text-gray-800 placeholder-gray-400 border-gray-300"
                                                />
                                            </FormControl>

                                            <Button
                                                type="button"
                                                onClick={generateRoomId}
                                                className="w-28 whitespace-nowrap cursor-pointer bg-blue-100 text-blue-700 hover:bg-blue-200"
                                            >
                                                Auto-generate
                                            </Button>

                                            <Button
                                                type="button"
                                                onClick={handleCopy}
                                                disabled={!roomIdValue}
                                                className="w-28 whitespace-nowrap cursor-pointer bg-green-100 text-green-700 hover:bg-green-200"
                                            >
                                                {copied ? "Copied!" : "Copy"}
                                            </Button>
                                        </div>
                                        <FormMessage />
                                        <p className="text-sm text-gray-500 mt-2">
                                            Tip: share the Room ID with collaborators to join the same session.
                                        </p>
                                    </FormItem>
                                )}
                            />

                            <div className="flex items-center justify-between gap-2">
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-orange-500 cursor-pointer text-white hover:bg-orange-600"
                                >
                                    {loading ? "Joining..." : "Join Room"}
                                </Button>

                                <Button
                                    type="button"
                                    onClick={() => form.reset()}
                                    className="bg-gray-200 cursor-pointer text-gray-800 hover:bg-gray-300"
                                >
                                    Clear
                                </Button>
                            </div>
                        </form>
                    </Form>
                    <div className="mt-4 text-center text-sm text-gray-500">
                        <span className="block">Don't have collaborators yet?</span>
                        <span className="block">Generate a Room ID and share the link.</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
