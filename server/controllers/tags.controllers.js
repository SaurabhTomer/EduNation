import Tag from "../models/tags.models.js";

//create tag handler function
exports.createTag = async (req, res) => {
  try {
    //fetch data
    const { name, description } = req.body;
    //validate
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    // craete entry in db
    const tagDetails = await Tag.create({
      name: name,
      description: description,
    });
    console.log(tagDetails);

    //retrun response
    return res.status(201).json({
      success: true,
      message: "Tag  created successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }
};


//get all tags
exports.showAllTags = async (req, res) => {
  try {
    //fetch all atgs details which have name and description in it
    const allTags = await Tag.find({}, { name: true, description: true });
    //also return all tags in response

    return res.status(200).json({
      success: true,
      message: "All tags returned Successfully",
      allTags,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }
};


