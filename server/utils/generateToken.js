const ERROR_RESPONSE = require("./handleError");
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports.generateUserToken = async (user, res) => {
  try {
    const payload = {
      id: user?.ID,
      email: user?.user_email,
      name: user?.name,
      username: user?.username,
      email: user?.email,
      role: user?.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: "27hr",
    });

    if (!token) {
      return res.status(201).json({
        status: false,
        message: "Issue creating token",
      });
    }
    return token;
  } catch (error) {
    ERROR_RESPONSE(res, error);
  }
};

module.exports.generateUserRefreshToken = async (user, res) => {
  try {
    const payload = {
      id: user?.ID,
      email: user?.user_email,
      name: user?.name,
      username: user?.username,
      role: user?.role,
      clientId: user?.clientId || null,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    if (!token) {
      return res.status(201).json({
        status: false,
        message: "Issue creating refresh token",
      });
    }
    return token;
  } catch (error) {
    ERROR_RESPONSE(res, error);
  }
};

module.exports.generateForgetPasswordToken = async (user, res) => {
  try {
    const payload = {
      id: user?.ID,
      email: user?.user_email,
      name: user?.name,
      username: user?.username,
      role: user?.role,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: "60m",
    });
    if (!token) {
      return res.status(201).json({
        status: false,
        message: "Issue creating forget password token",
      });
    }
    return token;
  } catch (error) {
    ERROR_RESPONSE(res, error);
  }
};


// module.exports.verifyTokenForRetailer = async (token, res) => {
//   try {
//     const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

//     if (!decodedToken) {
//       return res.status(201).json({
//         status: false,
//         message: "Token is invalid",
//       });
//     }

//     return decodedToken;
//   } catch (error) {
//     console.error("Error in verifyTokenForRetailer:", error);
//     ERROR_RESPONSE(res, error);
//   }
// };

// module.exports.generateTokenForAdmin = async (data, res) => {
//   try {
//     const token = jwt.sign(data, process.env.JWT_SECRET_KEY, {
//       expiresIn: "7d",
//     });

//     if (!token) {
//       return res.status(201).json({
//         status: false,
//         message: "Issue creating token",
//       });
//     }
//     return token;
//   } catch (error) {
//     ERROR_RESPONSE(res, error);
//   }
// };
