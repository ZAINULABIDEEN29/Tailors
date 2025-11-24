import type { Request, Response, NextFunction } from "express";
import { asyncHandler } from "./asyncHandler.middleware.js";
import { ApiError } from "../utils/ApiError.js";
import { verifyAccessToken } from "../utils/jwt.js";
import { findTailorById } from "../utils/db.utils.js";
import type { JwtPayload } from "jsonwebtoken";


export const authTailor = asyncHandler(
    async (req:Request,_res:Response,next:NextFunction):Promise<any>=>{
        
        const token = req.cookies.accessToken;
        if(!token){
            throw new ApiError(401,"Dont have any Token")
        }
        
        const decoded = verifyAccessToken(token) as JwtPayload;
        if(!decoded){
            throw new ApiError(401,"Invalid Token")
        }
        const tailor = await findTailorById(decoded.id)
        if(!tailor){
            throw new ApiError(401,"Tailor not found")
        }
        req.tailor = tailor;
        next();
    }
)
