import { z } from "zod";
import { paginationSchema } from "./common.schema";

export const productFilterSchema = z
  .object({
    category: z.string().optional(),
    minPrice: z.number().positive().optional(),
    maxPrice: z.number().positive().optional(),
    search: z.string().optional(),
    sortBy: z.enum(["price", "name", "createdAt"]).optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
  })
  .merge(paginationSchema);

export type ProductFilter = z.infer<typeof productFilterSchema>;
