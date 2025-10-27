# Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy the example file:
```bash
cp .env.example .env
```

Edit `.env`:
```
REACT_APP_API_BASE_URL=http://localhost:3001/api
```

### 3. Start Development

```bash
npm start
```

Visit `http://localhost:3000` 🎉

## 📋 What's Included

### ✅ Complete Feature Set

- **Customer Module**: Full CRUD with search, filters, pagination
- **Sales Inquiry Module**: Full CRUD with dynamic line items, status workflow
- **Reusable Components**: 7+ reusable UI components
- **Validation**: Comprehensive form validation
- **Responsive Design**: Mobile, tablet, desktop support
- **Toast Notifications**: User feedback
- **Loading States**: Better UX
- **Error Handling**: Graceful error management

### 📦 Files Created

- 20+ React components
- API service layer
- Validation utilities
- Constants and enums
- Configuration files
- Documentation files

## 🎯 Key Features to Test

### Customer Features
1. Create a new customer
2. Search by name or code
3. Filter by business type
4. Edit existing customer
5. Delete with confirmation
6. Pagination

### Inquiry Features
1. Create inquiry with line items
2. Add/remove line items
3. Change status
4. Filter by status/priority
5. View dashboard counts
6. Date range filtering

## 🔧 API Requirements

Your backend should provide:

### Customer Endpoints
- `GET /api/customers` (with pagination, search, filters)
- `GET /api/customers/:id`
- `POST /api/customers`
- `PUT /api/customers/:id`
- `DELETE /api/customers/:id`

### Inquiry Endpoints
- `GET /api/inquiries` (with filters)
- `GET /api/inquiries/:id`
- `POST /api/inquiries`
- `PUT /api/inquiries/:id`
- `DELETE /api/inquiries/:id`
- `PATCH /api/inquiries/:id/status`
- `GET /api/inquiries/status/count`

See `postman-collection.json` for detailed API structure.

## 📱 Pages

1. **Dashboard** (`/`) - Overview and quick actions
2. **Customer List** (`/customers`) - View all customers
3. **Customer Form** (`/customers/new`) - Create customer
4. **Inquiry List** (`/inquiries`) - View all inquiries
5. **Inquiry Form** (`/inquiries/new`) - Create inquiry

## 🎨 Tech Stack

- React 18
- React Router v6
- Tailwind CSS
- Axios
- React Hook Form
- React Hot Toast
- Lucide Icons
- Date-fns

## 📚 Documentation

- `README.md` - Main documentation
- `SETUP_INSTRUCTIONS.md` - Detailed setup
- `FEATURES.md` - Complete feature list
- `PROJECT_STRUCTURE.md` - Code structure
- `postman-collection.json` - API collection

## 🐛 Troubleshooting

### API Connection Issues
- Ensure backend is running on port 3001
- Check CORS settings on backend
- Verify `.env` file has correct URL

### Module Errors
- Delete `node_modules` and run `npm install`
- Clear cache: `npm start -- --reset-cache`

### Build Errors
- Check Node.js version (14+ required)
- Verify all dependencies installed

## ✨ Next Steps

1. Start your backend API
2. Run `npm start`
3. Test customer creation
4. Test inquiry creation
5. Explore all features!

## 🎉 You're All Set!

The frontend is ready to connect to your backend API. All components are fully functional and well-documented.

**Happy Coding!** 🚀

