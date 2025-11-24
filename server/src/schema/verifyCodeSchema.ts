import { z} from "zod"


export const verifyCodeSchema = z.object({
    userId:z.string(),
    verifyCode:z.string().min(6).max(6)
})


export type verifyCode = z.infer<typeof verifyCodeSchema>