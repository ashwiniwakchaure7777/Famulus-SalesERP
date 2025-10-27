const Joi = require('joi');

const salesInquiryValidationSchemas = {
  create: Joi.object({
    customer_id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'Customer ID must be a number',
        'number.integer': 'Customer ID must be an integer',
        'number.positive': 'Customer ID must be positive',
        'any.required': 'Customer ID is required'
      }),
    
    inquiry_date: Joi.date()
      .iso()
      .optional()
      .messages({
        'date.format': 'Inquiry date must be a valid date in YYYY-MM-DD format'
      }),
    
    expected_delivery_date: Joi.date()
      .iso()
      .greater('now')
      .required()
      .messages({
        'date.format': 'Expected delivery date must be a valid date in YYYY-MM-DD format',
        'date.greater': 'Expected delivery date must be a future date',
        'any.required': 'Expected delivery date is required'
      }),
    
    priority: Joi.string()
      .valid('Low', 'Medium', 'High')
      .optional()
      .messages({
        'any.only': 'Priority must be one of: Low, Medium, High'
      }),
    
    remarks: Joi.string()
      .max(1000)
      .optional()
      .allow('')
      .messages({
        'string.max': 'Remarks cannot exceed 1000 characters'
      }),
    
    created_by: Joi.string()
      .max(100)
      .optional()
      .messages({
        'string.max': 'Created by cannot exceed 100 characters'
      }),
    
    line_items: Joi.array()
      .items(
        Joi.object({
          product_name: Joi.string()
            .min(1)
            .max(255)
            .required()
            .messages({
              'string.empty': 'Product name is required',
              'string.min': 'Product name cannot be empty',
              'string.max': 'Product name cannot exceed 255 characters',
              'any.required': 'Product name is required'
            }),
          
          description: Joi.string()
            .max(1000)
            .optional()
            .allow('')
            .messages({
              'string.max': 'Description cannot exceed 1000 characters'
            }),
          
          quantity: Joi.number()
            .positive()
            .precision(2)
            .required()
            .messages({
              'number.base': 'Quantity must be a number',
              'number.positive': 'Quantity must be positive',
              'number.precision': 'Quantity can have maximum 2 decimal places',
              'any.required': 'Quantity is required'
            }),
          
          unit: Joi.string()
            .valid('Pcs', 'Kg', 'Ltr', 'Mtr')
            .required()
            .messages({
              'any.only': 'Unit must be one of: Pcs, Kg, Ltr, Mtr',
              'any.required': 'Unit is required'
            }),
          
          expected_unit_price: Joi.number()
            .min(0)
            .precision(2)
            .optional()
            .messages({
              'number.base': 'Expected unit price must be a number',
              'number.min': 'Expected unit price cannot be negative',
              'number.precision': 'Expected unit price can have maximum 2 decimal places'
            })
        })
      )
      .min(1)
      .required()
      .messages({
        'array.min': 'Must have at least 1 line item',
        'any.required': 'Line items are required'
      })
  }),

  update: Joi.object({
    customer_id: Joi.number()
      .integer()
      .positive()
      .optional()
      .messages({
        'number.base': 'Customer ID must be a number',
        'number.integer': 'Customer ID must be an integer',
        'number.positive': 'Customer ID must be positive'
      }),
    
    inquiry_date: Joi.date()
      .iso()
      .optional()
      .messages({
        'date.format': 'Inquiry date must be a valid date in YYYY-MM-DD format'
      }),
    
    expected_delivery_date: Joi.date()
      .iso()
      .greater('now')
      .optional()
      .messages({
        'date.format': 'Expected delivery date must be a valid date in YYYY-MM-DD format',
        'date.greater': 'Expected delivery date must be a future date'
      }),
    
    status: Joi.string()
      .valid('Draft', 'Submitted', 'Quoted', 'Won', 'Lost')
      .optional()
      .messages({
        'any.only': 'Status must be one of: Draft, Submitted, Quoted, Won, Lost'
      }),
    
    priority: Joi.string()
      .valid('Low', 'Medium', 'High')
      .optional()
      .messages({
        'any.only': 'Priority must be one of: Low, Medium, High'
      }),
    
    remarks: Joi.string()
      .max(1000)
      .optional()
      .allow('')
      .messages({
        'string.max': 'Remarks cannot exceed 1000 characters'
      }),
    
    modified_by: Joi.string()
      .max(100)
      .optional()
      .messages({
        'string.max': 'Modified by cannot exceed 100 characters'
      })
  }),

  updateLineItems: Joi.object({
    line_items: Joi.array()
      .items(
        Joi.object({
          product_name: Joi.string()
            .min(1)
            .max(255)
            .required()
            .messages({
              'string.empty': 'Product name is required',
              'string.min': 'Product name cannot be empty',
              'string.max': 'Product name cannot exceed 255 characters',
              'any.required': 'Product name is required'
            }),
          
          description: Joi.string()
            .max(1000)
            .optional()
            .allow('')
            .messages({
              'string.max': 'Description cannot exceed 1000 characters'
            }),
          
          quantity: Joi.number()
            .positive()
            .precision(2)
            .required()
            .messages({
              'number.base': 'Quantity must be a number',
              'number.positive': 'Quantity must be positive',
              'number.precision': 'Quantity can have maximum 2 decimal places',
              'any.required': 'Quantity is required'
            }),
          
          unit: Joi.string()
            .valid('Pcs', 'Kg', 'Ltr', 'Mtr')
            .required()
            .messages({
              'any.only': 'Unit must be one of: Pcs, Kg, Ltr, Mtr',
              'any.required': 'Unit is required'
            }),
          
          expected_unit_price: Joi.number()
            .min(0)
            .precision(2)
            .optional()
            .messages({
              'number.base': 'Expected unit price must be a number',
              'number.min': 'Expected unit price cannot be negative',
              'number.precision': 'Expected unit price can have maximum 2 decimal places'
            })
        })
      )
      .min(1)
      .required()
      .messages({
        'array.min': 'Must have at least 1 line item',
        'any.required': 'Line items are required'
      })
  }),

  query: Joi.object({
    page: Joi.number()
      .integer()
      .min(1)
      .optional()
      .messages({
        'number.base': 'Page must be a number',
        'number.integer': 'Page must be an integer',
        'number.min': 'Page must be at least 1'
      }),
    
    limit: Joi.number()
      .integer()
      .min(1)
      .max(100)
      .optional()
      .messages({
        'number.base': 'Limit must be a number',
        'number.integer': 'Limit must be an integer',
        'number.min': 'Limit must be at least 1',
        'number.max': 'Limit cannot exceed 100'
      }),
    
    customer_id: Joi.number()
      .integer()
      .positive()
      .optional()
      .messages({
        'number.base': 'Customer ID must be a number',
        'number.integer': 'Customer ID must be an integer',
        'number.positive': 'Customer ID must be positive'
      }),
    
    status: Joi.string()
      .valid('Draft', 'Submitted', 'Quoted', 'Won', 'Lost')
      .optional()
      .messages({
        'any.only': 'Status must be one of: Draft, Submitted, Quoted, Won, Lost'
      }),
    
    priority: Joi.string()
      .valid('Low', 'Medium', 'High')
      .optional()
      .messages({
        'any.only': 'Priority must be one of: Low, Medium, High'
      }),
    
    date_from: Joi.date()
      .iso()
      .optional()
      .messages({
        'date.format': 'Date from must be a valid date in YYYY-MM-DD format'
      }),
    
    date_to: Joi.date()
      .iso()
      .optional()
      .messages({
        'date.format': 'Date to must be a valid date in YYYY-MM-DD format'
      }),
    
    sort_by: Joi.string()
      .valid('inquiry_number', 'inquiry_date', 'expected_delivery_date', 'status', 'priority', 'created_at', 'updated_at')
      .optional()
      .messages({
        'any.only': 'Invalid sort field'
      }),
    
    sort_order: Joi.string()
      .valid('ASC', 'DESC', 'asc', 'desc')
      .optional()
      .messages({
        'any.only': 'Sort order must be either ASC or DESC'
      })
  })
};

module.exports = salesInquiryValidationSchemas;
