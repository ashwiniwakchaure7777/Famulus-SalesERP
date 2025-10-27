const jwt = require("jsonwebtoken");
const { TokenExpiredError } = require("jsonwebtoken");
const ERROR_RESPONSE = require("../utils/handleError");
const { isTokenBlacklisted } = require("../utils/handleToken");

module.exports.authentication = async (req, res, next) => {
  try {
    const token = req.headers?.authorization?.split(" ")[1];

    if (
      token &&
      token !== "null" &&
      token !== undefined &&
      token !== "undefined"
    ) {
      // Check if token is blacklisted
      if (isTokenBlacklisted(token)) {
        return res.status(200).json({
          status: false,
          message: "This token has been revoked. Please log in again.",
        });
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        if (!decoded.organizationId) {
          return res.status(400).json({
            status: false,
            message: "Missing organizationId in token. Please log in again.",
          });
        }
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
