import * as z from "zod";

export const locationSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(50),
  description: z.string().min(10, "Please provide a more detailed description").max(500),
  category: z.string().min(1, "Please select a category"),
  address: z.string().min(5, "Please provide an approximate address in Dallas"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export type LocationFormValues = z.infer<typeof locationSchema>;
