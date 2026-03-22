import express from 'express';
import dotenv from 'dotenv';
import connectDB from './utils/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

// load env
dotenv.config({
    path:".env"
}
);

// create express app
const app = express();

// mongodb connection
connectDB();

// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
const corsOptions = {
    origin: 'http://localhost:3000', // frontend server
    credentials: true,
    optionSuccessStatus: 200,
};
app.use(cors(corsOptions));



// backend server

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});