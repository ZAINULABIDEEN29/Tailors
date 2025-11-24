import {z} from "zod"

export const resetPasswordSchema = z.object({
    userId:z.string(),
    token:z.string(),
    newPassword:z.string().min(8,"atleast 8 characters required")
})