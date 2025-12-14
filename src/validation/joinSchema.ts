import { z } from "zod";

export const joinSchema = z.object({
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

export type JoinInput = z.infer<typeof joinSchema>;
