const {
  createCustomerService,
  findSingleCustomerService,
  findSingleCustomerWithPasswordService,
  findAllWithCountCustomerService,
  updateCustomerService,
  deleteCustomerService,
} = require("../services/customer.services");
const { generateUserToken } = require("../utils/generateToken");
const ERROR_RESPONSE = require("../utils/handleError");
const { Op } = require("sequelize");
const { getPagination } = require("../utils/pagination");
const { generateCustomerCode } = require("../utils/customerCodeGenerator");

module.exports.registerCustomer = async (req, res) => {
  try {
    const { confirmPassword, ...customerPayload } = req.body;

    const isExists = await findSingleCustomerService({
      where: { email: customerPayload.email },
    });

    if (isExists) {
      return res.status(500).json({
        status: false,
        message: "Email alredy registered. Please register with another email",
      });
    }

    // Generate customer_code if not provided
    if (!customerPayload.customer_code) {
      customerPayload.customer_code = await generateCustomerCode();
      console.log("Generated customer_code:", customerPayload.customer_code);
    }

    const customer = await createCustomerService(customerPayload);

    if (!customer) {
      return res.status(409).json({
        status: false,
        message: "Error while creating customer",
      });
    }

    res.status(201).json({
      status: true,
      message: `Customer ${customerPayload.customer_name} is created successfully`,
    });
  } catch (error) {
    ERROR_RESPONSE(res, error);
  }
};

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const customer = await findSingleCustomerWithPasswordService({
      where: { email },
    });

    if (!customer) {
      return res.status(409).json({
        status: false,
        message: "Customer not found. Please register first",
      });
    }

    // Compare password using the model's comparePassword method
    const isPasswordMatch = await customer.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        status: false,
        message: "Please provide correct credentials",
      });
    }
    const customerData = customer.toJSON();

    try {
      const token = generateUserToken({ ...customerData, role: "customer" });

      res.status(200).json({
        status: true,
        message: "Customer login successfully",
        data: {
          customer: customerData,
          token,
        },
      });
    } catch (tokenError) {
      console.error("Token generation error:", tokenError);
      return res.status(500).json({
        status: false,
        message: "Failed to generate authentication token",
      });
    }
  } catch (error) {
    ERROR_RESPONSE(res, error);
  }
};

module.exports.getAllCustomers = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 10,
      search = "",
      business_type,
      status,
      sort = "DESC",
    } = req.query;

    const where = {};

    page = isNaN(page) ? 1 : parseInt(page);
    limit = isNaN(limit) ? 10 : parseInt(limit);

    if (search) {
      where[Op.or] = [
        { customer_name: { [Op.like]: `%${search}%` } },
        { customer_code: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { phone_number: { [Op.like]: `%${search}%` } },
      ];
    }

    if (business_type) {
      where.business_type = business_type;
    }

    if (status) {
      where.status = status;
    }

    const queryOptions = {
      where,
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [["ID", sort]],
    };

    const result = await findAllWithCountCustomerService(queryOptions);

    if (result.count === 0) {
      return res.status(200).json({
        status: false,
        message: "Customers not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Customers retrieved successfully",
      data: result.rows,
      pagination: getPagination(page, limit, result.count),
    });
  } catch (error) {
    ERROR_RESPONSE(res, error);
  }
};

module.exports.getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await findSingleCustomerService({
      where: { ID: id },
    });

    if (!customer) {
      return res.status(404).json({
        status: false,
        message: "Customer not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Customer retrieved successfully",
      data: customer,
    });
  } catch (error) {
    ERROR_RESPONSE(res, error);
  }
};

module.exports.updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const { user } = req;

    if (user.role !== "user" && id !== user.id) {
      return res.status(403).json({
        status: false,
        message: "You are not authorized to update this customer",
      });
    }

    const existingCustomer = await findSingleCustomerService({
      where: { ID: id },
    });

    if (!existingCustomer) {
      return res.status(404).json({
        status: false,
        message: "Customer not found",
      });
    }

    if (updateData.email && updateData.email !== existingCustomer.email) {
      const emailExists = await findSingleCustomerService({
        where: { email: updateData.email, ID: { [Op.ne]: id } },
      });

      if (emailExists) {
        return res.status(409).json({
          status: false,
          message: "Email already registered with another customer",
        });
      }
    }

    const result = await updateCustomerService(
      { where: { ID: id } },
      updateData
    );

    if (result.updatedCount === 0) {
      return res.status(400).json({
        status: false,
        message: "Failed to update customer",
      });
    }

    res.status(200).json({
      status: true,
      message: "Customer updated successfully",
      data: result.updatedRows[0],
    });
  } catch (error) {
    ERROR_RESPONSE(res, error);
  }
};

module.exports.deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const existingCustomer = await findSingleCustomerService({
      where: { ID: id },
    });

    if (!existingCustomer) {
      return res.status(404).json({
        status: false,
        message: "Customer not found",
      });
    }

    const deletedCount = await deleteCustomerService({
      where: { ID: id },
    });

    if (deletedCount === 0) {
      return res.status(400).json({
        status: false,
        message: "Failed to delete customer",
      });
    }

    res.status(200).json({
      status: true,
      message: "Customer deleted successfully",
    });
  } catch (error) {
    ERROR_RESPONSE(res, error);
  }
};
