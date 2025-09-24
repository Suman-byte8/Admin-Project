import React from 'react';

const EmptyState = ({ message = "No applications found." }) => {
  return (
    <tr>
      <td colSpan="5" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
        {message}
      </td>
    </tr>
  );
};

export default EmptyState;