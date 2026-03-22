const Scan = require('../models/Scan')
const axios = require('axios')
const fs = require('fs')
const FormData = require('form-data')

const analyzeScan = async (req, res) => {
  try {

    const imagePath = req.file.path

    const form = new FormData()
    form.append('file', fs.createReadStream(imagePath))
    const mlResponse = await axios.post(process.env.ML_API_URL, form, {
      headers: form.getHeaders()
    })
    const result = mlResponse.data

    const scan = await Scan.create({
      patient: req.user.id,
      grade: result.grade,
      label: result.label,
      confidence: result.confidence,
      risk: result.risk,
      lesions: result.lesions,
      referral: result.referral,
      imagePath
    })

    res.json({ success: true, scan, result })

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

const getScanHistory = async (req, res) => {
  try {
    const scans = await Scan.find({ patient: req.user.id })
      .sort({ createdAt: -1 })
    res.json({ success: true, scans })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

module.exports = { analyzeScan, getScanHistory }