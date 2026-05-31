import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export type LoginFormData = z.infer<typeof loginSchema>

export const registerSchema = z
  .object({
    full_name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    mobile: z.string().min(10, "Please enter a valid mobile number"),
    jnv_state: z.string().min(1, "Please select your JNV state"),
    jnv_school: z.string().min(1, "Please select your JNV school"),
    batch_start_year: z.number().min(1986, "Invalid year").max(new Date().getFullYear(), "Invalid year"),
    passing_year: z.number().min(1993, "Invalid year").max(new Date().getFullYear() + 7, "Invalid year"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  })

export type RegisterFormData = z.infer<typeof registerSchema>

export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email"),
})

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>
