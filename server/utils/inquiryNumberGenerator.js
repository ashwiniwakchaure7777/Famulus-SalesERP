const moment = require("moment");
const { sequelize } = require("../config/database");

async function generateInquiryNumber(options = {}) {
  try {
    const { year = moment().year(), month = moment().format("MM"), prefix = "INQ" } = options;

    // Query directly using sequelize to find the last inquiry with matching number
    const [results] = await sequelize.query(
      `SELECT inquiry_number FROM sales_inquiries WHERE inquiry_number LIKE '${prefix}-${year}-${month}-%' AND "deletedAt" IS NULL ORDER BY inquiry_number DESC LIMIT 1`,
      { type: sequelize.QueryTypes.SELECT }
    );

    let nextNumber = 1;
    if (results && results.inquiry_number) {
      const parts = results.inquiry_number.split("-");
      if (parts.length === 4) {
        const lastNumber = parseInt(parts[3], 10);
        nextNumber = lastNumber + 1;
      }
    }

    // Generate the new inquiry number
    const inquiryNumber = `${prefix}-${year}-${month}-${nextNumber.toString().padStart(4, "0")}`;

    return inquiryNumber;
  } catch (error) {
    console.error("Error generating inquiry number:", error);
    throw new Error("Failed to generate inquiry number");
  }
}

module.exports = {
  generateInquiryNumber,
};

