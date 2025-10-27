# ERP Management System - Frontend

A modern, responsive React application for managing Customer Master data and Sales Inquiries.

## Features

### Customer Master Module
- ✅ Create, Read, Update, Delete customers
- ✅ Auto-generated Customer Code (CUST-YYYY-0001)
- ✅ Comprehensive field validation
- ✅ Search and filter functionality
- ✅ Pagination (10 items per page)
- ✅ Soft delete support

### Sales Inquiry Module
- ✅ Create, Read, Update, Delete sales inquiries
- ✅ Dynamic line items with add/remove functionality
- ✅ Status workflow management (Draft → Submitted → Quoted → Won/Lost)
- ✅ Customer association
- ✅ Dashboard with status counts
- ✅ Business rules enforcement

## Tech Stack

- **React 18** - UI library
- **React Router v6** - Routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Hook Form** - Form handling
- **React Hot Toast** - Notifications
- **Lucide React** - Icons
- **Date-fns** - Date utilities

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd client
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

Edit `.env` and set your backend API URL:
```
REACT_APP_API_BASE_URL=http://localhost:3001/api
```

4. Start the development server
```bash
npm start
```

The application will open at `http://localhost:3000`

## Project Structure

```
src/
├── components/
│   ├── common/          # Reusable components (Button, Input, Select, etc.)
│   ├── customer/        # Customer module components
│   ├── inquiry/         # Sales Inquiry module components
│   └── layout/          # Layout components (Navbar)
├── pages/               # Page components
├── utils/               # Utilities (API, validation, constants)
├── App.js              # Main app component with routes
├── index.js            # Entry point
└── index.css           # Global styles
```

## API Integration

The frontend expects a RESTful API with the following endpoints:

### Customers
- `GET /api/customers` - Get all customers (with pagination, search, filters)
- `GET /api/customers/:id` - Get customer by ID
- `POST /api/customers` - Create new customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Sales Inquiries
- `GET /api/inquiries` - Get all inquiries (with pagination, filters)
- `GET /api/inquiries/:id` - Get inquiry by ID
- `POST /api/inquiries` - Create new inquiry
- `PUT /api/inquiries/:id` - Update inquiry
- `DELETE /api/inquiries/:id` - Delete inquiry
- `PATCH /api/inquiries/:id/status` - Update inquiry status
- `GET /api/inquiries/status/count` - Get inquiry counts by status

## Features Breakdown

### Reusable Components
- **Button** - Flexible button with multiple variants
- **Input** - Text input with validation
- **Select** - Dropdown select with options
- **Modal** - Popup modal dialog
- **LoadingSpinner** - Loading indicator
- **Badge** - Status badges with colors
- **DeleteConfirm** - Confirmation modal

### Validation
- Email format validation
- Phone number validation (10 digits)
- GST number validation
- Date validations
- Required field checks
- Minimum line items check

### Styling
- Fully responsive design
- Mobile-friendly layout
- Consistent color scheme
- Modern UI/UX
- Hover states and transitions

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Environment Variables

- `REACT_APP_API_BASE_URL` - Backend API base URL (default: http://localhost:3001/api)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is created for demonstration purposes.

## Screenshots

### Key Features
- Clean and modern interface
- Responsive design for all screen sizes
- Real-time validation
- Toast notifications
- Pagination and filtering
- Status management
- Dashboard with metrics

