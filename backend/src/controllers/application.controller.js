import handleResponse from "../middleware/handleResponse.js";
import {
  applyJobService,
  getAppliedJobsService,
  getApplicationsOfJobService,
  updateApplicationStatusService,
  deleteApplicationService,
} from "../models/application.model.js";
import { fetchUserProfileService } from "../models/profile.model.js";
import uploadCloud from "../utils/cloudinary.js";

export const applyJob = async (req, res, next) => {
  try {
    const { job_id } = req.body || {};
    const resume = req.file ? req.file.path : req.body ? req.body.resume : null;
    const user_id = req.user?.id;

    if (!user_id) return handleResponse(res, 401, "Unauthorized");

    // Fetch candidate profile to get profile ID
    const profile = await fetchUserProfileService(user_id);
    if (!profile) {
      return handleResponse(
        res,
        400,
        "Please create/update your candidate profile before applying to jobs.",
      );
    }
    const candidate_id = profile.id;

    let resume_url = profile.resume_url;
    if (resume) {
      resume_url = await uploadCloud(resume);
    }
    if (!job_id) return handleResponse(res, 400, "Job ID is required");
    if (!resume_url) return handleResponse(res, 400, "Resume is required");

    const application = await applyJobService(job_id, candidate_id, resume_url);
    return handleResponse(res, 200, "Job applied successfully", application);
  } catch (err) {
    next(err);
  }
};

export const getAppliedJobs = async (req, res, next) => {
  try {
    const user_id = req.user?.id;
    if (!user_id) return handleResponse(res, 400, "No user ID provided");

    const profile = await fetchUserProfileService(user_id);
    if (!profile) {
      return handleResponse(res, 200, "Fetched applications", []);
    }
    const candidate_id = profile.id;

    const applications = await getAppliedJobsService(candidate_id);
    return handleResponse(res, 200, "Fetched applications", applications);
  } catch (err) {
    next(err);
  }
};

export const getApplicationsOfJob = async (req, res, next) => {
  try {
    const { job_id } = req.params;
    if (!job_id) return handleResponse(res, 400, "No job ID provided");
    const applications = await getApplicationsOfJobService(job_id);
    return handleResponse(res, 200, "Fetched applications", applications);
  } catch (err) {
    next(err);
  }
};

export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { application_id, status } = req.body;
    if (!application_id)
      return handleResponse(res, 400, "No application ID provided");
    if (!status) return handleResponse(res, 400, "No status provided");
    const application = await updateApplicationStatusService(
      application_id,
      status,
    );

    if (application === undefined)
      return handleResponse(res, 404, "No application found");
    return handleResponse(res, 200, "Application status updated", application);
  } catch (err) {
    next(err);
  }
};

export const deleteApplication = async (req, res, next) => {
  try {
    const { application_id } = req.params;
    const user_id = req.user?.id;
    if (!application_id)
      return handleResponse(res, 400, "No application ID provided");

    const profile = await fetchUserProfileService(user_id);
    if (!profile) {
      return handleResponse(res, 400, "Candidate profile not found");
    }
    const candidate_id = profile.id;

    const application = await deleteApplicationService(
      application_id,
      candidate_id,
    );
    return handleResponse(res, 200, "Application deleted", application);
  } catch (err) {
    next(err);
  }
};
