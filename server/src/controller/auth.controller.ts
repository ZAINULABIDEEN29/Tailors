import { type Request, type Response, type NextFunction, } from "express";
import { asyncHandler } from "../middleware/asyncHandler.middleware.js";
import { findTailorByEmail, findTailorById } from "../utils/db.utils.js";
import { ApiError } from "../utils/ApiError.js";
import { createTailor } from "../service/user.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { sendVerificationEmail } from "../helpers/sendVerificationEmail.js";
import {generateAccessToken,generateRefreshToken, verifyRefreshToken} from "../utils/jwt.js"
import  config  from "../config/env.config.js";
import crypto from "crypto"
import sendForgotPasswordEmail from "../helpers/sendForgotPassword.js";




export const registerTailor = asyncHandler(
    async (req:Request, res:Response, _next:NextFunction):Promise<any>=>{

        const {name, email, password} = req.body;

        const tailor = await findTailorByEmail(email);
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expireDate = new Date(Date.now() + 3600000);


        if(tailor && tailor.isVerified){
            throw new ApiError(400,"tailor already exists")
        }

        if(tailor && !tailor.isVerified){
            tailor.verifyCode = verifyCode;
            tailor.verifyCodeExpire = expireDate;
            await tailor.save();

           const emailResponse = await sendVerificationEmail(email,tailor.name,verifyCode)
           if(!emailResponse.success){
            throw new ApiError(500, emailResponse.message)
           }
           const {password:_, ...userResponse} = tailor.toObject();
           return res.json(new ApiResponse(200,true,"tailor already exists enter your otp",userResponse))
            
        }

        const tailorCreated = await createTailor(
            {
                name,
                email,
                password,
                verifyCode,
                verifyCodeExpire:expireDate,
                isVerified:false
            }
        )

        const emailResponse = await sendVerificationEmail(email,name,verifyCode);
        if(!emailResponse.success){
        throw new ApiError(500, emailResponse.message)
        }

        const {password:_,...userResponse} = tailorCreated.toObject();

       res.json(new ApiResponse(201,true,"tailor created successfully",userResponse))
          
    }
)

export const verifyCode = asyncHandler(
    async (req:Request, res:Response, next:NextFunction):Promise<any>=>{

        const {userId, verifyCode}=req.body;

        const tailorFound =await findTailorById(userId);

        if(!tailorFound){
            throw new ApiError(404,"Tailor not found")
        }
        if(tailorFound.isVerified){
            throw new ApiError(400,"Tailor already verified")
        }

        if(tailorFound.verifyCode !== verifyCode){
            throw new ApiError(400,"Invalid verify code")
        }
        if(!tailorFound.verifyCodeExpire || tailorFound.verifyCodeExpire < new Date){
            throw new ApiError(400,"Verify code expired")
        }

        tailorFound.verifyCode ="";
        tailorFound.verifyCodeExpire = null;
        tailorFound.isVerified = true;
        await tailorFound.save();

        const {password:_,...userResponse} = tailorFound.toObject();

        res.json(new ApiResponse(200,true,"tailor verified successfully",userResponse))
    }
)

export const loginTailor = asyncHandler(
    async (req:Request, res:Response, next:NextFunction):Promise<any>=>{
        const {email,password} = req.body;

        const tailorExists = await findTailorByEmail(email);
        if(!tailorExists){
            throw new ApiError(404,"Tailor not found")
        }

        if(!tailorExists.isVerified){
            throw new ApiError(400, "Please verify your email")
        }

        const isMatch = await tailorExists.comparePassword(password);

        if(!isMatch){
            throw new ApiError(400,"Invalid credentials")
        }

        const accessToken = generateAccessToken(tailorExists._id.toString());
        const refreshToken = generateRefreshToken(tailorExists._id.toString());
        tailorExists.refreshToken = refreshToken;
        await tailorExists.save();

        const isProduction = config.NODE_ENV === "production";
        const cookieOptions = {
            httpOnly:true,
            secure:isProduction,
            sameSite:isProduction ? ("strict" as const) : ("lax" as const),
        }

       return res.cookie("accessToken",accessToken,{
            ...cookieOptions,
            maxAge:3600000
        }).cookie("refreshToken",refreshToken,{
            ...cookieOptions,
              maxAge:3600000*24*7
        }).json(new ApiResponse(200,true,"login successful",tailorExists))
       

    }
)

