import {z} from "zod";


 export const registerSchema = z.object({
    name:z.string().min(2,"atleast 2 characters required"),
    email:z.string().email("invalid email"),
    password:z.string().min(8,"atleast 8 characters required"),
    verifyCode:z.string().optional(),
    verifyCodeExpire:z.date().optional(),
    isVerified:z.boolean().optional()

})



export type registerInput = z.infer<typeof registerSchema>;