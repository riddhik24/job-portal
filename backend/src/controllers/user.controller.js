import handleResponse from "../middleware/handleResponse.js";
import generateToken from "../utils/token.js";
import { loginUserService, registerUserService } from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const registerUser = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return handleResponse(res, 400, "All fields are required.");
    }

    const user = await registerUserService(email, password, role);

    return handleResponse(res, 200, "User Registered.", user);
  } catch (err) {
    next(err);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return handleResponse(res, 400, "All fields are required");
    }

    // const hashedPassword = await bcrypt.hash(password, 10);

    const user = await loginUserService(email, password);

    generateToken(user.id, user.role, res);

    return handleResponse(res, 200, "Logged In", user);
  } catch (err) {
    next(err);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    res.clearCookie("JWT");
    return handleResponse(res, 200, "Logged out successfully");
  } catch (err) {
    next(err);
  }
};

export const authUser = async (req, res, next) => {
  try {
    handleResponse(res, 200, "", req.user);
  } catch (err) {
    next(err);
  }
};
