export const BUSINESS_TYPES = [
  { value: 'retailer', label: 'Retailer' },
  { value: 'wholesaler', label: 'Wholesaler' },
  { value: 'distributor', label: 'Distributor' },
];

export const CUSTOMER_STATUS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

export const INQUIRY_STATUS = [
  { value: 'draft', label: 'Draft' },
  { value: 'submitted', label: 'Submitted' },
  { value: 'quoted', label: 'Quoted' },
  { value: 'won', label: 'Won' },
  { value: 'lost', label: 'Lost' },
];

export const PRIORITY_LEVELS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

export const UNITS = [
  { value: 'pcs', label: 'Pcs (Pieces)' },
  { value: 'kg', label: 'Kg (Kilogram)' },
  { value: 'ltr', label: 'Ltr (Liter)' },
  { value: 'mtr', label: 'Mtr (Meter)' },
];

export const STATUS_COLORS = {
  draft: 'bg-gray-100 text-gray-800',
  submitted: 'bg-blue-100 text-blue-800',
  quoted: 'bg-yellow-100 text-yellow-800',
  won: 'bg-green-100 text-green-800',
  lost: 'bg-red-100 text-red-800',
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-red-100 text-red-800',
};

export const STATUS_BADGE_STYLE = {
  draft: { bg: 'bg-gray-100', text: 'text-gray-800' },
  submitted: { bg: 'bg-blue-100', text: 'text-blue-800' },
  quoted: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  won: { bg: 'bg-green-100', text: 'text-green-800' },
  lost: { bg: 'bg-red-100', text: 'text-red-800' },
};

