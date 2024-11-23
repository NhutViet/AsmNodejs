var express = require("express");
var router = express.Router();

var userModel = require("../models/user");
const JWT = require("jsonwebtoken");
const config = require("../ultil/config");
router.get("/all", async function (req, res, next) {
  const data = await userModel.find();
  res.status(200).json(data);
});

router.post("/login", async function (req, res) {
  try {
    const { userName, passWord } = req.body;
    const checkUser = await userModel.findOne({
      userName: userName,
      passWord: passWord,
    });
    if (checkUser == null) {
      res.status(400).json({ status: false, message: "Lỗi đăng nhập" });
    } else {
      const token = JWT.sign({ userName: userName }, config.SECRETKEY, {
        expiresIn: "30s",
      });
      const refToken = JWT.sign({ userName: userName }, config.SECRETKEY, {
        expiresIn: "1d",
      });
      res.status(200).json({
        status: true,
        message: "Đăng nhập thành công",
        token: token,
        refToken: refToken,
      });
    }
  } catch (e) {
    res.status(400).json({ status: false, message: e });
  }
});

module.exports = router;
