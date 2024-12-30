import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Required").max(256),
});

export const RegisterWarrantySchema = z.object({
  civility: z.enum(["mr", "mrs"]),
  firstname: z.string().trim().min(1, "Required field"),
  name: z.string().trim().min(1, "Required filed"),
  email: z.string().email("Invalid email format").min(1, "Required field"),
  phoneIndex: z.string().min(1, "Required field"),
  phone: z.string().min(1, "Required field"),
  birthDate: z
    .preprocess(
      (arg) => (typeof arg === "string" ? new Date(arg) : arg),
      z.date({
        required_error: "Please select a date and time",
        invalid_type_error: "That's not a date!",
      })
    )
    .refine((date) => date >= new Date("1900-01-01"), {
      message: "Can't be born before 1900",
    })
    .refine((date) => date <= new Date(), {
      message: "Can't be born in the future",
    }),
  country: z.string().min(1, "Required field"),
  password: z
    .string()
    .min(8, "Minimum of 8 characters required")
    .max(256)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must have at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 symbol"
    ),
  serial: z
    .string()
    .length(5, "Serial must be exactly 5 characters")
    .regex(/^\d{5}$/, "Serial must be exactly 5 digits"),
  placeOfPurchase: z.string().min(1, "Required field"),
  purchaseDate: z
    .preprocess(
      (arg) => (typeof arg === "string" ? new Date(arg) : arg),
      z.date({
        required_error: "Please select a date and time",
        invalid_type_error: "That's not a date!",
      })
    )
    .refine((date) => date >= new Date("2024-01-01"), {
      message: "Can't be bought before 2024",
    })
    .refine((date) => date <= new Date(), {
      message: "Can't be purchased in the future",
    }),
  terms: z.boolean().refine((value) => value, { message: "Required field" }),
  requestWarranty: z
    .boolean()
    .refine((value) => value, { message: "Required field" }),
});

export const RegisterAdminSchema = z.object({
  token: z.string().min(1, "Required field"),
  name: z.string().min(1, "Required field"),
  email: z.string().email("Invalid email format").min(1, "Required field"),
  password: z
    .string()
    .min(8, "Minimum of 8 characters required")
    .max(256)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must have at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 symbol"
    ),
});
