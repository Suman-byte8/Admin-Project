import React from 'react';
import { formatDate } from '../../utils/dateUtils';

const MeetingDetails = ({ reservation }) => {
  return (
    <>
      <div className="flex flex-col gap-1 border-t border-solid border-t-[#dcdfe5] py-4 pr-2">
        <p className="text-[#636f88] text-sm font-normal leading-normal">Event Type</p>
        <p className="text-[#111318] text-sm font-normal leading-normal">{reservation.typeOfReservation || 'N/A'}</p>
      </div>
      <div className="flex flex-col gap-1 border-t border-solid border-t-[#dcdfe5] py-4 pl-2">
        <p className="text-[#636f88] text-sm font-normal leading-normal">Start Date</p>
        <p className="text-[#111318] text-sm font-normal leading-normal">{formatDate(reservation.reservationDate)}</p>
      </div>
      <div className="flex flex-col gap-1 border-t border-solid border-t-[#dcdfe5] py-4 pr-2">
        <p className="text-[#636f88] text-sm font-normal leading-normal">End Date</p>
        <p className="text-[#111318] text-sm font-normal leading-normal">{formatDate(reservation.reservationEndDate)}</p>
      </div>
      <div className="flex flex-col gap-1 border-t border-solid border-t-[#dcdfe5] py-4 pl-2">
        <p className="text-[#636f88] text-sm font-normal leading-normal">Number of Guests</p>
        <p className="text-[#111318] text-sm font-normal leading-normal">{reservation.numberOfGuests || 'N/A'}</p>
      </div>
      <div className="flex flex-col gap-1 border-t border-solid border-t-[#dcdfe5] py-4 pr-2">
        <p className="text-[#636f88] text-sm font-normal leading-normal">Number of Rooms</p>
        <p className="text-[#111318] text-sm font-normal leading-normal">{reservation.numberOfRooms || 'N/A'}</p>
      </div>
      <div className="flex flex-col gap-1 border-t border-solid border-t-[#dcdfe5] py-4 pl-2">
        <p className="text-[#636f88] text-sm font-normal leading-normal">Special Requests</p>
        <p className="text-[#111318] text-sm font-normal leading-normal">{reservation.additionalDetails || 'None'}</p>
      </div>
    </>
  );
};

export default MeetingDetails;
