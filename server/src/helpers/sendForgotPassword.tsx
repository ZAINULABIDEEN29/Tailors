import React from "react";
import { createTransporter,getFromEmail,getFromName } from "../utils/nodemailer.js";
import { render } from "@react-email/render";
import ForgotPasswordTemplate from "../templates/forgotPasswordTemplate.js";


export type EmailResult = {
    success:boolean;
    message:string;
}

const sendForgotPasswordEmail = async(
    email:string,
    username:string,
    resetLink:string
):Promise<EmailResult> =>{
    
    const transporter = createTransporter();
    if(!transporter){
        return{
            success:false,
            message:"Email service is not configured. Please contact support."
        }
    }
    try {
        const html = await render(React.createElement(ForgotPasswordTemplate, { username, resetLink }))

        const mailOptions = {
            from : `${getFromName()} <${getFromEmail()}>`,
            to :email,
            subject:"Reset Password Request",
            html
        }
        await transporter.sendMail(mailOptions);
        return{
            success:true,
            message:"Reset password email sent successfully"
        }
    } catch (error:any) {
        const errorMessage = error?.message || error?.toString() || "Unknown error occurred";
        return{
            success:false,
            message:`Failed to send reset password email: ${errorMessage}. Please check your email address and try again.`
        
        }
    }
}

export default sendForgotPasswordEmail;