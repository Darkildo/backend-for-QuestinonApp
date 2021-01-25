const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const errorHandler = require("../utils/errorHandler");
module.exports.login = async function (req, res) {
  const candidate = await User.findOne({ email: req.body.email });

  if (candidate) {
    const passwordResult = bcrypt.compareSync(
      req.body.password,
      candidate.password
    );
    if (passwordResult) {
      const token = jwt.sign(
        {
          email: candidate.email,
          userId: candidate._id,
        },
        keys.jwt,
        { expiresIn: 3600 }
      );
      res.status(200).json({
        login: {
          token: `Bearer ${token}`,
        },
      });
    } else {
      res.status(401).json({
        message: "Неверный пароль",
      });
    }
  } else {
    res.status(409).json({
      message: "пользователь не существует",
    });
  }
};

module.exports.register = async function (req, res) {
  const candidate = await User.findOne({ email: req.body.email });
  if (candidate) {
    res.status(409).json({
      message: "Email занят",
    });
  } else {
    const salt = bcrypt.genSaltSync(10);
    const password = req.body.password;
    const user = new User({
      email: req.body.email,
      password: bcrypt.hashSync(password, salt),
      RegDate: new Date(),
    });
    try {
      await user.save();
      res.status(201).json(user);
    } catch (e) {
      errorHandler(res, e);
    }
    //create user
  }
};
