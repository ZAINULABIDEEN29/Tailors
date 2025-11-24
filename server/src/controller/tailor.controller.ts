import type { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../middleware/asyncHandler.middleware.js";
import { ApiResponse } from "../utils/ApiResponse.js";



export const getTailor = asyncHandler(
    async (req:Request, res:Response, next:NextFunction):Promise<any> =>{

        return res.json(
            new ApiResponse(200,true,"tailor found",req.tailor)
        )
    }
)