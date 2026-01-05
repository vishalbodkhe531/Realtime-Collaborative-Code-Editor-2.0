import { z } from "zod";

export const signUpSchema = z
  .object({
    name: z
      .string()
      .min(2, "Full name must be at least 2 characters")
      .refine((val) => val.trim().length > 0, "Name cannot be empty"),

    email: z
      .string()
      .min(1, "Email is required")
      .refine((val) => val.trim().length > 0, "Email cannot be empty or spaces")
      .email("Please enter a valid email address"),

    password: z
      .string()
      .min(3, "Password must be at least 3 characters"),

    confirmPassword: z
      .string()
      .min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type signUpType = z.infer<typeof signUpSchema>;

export const SignInFormSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .refine((val) => !/\s/.test(val), "Email cannot contain spaces"),

  password: z
    .string()
    .trim()
    .min(3, "Password must be at least 3 characters")
    .refine((val) => !/\s/.test(val), "Password cannot contain spaces"),
});

export type SignInFormType = z.infer<typeof SignInFormSchema>;


export const joinFormSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores")
    .refine((val) => !/\s/.test(val), "Username cannot contain spaces"),

  roomId: z
    .string()
    .trim()
    .min(3, "Room ID must be at least 3 characters")
    .refine((val) => !/\s/.test(val), "Room ID cannot contain spaces"),
});

export type joinFormType = z.infer<typeof joinFormSchema>;


export const exitFormSchema = z.object({
  fileName: z
    .string()
    .trim()
    .min(2, "File name must be at least 2 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "File name can only contain letters, numbers, and underscores")
    .refine((val) => !/\s/.test(val), "File name cannot contain spaces"),

  description: z.string()
});

export type exitFormSchemaType = z.infer<typeof exitFormSchema>;


