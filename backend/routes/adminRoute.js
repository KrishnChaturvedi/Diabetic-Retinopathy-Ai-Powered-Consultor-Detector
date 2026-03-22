const express = require('express');
const loginAdmin = require('../controllers/adminController');

const adminRouter = express.Router();

adminRouter.post('/login',loginAdmin)

module.exports = adminRouter