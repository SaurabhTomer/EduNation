import Section from "../models/section.models.js";
import Course from "../models/course.models.js";

exports.createSection = async (req, res) => {
  try {
    //data fetch
    const { sectionName, courseId } = req.body;
    //data validation
    if (!sectionName || !courseId) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    //craete sction
    const newSection = await Section.create({ sectionName });
    //update course with section objectID
    const updateCourseDetails = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          courseContent: newSection._id,
        },
      },
      { new: true }
    );

    //return response
    return res.status(201).json({
      success: true,
      message: "section crateds successfully",
      updateCourseDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "section is not craeted",
      error: error.message,
    });
  }
};

//update section
exports.updateSection = async (req, res) => {
  try {
    //fetch
    const { sectionName, sectionId } = req.body;

    //valiadtion
    if (!sectionName || !sectionId) {
      return res
        .status(400)
        .json({ success: false, message: "Fields are required" });
    }

    //update section
    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      { sectionName },
      { new: true }
    );

    //retrun response
    return res.status(200).json({
      success: true,
      message: "section updated successfully",
      updateCourseDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "section is not updated",
      error: error.message,
    });
  }
};

//delete section
exports.deleteSection = async (req, res) => {
  try {
    // get id that is send in params
    const { sectionId } = req.params;

    //validate
    if (!sectionId) {
      return res
        .status(400)
        .json({ success: false, message: "Id are required" });
    }

    //find by  id and delete
    await Section.findByIdAndDelete(sectionId);

    //retrun response
    return res
      .status(500)
      .json({ success: true, message: "section is deleted successfully" });

      
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "section is not deleted",
      error: error.message,
    });
  }
};
