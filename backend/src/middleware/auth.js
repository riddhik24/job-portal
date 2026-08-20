import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const auth = async (req, res, next) => {
  try {
    const token = req.cookies.JWT;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.id) {
      return res.status(401).json({ message: "Unauthorized - invalid token" });
    }

    req.user = decoded;
    next();
  } catch (err) {
    console.error("Auth error", err);
    res.status(401).json({ message: "Unauthorized - invalid token" });
  }
};

export default auth;
