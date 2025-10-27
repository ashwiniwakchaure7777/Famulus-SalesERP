// Import all models
const USER_MODEL = require("./user.model");
const CUSTOMER_MODEL = require("./customer.model");
const SALES_INQUIRY_MODEL = require("./salesInquiry.model");
const SALES_INQUIRY_LINE_ITEM_MODEL = require("./salesInquiryLineItem.model");

// Create models object
const models = {
  USER_MODEL,
  CUSTOMER_MODEL,
  SALES_INQUIRY_MODEL,
  SALES_INQUIRY_LINE_ITEM_MODEL,
};

const initializeAssociations = () => {
  try {
    // Initialize associations for all models that have an associate method
    Object.values(models).forEach((model) => {
      if (model.associate) {
        model.associate(models);
      }
    });
    console.log("✅ Model associations initialized successfully");
  } catch (error) {
    console.error("❌ Error initializing associations:", error);
  }
};

module.exports = {
  USER_MODEL,
  CUSTOMER_MODEL,
  SALES_INQUIRY_MODEL,
  SALES_INQUIRY_LINE_ITEM_MODEL,
  initializeAssociations,
  models,
};
