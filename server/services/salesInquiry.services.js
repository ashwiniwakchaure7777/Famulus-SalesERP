const SALES_INQUIRY_MODEL = require("../models/salesInquiry.model");
const SALES_INQUIRY_ITEM_MODEL = require("../models/salesInquiryLineItem.model");

module.exports.createSalesInquiryService = async (payload, options = {}) => {
  try {
    const inquiry = await SALES_INQUIRY_MODEL.create(payload, options);
    return inquiry;
  } catch (error) {
    console.error("Error creating sales inquiry:", error.message);
    console.error("Payload:", payload);
    throw new Error(`Error while creating sales inquiry: ${error.message}`);
  }
};

module.exports.createBulkSalesInquiryItemsService = async (
  payload,
  options = {}
) => {
  try {
    const inquiry = await SALES_INQUIRY_ITEM_MODEL.createBulk(payload, options);
    return inquiry;
  } catch (error) {
    throw new Error("Error while creating sales inquiry");
  }
};
module.exports.findSingleSalesInquiryService = async (query) => {
  try {
    const inquiry = await SALES_INQUIRY_MODEL.findOne(query);
    return inquiry ? inquiry.toJSON() : null;
  } catch (error) {
    throw new Error("Error while getting a sales inquiry");
  }
};

module.exports.findAllSalesInquiryService = async (query) => {
  try {
    const inquiries = await SALES_INQUIRY_MODEL.findAll(query);
    return inquiries ? inquiries.map((i) => i.toJSON()) : null;
  } catch (error) {
    throw new Error("Error while getting all sales inquiries");
  }
};

module.exports.findAllWithCountSalesInquiryService = async (query) => {
  try {
    const { count, rows } = await SALES_INQUIRY_MODEL.findAndCountAll(query);
    const inquiries = rows ? rows.map((i) => i.get({ plain: true })) : null;
    return { count, rows: inquiries };
  } catch (error) {
    throw new Error("Error while getting sales inquiries with count");
  }
};

module.exports.updateSalesInquiryService = async (query, payload) => {
  try {
    const [updatedCount, updatedRows] = await SALES_INQUIRY_MODEL.update(
      payload,
      {
        ...query,
        returning: true,
      }
    );
    return { updatedCount, updatedRows };
  } catch (error) {
    console.error("Error while updating sales inquiry:", error.message);
    throw new Error("Error while updating sales inquiry");
  }
};

module.exports.deleteSalesInquiryService = async (query) => {
  try {
    const deletedCount = await SALES_INQUIRY_MODEL.destroy(query);
    return deletedCount;
  } catch (error) {
    console.error("Error while deleting sales inquiry:", error.message);
    throw new Error("Error while deleting sales inquiry");
  }
};

module.exports.createLineItemService = async (payload) => {
  try {
    const item = await SALES_INQUIRY_ITEM_MODEL.create(payload);
    return item ? item.toJSON() : null;
  } catch (error) {
    throw new Error("Error while creating line item");
  }
};

module.exports.createBulkSalesInquiryItemsService = async (payload, options = {}) => {
  try {
    const items = await SALES_INQUIRY_ITEM_MODEL.bulkCreate(payload, options);
    return items ? items.map((i) => i.toJSON()) : null;
  } catch (error) {
    throw new Error(`Error while creating line items in bulk: ${error.message}`);
  }
};
module.exports.findSingleLineItemService = async (query) => {
  try {
    const item = await SALES_INQUIRY_ITEM_MODEL.findOne(query);
    return item ? item.toJSON() : null;
  } catch (error) {
    throw new Error("Error while getting a line item");
  }
};

module.exports.findAllLineItemService = async (query) => {
  try {
    const items = await SALES_INQUIRY_ITEM_MODEL.findAll(query);
    return items ? items.map((i) => i.toJSON()) : null;
  } catch (error) {
    throw new Error("Error while getting all line items");
  }
};

module.exports.findAllWithCountLineItemService = async (query) => {
  try {
    const { count, rows } = await SALES_INQUIRY_ITEM_MODEL.findAndCountAll(
      query
    );
    const items = rows ? rows.map((i) => i.get({ plain: true })) : null;
    return { count, rows: items };
  } catch (error) {
    throw new Error("Error while getting line items with count");
  }
};

module.exports.updateLineItemService = async (query, payload) => {
  try {
    const [updatedCount, updatedRows] = await SALES_INQUIRY_ITEM_MODEL.update(
      payload,
      {
        ...query,
        returning: true,
      }
    );
    return { updatedCount, updatedRows };
  } catch (error) {
    console.error("Error while updating line item:", error.message);
    throw new Error("Error while updating line item");
  }
};

module.exports.deleteLineItemService = async (query) => {
  try {
    const deletedCount = await SALES_INQUIRY_ITEM_MODEL.destroy(query);
    return deletedCount;
  } catch (error) {
    console.error("Error while deleting line item:", error.message);
    throw new Error("Error while deleting line item");
  }
};

module.exports.updateLineItemsService = async (query, payload) => {
  try {
    const updatedRows = await SALES_INQUIRY_MODEL.update(payload, query);
    return updatedRows;
  } catch (error) {
    throw new Error("Error while updating line items in bulk");
  }
};

module.exports.findWithGroupBy = async (query) => {
  try {
    const result = await SALES_INQUIRY_MODEL.findAll(query);
    return result ? result.map((i) => i.get({ plain: true })) : [];
  } catch (error) {
    console.error("Error while getting grouped data:", error.message);
    throw new Error("Error while getting grouped data");
  }
};