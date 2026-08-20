import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";
import fs from "fs";
config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadCloud = async (localpath) => {
  try {
    if (!localpath) return;

    // Check if Cloudinary is configured
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      console.warn("⚠️ Cloudinary credentials not configured in .env. Falling back to local file path.");
      return `/${localpath.replace(/\\/g, "/").replace(/^\.\/public\//, "").replace(/^public\//, "")}`;
    }

    const result = await cloudinary.uploader.upload(localpath, {
      resource_type: "auto",
    });

    if (fs.existsSync(localpath)) {
      fs.unlinkSync(localpath);
    }

    return result.secure_url;
  } catch (err) {
    console.error("Cloudinary upload failed, falling back to local file path. Error:", err.message || err);
    // Keep local file and return local path for testing
    return `/${localpath.replace(/\\/g, "/").replace(/^\.\/public\//, "").replace(/^public\//, "")}`;
  }
};

export default uploadCloud;
