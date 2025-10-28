const CUSTOMER_MODEL = require("../models/customer.model");

module.exports.createCustomerService = async (payload) => {
  try {
    const customer = await CUSTOMER_MODEL.create(payload);
    return customer ? customer.toJSON() : null;
  } catch (error) {
    console.error("Error while creating customer:", error.message);
    console.error("Payload:", payload);
    throw new Error(`Error while creating customer: ${error.message}`);
  }
};

module.exports.findSingleCustomerService = async (query) => {
  try {
    const customer = await CUSTOMER_MODEL.findOne(query);
    return customer ? customer.toJSON() : null;
  } catch (error) {
    throw new Error("Error while getting a customer");
  }
};

module.exports.findSingleCustomerWithPasswordService = async (query) => {
  try {
    const customer = await CUSTOMER_MODEL.findOne(query);
    return customer;
  } catch (error) {
    throw new Error("Error while getting a customer");
  }
};

module.exports.findAllCustomerService = async (query) => {
  try {
    const customers = await CUSTOMER_MODEL.findAll(query);
    return customers ? customers.map((i) => i.toJSON()) : null;
  } catch (error) {
    throw new Error("Error while getting all customers");
  }
};

module.exports.findAllWithCountCustomerService = async (query) => {
  try {
    const { count, rows } = await CUSTOMER_MODEL.findAndCountAll(query);
    const customers = rows ? rows.map((i) => i.get({ plain: true })) : null;
    return { count, rows: customers };
  } catch (error) {
    throw new Error("Error while creating customer");
  }
};

module.exports.updateCustomerService = async (query, payload) => {
  try {
    const [updatedCount, updatedRows] = await CUSTOMER_MODEL.update(payload, {
      ...query,
      returning: true,
    });
    return { updatedCount, updatedRows };
  } catch (error) {
    console.error("Error while updating customer:", error.message);
    throw new Error("Error while updating customer");
  }
};

module.exports.deleteCustomerService = async (query) => {
  try {
    const deletedCount = await CUSTOMER_MODEL.destroy(query);
    return deletedCount;
  } catch (error) {
    console.error("Error while deleting customer:", error.message);
    throw new Error("Error while deleting customer");
  }
};
