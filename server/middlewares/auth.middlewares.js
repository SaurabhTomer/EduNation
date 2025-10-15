import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';


//auth
export const auth = async (req, res, next) => {
  try {
    //  Extract token from cookie, body, or header
    const token =
      req.cookies.token ||
      req.body.token ||
      (req.header("Authorization") && req.header("Authorization").replace("Bearer ", "").trim());

    //  If token missing, return error
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is missing",
      });
    }

    //  Verify token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // attach decoded data (id, role) to request

    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Token is invalid or expired",
      });
    }

    //  Pass control to next middleware
    next();

  } catch (error) {
    console.error("Error in auth middleware:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while validating user",
    });
  }
};


//isStudent
exports.isStudent = async (req, res, next) => {
  try {
    // Check if user exists in request (set by JWT auth middleware)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Token missing or invalid",
      });
    }

    // Check if user role is 'Student'
    if (req.user.accountType !== "Student") {
      return res.status(403).json({
        success: false,
        message: "Access denied: Students only route",
      });
    }

    // Role matches → proceed
    next();

  } catch (error) {
    console.error("Error in Student middleware:", error);
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified, please try again",
    });
  }
};


//isInstructor
exports.isInstructor = async (req, res, next) => {
  try {
    // Check if user exists in request (set by JWT auth middleware)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Token missing or invalid",
      });
    }

    // Check if user role is 'Student'
    if (req.user.accountType !== "Instructor") {
      return res.status(403).json({
        success: false,
        message: "Access denied: Instructor only route",
      });
    }

    next();

  } catch (error) {
    console.error("Error in Instructor middleware:", error);
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified, please try again",
    });
  }
};

//isAdmin
exports.isAdmin = async (req, res, next) => {
  try {
    // Check if user exists in request (set by JWT auth middleware)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Token missing or invalid",
      });
    }

    // Check if user role is 'Student'
    if (req.user.accountType !== "Admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied: Admin only route",
      });
    }

    // Role matches → proceed
    next();

  } catch (error) {
    console.error("Error in Admin middleware:", error);
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified, please try again",
    });
  }
};