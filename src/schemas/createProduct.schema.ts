import { z } from 'zod';

const optionalNumber = z.preprocess(
  (val) => (val === '' || val === undefined ? undefined : Number(val)),
  z.number().min(0).optional()
);

export const createProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(1, 'Description is required'),
  shortDescription: z.string().optional(),
  price: z.coerce.number().min(0, 'Price cannot be negative'),
  compareAtPrice: optionalNumber,
  costPrice: optionalNumber,
  category: z.string().min(1, 'Category is required'),
  brand: z.string().optional(),
  tags: z.string().optional(),
  productType: z.enum(['physical', 'digital', 'service']).default('physical'),
  weight: optionalNumber,
  weightUnit: z.enum(['g', 'kg', 'lb', 'oz']).default('g'),
  material: z.string().optional(),
  isFeatured: z.boolean().default(false),
  minOrderQty: z.coerce.number().int().min(1).default(1),
  initialStock: z.coerce.number().int().min(0).default(0),
});

export type CreateProductFormValues = z.infer<typeof createProductSchema>;
