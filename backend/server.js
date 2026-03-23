const express      = require('express')
const cors         = require('cors')
const dotenv       = require('dotenv')
const cookieParser = require('cookie-parser')
const connectDB    = require('./utils/db')
const userRouter   = require('./routes/userRoute')
const scanRouter   = require('./routes/scanRoutes')
const adminRouter  = require('./routes/adminRoute')
const quizRouter   = require('./routes/quizRoute')

dotenv.config()
console.log("MONGO_URI:", process.env.MONGO_URI)
connectDB()

const app = express()

// middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}))

// health check
app.get('/', (req, res) => res.send('API is running'))

// routes
app.use('/api/user', userRouter)
app.use('/api/scan', scanRouter)
app.use('/api/admin', adminRouter)
app.use('/api/quiz',quizRouter)

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})