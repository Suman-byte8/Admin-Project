import React from 'react';
import { formatDate } from '../../utils/dateUtils';

const AccommodationDetails = ({ reservation }) => {
  const formatRoomTypes = (roomTypes) => {
    if (!roomTypes || roomTypes.length === 0) return 'No rooms selected';
    return roomTypes.map(room => `${room.count} ${room.type} ${room.count > 1 ? 'Rooms' : 'Room'}`).join(', ');
  };

  return (
    <>
      <div className="flex flex-col gap-1 border-t border-solid border-t-[#dcdfe5] py-4 pr-2">
        <p className="text-[#636f88] text-sm font-normal leading-normal">Accommodation</p>
        <p className="text-[#111318] text-sm font-normal leading-normal">{formatRoomTypes(reservation.selectedRoomTypes)}</p>
      </div>
      <div className="flex flex-col gap-1 border-t border-solid border-t-[#dcdfe5] py-4 pl-2">
        <p className="text-[#636f88] text-sm font-normal leading-normal">Check-in</p>
        <p className="text-[#111318] text-sm font-normal leading-normal">
          {formatDate(reservation.arrivalDate)} at {reservation.checkInTime}
        </p>
      </div>
      <div className="flex flex-col gap-1 border-t border-solid border-t-[#dcdfe5] py-4 pr-2">
        <p className="text-[#636f88] text-sm font-normal leading-normal">Check-out</p>
        <p className="text-[#111318] text-sm font-normal leading-normal">
          {formatDate(reservation.departureDate)} at {reservation.checkOutTime}
        </p>
      </div>
      <div className="flex flex-col gap-1 border-t border-solid border-t-[#dcdfe5] py-4 pr-2">
        <p className="text-[#636f88] text-sm font-normal leading-normal">Number of Nights</p>
        <p className="text-[#111318] text-sm font-normal leading-normal">{reservation.nights || 'N/A'}</p>
      </div>
      <div className="flex flex-col gap-1 border-t border-solid border-t-[#dcdfe5] py-4 pr-2">
        <p className="text-[#636f88] text-sm font-normal leading-normal">Number of Guests</p>
        <p className="text-[#111318] text-sm font-normal leading-normal">
          {reservation.totalAdults} {reservation.totalAdults > 1 ? 'Adults' : 'Adult'}
          {reservation.totalChildren > 0 && `, ${reservation.totalChildren} ${reservation.totalChildren > 1 ? 'Children' : 'Child'}`}
        </p>
      </div>
      <div className="flex flex-col gap-1 border-t border-solid border-t-[#dcdfe5] py-4 pl-2">
        <p className="text-[#636f88] text-sm font-normal leading-normal">Special Requests</p>
        <p className="text-[#111318] text-sm font-normal leading-normal">{reservation.specialRequests || 'None'}</p>
      </div>
    </>
  );
};

export default AccommodationDetails;
