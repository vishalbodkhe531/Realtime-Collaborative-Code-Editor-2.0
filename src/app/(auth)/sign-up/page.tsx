"use client";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { signUp } from "@/hooks/useAuth";
import { signUpSchema, signUpType } from "@/validation/formsValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";


const SignUp = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const form = useForm<signUpType>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const handleSignUp = async (values: signUpType) => {
        try {
            setLoading(true);

            const res = signUp(values);

            if (!res) {
                toast.error("Failed to create account");
                return;
            }

            toast.success("Account created successfully!");

            const loginRes = await signIn("credentials", {
                email: values.email,
                password: values.password,
                redirect: false,
            });

            if (loginRes?.error) {
                toast.error(loginRes.error);
                return;
            }

            toast.success("Registration successful!");
            router.push("/sign-in");
        } catch (error: any) {
            console.error("Signup error:", error.message);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    }


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

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSignUp)} className="space-y-5">

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

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

                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm Password</FormLabel>
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

                        <Button
                            type="submit"
                            className="w-full bg-primary cursor-pointer text-primary-foreground hover:bg-primary/90"
                            disabled={loading}
                        >
                            {loading ? "Creating account..." : "Create account"}
                        </Button>
                    </form>
                </Form>


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