export const logout = asyncHandler(
    async (req:Request, res:Response, next:NextFunction):Promise<any>=>{

        const accessToken = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];
        const refreshToken = req.cookies.refreshToken || req.headers.authorization?.split(" ")[1];

        if(!accessToken){
            throw new ApiError(400,"Invalid access token")

            //later create token model and create token here
        }
        if(!refreshToken){
            throw new ApiError(400,"Invalid refresh token")
        }

        const isProduction = config.NODE_ENV === "production";
        const cookieOptions = {
            httpOnly:true,
            sameSite:isProduction ? ("strict" as const) : ("lax" as const),
            secure:isProduction,
        
        }
        res.clearCookie("accessToken",cookieOptions);
        res.clearCookie("refreshToken",cookieOptions);

        return res.json(new ApiResponse(200,true,"logout successful"))

        
    }
)

export const forgotPassword = asyncHandler(
    async(req:Request, res:Response, _next:NextFunction):Promise<any>=>{

        const {email} = req.body;

        if(!email){
            throw new ApiError(400,"Email is required")
        }

        const tailorExists = await findTailorByEmail(email);
        if(!tailorExists){
            throw new ApiError(400,"Tailor not found")
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        const expireDate = new Date(Date.now() + 3600000);
        tailorExists.resetPassword = resetToken;
        tailorExists.resetPasswordExpire = expireDate;
        await tailorExists.save();

        const url = config.CLIENT_URL || "http://localhost:5173"
        const client = `${url}/reset-password?token=${resetToken}&userId=${tailorExists._id}`
        /// send Email 
       const emailResponse =  await sendForgotPasswordEmail(email, tailorExists.name,client)
        if(!emailResponse.success){
            throw new ApiError(500,emailResponse.message)
        }

        return res.json(new ApiResponse(200,true,"reset password link sent to your email"))
    }
)

export const resetPassword = asyncHandler(
    async (req:Request, res:Response, _next:NextFunction):Promise<any>=>{

        const {userId,token, newPassword} = req.body;

        if(!token || !userId){
            throw new ApiError(400,"Fields are required")
        }
        const existingTailor = await findTailorById(userId);
        if(!existingTailor){
            throw new ApiError(404,"Tailor not found")
        }

        if(existingTailor.resetPassword !== token){
            throw new ApiError(400,"Invalid token")
        }
        if(!existingTailor.resetPasswordExpire || existingTailor.resetPasswordExpire < new Date){
            throw new ApiError(400,"Token expired")
        }

        existingTailor.password = newPassword;
        existingTailor.resetPassword= "",
        existingTailor.resetPasswordExpire = null;
        await existingTailor.save();

        return res.json(new ApiResponse(200,true,"password reset successful"))

    }
)

export const refreshToken = asyncHandler(
    async(req:Request, res:Response, next:NextFunction):Promise<any>=>{
        const refreshToken = req.cookies.refreshToken 

        if(!refreshToken){
            throw new ApiError(400,"refresh token not found")
        }

        let decoded:any;
        try {
            decoded =  verifyRefreshToken(refreshToken) as any;
            if(!decoded || !decoded.id){
                throw new ApiError(400,"Invalid refresh token did not match")
            }
        } catch (error) {
            throw new ApiError(400,"Invalid refreshs token",error)
        }

        const tailer = await findTailorById(decoded.id);
        if(!tailer){
            throw new ApiError(404,"Tailor not found")
        }

       const accessToken = generateAccessToken(tailer._id.toString());
       const refreshAccessToken = generateRefreshToken(tailer._id.toString());
       tailer.refreshToken = refreshAccessToken;
       await tailer.save();

       const isProduction = config.NODE_ENV === "production";
       const cookieOptions = {
        httpOnly:true,
        secure:isProduction,
        sameSite:isProduction ? ("strict" as const) : ("lax" as const),
       }
       
       return res.cookie("accessToken",accessToken,{
        ...cookieOptions,
        maxAge:3600000
       }).cookie("refreshToken",refreshAccessToken,{
        ...cookieOptions,
        maxAge:3600000*24*7
       }).json(new ApiResponse(200,true,"token refreshed",{
        _id:tailer._id,
        name:tailer.name,
        email:tailer.email,
        isVerified:tailer.isVerified,
       }))
        
    }
)