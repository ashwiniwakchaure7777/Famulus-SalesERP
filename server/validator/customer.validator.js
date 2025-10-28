const Joi = require("joi");

function createCustomerValidator(req, res, next) {
  const schema = Joi.object({
    customer_name: Joi.string()
      .min(2)
      .max(255)
      .required()
      .messages({
        "any.required": "Customer name is required",
        "string.empty": "Customer name cannot be empty",
        "string.min": "Customer name must be at least 2 characters",
        "string.max": "Customer name must be at most 255 characters",
      }),
    
    email: Joi.string()
      .email()
      .required()
      .messages({
        "any.required": "Email is required",
        "string.email": "Must be a valid email address",
        "string.empty": "Email cannot be empty",
      }),
    
    phone_number: Joi.string()
      .pattern(/^[\+]?[1-9][\d]{0,15}$/)
      .required()
      .messages({
        "any.required": "Phone number is required",
        "string.empty": "Phone number cannot be empty",
        "string.pattern.base": "Please provide a valid phone number",
      }),
    
    business_type: Joi.string()
      .valid("Retailer", "Wholesaler", "Distributor")
      .required()
      .messages({
        "any.required": "Business type is required",
        "any.only": "Business type must be one of: Retailer, Wholesaler, Distributor",
        "string.empty": "Business type cannot be empty",
      }),
    
    credit_limit: Joi.number()
      .min(0)
      .precision(2)
      .optional()
      .messages({
        "number.min": "Credit limit cannot be negative",
        "number.precision": "Credit limit can have maximum 2 decimal places",
      }),
    
    address_street: Joi.string()
      .max(500)
      .required()
      .messages({
        "string.max": "Street address cannot exceed 500 characters",
      }),
    
    address_city: Joi.string()
      .min(1)
      .max(100)
      .required()
      .messages({
        "any.required": "City is required",
        "string.empty": "City cannot be empty",
        "string.min": "City cannot be empty",
        "string.max": "City cannot exceed 100 characters",
      }),
    
    address_state: Joi.string()
      .min(1)
      .max(100)
      .required()
      .messages({
        "any.required": "State is required",
        "string.empty": "State cannot be empty",
        "string.min": "State cannot be empty",
        "string.max": "State cannot exceed 100 characters",
      }),
    
    address_pincode: Joi.string()
      .pattern(/^[1-9][0-9]{5}$/)
      .required()
      .messages({
        "any.required": "Pincode is required",
        "string.empty": "Pincode cannot be empty",
        "string.pattern.base": "Pincode must be a valid 6-digit number",
      }),
    
    gst_number: Joi.string()
      .pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)
      .optional()
      .allow("")
      .messages({
        "string.pattern.base": "Please provide a valid GST number",
      }),
    
    password: Joi.string()
      .min(8)
      .required()
      .messages({
        "any.required": "Password is required",
        "string.empty": "Password cannot be empty",
        "string.min": "Password must be at least 8 characters",
      }),
    
    confirmPassword: Joi.any()
      .valid(Joi.ref("password"))
      .required()
      .messages({
        "any.only": "Password and confirm password do not match",
        "any.required": "Confirm password is required",
      }),
  });
  
  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      status: false,
      message: error.details.map((err) => err.message),
    });
  }
  next();
}

