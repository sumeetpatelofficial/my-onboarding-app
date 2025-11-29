import { z } from "zod";

export const personalInfoSchema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  email: z.string().email("Invalid email"),
  phone: z
    .string()
    .transform((val) => "+" + val.replace(/\D/g, "")) // +15551234567
    .refine((val) => /^\+\d{8,15}$/.test(val), {
      message: "Invalid phone number format",
    }),
  gender: z.string().min(1, "Required"),
  password: z.string().min(6, "Password required"),
});

export type PersonalInfo = z.infer<typeof personalInfoSchema>;

export const addressSchema = z.object({
  line1: z.string().min(1),
  line2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  country: z.string().min(1),
});

export type AddressInfo = z.infer<typeof addressSchema>;

export const imageSchema = z.object({
  file: z.instanceof(File),
});

export type ImageInfo = z.infer<typeof imageSchema>;

export const singleCardSchema = z.object({
  nameOnCard: z.string().optional().or(z.literal("")),
  cardNumber: z.string().optional().or(z.literal("")),
  expiryDate: z.string().optional().or(z.literal("")),
  cvv: z.string().optional().or(z.literal("")),
});

export const fullSchema = z.object({
  cards: z.array(singleCardSchema).default([]),
  newCard: singleCardSchema.optional(),
});
