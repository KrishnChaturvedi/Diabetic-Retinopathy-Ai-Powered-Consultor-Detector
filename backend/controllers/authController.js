const validator = require('validator');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const UserModel = require('../models/UserModel');

// Api to register user 
const registerUser = async(req,res) =>{
  try {
    
    const {name,email,password} = req.body;
    if(!name || !email ||!password){
      return res.json({success:false,message:'Missing Details'})
    }

    if(!validator.isEmail(email)){
      return res.json({success:false,message:'enter a valid email'})
    }

    if(password.length < 8){
      return res.json({success:false,message: 'enter a strong password'})
    }

    const existingUser = await UserModel.findOne({ email })
    if (existingUser) {
      return res.json({ success: false, message: "Email already registered" })
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt)

    const userData = {
      name,
      email,
      password: hashedPassword
    }

  const newUser = new UserModel(userData)
  const user = await newUser.save()

  res.json({ success: true, message: 'Registration Successful!' })

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message })
  }
}

// api to login user
const loginUser = async(req,res) =>{
  try {
    
    const {email,password} = req.body;

    if(!email || !password){
  return res.json({ success: false, message: 'Missing Details' })
}

  const user = await UserModel.findOne({ email })

    if(!user){
      return res.json({success:false,message:'User Not Found'})
    }

    const isMatch = await bcrypt.compare(password,user.password)
    if(isMatch){
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET,{ expiresIn: '7d' })
      res.json({ success: true, token })
    }
    else{
      res.json({ success: false, message: "Invalid Credentials" })
    }
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

module.exports = { registerUser, loginUser }