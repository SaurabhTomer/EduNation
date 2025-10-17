import Profile from "../models/profile.models.js";
import User from "../models/user.models.js";

//we are not creating profile we already craete profile with null value in user

exports.updatedProfile = async (req, res) => {
  try {
    //fetch user  id and data
    const {dateOfBirth ="" , about="" , contactNumber="" , gender} = req.body;
    const id  = req.user.id;

    //validate
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "All field required" });
    }

    //find profile
    const userDetails = await Profile.findById(id);

    //upadted profile
    const profileId = userDetails.additionalDetails;

    const profileDetails = await Profile.findById(profileId);
    //upadted profile

    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.contactNumber = contactNumber;
    profileDetails.gender = gender;
    profileDetails.about  = about;


    //save details in db
    await profileDetails.save();

    //return response
   
    return res.status(200).json({
      success: true,
      message: "profile created successfully",
      profileDetails,
    });


  } catch (error) {
    console.error("Error while updating profile:", error);
    return res.status(500).json({
      success: false,
      message: "Error while updating profile",
      error: error.message,
    });
  }
};
