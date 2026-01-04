"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Github } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const route = useRouter();

    const handleCredentialsLogin = async () => {
        setLoading(true);

        await signIn("credentials", {
            email,
            password,
            callbackUrl: "/",
        });

        setLoading(false);
    };

    const handleCreateAccount = () => {
        setLoading(true);
        route.push("/sign-up");
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted px-4">
            <div className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-xl">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-semibold tracking-tight">
                        Welcome Back
                    </h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Sign in to continue to the collaborative code editor
                    </p>
                </div>

                <div className="space-y-4">
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

                    <Button
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                        onClick={handleCredentialsLogin}
                        disabled={loading}
                    >
                        {loading ? "Signing in..." : "Sign in"}
                    </Button>

                    <Button
                        variant="outline"
                        className="w-full border-primary cursor-pointer text-primary hover:bg-primary/10"
                        disabled={loading}
                        onClick={handleCreateAccount}
                    >
                        Create new account
                    </Button>
                </div>

                <div className="my-6 flex items-center gap-3">
                    <div className="h-px flex-1 bg-border" />
                    <span className="text-xs text-muted-foreground">OR</span>
                    <div className="h-px flex-1 bg-border" />
                </div>

                <Button
                    className="w-full gap-2 bg-[#24292F] cursor-pointer text-white hover:bg-[#24292F]/90"
                    onClick={() => signIn("github", { callbackUrl: "/" })}
                >
                    <Github className="h-5 w-5" />
                    Continue with GitHub
                </Button>

                {/* Footer */}
                <p className="mt-6 text-center text-xs text-muted-foreground">
                    By continuing, you agree to our
                    <span className="underline underline-offset-4">Terms of Service</span>{" "}
                    and
                    <span className="underline underline-offset-4">Privacy Policy</span>.
                </p>
            </div>
        </div>

    );
};

export default Login;
