const { Sequelize } = require("sequelize");
require("dotenv").config();

// Supabase Database Configuration
const DATABASE = process.env.SUPABASE_DB_NAME || "postgres";
const DB_USER = process.env.SUPABASE_DB_USER || "postgres";
const DB_PASSWORD = process.env.SUPABASE_DB_PASSWORD;
const DB_HOST = process.env.SUPABASE_DB_HOST;
const DB_PORT = process.env.SUPABASE_DB_PORT || "5432";

const sequelize = new Sequelize(DATABASE, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: "postgres",
  logging: false,
  pool: {
    max: 5, // Supabase free tier: 5 max connections
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  retry: {
    max: 5,
  },
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
});

async function connectWithRetry() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established successfully.");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    setTimeout(connectWithRetry, 5000);
  }
}

connectWithRetry();

process.on("SIGINT", async () => {
  console.log("🛑 Shutting down gracefully...");
  try {
    await sequelize.close();
    console.log("✅ Database connection closed.");
  } catch (error) {
    console.error("❌ Error closing database connection:", error);
  } finally {
    process.exit(0);
  }
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("⚠️ Unhandled Rejection at:", promise, "reason:", reason);
});

sequelize.connectionManager
  .getConnection()
  .then((connection) => {
    console.log("✅ Connection acquired from pool.");
    sequelize.connectionManager.releaseConnection(connection);
  })
  .catch((err) => {
    console.error("⚠️ Error acquiring connection:", err.message);
    if (
      ["ECONNREFUSED", "ECONNRESET", "ER_ACCESS_DENIED_ERROR"].includes(
        err.code
      )
    ) {
      connectWithRetry();
    }
  });

module.exports = sequelize;
