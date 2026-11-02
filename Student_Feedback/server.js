import express from "express";
import dotenv from "dotenv";
import router from "./routes/studentRoutes.js";
import connectDB from "./config/db.js";
dotenv.config();
connectDB(process.env.MONGO_URI);
const app=express();
app.use(express.json());

app.use("/api/feedback",router);
const PORT=process.env.PORT||5000;
app.listen(PORT,()=>{
    console.log("Server Started");
})