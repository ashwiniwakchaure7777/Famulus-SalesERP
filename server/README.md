# ERP Customer & Sales Inquiry Management System - Backend

A comprehensive Node.js backend API for managing customers and sales inquiries with full CRUD operations, validation, and business logic.

## 🚀 Features

### Customer Management
- ✅ Create, Read, Update, Delete customers
- ✅ Auto-generation of Customer Code (CUST-YYYY-0001)
- ✅ Soft delete functionality
- ✅ Comprehensive validation for all fields
- ✅ Business type categorization (Retailer, Wholesaler, Distributor)
- ✅ Credit limit management
- ✅ Address management with validation
- ✅ GST number validation
- ✅ Status management (Active/Inactive)

### Sales Inquiry Management
- ✅ Create, Read, Update, Delete sales inquiries
- ✅ Auto-generation of Inquiry Number (INQ-YYYY-MM-0001)
- ✅ Dynamic line items with add/remove functionality
- ✅ Status workflow management (Draft → Submitted → Quoted → Won/Lost)
- ✅ Priority levels (Low, Medium, High)
- ✅ Customer association with validation
- ✅ Business rules enforcement
- ✅ Real-time total items calculation

### Technical Features
- ✅ RESTful API with proper HTTP status codes
- ✅ JWT-based authentication
- ✅ Input validation using Joi
- ✅ Error handling middleware
- ✅ PostgreSQL with Sequelize ORM
- ✅ Logging using Winston
- ✅ Rate limiting
- ✅ CORS support
- ✅ Security headers with Helmet
- ✅ Environment variables configuration
- ✅ API documentation

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Authentication**: JWT
- **Validation**: Joi
- **Logging**: Winston
- **Security**: Helmet, CORS
- **Rate Limiting**: express-rate-limit

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd erp-customer-sales-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=erp_customer_sales
   DB_USER=your_username
   DB_PASSWORD=your_password

   # JWT Configuration
   JWT_SECRET_KEY=your_super_secret_jwt_key_here
   JWT_EXPIRES_IN=24h

   # Server Configuration
   PORT=3000
   NODE_ENV=development
   ```

4. **Database Setup**
   ```bash
   # Create PostgreSQL database
   createdb erp_customer_sales
   
   # Run migrations (if using Sequelize CLI)
   npx sequelize-cli db:migrate
   ```

5. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication
All endpoints except `/api/auth/login` require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Demo Credentials
```
Username: admin
Password: admin123
```

### Endpoints

#### Authentication
- `POST /api/auth/login` - Authenticate user and get token
- `GET /api/auth/verify` - Verify token

#### Customers
- `POST /api/customers` - Create a new customer
- `GET /api/customers` - Get all customers (with pagination and filtering)
- `GET /api/customers/stats` - Get customer statistics
- `GET /api/customers/active` - Get active customers for dropdown
- `GET /api/customers/export` - Export customers to CSV
- `GET /api/customers/:id` - Get customer by ID
- `GET /api/customers/code/:code` - Get customer by code
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer (soft delete)
- `PATCH /api/customers/bulk-status` - Bulk update customer status

#### Sales Inquiries
- `POST /api/sales-inquiries` - Create a new sales inquiry with line items
- `GET /api/sales-inquiries` - Get all sales inquiries (with pagination and filtering)
- `GET /api/sales-inquiries/stats` - Get sales inquiry statistics
- `GET /api/sales-inquiries/dashboard` - Get dashboard data
- `GET /api/sales-inquiries/export` - Export sales inquiries to CSV
- `GET /api/sales-inquiries/customer/:customerId` - Get inquiries by customer
- `GET /api/sales-inquiries/:id` - Get sales inquiry by ID
- `GET /api/sales-inquiries/number/:number` - Get sales inquiry by number
- `PUT /api/sales-inquiries/:id` - Update sales inquiry
- `PATCH /api/sales-inquiries/:id/status` - Update inquiry status
- `PUT /api/sales-inquiries/:id/line-items` - Update line items for an inquiry
- `DELETE /api/sales-inquiries/:id` - Delete sales inquiry
- `PATCH /api/sales-inquiries/bulk-status` - Bulk update inquiry status

### Query Parameters

#### Pagination
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)

#### Filtering
- `search` - Search in customer name, code, or email
- `business_type` - Filter by business type
- `status` - Filter by status
- `customer_id` - Filter by customer ID
- `priority` - Filter by priority
- `date_from` - Filter from date
- `date_to` - Filter to date

#### Sorting
- `sort_by` - Sort field
- `sort_order` - Sort order (ASC/DESC)

## 🏗️ Project Structure

```
├── config/
│   ├── database.js          # Database configuration
│   └── sequelize.js         # Sequelize configuration
├── controllers/
│   ├── customer.controller.js
│   └── salesInquiry.controller.js
├── middlewares/
│   ├── auth.middleware.js
│   ├── error.middleware.js
│   ├── rateLimiter.middleware.js
│   └── validation.middleware.js
├── models/
│   ├── customer.model.js
│   ├── salesInquiry.model.js
│   ├── salesInquiryLineItem.model.js
│   └── index.js
├── routes/
│   ├── auth.routes.js
│   ├── customer.routes.js
│   ├── salesInquiry.routes.js
│   └── index.js
├── services/
│   ├── customer.services.js
│   └── salesInquiry.services.js
├── utils/
│   ├── constants.js
│   └── helpers.js
├── validator/
│   ├── customer.validator.js
│   └── salesInquiry.validator.js
├── logs/                    # Log files
├── .env                     # Environment variables
├── .gitignore
├── index.js                 # Main application file
├── package.json
└── README.md
```

## 🔒 Business Rules

### Customer Rules
- Customer code is auto-generated in format: `CUST-YYYY-0001`
- Email must be unique across all customers
- Can only delete customers without sales inquiries
- Credit limit defaults to 50,000
- GST number must be valid format if provided

### Sales Inquiry Rules
- Inquiry number is auto-generated in format: `INQ-YYYY-MM-0001`
- Can only create inquiry for Active customers
- Expected delivery date must be a future date
- Must have at least 1 line item to save inquiry
- Cannot delete inquiry if status is Won or Lost
- Status flow: Draft → Submitted → Quoted → Won/Lost

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📊 Database Schema

### Customers Table
- `id` (Primary Key)
- `customer_code` (Unique)
- `customer_name`
- `email` (Unique)
- `phone_number`
- `business_type` (ENUM)
- `credit_limit`
- `address_street`
- `address_city`
- `address_state`
- `address_pincode`
- `gst_number`
- `status` (ENUM)
- `created_at`
- `updated_at`
- `deleted_at` (Soft delete)

### Sales Inquiries Table
- `id` (Primary Key)
- `inquiry_number` (Unique)
- `customer_id` (Foreign Key)
- `inquiry_date`
- `expected_delivery_date`
- `status` (ENUM)
- `priority` (ENUM)
- `total_items_count`
- `remarks`
- `created_by`
- `modified_by`
- `created_at`
- `updated_at`
- `deleted_at` (Soft delete)

### Sales Inquiry Line Items Table
- `id` (Primary Key)
- `sales_inquiry_id` (Foreign Key)
- `product_name`
- `description`
- `quantity`
- `unit` (ENUM)
- `expected_unit_price`
- `created_at`
- `updated_at`
- `deleted_at` (Soft delete)

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
DB_HOST=your_production_db_host
DB_PORT=5432
DB_NAME=erp_customer_sales_prod
DB_USER=your_production_db_user
DB_PASSWORD=your_production_db_password
JWT_SECRET_KEY=your_production_JWT_SECRET_KEY
PORT=3000
```

### Docker Deployment
```bash
# Build Docker image
docker build -t erp-backend .

# Run container
docker run -p 3000:3000 --env-file .env erp-backend
```

## 📝 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },
  "pagination": { ... } // For paginated responses
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": [ ... ] // For validation errors
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please contact the development team or create an issue in the repository.

## 🔄 Version History

- **v1.0.0** - Initial release with Customer and Sales Inquiry management
