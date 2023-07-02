const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const authRouter = require("./src/routes/auth.js");
const todoRouter = require("./src/routes/todo.js");
const countRouter = require("./src/routes/count.js");

dotenv.config();
const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_ACCESS);
    console.log("Connected to MongoDB");
    // Perform additional operations after successful connection
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

connectToDatabase();

app.use(express.json());
app.use(
  cors({
    origin: ["https://react-foodwise-app.vercel.app/"],
  })
);

app.use("/", authRouter);
app.use("/", todoRouter);
app.use("/", countRouter);

APP_PORT = 4000;
app.listen(APP_PORT, () => console.log(`App is running on port ${APP_PORT}`));
