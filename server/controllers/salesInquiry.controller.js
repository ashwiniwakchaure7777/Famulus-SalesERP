const salesInquiryService = require("../services/salesInquiry.services");
const { asyncHandler } = require("../middlewares/error.middleware");
const {
  createSalesInquiryService,
  updateSalesInquiryService,
  updateLineItemsService,
  deleteSalesInquiryService,
  findAllWithCountSalesInquiryService,
  findSingleSalesInquiryService,
  createBulkSalesInquiryItemsService,
  deleteLineItemService,
  updateLineItemService,
  createLineItemService,
  findAllLineItemService,
  findWithGroupBy,
} = require("../services/salesInquiry.services");
const sequelize = require("../config/sequelizedb");
const { findSingleUserService } = require("../services/user.services");
const { findSingleCustomerService } = require("../services/customer.services");
const { Op } = require("sequelize");
const { getPagination } = require("../utils/pagination");
const ERROR_RESPONSE = require("../utils/handleError");
const { generateInquiryNumber } = require("../utils/inquiryNumberGenerator");
const SALES_INQUIRY_ITEM_MODEL = require("../models/salesInquiryLineItem.model");
const CUSTOMER_MODEL = require("../models/customer.model");

module.exports.createSalesInquiry = asyncHandler(async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    let { line_items, ...inquiryData } = req.body;
    const { user } = req;
    console.log(user);
    const customerDetails = await findSingleCustomerService({
      where: { ID: user.id },
      transaction,
    });

    if (!customerDetails || customerDetails.status == "Inactive") {
      await transaction.rollback();
      return res.status(201).json({
        status: false,
        message: "Customer not found or customer is inactive",
      });
    }

    // Generate inquiry_number if not provided
    if (!inquiryData.inquiry_number) {
      inquiryData.inquiry_number = await generateInquiryNumber();
      console.log("Generated inquiry_number:", inquiryData.inquiry_number);
    }

    // Set customer_id from token
    inquiryData.customer_id = user.id;

    const inquiry = await createSalesInquiryService(inquiryData, {
      transaction,
    });

    if (!inquiry) {
      await transaction.rollback();
      return res.status(201).json({
        status: false,
        message: "Error while creaing the sales inquiry",
      });
    }

    line_items = line_items.map((item) => ({
      ...item,
      sales_inquiry_id: inquiry.ID,
      quantity: parseInt(item.quantity, 10) || 0,
      expected_unit_price: parseFloat(item.expected_unit_price) || 0,
    }));

    const lineItems = await createBulkSalesInquiryItemsService(line_items, {
      transaction,
    });

    if (lineItems.length !== line_items.length) {
      await transaction.rollback();
      return res.status(400).json({
        status: false,
        message: "Error while creating the inquiry line items",
      });
    }

    await transaction.commit();

    res.status(201).json({
      status: true,
      message: "Sales inquiry created successfully",
      data: inquiry,
    });
  } catch (error) {
    console.error("Sales inquiry creation error:", error.message);
    console.error("Error stack:", error.stack);
    if (transaction && !transaction.finished) {
      try {
        await transaction.rollback();
        console.log("Transaction rolled back successfully");
      } catch (rollbackError) {
        console.error("Error during transaction rollback:", rollbackError);
      }
    }
    ERROR_RESPONSE(res, error);
  }
});

