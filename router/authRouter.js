const express = require('express');
const authController = require('../controllers/authController');
const middlewareController = require('../controllers/middlewareController');
const authRouter = express.Router();

authRouter.post('/register',authController.register)
authRouter.post('/login',authController.login)
authRouter.post('/refresh-token',authController.refreshToken)
authRouter.post('/logout',middlewareController.verifyToken ,authController.logout)
module.exports = authRouter