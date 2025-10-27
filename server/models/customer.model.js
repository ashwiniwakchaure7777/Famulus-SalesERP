const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const moment = require("moment");
const bcrypt = require("bcryptjs");

const CUSTOMER_MODEL = sequelize.define(
  "Customer",
  {
    ID: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    customer_code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    customer_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    phone_number: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    business_type: {
      type: DataTypes.ENUM("Retailer", "Wholesaler", "Distributor"),
      allowNull: false,
    },
    credit_limit: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      defaultValue: 50000.0,
    },
    address_street: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    address_city: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    address_state: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    address_pincode: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    gst_number: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("Active", "Inactive"),
      allowNull: false,
      defaultValue: "Active",
    },
  },
  {
    tableName: "customers",
    timestamps: true,
    paranoid: true,
    hooks: {
      beforeCreate: async (customer) => {
        if (!customer.customer_code) {
          const year = moment().year();
          const lastCustomer = await CUSTOMER_MODEL.findOne({
            where: {
              customer_code: {
                [sequelize.Sequelize.Op.like]: `CUST-${year}-%`,
              },
            },
            order: [["customer_code", "DESC"]],
          });

          let nextNumber = 1;
          if (lastCustomer) {
            const lastNumber = parseInt(
              lastCustomer.customer_code.split("-")[2]
            );
            nextNumber = lastNumber + 1;
          }

          customer.customer_code = `CUST-${year}-${nextNumber
            .toString()
            .padStart(4, "0")}`;
        }

        if (customer.password) {
          const salt = await bcrypt.genSalt(12);
          customer.password = await bcrypt.hash(customer.password, salt);
        }
      },
      beforeUpdate: async (customer) => {
        if (customer.changed("password")) {
          const salt = await bcrypt.genSalt(5);
          customer.password = await bcrypt.hash(customer.password, salt);
        }
      },
    },
  }
);

// Instance methods
CUSTOMER_MODEL.prototype.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

CUSTOMER_MODEL.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  delete values.password;
  return values;
};

// Define associations
CUSTOMER_MODEL.associate = function (models) {
  // Customer has many Sales Inquiries
  CUSTOMER_MODEL.hasMany(models.SALES_INQUIRY_MODEL, {
    foreignKey: "customer_id",
    as: "salesInquiries",
  });
};

module.exports = CUSTOMER_MODEL;
