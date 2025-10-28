const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customer.controller");
const {
  createCustomerValidator,
  loginCustomerSchema,
  updateCustomerSchema,
  queryCustomerSchema,
} = require("../validator/customer.validator");
const validateRequest = require("../middlewares/validateRequest");
const { authentication } = require("../middlewares/authentication");

router.post(
  "/register",
  createCustomerValidator,
  customerController.registerCustomer
);

router.post(
  "/login",
  validateRequest(loginCustomerSchema),
  customerController.login
);

router.use(authentication);

router.get(
  "/",
  validateRequest(queryCustomerSchema, "query"),
  customerController.getAllCustomers
);

router.get("/:id", customerController.getCustomerById);

router.put(
  "/:id",
  validateRequest(updateCustomerSchema),
  customerController.updateCustomer
);

router.delete("/:id", customerController.deleteCustomer);

module.exports = router;
