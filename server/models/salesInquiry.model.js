const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const moment = require("moment");

const SALES_INQUIRY_MODEL = sequelize.define(
  "SalesInquiry",
  {
    ID: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    inquiry_number: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    customer_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    inquiry_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    expected_delivery_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("Draft", "Submitted", "Quoted", "Won", "Lost"),
      allowNull: false,
      defaultValue: "Draft",
    },
    priority: {
      type: DataTypes.ENUM("Low", "Medium", "High"),
      allowNull: false,
      defaultValue: "Medium",
    },
    total_items_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    }, 
    created_by: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    modified_by: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
  },
  {
    tableName: "sales_inquiries",
    timestamps: true,
    paranoid: true,
    hooks: {
      beforeCreate: async (inquiry) => {
        if (!inquiry.inquiry_number) {
          const year = moment().year();
          const month = moment().format("MM");
          const lastInquiry = await SalesInquiry.findOne({
            where: {
              inquiry_number: {
                [sequelize.Sequelize.Op.like]: `INQ-${year}-${month}-%`,
              },
            },
            order: [["inquiry_number", "DESC"]],
          });

          let nextNumber = 1;
          if (lastInquiry) {
            const lastNumber = parseInt(
              lastInquiry.inquiry_number.split("-")[3]
            );
            nextNumber = lastNumber + 1;
          }

          inquiry.inquiry_number = `INQ-${year}-${month}-${nextNumber
            .toString()
            .padStart(4, "0")}`;
        }
      },
    },
  }
);

SALES_INQUIRY_MODEL.associate = function (models) {
  SALES_INQUIRY_MODEL.belongsTo(models.CUSTOMER_MODEL, {
    foreignKey: "customer_id",
    as: "customer",
  });

  SALES_INQUIRY_MODEL.hasMany(models.SALES_INQUIRY_LINE_ITEM_MODEL, {
    foreignKey: "sales_inquiry_id",
    as: "lineItems",
  });
};

module.exports = SALES_INQUIRY_MODEL;
