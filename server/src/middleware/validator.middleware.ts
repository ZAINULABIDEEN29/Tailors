import type { Request, Response, NextFunction } from "express";
import { type ZodSchema } from "zod";




export const validate = (schema:ZodSchema)=> (req:Request,res:Response,next:NextFunction)=>{
   try {
     schema.parse(req.body)
     next();
   } catch (error) {
        if(error ){
            return res.status(400).json({
                success:false,
                message:error
            })
        
        }
   }
}