const express = require('express');
const middlewareController = require('../controllers/middlewareController');
const userController = require('../controllers/userController');
const userRouter = express.Router();


userRouter.get('/get-all-user',middlewareController.verifyToken,userController.getAllUser)
userRouter.delete('/delete-user/:id',middlewareController.verifyTokenAndAdmin,userController.deleteUser)
module.exports = userRouter;
