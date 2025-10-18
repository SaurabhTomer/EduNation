import { instance } from "../config/razorpay.js";
import Course from "../models/course.models.js";
import User from "../models/user.models.js";
import mailSender from "../utils/mailSender.js";
import { courseEnrollmentEmail } from "../mails/templates/courseEnrollment.js";
import mongoose from "mongoose";

//capture  the payment and it\\nitiate the razorpay order
exports.capturePayment = async (req, res) => {
  try {
    //get course id and user id
    const userId = req.user.id;
    const { courseId } = req.body;

    //validation
    if (!courseId) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide valid course Id" });
    }

    //valid courseDetails
    let course;
    try {
      Course = await Course.findById(courseId);
      if (!Course) {
        return res
          .status(400)
          .json({ success: false, message: "Could not find course details" });
      }
    } catch (error) {
      return res
        .status(400)
        .json({ success: false, message: "Could not validate course" });
    }

    //user already pay for the same course
    // by this we convert userid from  string to object 

    const uid = new mongoose.Types.ObjectId(userId);
    if (course.studentsEnrolled.includes(uid)) {
      return res.status(200).json({
        success: false,
        message: "Student is already enrolled  in this course",
      });
    }


    //create order
    const amount = Course.price;
    const currency = "INR";

    const options = {
      amount: amount * 100,
      currency,
      receipt: Math.random(Date.now()).toString(),
      notes: {
       courseId,
        userId,
      },
    };

    try {
      //initiate the payment using razorpay
      const PaymentResponse = await instance.orders.create(options);
      console.log(PaymentResponse);
    } catch (error) {
      console.log(error);
      return res
        .status(404)
        .json({ success: false, message: "Could not initiate order" });
    }

    //return response
    return res
      .status(200)
      .json({
        success: ture,
        courseName: course.courseName,
        courseDescription: Course.courseDescription,
        thumbnail:Course.thumbnail,
        currency:PaymentResponse.currency,
        amount:PaymentResponse.amount,
        orderId:PaymentResponse.id,
      });
      
  } catch (error) {
    console.log("capture payment error");
    return res.status(500).json({ success: false, message: error.message });
  }
};
