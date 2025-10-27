const {
  createUserService,
  findSingleUserService,
} = require("../services/user.services");
const { generateUserToken } = require("../utils/generateToken");
const ERROR_RESPONSE = require("../utils/handleError");

module.exports.createUser = async (req, res) => {
  try {
    const userPayload = req.body;

    const isExists = await findSingleUserService({
      where: { email: userPayload.email },
    });

    if (isExists) {
      return res.status(500).json({
        status: false,
        message: "Email already registered. Please register with another email",
      });
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

    const isExists = await findSingleUserService({
      where: { email },
    });

    if (!isExists) {
      return res.status(409).json({
        status: false,
        message: "User not found. Please register first",
      });
    }

    const isPasswordMatch = await isExists.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        status: false,
        message: "Please provide correct credentials",
      });
    }
    
    const token = generateUserToken({ ...isExists, role: "user" }, res);

    res.status(200).json({
      status: true,
      message: "User login successfully",
      data: {
        user: isExists,
        token,
      },
    });
  } catch (error) {
    ERROR_RESPONSE(res, error);
  }
};



