import {
  fetchUserProfileService,
  fetchRecruiterProfileService,
  updateCandidateProfileService,
  updateRecruiterProfileService,
  getUserRole,
} from "../models/profile.model.js";
import handleResponse from "../middleware/handleResponse.js";
import uploadCloud from "../utils/cloudinary.js";

export const fetchUserProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return handleResponse(res, 400, "Invalid user.");
    }

    const roleData = await getUserRole(id);
    if (!roleData) {
      return handleResponse(res, 404, "User not found.");
    }

    let profile;
    if (roleData.role === "recruiter") {
      profile = await fetchRecruiterProfileService(id);
    } else {
      profile = await fetchUserProfileService(id);
    }

    return handleResponse(res, 200, "User profile fetched.", profile || null);
  } catch (err) {
    next(err);
  }
};

export const updateCandidateProfile = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const { full_name, phone, bio, skills, experience_years } = req.body || {};

    const avatar = req.files?.avatar?.[0]?.path || req.body?.avatar;
    const resume = req.files?.resume?.[0]?.path || req.body?.resume;

    let avatar_url;
    let resume_url;

    if (avatar) {
      avatar_url = await uploadCloud(avatar);
    }

    if (resume) {
      resume_url = await uploadCloud(resume);
    }

    if (!user_id) return handleResponse(res, 400, "User details not found");
    const profile = await updateCandidateProfileService(
      user_id,
      full_name,
      phone,
      bio,
      avatar_url,
      resume_url,
      skills,
      experience_years,
    );

    return handleResponse(res, 200, "Profile data updated.", profile);
  } catch (err) {
    next(err);
  }
};

export const updateRecruiterProfile = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const { company_name, website, location } = req.body || {};
    const logo = req.file?.path || req.body?.logo;
    let logo_url;

    if (!user_id) return handleResponse(res, 400, "User details not found");
    if (logo) {
      logo_url = await uploadCloud(logo);
    }
    const profile = await updateRecruiterProfileService(
      user_id,
      company_name,
      website,
      logo_url,
      location,
    );

    return handleResponse(res, 200, "Profile data updated.", profile);
  } catch (err) {
    next(err);
  }
};
