import { z } from "zod";

export const profileFormSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    phone: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),
    email: z.string().email("Please enter a valid email address"),
    dob: z
      .date({
        required_error: "Please select a date of birth",
      })
      .refine((date) => {
        const today = new Date();
        const age = today.getFullYear() - date.getFullYear();
        const monthDiff = today.getMonth() - date.getMonth();
        if (
          monthDiff < 0 ||
          (monthDiff === 0 && today.getDate() < date.getDate())
        ) {
          return age - 1 >= 12;
        }
        return age >= 12;
      }, "You must be at least 12 years old"),
    preferences: z.array(z.string()).refine((val) => val.length > 0, {
      message: "Please select at least one article preference",
    }),
  })


export type ProfileFormValues = z.infer<typeof profileFormSchema>;
