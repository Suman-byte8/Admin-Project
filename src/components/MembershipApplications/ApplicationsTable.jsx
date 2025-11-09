import React from 'react';
import StatusBadge from './StatusBadge';
import EmptyState from './EmptyState';

const ApplicationsTable = React.memo(({ data, onDetailsClick }) => {
  if (data.length === 0) {
    return <EmptyState />;
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <>
      {data.map((app) => (
        <tr
          key={app.id}
          className="bg-white dark:bg-background-dark/50 border-b dark:border-white/10 text-gray-900 hover:bg-gray-50 dark:hover:bg-background-dark"
        >
          <td className="px-6 py-4 font-medium  whitespace-nowrap">
            {app.name}
          </td>
          <td className="px-6 py-4">{app.email}</td>
          <td className="px-6 py-4">{app.phone}</td>
          <td className="px-6 py-4">
            <StatusBadge status={app.status} />
          </td>
          <td className="px-6 py-4">{formatDate(app.memberShipStartDate)}</td>
          <td className="px-6 py-4">{formatDate(app.memberShipEndDate)}</td>
          <td className="px-6 py-4 text-right">
            <button
              onClick={() => onDetailsClick(app)}
              className="font-medium text-primary hover:underline"
            >
              View Details
            </button>
          </td>
        </tr>
      ))}
    </>
  );
});

export default ApplicationsTable;
