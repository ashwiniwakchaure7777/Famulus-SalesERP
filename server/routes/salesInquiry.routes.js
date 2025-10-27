const express = require("express");
const router = express.Router();
const salesInquiryController = require("../controllers/salesInquiry.controller");
const {
  create,
  update,
  updateLineItems,
  query,
} = require("../validator/salesInquiry.validator");
const validateRequest = require("../middlewares/validateRequest");

router.post(
  "/",
  validateRequest(create),
  salesInquiryController.createSalesInquiry
);

router.get(
  "/",
  validateRequest(query, "query"),
  salesInquiryController.getAllSalesInquiries
);

router.get("/:id", salesInquiryController.getSalesInquiryById);

router.put(
  "/:id",
  validateRequest(update),
  salesInquiryController.updateSalesInquiry
);

router.delete("/:id", salesInquiryController.deleteSalesInquiry);

module.exports = router;
