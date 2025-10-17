import subSection from "../models/subSection.models.js";
import Section from "../models/section.models.js";
import uploadImageToCloudinary from "../utils/imageUpload.js";

//create sub section
export const createSubSection = async (req, res) => {
  try {
    //fetch data from body
    const { sectionId, title, description, timeDuration } = req.body;

    //extract file/video
    const video = req.files.videoFile;

    //validate data
    if (!sectionId || !title || !description || !timeDuration || !video) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    //upload video to cloudinary and get secure url
    const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);

    //create subSection
    const subSectionDetails = await subSection.create({
      title,
      timeDuration,
      description,
      videoUrl: uploadDetails.secure_url,
    });

    //push subsection id in Section
    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      {
        $push: {
          subSection: subSectionDetails._id,
        },
      },
      { new: true }
    )
      .populate("subSection") //  populate all subSections
      .exec();

    console.log("Updated Section :", updatedSection);

    //return response
    return res.status(201).json({
      success: true,
      message: "Subsection created successfully",
      data: updatedSection,
    });

  } catch (error) {
    console.error("Error while creating subsection:", error);
    return res.status(500).json({
      success: false,
      message: "Subsection could not be created",
      error: error.message,
    });
  }
};


//update sub section 
export const updateSubSection = async (req, res) => {
  try {
    //fetch data from body
    const { subSectionId, title, description, timeDuration } = req.body;

    //extract file/video
    const video = req.files.videoFile;

    //validate data
    if (!subSectionId || !title || !description || !timeDuration || !video) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    //upload video to cloudinary and get secure url
    const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);


    //update subsection id in in sub section
    const updatedSubSection = await subSection.findByIdAndUpdate(
      subSectionId,
      {
        title:title,
        description:description,
        timeDuration:timeDuration,
        videoUrl:uploadDetails.secure_url,
      },
      { new: true }
    )
      

    console.log("Updated subsection :", updatedSubSection);

    //return response
    return res.status(201).json({
      success: true,
      message: "Subsection upddated successfully",
 
     
    });

  } catch (error) {
    console.error("Error while updating subsection:", error);
    return res.status(500).json({
      success: false,
      message: "Subsection could not be updated",
      error: error.message,
    });
  }
};


//delete sub section