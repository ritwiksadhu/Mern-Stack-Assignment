import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user_model.js";
import logger, { logError, logInfo } from "../../../config/logger.js";

export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ success: false, error: "User already exists", user });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    const payload = {
      user_id: user._id,
      name: user.name,
      email: user.email,
    };
    const authToken = jwt.sign(payload, process.env.JWT_SECRET);

    logInfo(`User ${user.email} signed up successfully`);

    res.status(200).json({ success: true, authToken, user: payload });
  } catch (error) {
    logError(error.message);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      logError(`User ${login} not found`);
      return res
        .status(400)
        .json({ success: false, error: "Invalid credentials" });
    }

    const isMatchPassword = await bcrypt.compare(password, user.password);
    if (!isMatchPassword) {
      logError(`Invalid password for user ${login}`);
      return res
        .status(400)
        .json({ success: false, error: "Invalid credentials" });
    }

    const payload = {
      user_id: user._id,
      name: user.name,
      email: user.email,
    };
    const authToken = jwt.sign(payload, process.env.JWT_SECRET);

    logInfo(`User ${login} logged in successfully`);

    res.status(200).json({ success: true, authToken, user: payload });
  } catch (error) {
    logError(error.message);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

export const getUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    logInfo(`User ${user.login} data fetched successfully`);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    logError(error.message);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

export const verifyUserToken = async (req, res) => {
  const token = req.header("x-auth-token");

  if (!token) {
    logError("Access denied. No token provided");
    return res.status(401).json({
      success: false,
      error: "Access denied. No token provided",
    });
  }

  try {
    const { user } = await verifyToken(token);

    return res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    logError(error.message);
    return res.status(401).json({
      success: false,
      error: "Unauthorized",
    });
  }
};

const verifyToken = async (token) => {
  try {
    const secretKey = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secretKey);

    // Verify if the user exists in the database
    const user = await User.findById(decoded.user_id);

    if (!user) {
      throw new Error("User not found");
    }

    return { user, decoded };
  } catch (error) {
    logError(error.message);
    throw new Error("Unauthorized");
  }
};
