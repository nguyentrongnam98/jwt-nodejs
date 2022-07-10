const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const authRouter = require('./router/authRouter');
const userRouter = require('./router/userRouter');

dotenv.config()
mongoose.connect(process.env.mongoose, () => {
    console.log('Connected db');
})
const app = express()

app.use(cors())
app.use(cookieParser());
app.use(express.json());
app.use('/v1',authRouter)
app.use('/v1',userRouter)
app.listen(process.env.PORT, () => {
    console.log(`Server is running with port ${process.env.PORT}`);
})