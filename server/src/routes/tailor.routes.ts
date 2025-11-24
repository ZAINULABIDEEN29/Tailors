import express from "express"
import { getTailor } from "../controller/tailor.controller.js";
import { authTailor } from "../middleware/auth.middleware.js";
const router = express.Router();


router.get("/get-tailor",authTailor, getTailor)


export default router;