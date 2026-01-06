"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Github } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { SignInFormSchema, SignInFormType } from "@/validation/formsValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const Login = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const form = useForm<SignInFormType>({
        resolver: zodResolver(SignInFormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const handleCreateAccount = () => {
        setLoading(true);
        router.push("/sign-up");
    };

    async function onSubmit(values: SignInFormType) {
        try {
            setLoading(true);

            const res = await signIn("credentials", {
                email: values.email,
                password: values.password,
                redirect: false,
            });

            if (res?.error) {
                return toast.error(res.error);
            }
            toast.success("Signed in successfully");
            router.push("/");
        } catch (err: any) {
            toast.error(err.message || "Something went wrong during sign in.");
        } finally {
            setLoading(false);
        }
    }

    const handleSignInWithGitHub = async () => {
        setLoading(true);
        await signIn("github", { callbackUrl: "/" });
        toast.success("Signed in with GitHub successfully");
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

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="you@example.com"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="••••••••"
                                            {...field}
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="space-y-4">
                            <Button
                                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                                // onClick={handleCredentialsLogin}
                                type="submit"
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
                    </form>
                </Form>

                <div className="my-6 flex items-center gap-3">
                    <div className="h-px flex-1 bg-border" />
                    <span className="text-xs text-muted-foreground">OR</span>
                    <div className="h-px flex-1 bg-border" />
                </div>

                <Button
                    onClick={handleSignInWithGitHub}
                    disabled={loading}
                    className="w-full gap-2 bg-[#24292F] cursor-pointer text-white hover:bg-[#24292F]/90"
                >
                    <Github className="h-5 w-5" />
                    Continue with GitHub
                </Button>

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
