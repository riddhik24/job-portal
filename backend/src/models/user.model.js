import bcrypt from "bcryptjs";
import { pool } from "../utils/db.js";

export const registerUserService = async (email, password, role) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const verify = await pool.query("SELECT * FROM users WHERE email=$1", [
    email,
  ]);
  if (verify.rows.length > 0) {
    throw new Error("User already exists");
  }
  const user = await pool.query(
    "INSERT INTO users (email,password,role) VALUES ($1,$2,$3) RETURNING id,email,role",
    [email, hashedPassword, role],
  );

  return user.rows[0];
};

export const loginUserService = async (email, password) => {
  const result = await pool.query("SELECT * FROM users WHERE email=$1", [
    email,
  ]);

  const user = result.rows[0];

  if (!user) {
    throw new Error("Invalid Email");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Wrong password.");
  }

  return {
    id: user.id,
    email: user.email,
    role: user.role,
  };
};
