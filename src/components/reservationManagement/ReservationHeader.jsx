import React from 'react';

const ReservationHeader = () => {
  return (
    <div className="flex flex-wrap justify-between gap-3 p-4 items-center">
      <p className="text-[#111718] text-[32px] font-bold leading-tight min-w-72 flex items-center gap-2">
        <i className="fas fa-calendar-check text-blue-600"></i>
        Reservations
      </p>
    </div>
  );
};

export default ReservationHeader;
