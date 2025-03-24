
import { z } from "zod";

export const blogFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title must be less than 100 characters"),
  summary: z.string().min(10, "Summary must be at least 10 characters").max(200, "Summary must be less than 200 characters"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  author: z.string().min(2, "Author name must be at least 2 characters"),
  category: z.string(),
  is_popular: z.boolean().default(false),
  is_featured: z.boolean().default(false),
  image_url: z.string().optional(),
});

export type BlogFormData = z.infer<typeof blogFormSchema>;