module.exports.getAllSalesInquiries = asyncHandler(async (req, res) => {
  try {
    let {
      page = 1,
      limit = 10,
      search = "",
      status,
      priority,
      customer_id,
      date_from,
      date_to,
      sort = "DESC",
    } = req.query;

    const { user } = req;

    const where = {};

    page = isNaN(page) ? 1 : parseInt(page);
    limit = isNaN(limit) ? 10 : parseInt(limit);

    if (search) {
      where[Op.or] = [{ inquiry_number: { [Op.like]: `%${search}%` } }];
    }

    if (status) {
      where.status = status;
    }

    if (priority) {
      where.priority = priority;
    }

    // Date filtering
    if (date_from || date_to) {
      where.inquiry_date = {};
      if (date_from) {
        where.inquiry_date[Op.gte] = new Date(date_from);
      }
      if (date_to) {
        where.inquiry_date[Op.lte] = new Date(date_to);
      }
    }

    if (user.role == "customer") {
      where.customer_id = user.id;
    }

    if (customer_id) {
      where.customer_id = customer_id;
    }

    const queryOptions = {
      where,
      include: [
        {
          model: CUSTOMER_MODEL,
          as: "customer",
          attributes: ["ID", "customer_name", "customer_code"],
        },
        {
          model: SALES_INQUIRY_ITEM_MODEL,
          as: "lineItems",
          attributes: ["ID"],
          required: false,
        },
      ],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [["ID", sort]],
    };

    const result = await findAllWithCountSalesInquiryService(queryOptions);

    if (result.count === 0) {
      return res.status(200).json({
        status: false,
        message: "Sales inquiries not found",
      });
    }

    // Add line items count to each inquiry
    const inquiriesWithCount = result.rows.map(inquiry => {
      const inquiryData = inquiry.get ? inquiry.get({ plain: true }) : inquiry;
      return {
        ...inquiryData,
        lineItemsCount: inquiryData.lineItems?.length || 0,
      };
    });

    res.status(200).json({
      status: true,
      message: "Sales inquiries retrieved successfully",
      data: inquiriesWithCount,
      pagination: getPagination(page, limit, result.count),
    });
  } catch (error) {
    ERROR_RESPONSE(res, error);
  }
});

module.exports.getSalesInquiryById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req;

    const inquiry = await findSingleSalesInquiryService({
      where: { ID: id },
      include: [
        {
          model: SALES_INQUIRY_ITEM_MODEL,
          as: "lineItems",
        },
      ],
    });

    if (!inquiry) {
      return res.status(404).json({
        status: false,
        message: "Sales inquiry not found",
      });
    }

    if (user.role !== "user" && user?.id !== inquiry?.customer_id) {
      return res.status(403).json({
        status: false,
        message: "You can't access the other customer's inquiry",
      });
    }
    res.status(200).json({
      status: true,
      message: "Sales inquiry retrieved successfully",
      data: inquiry,
    });
  } catch (error) {
    ERROR_RESPONSE(res, error);
  }
});

module.exports.updateSalesInquiry = asyncHandler(async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { user } = req;

    let { line_items, ...inquiryData } = req.body;

    // First, check if the inquiry exists and user is authorized
    const inquiry = await findSingleSalesInquiryService({
      where: { ID: id },
      transaction,
    });

    if (!inquiry) {
      await transaction.rollback();
      return res.status(404).json({
        status: false,
        message: "Sales inquiry not found",
      });
    }

    if (user.role != "user" && inquiry.customer_id !== user?.id) {
      await transaction.rollback();
      return res.status(403).json({
        status: false,
        message: "You are not authorized to update this sales inquiry",
      });
    }

    // Now fetch customer details and existing line items
    const customerDetails = await findSingleCustomerService({
      where: { ID: user.id },
      transaction,
    });

    const lineItems = await findAllLineItemService({
      where: { sales_inquiry_id: id },
      transaction,
    });

    const affectedRow = await updateSalesInquiryService(
      { where: { ID: id } },
      inquiryData,
      { transaction }
    );

    if (affectedRow.updatedCount === 0) {
      await transaction.rollback();
      return res.status(400).json({
        status: false,
        message: "Sales inquiry not found",
      });
    }

    const lineItemsToBeUpdated = line_items.filter((item) =>
      lineItems.some((li) => li.product_name === item.product_name)
    );
    const lineItemsToBeDeleted = lineItems.filter(
      (item) =>
        !lineItemsToBeUpdated.some(
          (li) => li.product_name === item.product_name
        )
    );
    const lineItemsToBeCreated = line_items.filter(
      (item) => !lineItems.some((li) => li.product_name === item.product_name)
    );

    if (lineItemsToBeUpdated.length > 0) {
      const updated = await Promise.all(
        lineItemsToBeUpdated.map((item) => {
          const existingItem = lineItems.find(li => li.product_name === item.product_name);
          const { product_name, sales_inquiry_id, ...updateData } = item;
          return updateLineItemService(
            { where: { ID: existingItem.ID } },
            updateData,
            { transaction }
          );
        })
      );
      if (updated.some((item) => item.updatedCount === 0)) {
        await transaction.rollback();
        return res.status(400).json({
          status: false,
          message: "Error while updating some of the line items",
        });
      }
    }

    if (lineItemsToBeDeleted.length > 0) {
      const deleted = await Promise.all(
        lineItemsToBeDeleted.map((item) =>
          deleteLineItemService({ where: { ID: item.ID } }, { transaction })
        )
      );
      if (deleted.some((item) => item.deletedCount === 0)) {
        await transaction.rollback();
        return res.status(400).json({
          status: false,
          message: "Error while deleting some of the line items",
        });
      }
    }
    if (lineItemsToBeCreated.length > 0) {
      const created = await Promise.all(
        lineItemsToBeCreated.map((item) =>
          createLineItemService(item, { transaction })
        )
      );
      if (created.some((item) => !item)) {
        throw new Error("Error while creating some of the line items");
      }
    }

    await transaction.commit();
    res.status(201).json({
      status: true,
      message: "Inquiry updated successfully",
    });
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }
    ERROR_RESPONSE(res, error);
  }
});

