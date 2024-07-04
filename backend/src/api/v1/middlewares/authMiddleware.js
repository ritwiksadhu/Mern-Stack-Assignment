import jwt from "jsonwebtoken";
import { logError } from "../../../config/logger.js";
import User from "../models/user_model.js";

const authMiddleware = async (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token) {
    logError("Access denied. No token provided");
    return res.status(401).json({
      success: false,
      error: "Access denied. No token provided",
    });
  }

  try {
    const secretKey = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secretKey);

    // Verify if the user exists in the database
    const user = await User.findById(decoded.user_id);

    if (!user) {
      logError("User not found");
      return res.status(401).json({
        success: false,
        error: "User not found",
      });
    }

    // Attach user details to the request object for further use
    req.user_id = decoded.user_id;
    req.user = {
      id: user._id,
      name: user.name,
      email: user.email,
    };

    next();
  } catch (error) {
    logError(error.message);
    return res.status(401).json({
      success: false,
      error: error.message,
    });
  }
};

export default authMiddleware;
