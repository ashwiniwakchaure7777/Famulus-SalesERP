const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const SALES_INQUIRY_ITEM_MODEL = sequelize.define(
  "SalesInquiryLineItem",
  {
    ID: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    sales_inquiry_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    product_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    unit: {
      type: DataTypes.ENUM("Pcs", "Kg", "Ltr", "Mtr"),
      allowNull: false,
    },
    expected_unit_price: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },
  },
  {
    tableName: "sales_inquiry_line_items",
    timestamps: true,
  }
);

// Define associations
SALES_INQUIRY_ITEM_MODEL.associate = function (models) {
  // Line Item belongs to Sales Inquiry
  SALES_INQUIRY_ITEM_MODEL.belongsTo(models.SALES_INQUIRY_MODEL, {
    foreignKey: "sales_inquiry_id",
    as: "salesInquiry",
  });
};

module.exports = SALES_INQUIRY_ITEM_MODEL;
