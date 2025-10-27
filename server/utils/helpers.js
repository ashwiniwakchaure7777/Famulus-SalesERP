const moment = require("moment");

module.exports.generateCustomerCode = (lastNumber = 0) => {
  const year = moment().year();
  const nextNumber = lastNumber + 1;
  return `CUST-${year}-${nextNumber.toString().padStart(4, "0")}`;
};

module.exports.generateInquiryCode = (lastNumber = 0) => {
  const year = moment().year();
  const month = moment().format("MM");
  const nextNumber = lastNumber + 1;
  return `INQ-${year}-${month}-${nextNumber.toString().padStart(4, "0")}`;
};

module.exports.formatCurrency = (amount, currency = "INR") => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

module.exports.formatDate = (date, format = "DD/MM/YYYY") => {
  return moment(date).format(format);
};

module.exports.sanitizeString = (str) => {
  if (!str) return "";
  return str.trim().replace(/[<>]/g, "");
};

module.exports.isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

module.exports.isValidPhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone);
};

module.exports.isValidGST = (gst) => {
  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return gstRegex.test(gst);
};

module.exports.isValidPincode = (pincode) => {
  const pincodeRegex = /^[1-9][0-9]{5}$/;
  return pincodeRegex.test(pincode);
};

module.exports.generateRandomString = (length = 8) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

module.exports.deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

module.exports.isFutureDate = (date) => {
  return moment(date).isAfter(moment(), "day");
};

module.exports.getCurrentMonthRange = () => {
  const start = moment().startOf("month");
  const end = moment().endOf("month");
  return {
    start: start.format("YYYY-MM-DD"),
    end: end.format("YYYY-MM-DD"),
  };
};

module.exports.getLastNDaysRange = (days = 30) => {
  const start = moment().subtract(days, "days");
  const end = moment();
  return {
    start: start.format("YYYY-MM-DD"),
    end: end.format("YYYY-MM-DD"),
  };
};

module.exports.calculateLineItemsTotal = (lineItems) => {
  let totalAmount = 0;
  let totalQuantity = 0;

  lineItems.forEach((item) => {
    const quantity = parseFloat(item.quantity) || 0;
    const price = parseFloat(item.expected_unit_price) || 0;
    const amount = quantity * price;

    totalQuantity += quantity;
    totalAmount += amount;
  });

  return {
    total_quantity: totalQuantity,
    total_amount: totalAmount,
    item_count: lineItems.length,
  };
};
