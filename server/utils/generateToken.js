const ERROR_RESPONSE = require("./handleError");
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports.generateUserToken = (user) => {
  try {
    const payload = {
      id: user?.ID,
      email: user?.email || user?.user_email,
      name: user?.customer_name || user?.first_name,
      username: user?.username,
      role: user?.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    if (!token) {
      throw new Error("Failed to generate token");
    }
    return token;
  } catch (error) {
    console.error("Error generating token:", error);
    throw error;
  }
};
