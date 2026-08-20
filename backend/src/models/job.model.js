import { pool } from "../utils/db.js";

// export const getJobsService = async (filters = {}) => {
//   const { search, location, salary } = filters;

//   let queryText = "SELECT * FROM jobs WHERE is_active = true";
//   const queryParams = [];

//   // Dynamically add conditions and positional parameters ($1, $2, etc.)
//   if (search) {
//     queryParams.push(`%${search}%`);
//     queryText += ` AND title ILIKE $${queryParams.length}`; // ILIKE is case-insensitive search
//   }

//   if (location) {
//     queryParams.push(`%${location}%`);
//     queryText += ` AND location ILIKE $${queryParams.length}`;
//   }

//   if (salary) {
//     queryParams.push(Number(salary));
//     queryText += ` AND salary_min >= $${queryParams.length}`;
//   }

//   // Always order by latest
//   queryText += " ORDER BY created_at DESC";

//   const jobs = await pool.query(queryText, queryParams);
//   return jobs.rows;
// };

export const getJobService = async (id) => {
  const job = await pool.query(
    `
    SELECT 
      j.id,
      j.title,
      j.description,
      j.job_type,
      j.location,
      j.salary_min,
      j.salary_max,
      j.created_at,
      j.skills,
      
      -- Bundles recruiter and company details directly into a nested JSON object
      json_build_object(
        'company_name', cp.company_name,
        'website', cp.website,
        'logo_url', cp.logo_url,
        'location', cp.location,
        'recruiter_email', u.email
      ) AS company

    FROM jobs j
    INNER JOIN company_profiles cp ON j.company_id = cp.id
    INNER JOIN users u ON cp.id = u.id
    WHERE j.id = $1
  `,
    [id],
  );
  return job.rows[0];
};

export const postJobService = async (
  company_id,
  title,
  description,
  job_type,
  salary_min,
  salary_max,
  location,
  skills,
) => {
  let skillsArray = skills;
  if (typeof skills === "string") {
    skillsArray = skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  } else if (!skills) {
    skillsArray = [];
  }

  const job = await pool.query(
    `INSERT INTO jobs(company_id,title,description,job_type,salary_min,salary_max,location,skills) VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [
      company_id,
      title,
      description,
      job_type,
      salary_min,
      salary_max,
      location,
      skillsArray,
    ],
  );

  return job.rows[0];
};

export const updateJobService = async (
  id,
  job_type,
  salary_min,
  salary_max,
  location,
  description,
) => {
  const updatedJob = await pool.query(
    `UPDATE jobs SET job_type = $1, salary_min = $2 , salary_max= $3, location = $4,description = $5 WHERE id = $6 RETURNING *`,
    [job_type, salary_min, salary_max, location, description, id],
  );

  return updatedJob.rows[0];
};

export const deleteJobService = async (id, company_id) => {
  const deletedJob = await pool.query(
    "DELETE FROM jobs WHERE id = $1 AND company_id = $2 RETURNING *",
    [id, company_id],
  );

  return deletedJob.rows[0];
};

export const getRecruiterJobsService = async (id) => {
  const jobs = await pool.query("SELECT * FROM jobs WHERE company_id = $1", [
    id,
  ]);
  return jobs.rows;
};

export const getJobsService = async (filters = {}) => {
  const { title, location, salary } = filters;

  // Base query joining jobs (j), company_profiles (cp), and users (u)
  let queryText = `
    SELECT 
      j.id,
      j.title,
      j.description,
      j.job_type,
      j.location,
      j.salary_min,
      j.salary_max,
      j.created_at,
      j.skills,
      
      -- Bundles recruiter and company details directly into a nested JSON object
      json_build_object(
        'company_name', cp.company_name,
        'website', cp.website,
        'logo_url', cp.logo_url,
        'location', cp.location,
        'recruiter_email', u.email
      ) AS company

    FROM jobs j
    INNER JOIN company_profiles cp ON j.company_id = cp.id
    INNER JOIN users u ON cp.id = u.id
    WHERE j.is_active = true
  `;

  const queryParams = [];

  // Dynamically add conditions with table alias (j.) to prevent ambiguous column errors
  if (title) {
    queryParams.push(`%${title}%`);
    queryText += ` AND j.title ILIKE $${queryParams.length}`;
  }

  if (location) {
    queryParams.push(`%${location}%`);
    queryText += ` AND j.location ILIKE $${queryParams.length}`;
  }

  if (salary) {
    queryParams.push(Number(salary));
    queryText += ` AND j.salary_min >= $${queryParams.length}`;
  }

  // Always order by latest creation date
  queryText += " ORDER BY j.created_at DESC";

  const jobs = await pool.query(queryText, queryParams);
  return jobs.rows;
};
