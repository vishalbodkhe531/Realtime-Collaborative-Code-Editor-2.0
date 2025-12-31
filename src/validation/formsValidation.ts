import { z } from "zod";

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
