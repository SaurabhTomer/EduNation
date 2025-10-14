import User from "../models/user.models.js";
import OTP from "../models/otp.models.js";
import Profile from "../models/profile.models.js";

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
    const { email } = req.body;

    //validate user details
    if (!email) {
      return res.status(400).json({ message: " Email is required" });
    }


  

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//change password
