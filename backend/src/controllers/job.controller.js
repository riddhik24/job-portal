import {
  getJobsService,
  getJobService,
  postJobService,
  updateJobService,
  deleteJobService,
  getRecruiterJobsService,
} from "../models/job.model.js";
import handleResponse from "../middleware/handleResponse.js";

export const getJobs = async (req, res, next) => {
  try {
    const { title, location, salary } = req.query || req.params;
    const jobs = await getJobsService({ title, location, salary });
    return handleResponse(res, 200, "Fetched jobs.", jobs);
  } catch (err) {
    next(err);
  }
};

export const getJob = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) return handleResponse(res, 400, "Job not found.");
    const job = await getJobService(id);
    return handleResponse(res, 200, "Fetched job.", job);
  } catch (err) {
    next(err);
  }
};

export const postJob = async (req, res, next) => {
  try {
    const {
      company_id,
      title,
      description,
      job_type,
      salary_min,
      salary_max,
      location,
      skills,
    } = req.body;

    if (!company_id) return handleResponse(res, 400, "No company ID provided.");
    if (!title) return handleResponse(res, 400, "Title is required.");
    const job = await postJobService(
      company_id,
      title,
      description,
      job_type,
      salary_min,
      salary_max,
      location,
      skills,
    );
    return handleResponse(res, 200, "Job posted successfully.", job);
  } catch (err) {
    next(err);
  }
};

export const updateJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { job_type, salary_min, salary_max, location, description } =
      req.body;

    if (!id) return handleResponse(res, 400, "No job ID provided.");
    const job = await updateJobService(
      id,
      job_type,
      salary_min,
      salary_max,
      location,
      description,
    );
    return handleResponse(res, 200, "Updated job.", job);
  } catch (err) {
    next(err);
  }
};

export const deleteJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    const company_id = req.user.id;
    if (!id) return handleResponse(res, 400, "No job ID provided.");
    const job = await deleteJobService(id, company_id);
    return handleResponse(res, 200, "Deleted job.", job);
  } catch (err) {
    next(err);
  }
};

export const getRecruiterJobs = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) return handleResponse(res, 400, "No company ID provided.");
    const jobs = await getRecruiterJobsService(id);
    return handleResponse(res, 200, "Recruiter jobs.", jobs);
  } catch (err) {
    next(err);
  }
};
