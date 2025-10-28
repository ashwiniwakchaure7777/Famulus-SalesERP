const { logger } = require("../middlewares/error.middleware");

const ERROR_RESPONSE = (res, error) => {
  // Log error with logger
  logger.error("Error occurred:", {
    message: error.message,
    stack: error.stack,
    ...error,
  });

  // If error is a validation error (optional, for Mongoose/other validation)
  if (error.name === "ValidationError") {
    const messages = Object.values(error.errors).map((err) => err.message);
    return res.status(201).json({
      status: false,
      message: "Validation error",
      errors: messages,
    });
  }

  // Default to Internal Server Error for any other type of errors
  if (!res.headersSent) {
    return res.status(500).json({
      status: false,
      message: error.message || "Internal Server Error",
      error,
    });
  }
};

module.exports = ERROR_RESPONSE;
