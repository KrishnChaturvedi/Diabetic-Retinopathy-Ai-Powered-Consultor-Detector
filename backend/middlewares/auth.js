const jwt = require('jsonwebtoken');

const auth = async(req,res,next) =>{
  try {
    
    const token = req.headers.authorization?.split(' ')[1]; 
    if(!token){
      return res.status(401).json({success:false,message: 'Not Authorized, Login again'});
    }
    const token_decoded = jwt.verify(token,process.env.JWT_SECRET);
    req.user = token_decoded;
    next()

  } catch (error) {
    console.log(error);
    res.status(401).json({success:false,message:error.message})
  }
}

module.exports = auth;