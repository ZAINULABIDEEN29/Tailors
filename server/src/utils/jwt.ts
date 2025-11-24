import jwt from "jsonwebtoken"
import config from "../config/env.config.js"
import { ApiError } from "./ApiError.js"



export const generateAccessToken = (userId:string)=>{
     return jwt.sign({id:userId},config.JWT_SECRET,{
        expiresIn:"5m"
     })
}

export const generateRefreshToken = (userId:string)=>{
    return jwt.sign({id:userId},config.JWT_REFRESH_SECRET,{
        expiresIn:"1d"
    })
}


export const verifyAccessToken = (token:string)=>{
    try {
        return jwt.verify(token, config.JWT_SECRET)
    } catch (error) {
        if(error instanceof jwt.TokenExpiredError){
            throw new ApiError(401,"Token has expirder")
        }
        throw new ApiError(401,"Invalid Token")
    }
}

export const verifyRefreshToken = (token:string)=>{
   try {
     return jwt.verify(token,config.JWT_REFRESH_SECRET)
   } catch (error:any) {
    if(error instanceof jwt.TokenExpiredError){
        throw new ApiError(401,"Token has expirder")
    }
    throw new ApiError(401,`Invalid refresh Token ${error.message}`)
   }
}


