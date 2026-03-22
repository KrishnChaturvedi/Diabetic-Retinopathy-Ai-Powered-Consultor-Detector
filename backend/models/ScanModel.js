const mongoose = require('mongoose');

const ScanSchema = new mongoose.Schema({
  patient:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'User',
    required: true
  },
  grade:{
    type:String
  },
  label:{
    type:String
  },
  confidence:{
    type:Number
  },
  risk:{
    type:String
  },
  lesions:{
    type:Object
  },
  imagePath:{
    type:String
  },
  referral:{
    type:String
  }
},{ timestamps: true });

module.exports = mongoose.model('Scan',ScanSchema);