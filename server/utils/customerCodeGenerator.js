const moment = require("moment");
const { Op } = require("sequelize");
const { sequelize } = require("../config/database");

async function generateCustomerCode(options = {}) {
    try {
        const { year = moment().year(), prefix = "CUST" } = options;

        // Query directly using sequelize to find the last customer with matching code
        const [results] = await sequelize.query(
            `SELECT customer_code FROM customers WHERE customer_code LIKE '${prefix}-${year}-%' AND "deletedAt" IS NULL ORDER BY customer_code DESC LIMIT 1`,
            { type: sequelize.QueryTypes.SELECT }
        );

        let nextNumber = 1;
        if (results && results.customer_code) {
            const parts = results.customer_code.split("-");
            if (parts.length === 3) {
                const lastNumber = parseInt(parts[2], 10);
                nextNumber = lastNumber + 1;
            }
        }

        // Generate the new customer code
        const customerCode = `${prefix}-${year}-${nextNumber.toString().padStart(4, "0")}`;

        return customerCode;
    } catch (error) {
        console.error("Error generating customer code:", error);
        throw new Error("Failed to generate customer code");
    }
}

module.exports = {
    generateCustomerCode,
};
