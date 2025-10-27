# Setup Instructions

## Quick Start Guide

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy the example environment file and update with your backend URL:

```bash
cp .env.example .env
```

Edit `.env` and set:
```
REACT_APP_API_BASE_URL=http://localhost:3001/api
```

### 3. Start Development Server

```bash
npm start
```

The app will be available at `http://localhost:3000`

## Backend Requirements

Your backend API should implement the following structure:

### Customer API Endpoints

- `POST /api/customers` - Create customer
  - Returns: `{ customer }`
  
- `GET /api/customers` - List customers
  - Query params: `page`, `limit`, `search`, `businessType`, `status`
  - Returns: `{ customers: [], total }`

- `GET /api/customers/:id` - Get customer
  - Returns: `{ customer }`

- `PUT /api/customers/:id` - Update customer
  - Returns: `{ customer }`

- `DELETE /api/customers/:id` - Delete customer
  - Returns: `{ message }`

### Inquiry API Endpoints

- `POST /api/inquiries` - Create inquiry
  - Returns: `{ inquiry }`

- `GET /api/inquiries` - List inquiries
  - Query params: `page`, `limit`, `status`, `priority`, `dateFrom`, `dateTo`
  - Returns: `{ inquiries: [], total }`

- `GET /api/inquiries/:id` - Get inquiry
  - Returns: `{ inquiry }`

- `PUT /api/inquiries/:id` - Update inquiry
  - Returns: `{ inquiry }`

- `DELETE /api/inquiries/:id` - Delete inquiry
  - Returns: `{ message }`

- `PATCH /api/inquiries/:id/status` - Update status
  - Body: `{ status }`
  - Returns: `{ inquiry }`

- `GET /api/inquiries/status/count` - Get status counts
  - Returns: `{ draft, submitted, quoted, won, lost }`

## Data Models

### Customer Model
```javascript
{
  _id: String,
  customerCode: String,      // Auto-generated
  customerName: String,       // Required
  email: String,             // Required, validated
  phoneNumber: String,       // Required, 10 digits
  businessType: String,      // Required: 'retailer', 'wholesaler', 'distributor'
  creditLimit: Number,       // Default: 50000
  addressStreet: String,
  addressCity: String,       // Required
  addressState: String,      // Required
  addressPincode: String,    // Required, 6 digits
  gstNumber: String,        // Optional, validated
  status: String,            // 'active' | 'inactive'
  createdDate: Date,
  modifiedDate: Date
}
```

### Inquiry Model
```javascript
{
  _id: String,
  inquiryNumber: String,     // Auto-generated
  customer: ObjectId,        // Required, reference to Customer
  inquiryDate: Date,        // Required, default: today
  expectedDeliveryDate: Date, // Required, must be future
  status: String,            // 'draft' | 'submitted' | 'quoted' | 'won' | 'lost'
  priority: String,          // 'low' | 'medium' | 'high'
  remarks: String,
  totalItemsCount: Number,   // Auto-calculated
  lineItems: [{
    productName: String,     // Required
    description: String,
    quantity: Number,        // Required
    unit: String,            // Required: 'pcs' | 'kg' | 'ltr' | 'mtr'
    expectedUnitPrice: Number
  }],
  createdBy: String,
  modifiedBy: String
}
```

## Build for Production

```bash
npm run build
```

The optimized build will be in the `build` directory.

## Deployment

### Option 1: Vercel (Recommended)

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Set environment variables in Vercel dashboard

### Option 2: Netlify

1. Install Netlify CLI: `npm i -g netlify-cli`
2. Run: `netlify deploy`
3. Set environment variables in Netlify dashboard

### Option 3: Traditional Hosting

1. Build the app: `npm run build`
2. Upload the `build` folder to your web server
3. Configure your server to serve index.html for all routes

## Troubleshooting

### API Connection Issues
- Verify backend is running
- Check CORS is enabled on backend
- Verify API_BASE_URL in .env

### Module Not Found
- Run `npm install` again
- Delete `node_modules` and reinstall

### Build Errors
- Clear cache: `npm start -- --reset-cache`
- Check Node.js version (14+)

## Testing the Application

1. Start the backend API on port 3001
2. Start the frontend on port 3000
3. Navigate to http://localhost:3000
4. Test customer creation
5. Test inquiry creation with line items
6. Verify pagination and filtering

## Features to Test

### Customer Module
- ✅ Create new customer with validation
- ✅ Search by name/code
- ✅ Filter by business type and status
- ✅ Edit existing customer
- ✅ Delete customer
- ✅ Pagination

### Inquiry Module
- ✅ Create inquiry with dynamic line items
- ✅ Add/remove line items
- ✅ Status management workflow
- ✅ Dashboard counts
- ✅ Filter by status and priority
- ✅ Date range filtering
- ✅ Business rules (cannot delete Won/Lost)

