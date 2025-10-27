# Project Structure

```
client/
├── public/
│   └── index.html              # HTML template
├── src/
│   ├── components/             # React components
│   │   ├── common/            # Reusable UI components
│   │   │   ├── Badge.jsx      # Status badges
│   │   │   ├── Button.jsx     # Button component
│   │   │   ├── DeleteConfirm.jsx # Delete confirmation modal
│   │   │   ├── Input.jsx      # Input field component
│   │   │   ├── LoadingSpinner.jsx # Loading indicator
│   │   │   ├── Modal.jsx      # Modal dialog
│   │   │   └── Select.jsx     # Select dropdown
│   │   ├── customer/          # Customer module
│   │   │   ├── CustomerForm.jsx # Customer create/edit form
│   │   │   └── CustomerList.jsx  # Customer list/table
│   │   ├── inquiry/           # Inquiry module
│   │   │   ├── InquiryForm.jsx  # Inquiry create/edit form
│   │   │   └── InquiryList.jsx   # Inquiry list/table
│   │   └── layout/            # Layout components
│   │       └── Navbar.jsx     # Navigation bar
│   ├── pages/                 # Page components
│   │   └── Dashboard.jsx      # Dashboard page
│   ├── utils/                 # Utility functions
│   │   ├── api.js            # API service layer
│   │   ├── constants.js      # Constants and enums
│   │   └── validation.js     # Validation functions
│   ├── App.js                # Main app component
│   ├── index.js              # Entry point
│   └── index.css             # Global styles
├── .env.example               # Environment variables template
├── .gitignore                 # Git ignore rules
├── package.json               # Dependencies and scripts
├── postcss.config.js          # PostCSS configuration
├── postman-collection.json    # API collection for Postman
├── tailwind.config.js         # Tailwind CSS configuration
├── FEATURES.md                # Feature documentation
├── PROJECT_STRUCTURE.md       # This file
├── README.md                  # Main documentation
└── SETUP_INSTRUCTIONS.md      # Setup guide
```

## Component Details

### Common Components (`src/components/common/`)

#### Badge.jsx
- Displays status with color coding
- Props: `status`, `children`
- Uses STATUS_BADGE_STYLE for colors

#### Button.jsx
- Flexible button with multiple variants
- Props: `variant`, `size`, `onClick`, `disabled`, `fullWidth`
- Variants: primary, secondary, danger, success, outline
- Sizes: sm, md, lg

#### DeleteConfirm.jsx
- Confirmation modal for delete actions
- Props: `isOpen`, `onClose`, `onConfirm`, `title`, `message`

#### Input.jsx
- Text input field with validation
- Props: `label`, `name`, `type`, `value`, `onChange`, `error`, `required`
- Supports various input types

#### LoadingSpinner.jsx
- Loading indicator
- Props: `size`, `fullScreen`
- CSS-based spinner animation

#### Modal.jsx
- Modal dialog component
- Props: `isOpen`, `onClose`, `title`, `size`, `children`
- Sizes: sm, md, lg, xl

#### Select.jsx
- Dropdown select component
- Props: `label`, `name`, `value`, `onChange`, `options`, `error`, `required`
- Supports option arrays

### Customer Module (`src/components/customer/`)

#### CustomerList.jsx
- Main customer listing page
- Features:
  - Pagination
  - Search functionality
  - Filter by business type and status
  - Actions: View, Edit, Delete
  - Confirmation modal for deletion

#### CustomerForm.jsx
- Customer create/edit form
- Features:
  - All customer fields
  - Real-time validation
  - Auto-generated customer code (read-only)
  - Toast notifications
  - Edit mode with pre-population

### Inquiry Module (`src/components/inquiry/`)

#### InquiryList.jsx
- Main inquiry listing page
- Features:
  - Dashboard cards with status counts
  - Filter by status, priority, date range
  - Quick status change dropdown
  - Actions: View, Edit, Delete
  - Business rules enforcement

#### InquiryForm.jsx
- Inquiry create/edit form
- Features:
  - Customer selection (searchable)
  - Date pickers
  - Dynamic line items
  - Add/remove line items
  - Real-time validation
  - Total items count

### Layout Components (`src/components/layout/`)

#### Navbar.jsx
- Top navigation bar
- Features:
  - Active route highlighting
  - Links to Dashboard, Customers, Inquiries
  - Responsive design

### Pages (`src/pages/`)

#### Dashboard.jsx
- Main dashboard page
- Features:
  - Quick action cards
  - Module access
  - Overview statistics

### Utilities (`src/utils/`)

#### api.js
- API service layer
- Exports: `customerAPI`, `inquiryAPI`
- Interceptors for JWT handling
- Error handling

#### constants.js
- Application constants
- Exports:
  - BUSINESS_TYPES
  - CUSTOMER_STATUS
  - INQUIRY_STATUS
  - PRIORITY_LEVELS
  - UNITS
  - STATUS_COLORS
  - STATUS_BADGE_STYLE

#### validation.js
- Validation functions
- Exports:
  - `validateEmail()`
  - `validatePhone()`
  - `validateGST()`
  - `validateCustomer()`
  - `validateInquiry()`
  - `formatDate()`
  - `formatDateDisplay()`

## File Flow

### Entry Point
`src/index.js` → `src/App.js` → Routes → Components

### Routing
`App.js` manages all routes:
- `/` → Dashboard
- `/customers` → CustomerList
- `/customers/new` → CustomerForm (create)
- `/customers/:id/edit` → CustomerForm (edit)
- `/inquiries` → InquiryList
- `/inquiries/new` → InquiryForm (create)
- `/inquiries/:id/edit` → InquiryForm (edit)

### Data Flow
Components → API calls → Backend → Response → State update → Re-render

## Styling

- Tailwind CSS for utility-first styling
- Custom components with Tailwind classes
- Responsive breakpoints
- Consistent color scheme
- Modern UI patterns

## State Management

- React hooks (useState, useEffect)
- Local component state
- API calls for data fetching
- Toast notifications for feedback

## Development Workflow

1. Install dependencies: `npm install`
2. Configure environment: `.env`
3. Start dev server: `npm start`
4. Build for production: `npm run build`

## Testing Approach

While no test files are included, the code is structured to be easily testable:
- Component isolation
- Pure functions in utils
- Clear prop interfaces
- Separation of concerns

