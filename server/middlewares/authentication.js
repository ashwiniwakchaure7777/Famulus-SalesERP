const jwt = require("jsonwebtoken");
const { TokenExpiredError } = require("jsonwebtoken");
const ERROR_RESPONSE = require("../utils/handleError");
const { logger } = require("./error.middleware");

module.exports.authentication = async (req, res, next) => {
  try {
    const token = req.headers?.authorization?.split(" ")[1];

    if (
      token &&
      token !== "null" &&
      token !== undefined &&
      token !== "undefined"
    ) {
      
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        logger.info(`Decoded token: ${decoded}`);
        req.user = decoded;
        next();

      } catch (error) {
        if (error instanceof TokenExpiredError) {
          res.status(200).json({
            status: false,
            message: "Token has expired. Please log in again.",
          });
        } else {
          res.status(200).json({
            status: false,
            message: "Invalid token. Please log in again.",
          });
        }
      }
    } else {
      res.status(200).json({
        status: false,
        message: "Please log in first.",
      });
    }
  } catch (error) {
    return ERROR_RESPONSE(res, error);
  }
};
