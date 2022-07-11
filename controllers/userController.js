const User = require("../models/user");

const userController = {
  getAllUser: async (req, res) => {
    try {
      const allUser = await User.find();
      res.status(200).json(allUser);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  deleteUser: async (req, res) => {
    try {
      const findUser = await User.findById(req.params.id);
      if (findUser) {
       return res.status(200).json("Delete user success !");
      }
    } catch (error) {
     return res.status(500).json(error);
    }
  },
};

module.exports = userController;
