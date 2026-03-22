const express      = require('express')
const cors         = require('cors')
const dotenv       = require('dotenv')
const cookieParser = require('cookie-parser')
const connectDB    = require('./config/db')
const userRouter   = require('./routes/authRoutes')

dotenv.config()
connectDB()

const app = express()

// middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))

// health check
app.get('/', (req, res) => res.send('API is running'))

// routes
app.use('/api/user', userRouter)

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`)
})