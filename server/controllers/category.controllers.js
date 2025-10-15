import Category from "../models/category.models.js";

//create category handler function
exports.createCategory = async (req, res) => {
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
    const categoryDetails = await Category.create({
      name: name,
      description: description,
    });
    console.log(categoryDetails);

    //retrun response
    return res.status(201).json({
      success: true,
      message: "category  created successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }
};


//get all category
exports.showAllCategory = async (req, res) => {
  try {
    //fetch all category details which have name and description in it
    const allCategory = await Category.find({}, { name: true, description: true });
    //also return all tags in response

    return res.status(200).json({
      success: true,
      message: "All category returned Successfully",
      allCategory,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }
};


