import React from 'react';

const StatusBadge = ({ status }) => {
  const getBadgeStyle = () => {
    switch (status) {
      case 'approved':
        return {
          bg: 'bg-green-300 ',
          text: 'text-green-800 ',
          label: 'Approved'
        };
      case 'pending':
        return {
          bg: 'bg-yellow-100 ',
          text: 'text-yellow-800',
          label: 'Pending'
        };
      case 'rejected':
        return {
          bg: 'bg-red-100 ',
          text: 'text-red-800 ',
          label: 'Rejected'
        };
      default:
        return { bg: '', text: '', label: status };
    }
  };

  const { bg, text, label } = getBadgeStyle();

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bg} ${text}`}>
      <svg className="w-2.5 h-2.5 mr-1.5" fill="currentColor" viewBox="0 0 8 8">
        <circle cx="4" cy="4" r="3"></circle>
      </svg>
      {label}
    </span>
  );
};

export default StatusBadge;