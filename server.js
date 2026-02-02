const express = require("express");
const mongoose = require("mongoose");
const mainApiRoutes = require("./src/api-routes/index");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect("mongodb://127.0.0.1:27017/Scholar-Press")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB error:", err.message);
    process.exit(1);
  });
app.use("/api", mainApiRoutes);
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});
app.listen(5000, () => console.log("server is connected"));
