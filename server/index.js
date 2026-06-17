require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const fs = require("fs");

const customerRoutes = require("./routes/customer.routes");
const userRoutes = require("./routes/user.routes");
const salesInquiryRoutes = require("./routes/salesInquiry.routes");
const sequelize = require("./config/sequelizedb");

const {
  initializeAssociations,
} = require("./models/associations");

const {
  errorHandler,
  notFound,
  logger,
} = require("./middlewares/error.middleware");

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

const logsDir = path.join(__dirname, "logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  })
);

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.FRONTEND_URL
        : [
            "http://localhost:3000",
            "http://localhost:3001",
            "http://127.0.0.1:3000",
          ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

app.get("/", (req, res) => {
  res.json({
    status: true,
    message: "ERP Customer & Sales Inquiry Management API",
    version: "1.0.0",
    documentation: "/api/docs",
    health: "/api/health",
    timestamp: new Date().toISOString(),
  });
});

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
} else {
  app.use(
    morgan("combined", {
      stream: {
        write: (message) => logger.info(message.trim()),
      },
    })
  );
}

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url} - ${req.ip}`);
  next();
});

const PORT = process.env.PORT || 8056;

app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  try {
    initializeAssociations();
    await sequelize.authenticate();
    console.log("✅ Database connection established successfully.");

    await sequelize.sync({ alter: true, force: true });
    console.log("✅ Database connected and synced successfully");

    app.use("/api/v1/customers", customerRoutes);
    app.use("/api/v1/users", userRoutes);
    app.use("/api/v1/sales-inquiries", salesInquiryRoutes);

    app.listen(PORT, () => {
      console.log(`Server is running on PORT: ${PORT}`);
    });
  } catch (startError) {
    console.error("❌ Error starting server:", startError.message || startError);
    process.exit(1);
  }
};

startServer();
