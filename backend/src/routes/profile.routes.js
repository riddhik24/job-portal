import express from "express";
import auth from "../middleware/auth.js";
import {
  fetchUserProfile,
  updateCandidateProfile,
  updateRecruiterProfile,
} from "../controllers/profile.controller.js";
import checkRole from "../middleware/role.js";
import upload from "../utils/multer.js";
const router = express.Router();

router.route("/:id").get(auth, fetchUserProfile);
router.route("/candidate/:user_id").put(
  auth,
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  updateCandidateProfile,
);
router
  .route("/recruiter/:user_id")
  .put(auth, checkRole("recruiter"), upload.single("logo"), updateRecruiterProfile);

export default router;
