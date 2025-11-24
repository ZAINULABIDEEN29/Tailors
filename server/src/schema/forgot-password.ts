import {z} from "zod"


export const forgotPasswordSchema = z.object({
    email:z.string().email("invalid email").regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email address")

})