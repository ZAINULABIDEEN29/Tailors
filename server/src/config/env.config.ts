

const config = {
    MONGO_URI:String( process.env.MONGO_URI),
    PORT: String( process.env.PORT),
    NODE_ENV:String(process.env.NODE_ENV),
    CLIENT_URL:String(process.env.CLIENT_URL),
    JWT_SECRET:String(process.env.JWT_SECRET),
    JWT_REFRESH_SECRET:String(process.env.JWT_REFRESH_SECRET),
    JWT_ACESS_EXPIRES_IN:String(process.env.JWT_ACESS_EXPIRES_IN),
    JWT_REFRESH_EXPIRES_IN:String(process.env.JWT_REFRESH_EXPIRES_IN),
    SMTP_HOST:String(process.env.SMTP_HOST),
    SMTP_SERVICE:String(process.env.SMTP_SERVICE),
    SMTP_PORT:String(process.env.SMTP_PORT),
    SMTP_MAIL:String(process.env.SMTP_MAIL),
    SMTP_PASSWORD:String(process.env.SMTP_PASSWORD),
    ADMIN_EMAIL:String(process.env.ADMIN_EMAIL),
    CLOUDINARY_CLOUD_NAME:String(process.env.CLOUDINARY_CLOUD_NAME),
    CLOUDINARY_API_KEY:String(process.env.CLOUDINARY_API_KEY),
    CLOUDINARY_API_SECRET:String(process.env.CLOUDINARY_API_SECRET),
    
}

export default config;