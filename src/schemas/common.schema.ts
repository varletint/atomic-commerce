import { z } from "zod";
import { REGEX_PATTERNS } from "@/constants";

export const emailSchema = z.string().email("Invalid email address");

export const phoneSchema = z
  .string()
  .regex(REGEX_PATTERNS.PHONE, "Invalid phone number");

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(
    REGEX_PATTERNS.PASSWORD,
    "Password must contain uppercase, lowercase, number, and special character",
  );

export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
});

export const idSchema = z.string().uuid("Invalid ID format");
