import { pool } from "../utils/db.js";

export const applyJobService = async (job_id, candidate_id, resume_url) => {
  const application = await pool.query(
    "INSERT INTO applications(job_id,candidate_id,resume_url) VALUES($1,$2,$3) RETURNING *",
    [job_id, candidate_id, resume_url],
  );
  return application.rows[0];
};

export const getAppliedJobsService = async (candidate_id) => {
  const application = await pool.query(
    `
    SELECT 
      a.id,
      a.job_id,
      a.status,
      a.applied_at,
      j.title AS job_title,
      j.location AS job_location,
      cp.company_name,
      cp.logo_url AS company_logo
    FROM applications a
    LEFT JOIN jobs j ON a.job_id = j.id
    LEFT JOIN company_profiles cp ON j.company_id = cp.id
    WHERE a.candidate_id = $1
    `,
    [candidate_id],
  );
  return application.rows;
};

export const getApplicationsOfJobService = async (job_id) => {
  const application = await pool.query(
    `
    SELECT 
      a.id,
      a.job_id,
      a.candidate_id,
      a.resume_url,
      a.status,
      a.applied_at,
      cp.full_name,
      cp.phone,
      cp.bio,
      cp.avatar_url,
      cp.skills,
      cp.experience_years,
      u.email AS candidate_email
    FROM applications a
    LEFT JOIN candidate_profiles cp ON a.candidate_id = cp.user_id
    LEFT JOIN users u ON a.candidate_id = u.id
    WHERE a.job_id = $1
    `,
    [job_id],
  );
  return application.rows;
};

export const updateApplicationStatusService = async (
  application_id,
  status,
) => {
  const application = await pool.query(
    "UPDATE applications SET status = $1 WHERE id = $2 RETURNING *",
    [status, application_id],
  );
  return application.rows[0];
};

export const deleteApplicationService = async (
  application_id,
  candidate_id,
) => {
  const application = await pool.query(
    "DELETE FROM applications WHERE id = $1 AND candidate_id = $2 RETURNING *",
    [application_id, candidate_id],
  );
  return application.rows[0];
};
