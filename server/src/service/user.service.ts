import Tailor from "../model/tailor.model.js"
import { ApiError } from "../utils/ApiError.js"
import type {registerInput} from "../schema/register.schema.js";



export const createTailor = async ({name,email,password,verifyCode,verifyCodeExpire,isVerified}:registerInput)=>{

    if(!name || !email || !password){
        throw new ApiError(400, "All fields are required")
    }
    const tailor = new Tailor({
        name,
        email,
        password,
        verifyCode,
        verifyCodeExpire,
        isVerified
    })
    await tailor.save()
    return tailor;
}