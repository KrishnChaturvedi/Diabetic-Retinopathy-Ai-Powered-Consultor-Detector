import express from 'express';
import dotenv from 'dotenv';
import connectDB from './utils/db';
import cookieparser from 'cookie-parser';
import cors from 'cors';

//mongodb connection
dotenv.config();     
connectDB();

//middlewares
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieparser());
const corsOptions = {
    origin: 'http://localhost:5173',       //frontend server
    credentials: true,
    optionSuccessStatus: 200
}


//backend server
app.listen(process.env.PORT, () => {   
    console.log(`Server is running on port ${process.env.PORT}`);
})