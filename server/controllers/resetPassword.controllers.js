
import User from "../models/user.models.js";
import mailSender from "../utils/mailSender.js";
import bcrypt from "bcryptjs";


//reset password token
exports.resetPasswordToken = async (req, res) => {
  try {
    //get email from request
    const { email } = req.body;
    //check user for this email exists and validation
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Your email is not registered with us",
      });
    }
    //generate token
    //creates random uuid 
    const token = crypto.randomUUID();

    //update user by adding token and expiration time
    const updatedDetails = await User.findOneAndUpdate(
      {
        email: email,
      },
      { token: token, resetPasswordExpires: Date.now() + 5 * 60 * 1000 },
      { new: true } //retrun updated document
    );

    //craete url
    // this is a frontend url
    const url = `http://localhost:3000/update-password/${token}`;

    //send mail containing  the url
    await mailSender(
      email,
      "Password Reset Link",
      `Password Reset Link : ${url}`
    );

    //return response
    return res.status(200).json({
      success: true,
      message:
        "Email sent Successfully  ,Please check email and change password ",
    });

  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Reset password link sent error" });
  }
};

//reset password
exports.resetPassword = async(req,res) => {

  try {
      //fetch data
    //token is send in body by frontend
    const {password , confirmPassword ,token} = req.body;

    //validation
    if(password !== confirmPassword){
      return res.status(400).json({success:false,message:"Password not match"})
    }
    //get userDetails from db using token 
    const userDetails = await User.findOne({token : token})

    //if no entry - invalid token 
    if(!userDetails){
        return res.status(400).json({success:false,message:"Token is Invalid"})

    }
    //token time checks
     if(!userDetails.resetPasswordExpires < Date.now()){
        return res.status(400).json({success:false,message:"Reset Password time Expires , Try Again"})
    }

    //hash password
    const hashPassword = await bcrypt.hash(password , 10);

    //update pssword
    await User.findByIdAndUpdate(
      {token:token},  //search based on this
      {password:hashPassword},
      {new:true}
    )

    //return password
      return res.status(200).json({success:true,message:"Password Reset successfully"})

  } catch (error) {
    console.log(error);
    return res.status(400).json({success:false,message:"Token reset error"})  
  }
}
