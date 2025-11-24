import nodemailer from  "nodemailer";
import  config  from "../config/env.config.js";

interface SmtpConfig{
    service?:string;
    host?:string;
    port?:number;
    secure?:boolean;
    auth:{
        user:string;
        pass:string;
    }
}


export const createTransporter = ()=>{
    if(
        !process.env.SMTP_MAIL ||
        !process.env.SMTP_PASSWORD ||
        (!process.env.SMTP_HOST && ! process.env.SMTP_SERVICE)
    ){
        return null;
    }
    
    const config:SmtpConfig = {
        auth:{
            user:process.env.SMTP_MAIL,
            pass:process.env.SMTP_PASSWORD,
        }
    };

    if(process.env.SMTP_SERVICE){
        config.service = process.env.SMTP_SERVICE;
    }  else if(process.env.SMTP_HOST && process.env.SMTP_PORT){
        config.host = process.env.SMTP_HOST;
        config.port = Number(process.env.SMTP_PORT);
        config.secure = false;
    }
    else {
        console.error("SMTP configuration error:Either SMTP service or Host")
        return null;
    }
    const transporter = nodemailer.createTransport(config);
    return transporter;
}

export const verifyTransporter = async (transporter:nodemailer.Transporter):Promise<boolean>=>{
    try {
        await transporter.verify();
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export const getFromEmail = ():string =>{
    return process.env.ADMIN_EMAIL || process.env.SMTP_MAIL || "";
}

export const getFromName = ()=>{
    return "Tailor App"
}


