const path = require("path");

const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const compression = require("compression");
const cors = require("cors");
const AppError = require("./utils/apiError");
const dbConnection = require("./config/database");
const errorMiddleware = require("./middlewares/errorMiddleware");
const mountRoutes = require("./routes/index");

dotenv.config({
  path: "config.env",
});

const app = express();

// Enable CORS (Cross-Origin Resource Sharing)
app.use(cors());
app.options("*", cors());

// Compress all responses
app.use(compression());

const PORT = process.env.PORT || 8000;
app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));

// Connect to the database
dbConnection();

// Middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`${process.env.NODE_ENV} mode`);
} else {
  console.log("Production mode");
  app.use(express.static("public")); // Serve static files from the 'public' folder
}

// Mount routes

mountRoutes(app);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 400));
});

// Error middleware from express
app.use(errorMiddleware);
// Start the server
const server = app.listen(PORT || 8000, () => {
  console.log(`app running ${process.env.PORT}`);
});

// Handle unhandled promise rejections

process.on("unhandledRejection", (err) => {
  console.error("Unhandled rejection:", err.message);
  server.close(() => {
    console.error("Shutting down the server...");
    process.exit(1);
  });
});
