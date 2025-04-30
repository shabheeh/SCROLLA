import { z } from "zod";

export const articleFormSchema = z.object({
  title: z
    .string()
    .min(20, "Title must be atleast 20 charachters")
    .max(60, "Title must be no more than 60 characters."),
  subtitle: z
    .string()
    .min(10, "Subtitle must be atleast 10 charachters")
    .max(100, "Subtitle must be no more than 100 characters."),
  topics: z.array(z.string()).refine((val) => val.length > 0, {
    message: "Please select at least one topic",
  }),
});

export type ArticleFormValues = z.infer<typeof articleFormSchema>