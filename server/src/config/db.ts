import mongoose from "mongoose";


const connectDB = async ()=>{
    try {
      const db =  await mongoose.connect(process.env.MONGO_URI || "",{})
      console.log("Database connected", db.connection.host);
    } catch (error) {
        console.log("Database connection Error",error)
        process.exit(1);
    }
}

export default connectDB;