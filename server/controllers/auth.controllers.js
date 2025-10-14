import dotenv from "dotenv";
dotenv.config();
import User from "../models/user.models.js";
import OTP from "../models/otp.models.js";
import Profile from "../models/profile.models.js";
import jwt from "jsonwebtoken";

//send otp
exports.sendOTP = async (req, res) => {
  try {
    //fetch email from request body
    const { email } = req.body;

    //validate user
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    //check user exists or not
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    //generate otp
    let generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    //check same otp exists in db or not
    let otpExists = await OTP.findOne({ otp: generatedOtp });

    //if exists then again generate different otp
    while (otpExists) {
      generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      otpExists = await OTP.findOne({ otp: generatedOtp });
    }

    //save otp in db for verify otp
    await OTP.create({ email, otp: generatedOtp });
    console.log("OTP entry created:", generatedOtp);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("Error occurred while sending OTP:", error);
    res.status(500).json({ message: "Error occurred while sending OTP" });
  }
};

//signup
exports.signup = async (req, res) => {
  try {
    //fetch data from request body
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      otp,
      contactNumber,
    } = req.body;

    //validate user details
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // matches the password if don't matches
    if (password != confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // check if user already exists
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // find most recent otp stored from the user
    const recentOtp = await OTP.findOne({ email })
      .sort({ createdAt: -1 })
      .limit(1);

    // check the otp and recent otp (matches from db and recent)
    if (!recentOtp || recentOtp.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });

    // create a new user and add it to the database

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      accountType,
      contactNumber,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//login
exports.login = async (req, res) => {
  try {
    //fetch data from request body
    const { email, password } = req.body;

    //validate user details
    if (!email || !password) {
      return res.status(400).json({ message: " All fields are required" });
    }

    //check user exixts
    const user = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "User is not Registered , Please Signup",
      });
    }

    //generate jwt token , after password matches
    if (await bcrypt.compare(password, User.password)) {
      const payload = {
        email: user.email,
        id: user._id,
        accountType: user.accountType,
      };

      //this payload comes in mddlewares in access role
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });

      user.token = token;
      user.password = undefined;

      //create cookie
      const options = {
        expires: new Date(Date.now() + 3 * 60 * 60 * 1000),
        httpOnly: true,
      };
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "Logged in successfully",
      });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Password is incorrect" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Login fail , please try again" });
  }
};

//change password
export const changePassword = async (req, res) => {
  try {
    // 1️⃣ Get data from req body
    const { oldPassword, newPassword, confirmPassword } = req.body;

    // 2️⃣ Validation
    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // 3️⃣ Get user from token (set by auth middleware)
    const userId = req.user.id;
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 4️⃣ Check if old password matches database password
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Old password is incorrect",
      });
    }

    // 5️⃣ Check if new password & confirm password match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match",
      });
    }

    // 6️⃣ Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 7️⃣ Update password in database
    user.password = hashedPassword;
    await user.save();

    // 8️⃣ Send email notification
    try {
      await mailSender({
        to: user.email,
        subject: "Password Changed Successfully",
        html: `Hi ${user.firstName} ${user.lastName}, your password has been successfully updated.`,
      });
    } catch (err) {
      console.error("Email not sent:", err);
    }

    // 9️⃣ Return success response
    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error while changing password",
    });
  }
};
