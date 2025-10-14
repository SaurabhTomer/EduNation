import mongoose from "mongoose";
import { mailSender } from "../utils/mailSender.js";

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim:true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires:5*60,
  },
});


// function to send email
async function sendVerificationEmail(email , otp){
    try {
        const mailResponse = await mailSender(email , "Verification Email from EduNation" , otp);
        console.log("Email send successfully");
    } catch (error) {
        console.log( "error occured while sending email : ",error.message);
        throw error;
    }
}

// pre middleware (pre hook ) to send otp mail to save user in db and calling next 
otpSchema.pre("save" , async function(next){
    await sendVerificationEmail(this.email , this.otp);
    next();
})

export default mongoose.model("OTP" , otpSchema)