import dotenv from "dotenv"
dotenv.config()
import express from "express"
import cookieParser from "cookie-parser";
import morgan from "morgan";
import connectDB from "../src/config/db.js"
import {errorHandler} from "../src/middleware/errorHandler.middleware.js"
import authRoutes from "./routes/auth.route.js"
import tailorRoutes from "./routes/tailor.routes.js"


const app = express();

connectDB();
const PORT = process.env.PORT || 5000;


app.use(cookieParser())
app.use(express.json({limit:"20kb"}))
app.use(express.urlencoded({extended:true}))
app.use(morgan("dev"))


app.use("/api/auth",authRoutes)
app.use("/api/tailors",tailorRoutes)

app.get("/",(req,res)=>{
    res.send("Hello World")
})

app.use(errorHandler)
app.listen(PORT,()=>{
    console.log(`Server running on http://localhost:${PORT}`)
})

