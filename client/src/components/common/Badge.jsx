import React from 'react';
import { STATUS_BADGE_STYLE } from '../../utils/constants';

const Badge = ({ status, children }) => {
  const style = STATUS_BADGE_STYLE[status?.toLowerCase()] || {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text}`}
    >
      {children || status}
    </span>
  );
};

export default Badge;

