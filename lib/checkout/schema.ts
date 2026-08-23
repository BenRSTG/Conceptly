import { z } from "zod";

export const checkoutRequestSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().uuid(),
        variantId: z.string().uuid().nullable(),
        quantity: z.number().int().positive(),
      }),
    )
    .min(1),
  email: z.string().trim().email(),
  address: z.object({
    fullName: z.string().trim().min(1),
    street: z.string().trim().min(1),
    houseNumber: z.string().trim().min(1),
    postalCode: z.string().trim().min(1),
    city: z.string().trim().min(1),
    country: z.string().trim().min(2),
  }),
});

export type CheckoutRequest = z.infer<typeof checkoutRequestSchema>;
