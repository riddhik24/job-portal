import connectDB from "./utils/db.js";
import dotenv from "dotenv";
import app from "./app.js";
dotenv.config();

const PORT = process.env.PORT;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to db.", err);
    process.exit(1);
  });
