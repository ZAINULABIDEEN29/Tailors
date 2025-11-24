import {z} from "zod"

export const loginSchema = z.object({
    email:z.string().email("invalid email"),
    password:z.string().min(8,"atleast 8 characters required"),

})

export type loginInput = z.infer<typeof loginSchema>