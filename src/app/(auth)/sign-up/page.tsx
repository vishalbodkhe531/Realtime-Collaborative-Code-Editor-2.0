"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";

const SignUp = () => {
    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignUp = async () => {
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            router.push("/login");
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted px-4">
            <div className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-xl">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-semibold tracking-tight">
                        Create an Account
                    </h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Start collaborating in real-time
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="space-y-1">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                            id="name"
                            placeholder="Enter name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <Button
                        className="w-full bg-primary cursor-pointer text-primary-foreground hover:bg-primary/90"
                        onClick={handleSignUp}
                        disabled={loading}
                    >
                        {loading ? "Creating account..." : "Create account"}
                    </Button>
                </div>

                <p className="mt-6 text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link
                        href="/sign-in"
                        className="text-primary underline underline-offset-4"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignUp;