module.exports.deleteSalesInquiry = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req;

    transaction = await sequelize.transaction();

    const inquiry = await findSingleSalesInquiryService({
      where: { ID: id },
    });

    if (!inquiry) {
      return res.status(404).json({
        status: false,
        message: "Sales inquiry not found",
      });
    }

    // Allow deletion if user is admin OR if inquiry belongs to the user
    if (user.role === "customer" && inquiry.customer_id !== user.id) {
      return res.status(403).json({
        status: false,
        message: "You are not authorized to delete this sales inquiry",
      });
    }

    const deleted = await deleteSalesInquiryService({ where: { ID: id } });

    if (deleted === 0) {
      return res.status(400).json({
        status: false,
        message: "Sales inquiry not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Sales inquiry deleted successfully",
    });
  } catch (error) {
    ERROR_RESPONSE(res, error);
  }
});

module.exports.updateInquiryStatus = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const { user } = req;

    const customerDetails = await findSingleCustomerService({
      where: { ID: user.id },
    });

    if (!customerDetails || customerDetails.status == "Inactive") {
      return res.status(201).json({
        status: false,
        message: "Customer not found or customer is inactive",
      });
    }

    const affectedRow = await updateSalesInquiryService(
      { where: { ID: id } },
      { status },
    );

    if (affectedRow.updatedCount === 0) {
      return res.status(400).json({
        status: false,
        message: "Sales inquiry not found",
      });
    }

    res.status(201).json({
      status: true,
      message: `Inquiry status to ${status} updated successfully`,
    });
  } catch (error) {
    ERROR_RESPONSE(res, error);
  }
});

module.exports.getStatusCounts = asyncHandler(async (req, res) => {
  try {
    const { user } = req;
    const where = {};

    if (user.role == "customer") {
      where.customer_id = user.id;
    }

    const result = await findWithGroupBy({
      where,
      group: ["status"],
      attributes: ["status", [sequelize.fn("COUNT", sequelize.col("ID")), "count"]],
    });

    const counts = {
      draft: 0,
      submitted: 0,
      quoted: 0,
      won: 0,
      lost: 0,
    };

    if (result && result.length > 0) {
      result.forEach((item) => {
        if (item.status && counts.hasOwnProperty(item.status.toLowerCase())) {
          counts[item.status.toLowerCase()] = parseInt(item.count);
        }
      });
    }

    res.status(200).json({
      status: true,
      message: "Status counts retrieved successfully",
      data: counts,
    });
  } catch (error) {
    ERROR_RESPONSE(res, error);
  }
});