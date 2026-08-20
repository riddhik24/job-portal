import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import errorHandling from "./middleware/error.js";
import { pool } from "./utils/db.js";
import userRouter from "./routes/user.routes.js";
import profileRouter from "./routes/profile.routes.js";
import jobRouter from "./routes/job.routes.js";
import applicationRouter from "./routes/application.routes.js";
dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
//PORT
// const PORT = process.env.PORT;

//test connection
app.get("/", async (req, res) => {
  const result = await pool.query("SELECT current_database()");
  res.send(`Database name: ${result.rows[0].current_database}`);
});

app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//routes
app.use("/api/auth", userRouter);
app.use("/api/profile", profileRouter);
app.use("/api/jobs", jobRouter);
app.use("/api/applications", applicationRouter);

app.use(errorHandling);

export default app;