const updateCustomerSchema = Joi.object({
  customer_name: Joi.string()
    .min(2)
    .max(255)
    .optional()
    .messages({
      "string.min": "Customer name must be at least 2 characters",
      "string.max": "Customer name must be at most 255 characters",
    }),
  
  email: Joi.string()
    .email()
    .optional()
    .messages({
      "string.email": "Must be a valid email address",
    }),
  
  phone_number: Joi.string()
    .pattern(/^[\+]?[1-9][\d]{0,15}$/)
    .optional()
    .messages({
      "string.pattern.base": "Please provide a valid phone number",
    }),
  
  business_type: Joi.string()
    .valid("Retailer", "Wholesaler", "Distributor")
    .optional()
    .messages({
      "any.only": "Business type must be one of: Retailer, Wholesaler, Distributor",
    }),
  
  credit_limit: Joi.number()
    .min(0)
    .precision(2)
    .optional()
    .messages({
      "number.min": "Credit limit cannot be negative",
      "number.precision": "Credit limit can have maximum 2 decimal places",
    }),
  
  address_street: Joi.string()
    .max(500)
    .optional()
    .allow("")
    .messages({
      "string.max": "Street address cannot exceed 500 characters",
    }),
  
  address_city: Joi.string()
    .min(1)
    .max(100)
    .optional()
    .messages({
      "string.min": "City cannot be empty",
      "string.max": "City cannot exceed 100 characters",
    }),
  
  address_state: Joi.string()
    .min(1)
    .max(100)
    .optional()
    .messages({
      "string.min": "State cannot be empty",
      "string.max": "State cannot exceed 100 characters",
    }),
  
  address_pincode: Joi.string()
    .pattern(/^[1-9][0-9]{5}$/)
    .optional()
    .messages({
      "string.pattern.base": "Pincode must be a valid 6-digit number",
    }),
  
  gst_number: Joi.string()
    .pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)
    .optional()
    .allow("")
    .messages({
      "string.pattern.base": "Please provide a valid GST number",
    }),
  
  status: Joi.string()
    .valid("Active", "Inactive")
    .optional()
    .messages({
      "any.only": "Status must be either Active or Inactive",
    }),
  
  password: Joi.string()
    .min(8)
    .optional()
    .messages({
      "string.min": "Password must be at least 8 characters",
    }),
  
  confirmPassword: Joi.when("password", {
    is: Joi.exist(),
    then: Joi.string().valid(Joi.ref("password")).required().messages({
      "any.only": "Confirm password must match password",
      "any.required": "Confirm password is required when password is provided",
    }),
    otherwise: Joi.optional(),
  }),
});

const queryCustomerSchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .optional()
    .messages({
      "number.base": "Page must be a number",
      "number.integer": "Page must be an integer",
      "number.min": "Page must be at least 1",
    }),
  
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .optional()
    .messages({
      "number.base": "Limit must be a number",
      "number.integer": "Limit must be an integer",
      "number.min": "Limit must be at least 1",
      "number.max": "Limit cannot exceed 100",
    }),
  
  search: Joi.string()
    .max(255)
    .optional()
    .allow("")
    .messages({
      "string.max": "Search term cannot exceed 255 characters",
    }),
  
  business_type: Joi.string()
    .valid("Retailer", "Wholesaler", "Distributor")
    .optional()
    .allow("")
    .messages({
      "any.only": "Business type must be one of: Retailer, Wholesaler, Distributor",
    }),
  
  status: Joi.string()
    .valid("Active", "Inactive")
    .optional()
    .allow("")
    .messages({
      "any.only": "Status must be either Active or Inactive",
    }),
  
  sort_by: Joi.string()
    .valid("customer_name", "customer_code", "email", "business_type", "status", "created_at", "updated_at")
    .optional()
    .messages({
      "any.only": "Invalid sort field",
    }),
  
  sort_order: Joi.string()
    .valid("ASC", "DESC", "asc", "desc")
    .optional()
    .messages({
      "any.only": "Sort order must be either ASC or DESC",
    }),
});

const exportCustomersSchema = Joi.object({
  format: Joi.string()
    .valid("csv", "excel")
    .optional()
    .messages({
      "any.only": "Format must be either csv or excel",
    }),
  
  business_type: Joi.string()
    .valid("Retailer", "Wholesaler", "Distributor")
    .optional()
    .allow("")
    .messages({
      "any.only": "Business type must be one of: Retailer, Wholesaler, Distributor",
    }),
  
  status: Joi.string()
    .valid("Active", "Inactive")
    .optional()
    .allow("")
    .messages({
      "any.only": "Status must be either Active or Inactive",
    }),
});

const loginCustomerSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      "any.required": "Email is required",
      "string.email": "Must be a valid email address",
      "string.empty": "Email cannot be empty",
    }),
  
  password: Joi.string()
    .required()
    .messages({
      "any.required": "Password is required",
      "string.empty": "Password cannot be empty",
    }),
});

module.exports = {
  updateCustomerSchema,
  queryCustomerSchema,
  exportCustomersSchema,
  createCustomerValidator,
  loginCustomerSchema,
};