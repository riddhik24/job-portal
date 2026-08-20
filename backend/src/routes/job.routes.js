import express from "express";
import {
  getJob,
  getJobs,
  updateJob,
  postJob,
  deleteJob,
  getRecruiterJobs,
} from "../controllers/job.controller.js";
import auth from "../middleware/auth.js";
import checkRole from "../middleware/role.js";
const router = express.Router();

router.route("/:search/:location/:salary").get(getJobs);
router.route("/:id").get(getJob);
router
  .route("/:id/my-jobs")
  .get(auth, checkRole("recruiter"), getRecruiterJobs);
router.route("/").post(auth, checkRole("recruiter"), postJob).get(getJobs);
router.route("/:id").put(auth, checkRole("recruiter"), updateJob);
router.route("/:id").delete(auth, checkRole("recruiter"), deleteJob);

export default router;
