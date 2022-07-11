const User = require("../models/user");
const brcypt = require("bcrypt");
const jwt = require("jsonwebtoken");
let refreshTokens = [];
const authController = {
  register: async (req, res) => {
    try {
      const salt = await brcypt.genSalt(10);
      const hashed = await brcypt.hash(req.body.password, salt);
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashed,
      });
      await newUser.save();
      res.status(200).json(newUser);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  generateAccessToken: (user) => {
    return jwt.sign(
      {
        id: user._id,
        admin: user.admin,
      },
      process.env.SECRET_KEY,
      { expiresIn: "5d" }
    );
  },
  generateRefreshToken: (user) => {
   return jwt.sign(
      {
        id: user._id,
        admin: user.admin,
      },
      process.env.REFRESH_KEY,
      { expiresIn: "5d" }
    );
  },
  login: async (req, res) => {
    try {
      const user = await User.findOne({ username: req.body.username });
      if (!user) {
       return res.status(404).json("wrong user");
      }
      const validPassword = await brcypt.compare(
        req.body.password,
        user.password
      );
      if (!validPassword) {
       return res.status(404).json("wrong password");
      }
      if (user && validPassword) {
        const access_token = authController.generateAccessToken(user)
        const refresh_token = authController.generateRefreshToken(user)
        refreshTokens.push(refresh_token)
        res.cookie("refresh_token",refresh_token,{
          httpOnly:true,
          path:'/',
          sameSite:'strict',
          secure:false
        })

        const { password, ...others } = user._doc;
       return res.status(200).json({
          message: "login success!",
          user: others,
          access_token,
          refresh_token,
        });
      }
    } catch (error) {
     return res.status(500).json(error);
    }
  },
  refreshToken: async (req,res) => {
    const refresh_token = req.cookies.refresh_token
    console.log(req);
    console.log('====================================');
    console.log(refresh_token);
    console.log('====================================');
    if (!refresh_token) {
      res.status(401).json('You are not authenticated')
    }
    if (refreshTokens.includes(refresh_token)) {
      res.status(400).json('refresh-token is not valid')
    }
    jwt.verify(refresh_token,process.env.REFRESH_KEY,(err,user) => {
      
      if (err) {
       return res.status(401).json('You are not authenticated')
      }
      refreshTokens = refreshTokens.filter((token) => token !== refresh_token)
      const new_access_token = authController.generateAccessToken(user)
      const new_refresh_token = authController.generateRefreshToken(user)
      refreshTokens.push(new_refresh_token)
      console.log('new_refresh_token',new_refresh_token);
      res.cookie('refresh_token',new_refresh_token, {
        httpOnly:true,
        path:'/',
        sameSite:'strict',
        secure:false
      });
    return  res.status(200).json({access_token:new_access_token})
    })
  },
  logout: async (req,res) => {
    res.clearCookie('refresh_token');
    refreshTokens = refreshTokens.filter((token) => token !== req.cookies.refresh_token)
    res.status(200).json('logout success')
  }
};

module.exports = authController;
