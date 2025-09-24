import React from 'react';

const NoReservations = ({ selectedDateRange, selectedReservationType }) => {
  const getMessage = () => {
    const typeText = (selectedReservationType || 'reservation').toLowerCase();
    const rangeText = (selectedDateRange || 'selected period').toLowerCase();

    if (selectedDateRange === "Date Range") {
      return `No ${typeText} reservations found.`;
    }

    return `No ${typeText} reservations found for ${rangeText}.`;
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="text-center">
        <div className="mb-6">
          <i className="fas fa-calendar-times text-6xl text-gray-300"></i>
        </div>
        <h3 className="text-xl font-semibold text-[#111718] mb-2">
          No Reservations Found
        </h3>
        <p className="text-[#60838a] text-sm max-w-md">
          {getMessage()}
        </p>
        <div className="mt-6">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            <i className="fas fa-refresh"></i>
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoReservations;
