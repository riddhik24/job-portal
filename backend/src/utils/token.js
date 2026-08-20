import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const generateToken = (id, role, res) => {
  const token = jwt.sign({ id: id, role: role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.cookie("JWT", token, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    secure: true,
    sameSite: "None",
  });
};

export default generateToken;
