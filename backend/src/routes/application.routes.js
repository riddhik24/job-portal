import express from "express";
import {
  applyJob,
  getAppliedJobs,
  getApplicationsOfJob,
  updateApplicationStatus,
  deleteApplication,
} from "../controllers/application.controller.js";
import auth from "../middleware/auth.js";
import checkRole from "../middleware/role.js";
import upload from "../utils/multer.js";

const router = express.Router();

router.route("/apply").post(auth, checkRole("candidate"), upload.single("resume"), applyJob);
router.route("/candidate").get(auth, checkRole("candidate"), getAppliedJobs);
router.route("/:job_id").get(auth, checkRole("recruiter"), getApplicationsOfJob);
router.route("/").patch(auth, checkRole("recruiter"), updateApplicationStatus);
router
  .route("/:application_id")
  .delete(auth, checkRole("candidate"), deleteApplication);

export default router;
