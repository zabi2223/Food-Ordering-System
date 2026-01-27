import { z } from "zod";

export const productValidation = z.object({
    name: z.string().min(3).max(100),
    price: z.number().positive(),
    description: z.string().min(5).max(500),
});

export const signupValidation = z.object({
    name: z.string().min(3).max(50),
    email: z.string().email(),
    password: z.string().min(8).max(20),
});

export const loginValidation = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(20),
});
