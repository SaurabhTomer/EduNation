
import Course from "../models/course.models.js";
import Category from "../models/category.models.js";
import User from "../models/user.models.js";
import { uploadImageToCloudinary } from "../utils/imageUpload.js";

//craeteCourse handler function

exports.createCourse = async (req, res) => {
  try {
    //fetch data
    //here tag id is passed because its ref is stored in course model
    const { courseName, courseDescription, whatYouWillLearn, price, Category } =
      req.body;

    //get thumbnail
    const thumbnail = req.files.thumbnailImage;

    //validation
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !Category
    ) {
      return res
        .status(400)
        .json({ success: false, message: "all fields are required" });
    }

    //check for instruction to save in database from models
    const userId = req.user.id; // saved in payload
    //here instructor id is passed because its ref is stored in course model
    const instructorDetails = await User.findById({ userId });
    console.log("instructor Deatils : ", instructorDetails);

    //validation
    if (!instructorDetails) {
      return res
        .status(400)
        .json({ success: false, message: "Instructor details not found" });
    }

    //check given tag is valid or not
    const categoryDetails = await Tag.findById({ Category });
    if (!categoryDetails) {
      return res.status(400).json({ success: false, message: "category not found" });
    }

    //uplaod image to cloudinary
    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );

    //create entry for new course
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn,
      price,
      category: categoryDetails._id,
      thumbnail: thumbnailImage.secure_url,
      //secure url comes from thumnailImage after uplaoding thumbnail on cloudinary
    });

    //add new course to the user schema of instructor
    await User.findByIdAndUpdate(
      { id: instructorDetails._id },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );

    //update tag schema
    await Course.findByIdAndUpdate(
      { id: categoryDetails._id },
      {
        $push: {
          category: categoryDetails._id,
        },
      },
      { new: true }
    );

    //return response
    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: newCourse,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to create course",
      error: error.message,
    });
  }
};

//get all courses
exports.showAllCourses = async (req, res) => {
  try {

    //get all courses of particluar instaructor
    const allCourses = await Course.find(
      {},
      {
        courseName: true,
        price: true,
        instructor: true,
        thumbnail: true,
        ratingAndReview: true,
        studentsEnrolled: true,
      }
    ).populate("instructor").exec();
    
    //retur response
    return res.status(200).json({success:true,
        message:"Data fetch successfully",
        data : allCourses,
    })

  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({
        success: false,
        message: "cannot fetch course data",
        error: error.message,
      });
  }
};
