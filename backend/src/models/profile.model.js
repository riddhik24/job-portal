import { pool } from "../utils/db.js";

export const fetchUserProfileService = async (id) => {
  const profile = await pool.query(
    `SELECT * FROM candidate_profiles WHERE user_id = $1`,
    [id],
  );

  return profile.rows[0];
};

export const fetchRecruiterProfileService = async (id) => {
  const profile = await pool.query(
    `SELECT * FROM company_profiles WHERE user_id = $1`,
    [id],
  );

  return profile.rows[0];
};

export const getUserRole = async (id) => {
  const user = await pool.query(`SELECT role FROM users WHERE id = $1`, [id]);
  return user.rows[0];
};
export const updateCandidateProfileService = async (
  user_id,
  full_name,
  phone,
  bio,
  avatar_url,
  resume_url,
  skills,
  experience_years,
) => {
  let skillsArray = skills;
  if (typeof skills === "string") {
    skillsArray = skills.split(",").map((s) => s.trim()).filter(Boolean);
  } else if (!skills) {
    skillsArray = [];
  }

  const profile = await pool.query(
    `INSERT INTO candidate_profiles (user_id, full_name, phone, bio,avatar_url,resume_url, skills, experience_years)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     ON CONFLICT (user_id) 
     DO UPDATE SET full_name= EXCLUDED.full_name,
            phone= EXCLUDED.phone,
            bio= EXCLUDED.bio,
            avatar_url= EXCLUDED.avatar_url,
            resume_url = EXCLUDED.resume_url,
            skills = EXCLUDED.skills,
            experience_years= EXCLUDED.experience_years 
          RETURNING *`,
    [
      user_id,
      full_name,
      phone,
      bio,
      avatar_url,
      resume_url,
      skillsArray,
      experience_years,
    ],
  );

  return profile.rows[0];
};

export const updateRecruiterProfileService = async (
  user_id,
  company_name,
  website,
  logo_url,
  location,
) => {
  const profile = await pool.query(
    `INSERT INTO company_profiles (user_id, company_name, website, logo_url, location)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (user_id) 
     DO UPDATE SET company_name= EXCLUDED.company_name,
            website = EXCLUDED.website,
            logo_url = EXCLUDED.logo_url,
            location = EXCLUDED.location
        RETURNING *`,
    [user_id, company_name, website, logo_url, location],
  );

  return profile.rows[0];
};
