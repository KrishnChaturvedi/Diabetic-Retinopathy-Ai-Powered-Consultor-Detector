const express = require('express')
const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary = require('../utils/cloudinary')

const { analyzeScan, getScanHistory } = require('../controllers/scanController')
const auth = require('../middlewares/auth')

const scanRouter = express.Router()

// 🔥 replace diskStorage with CloudinaryStorage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'uploads',
    allowed_formats: ['jpg', 'png', 'jpeg']
  }
})

const upload = multer({ storage })

scanRouter.post('/analyze', auth, upload.single('image'), analyzeScan)
scanRouter.get('/history', auth, getScanHistory)

module.exports = scanRouter