const {
  createUserService,
  findSingleUserService,
  findSingleUserWithPasswordService,
} = require("../services/user.services");
const { generateUserToken } = require("../utils/generateToken");
const ERROR_RESPONSE = require("../utils/handleError");

module.exports.createUser = async (req, res) => {
  try {
    const { confirmPassword, ...userPayload } = req.body;

    const isExists = await findSingleUserService({
      where: { email: userPayload.email },
    });

    if (isExists) {
      return res.status(500).json({
        status: false,
        message: "Email already registered. Please register with another email",
      });
    }

    // Convert empty strings to null for optional fields to avoid Sequelize validation errors
    if (userPayload.phone_number === '') {
      userPayload.phone_number = null;
    }
    if (userPayload.profile_picture === '') {
      userPayload.profile_picture = null;
    }
    if (userPayload.department === '') {
      userPayload.department = null;
    }
    if (userPayload.employee_id === '') {
      userPayload.employee_id = null;
    }

    const user = await createUserService(userPayload);

    if (!user) {
      return res.status(409).json({
        status: false,
        message: "Error while creating user",
      });
    }

    res.status(201).json({
      status: true,
      message: `User ${userPayload.first_name} ${userPayload.last_name} is created successfully`,
    });
  } catch (error) {
    ERROR_RESPONSE(res, error);
  }
};

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await findSingleUserWithPasswordService({
      where: { email },
    });

    if (!user) {
      return res.status(409).json({
        status: false,
        message: "User not found. Please register first",
      });
    }

    // Compare password using the model's comparePassword method
    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        status: false,
        message: "Please provide correct credentials",
      });
    }
    
    const userData = user.toJSON();
    const token = generateUserToken({ ...userData, role: "user" });

    res.status(200).json({
      status: true,
      message: "User login successfully",
      data: {
        user: userData,
        token,
      },
    });
  } catch (error) {
    ERROR_RESPONSE(res, error);
  }
};



