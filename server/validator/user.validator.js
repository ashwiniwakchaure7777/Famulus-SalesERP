const Joi = require("joi");

function userValidator(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required().messages({
      "any.required": "Name is required",
      "string.empty": "Name cannot be empty",
      "string.min": "Name must be at least 3 characters",
      "string.max": "Name must be at most 50 characters",
    }),
    username: Joi.string().min(3).max(50).optional().messages({
      "string.empty": "Username cannot be empty",
      "string.min": "Username must be at least 3 characters",
      "string.max": "Username must be at most 50 characters",
    }),
    email: Joi.string().email().required().messages({
      "any.required": "Email is required",
      "string.email": "Must be a valid email address",
      "string.empty": "Email cannot be empty",
    }),
    phone: Joi.string()
      .pattern(/^\+1\d{10}$/)
      .required()
      .messages({
        "any.required": "Phone is required",
        "string.empty": "Phone cannot be empty",
        "string.pattern.base": "Phone number must be in +1 format with 10 digits (e.g., +12135557654)",
      }),
    profileImageUrl: Joi.string().uri().optional().allow("").messages({
      "string.uri": "Profile image must be a valid URI",
    }),
    role: Joi.string()
      .valid("admin", "operations", "support", "finance")
      .required()
      .messages({
        "any.required": "Role is required",
        "any.only": "Role must be one of admin, operations, support, finance",
        "string.empty": "Role cannot be empty",
      }),
    password: Joi.string().min(8).required().messages({
      "any.required": "Password is required",
      "string.empty": "Password cannot be empty",
      "string.min": "Password must be at least 8 characters",
    }),
    confirmPassword: Joi.any().valid(Joi.ref("password")).required().messages({
      "any.only": "Password and confirm password do not match",
      "any.required": "Confirm password is required",
    }),
    shiftTime: Joi.string().required().allow("").messages({
      "string.empty": "Shift time cannot be empty",
    }),
    notes: Joi.string().optional().allow("").messages({
      "string.empty": "Notes cannot be empty",
    }),
    // Uniqueness for username/email must be checked in controller
  });
  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details.map((err) => err.message),
    });
  }
  next();
}

function createUserValidator(req, res, next) {
  const schema = Joi.object({
    first_name: Joi.string().min(2).max(100).required().messages({
      "any.required": "First name is required",
      "string.empty": "First name cannot be empty",
      "string.min": "First name must be at least 2 characters",
      "string.max": "First name must be at most 100 characters",
    }),
    last_name: Joi.string().min(2).max(100).required().messages({
      "any.required": "Last name is required",
      "string.empty": "Last name cannot be empty",
      "string.min": "Last name must be at least 2 characters",
      "string.max": "Last name must be at most 100 characters",
    }),
    email: Joi.string().email().required().messages({
      "any.required": "Email is required",
      "string.email": "Must be a valid email address",
      "string.empty": "Email cannot be empty",
    }),
    phone_number: Joi.string()
      .pattern(/^[\+]?[1-9][\d]{0,15}$/)
      .optional()
      .allow("")
      .messages({
        "string.pattern.base": "Please provide a valid phone number",
      }),
    role: Joi.string()
      .valid("Admin", "Manager", "Sales", "User")
      .optional()
      .messages({
        "any.only": "Role must be one of Admin, Manager, Sales, User",
      }),
    status: Joi.string()
      .valid("Active", "Inactive", "Suspended")
      .optional()
      .messages({
        "any.only": "Status must be one of Active, Inactive, Suspended",
      }),
    password: Joi.string().min(8).required().messages({
      "any.required": "Password is required",
      "string.empty": "Password cannot be empty",
      "string.min": "Password must be at least 8 characters",
    }),
    confirmPassword: Joi.any().valid(Joi.ref("password")).required().messages({
      "any.only": "Password and confirm password do not match",
      "any.required": "Confirm password is required",
    }),
    profile_picture: Joi.string().optional().allow("").messages({
      "string.uri": "Profile picture must be a valid URL",
    }),
    department: Joi.string().max(100).optional().allow("").messages({
      "string.max": "Department cannot exceed 100 characters",
    }),
    employee_id: Joi.string().max(50).optional().allow("").messages({
      "string.max": "Employee ID cannot exceed 50 characters",
    }),
    date_of_birth: Joi.date().optional().messages({
      "date.base": "Date of birth must be a valid date",
    }),
    joining_date: Joi.date().optional().messages({
      "date.base": "Joining date must be a valid date",
    }),
    // Uniqueness for email must be checked in controller
  });
  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details.map((err) => err.message),
    });
  }
  next();
}

const updateUserSchema = Joi.object({
  name: Joi.string().min(3).max(50).optional(),
  username: Joi.string().min(3).max(50).optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string()
    .pattern(/^\+1\d{10}$/)
    .optional()
    .messages({
      "string.pattern.base": "Phone number must be in +1 format with 10 digits (e.g., +12135557654)",
    }),
  profileImageUrl: Joi.string().uri().optional().allow(""),
  role: Joi.string()
    .valid("admin", "operations", "support", "finance")
    .optional(),
  status: Joi.string().valid("active", "inactive", "disabled").optional(),
  password: Joi.string().min(8).optional(),
  confirmPassword: Joi.when("password", {
    is: Joi.exist(),
    then: Joi.string().valid(Joi.ref("password")).required().messages({
      "any.only": "Confirm password must match password",
      "any.required": "Confirm password is required when password is provided",
    }),
    otherwise: Joi.optional(),
  }),
  shiftTime: Joi.string().optional().allow(""),
  notes: Joi.string().optional().allow(""),
  employeeId: Joi.forbidden().messages({
    "any.unknown": "Employee ID cannot be updated. It is auto-generated.",
  }),
});

const loginUserSchema = Joi.object({
  username: Joi.string().optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().required(),
}).or("username", "email");

const forgetPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

const resetForgotPasswordSchema = Joi.object({
  password: Joi.string().min(8).required(),
  confirmPassword: Joi.any().valid(Joi.ref("password")).required().messages({
    "any.only": "Password and confirm password do not match.",
  }),
  forgetPasswordToken: Joi.string().required(),
});

const refreshTokenLoginSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

const updatePasswordSchema = Joi.object({
  oldPassword: Joi.string().required().messages({
    "any.required": "Old password is required",
    "string.empty": "Old password cannot be empty",
  }),
  newPassword: Joi.string().min(8).required().messages({
    "any.required": "New password is required",
    "string.empty": "New password cannot be empty",
    "string.min": "New password must be at least 8 characters",
  }),
  confirmNewPassword: Joi.string()
    .required()
    .valid(Joi.ref("newPassword"))
    .messages({
      "any.only": "Confirm new password must match new password",
      "any.required": "Confirm new password is required",
      "string.empty": "Confirm new password cannot be empty",
    }),
});

const forgetPasswordGenerateTokenSchema = Joi.object({
  email: Joi.string().email().lowercase().messages({
    "string.email": "Email must be a valid email address",
  }),
  username: Joi.string().lowercase().messages({
    "string.empty": "Username cannot be empty",
  }),
})
  .or("email", "username")
  .messages({
    "object.missing": "Either email or username is required",
  });

module.exports = {
  updateUserSchema,
  loginUserSchema,
  forgetPasswordSchema,
  resetForgotPasswordSchema,
  refreshTokenLoginSchema,
  userValidator,
  createUserValidator,
  updatePasswordSchema,
  forgetPasswordGenerateTokenSchema,
};
