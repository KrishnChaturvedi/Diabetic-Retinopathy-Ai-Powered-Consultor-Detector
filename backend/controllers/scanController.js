const Scan = require('../models/ScanModel');
const axios = require('axios');

const analyzeScan = async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image uploaded' });
    }

    const imagePath = req.file.path;
    let result;

    // 🔥 ML INTEGRATION
    if (process.env.ML_API_URL) {
      const FormData = require('form-data');

      // Step 1: download image from Cloudinary URL
      const response = await axios.get(imagePath, {
        responseType: 'stream'
      });

      // Step 2: create form-data
      const formData = new FormData();
      formData.append('file', response.data, 'image.jpg'); // ✅ filename added
      formData.append('user_id', req.user.id);

      // Step 3: send to ML API
      const mlResponse = await axios.post(
        process.env.ML_API_URL,
        formData,
        {
          headers: formData.getHeaders(),
          timeout: 10000
        }
      );

      const mlData = mlResponse.data;

      // Step 4: safety check
      if (!mlData || mlData.status !== "success") {
        throw new Error("ML API failed");
      }

      // Step 5: map ML response
      result = {
        grade: mlData.prediction.prediction,
        label: mlData.prediction.prediction,
        confidence: mlData.prediction.confidence,
        risk: "Calculated",
        lesions: [],
        referral: false
      };

    } else {
      // ✅ Mock fallback
      result = {
        grade: 2,
        label: 'Moderate NPDR',
        confidence: 0.87,
        risk: 'High',
        lesions: ['microaneurysms', 'hemorrhages'],
        referral: true
      };
    }

    // 🔥 Save to DB
    const scan = await Scan.create({
      patient: req.user.id,
      grade: result.grade,
      label: result.label,
      confidence: result.confidence,
      risk: result.risk,
      lesions: result.lesions,
      referral: result.referral,
      imagePath
    });

    res.json({ success: true, scan, result });

  } catch (error) {
    console.log("ERROR:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getScanHistory = async (req, res) => {
  try {
    const scans = await Scan.find({ patient: req.user.id })
      .sort({ createdAt: -1 });

    res.json({ success: true, scans });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { analyzeScan, getScanHistory };