import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pkg;

const connectionString = process.env.DB_URL;
export const pool = new Pool(
  connectionString
    ? {
        connectionString,
        ssl: { rejectUnauthorized: false },
      }
    : {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
      },
);

const connectDB = async () => {
  try {
    // pool.on("connect", () => {
    //   console.log("Connection pool established with DB");
    // });
    const client = await pool.connect();
    console.log("Connection pool established with DB");
    client.release();
  } catch (err) {
    console.error("Error in connecting database: ", err);
    throw err;
  }
};

export default connectDB;
