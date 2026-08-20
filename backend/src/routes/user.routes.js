import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  authUser,
} from "../controllers/user.controller.js";
import auth from "../middleware/auth.js";
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);
router.route("/authUser").get(auth, authUser);
export default router;
