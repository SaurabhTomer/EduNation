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
    return res.status(200).json({
      success: ture,
      courseName: course.courseName,
      courseDescription: Course.courseDescription,
      thumbnail: Course.thumbnail,
      currency: PaymentResponse.currency,
      amount: PaymentResponse.amount,
      orderId: PaymentResponse.id,
    });
  } catch (error) {
    console.log("capture payment error");
    return res.status(500).json({ success: false, message: error.message });
  }
};

//verify signature or  razoorpay and server
exports.verifySignature = async (req, res) => {
  try {
    //signature send by server
    const webhooksecret = "12345678";
    //signature send by razorpay
    const signature = req.headers("x-razorpay-signature");

    const shasum = crypto.createHmac("sha256", webhooksecret);
    shasum.update(JSON.stringify(req.body)); //convert shasum to string
    const digest = shasum.digest("hex");

    if (signature === digest) {
      console.log("Payment is  authorized");

      const { courseId, userId } = req.body.payload.payment.entiry.notes;

      try {
        //fulfil the action

        //find the course and enrol  the student in course
        const enrolledCourse = await Course.findOneAndUpdate(
          { _id: courseId },
          {
            $push: {
              studentsEnrolled: userId,
            },
          },
          { new: ture }
        );

        if (!enrolledCourse) {
          return res
            .status(500)
            .json({ success: false, message: "course not found" });
        }

        console.log(enrolledCourse);

        //find the student and add course to their enroller course list
        const enrolledStudent = await User.findOneAndUpdate(
          { _id: userId },
          { $push: { courses: courseId } },
          { new: true }
        );

        console.log(enrolledStudent);

        //mail send krdo confirmation ka
        const emailResponse = await mailSender(
          enrolledStudent.email,
          "Congratulation you  are enrolled in EduNation course",
          "Now you can start you learning journey"
        );

        console.log(emailResponse);

        return res
          .status(200)
          .json({
            success: ture,
            message: "signature verified and course added",
          });
      } catch (error) {
        console.log(error);
        return res.status(500).json({ success: true, message: error.message });
      }
    }
    else{
        return res.status(400).json({success:false,message:"Invalid request"})
    }
  } catch (error) {
    return res.staus(500).json({success:false , message:"Error in  verify signature"})
  }
};
