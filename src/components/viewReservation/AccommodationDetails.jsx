import React from 'react';
import { formatDate } from '../../utils/dateUtils';
import { calculateTotalGuests, calculateRoomSummary } from '../../utils/reservationUtils';

const AccommodationDetails = ({ reservation }) => {
  return (
    <>
      <div className="flex flex-col gap-1 border-t border-solid border-t-[#dcdfe5] py-4 pr-2">
        <p className="text-[#636f88] text-sm font-normal leading-normal">Accommodation</p>
        <p className="text-[#111318] text-sm font-normal leading-normal">{calculateRoomSummary(reservation.rooms)}</p>
      </div>
      <div className="flex flex-col gap-1 border-t border-solid border-t-[#dcdfe5] py-4 pl-2">
        <p className="text-[#636f88] text-sm font-normal leading-normal">Check-in</p>
        <p className="text-[#111318] text-sm font-normal leading-normal">{formatDate(reservation.arrivalDate, '3:00 PM')}</p>
      </div>
      <div className="flex flex-col gap-1 border-t border-solid border-t-[#dcdfe5] py-4 pr-2">
        <p className="text-[#636f88] text-sm font-normal leading-normal">Check-out</p>
        <p className="text-[#111318] text-sm font-normal leading-normal">{formatDate(reservation.departureDate, '11:00 AM')}</p>
      </div>
      <div className="flex flex-col gap-1 border-t border-solid border-t-[#dcdfe5] py-4 pr-2">
        <p className="text-[#636f88] text-sm font-normal leading-normal">Number of Guests</p>
        <p className="text-[#111318] text-sm font-normal leading-normal">{calculateTotalGuests(reservation.rooms, reservation.totalAdults, reservation.totalChildren)}</p>
      </div>
      <div className="flex flex-col gap-1 border-t border-solid border-t-[#dcdfe5] py-4 pl-2">
        <p className="text-[#636f88] text-sm font-normal leading-normal">Special Requests</p>
        <p className="text-[#111318] text-sm font-normal leading-normal">{reservation.specialRequests || 'None'}</p>
      </div>
    </>
  );
};

export default AccommodationDetails;
