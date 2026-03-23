// 🔥 VERY IMPORTANT: dotenv FIRST (before everything)
require('dotenv').config();

const express      = require('express');
const cors         = require('cors');
const cookieParser = require('cookie-parser');

const connectDB    = require('./utils/db');
const userRouter   = require('./routes/userRoute');
const scanRouter   = require('./routes/scanRoutes');
const adminRouter  = require('./routes/adminRoute');
const quizRouter   = require('./routes/quizRoute');

// Debug (optional)
console.log("MONGO_URI:", process.env.MONGO_URI);

// Connect DB
connectDB();

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
  origin: true,
  credentials: true,
}));

// Health check
app.get('/', (req, res) => res.send('API is running'));

// Routes
app.use('/api/user', userRouter);
app.use('/api/scan', scanRouter);
app.use('/api/admin', adminRouter);
app.use('/api/quiz', quizRouter);

// Start server
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});