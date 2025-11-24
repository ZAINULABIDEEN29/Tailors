import express from "express";
const router = express.Router();
import { registerTailor ,verifyCode,loginTailor,logout, forgotPassword,resetPassword,refreshToken} from "../controller/auth.controller.js";
import {validate} from "../middleware/validator.middleware.js"
import {registerSchema} from "../schema/register.schema.js";
import {verifyCodeSchema} from "../schema/verifyCodeSchema.js"
import {authTailor} from "../middleware/auth.middleware.js"
import { loginSchema } from "../schema/login.schema.js";
import { forgotPasswordSchema } from "../schema/forgot-password.js";
import { resetPasswordSchema } from "../schema/reset-password.js";



router.post("/register",validate(registerSchema),registerTailor)
router.post("/verify",validate(verifyCodeSchema),verifyCode)
router.post("/login",validate(loginSchema),loginTailor)
router.get("/logout",authTailor,logout)
router.post("/forgot-passwprd",validate(forgotPasswordSchema),forgotPassword);
router.post("/reset-password",validate(resetPasswordSchema),resetPassword);
router.get("/refresh",refreshToken);



export default router;



