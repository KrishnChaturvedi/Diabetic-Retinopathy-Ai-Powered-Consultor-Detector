const express    = require('express')
const multer     = require('multer')

const { analyzeScan, getScanHistory } = require('../controllers/scanController')
const auth = require('../middlewares/auth')

const scanRouter = express.Router()

// multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname)
  }
})

const upload = multer({ storage })

scanRouter.post('/analyze', auth, upload.single('image'), analyzeScan)
scanRouter.get('/history',  auth, getScanHistory)

module.exports = scanRouter