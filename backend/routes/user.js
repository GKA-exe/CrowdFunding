const express = require("express");
const expressAsyncHandler = require("express-async-handler");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const verifyToken = require("../middlewares/verifyToken");
const userRouter = express.Router();
const { transporter, options } = require("./util");

let userCollection, otpCollection;

userRouter.use((req, res, next) => {
  userCollection = req.app.get("userCollection");
  otpCollection = req.app.get("otpCollection");
  next();
});

// User checking
userRouter.post(
  "/check-user",
  expressAsyncHandler(async (req, res) => {
    const user = req.body;
    const dbUser = await userCollection.findOne({ username: user.username });

    if (user.username === process.env.ADMIN_USERNAME) {
      return res.send({ message: "Not Authorized", statusCode: 6 });
    }

    if (dbUser !== null) {
      return res.send({ message: "User Already Exists", statusCode: 1 });
    }

    let otp = otpGenerator.generate(6, {
      specialChars: false,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
    });

    options.to = user.email;
    options.text = `Your OTP is ${otp}, please don't share with anyone`;

    const info = await transporter.sendMail(options);
    console.log(`Message sent with message id ${info.messageId}`);

    otp = await bcryptjs.hash(otp, 7);
    await otpCollection.insertOne({ username: user.username, otp: otp });

    res.send({ message: "User OK", statusCode: 12 });
  })
);

// User Creation
userRouter.post(
  "/new-user",
  expressAsyncHandler(async (req, res) => {
    const user = req.body;
    const otpUser = await otpCollection.findOne({ username: user.username });

    const otpVerified = await bcryptjs.compare(user.otp, otpUser.otp);

    if (!otpVerified) {
      return res.send({ message: "OTP didn't match", statusCode: 13 });
    }

    await otpCollection.deleteOne({ username: user.username });

    delete user.otp;
    const hashedPassword = await bcryptjs.hash(user.password, 7);
    user.password = hashedPassword;

    await userCollection.insertOne(user);
    return res.send({ message: "User Created", statusCode: 2 });
  })
);

// User Login
userRouter.post(
  "/login",
  expressAsyncHandler(async (req, res) => {
    const user = req.body;
    const dbUser = await userCollection.findOne({ username: user.username });

    if (
      user.username === process.env.ADMIN_USERNAME &&
      user.password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(
        { username: user.username },
        process.env.SECRET_KEY,
        { expiresIn: "1d" }
      );

      delete user.password;
      return res.send({
        message: "Admin Logged in",
        statusCode: 5,
        token: token,
        user: user,
      });
    }

    if (dbUser === null) {
      return res.send({ statusCode: 7, message: "Invalid Username" });
    }

    const status = await bcryptjs.compare(user.password, dbUser.password);

    if (status === false) {
      return res.send({ message: "Invalid Password", statusCode: 3 });
    }

    const token = jwt.sign(
      { username: user.username },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );

    delete dbUser.password;
    res.send({
      message: "Login Success",
      statusCode: 4,
      token: token,
      user: dbUser,
    });
  })
);

// Protected Route test
userRouter.get("/protected", verifyToken, (req, res) => {
  res.send("Accessed");
});

module.exports = userRouter;
