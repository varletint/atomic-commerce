import { z } from "zod";
import { emailSchema, phoneSchema } from "./common.schema";

export const shippingAddressSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  address: z.string().min(5),
  city: z.string().min(2),
  state: z.string().min(2),
  zipCode: z.string().min(5),
  country: z.string().min(2),
  phone: phoneSchema,
});

export const checkoutSchema = z.object({
  email: emailSchema,
  shippingAddress: shippingAddressSchema,
  billingAddress: shippingAddressSchema.optional(),
  sameAsShipping: z.boolean().default(true),
});

export type ShippingAddress = z.infer<typeof shippingAddressSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
