const ApiError = require("../utils/apiError");

// eslint-disable-next-line no-shadow
const sendErrorForDev = (error, res) =>
  res.status(error.statusCode).json({
    status: error.status,
    error,
    message: error.message,
    stack: error.stack,
  });

// eslint-disable-next-line no-shadow
const sendErrorForProduction = (error, res) =>
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
  });

const handleJwtInvalidSignature = () =>
  new ApiError("Invalid token, please login again..", 401);

const handleJwtExpired = () =>
  new ApiError("Expired token, please login again..", 401);
const globalError = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";

  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-use-before-define
    sendErrorForDev(error, res);
  } else {
    // eslint-disable-next-line no-use-before-define
    if (error.name === "JsonWebTokenError") error = handleJwtInvalidSignature();
    if (error.name === "TokenExpiredError") error = handleJwtExpired();
    sendErrorForProduction(error, res);
  }
};

module.exports = globalError;
