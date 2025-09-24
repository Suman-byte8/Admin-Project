import React from 'react';
import { formatDate } from '../../utils/dateUtils';

const RestaurantDetails = ({ reservation }) => {
  return (
    <>
      <div className="flex flex-col gap-1 border-t border-solid border-t-[#dcdfe5] py-4 pr-2">
        <p className="text-[#636f88] text-sm font-normal leading-normal">Date</p>
        <p className="text-[#111318] text-sm font-normal leading-normal">{formatDate(reservation.date)}</p>
      </div>
      <div className="flex flex-col gap-1 border-t border-solid border-t-[#dcdfe5] py-4 pl-2">
        <p className="text-[#636f88] text-sm font-normal leading-normal">Time Slot</p>
        <p className="text-[#111318] text-sm font-normal leading-normal">{reservation.timeSlot || 'N/A'}</p>
      </div>
      <div className="flex flex-col gap-1 border-t border-solid border-t-[#dcdfe5] py-4 pr-2">
        <p className="text-[#636f88] text-sm font-normal leading-normal">Number of Diners</p>
        <p className="text-[#111318] text-sm font-normal leading-normal">{reservation.noOfDiners || 'N/A'}</p>
      </div>
      <div className="flex flex-col gap-1 border-t border-solid border-t-[#dcdfe5] py-4 pl-2">
        <p className="text-[#636f88] text-sm font-normal leading-normal">Special Requests</p>
        <p className="text-[#111318] text-sm font-normal leading-normal">{reservation.specialRequests || 'None'}</p>
      </div>
      {reservation.additionalDetails && (
        <div className="flex flex-col gap-1 border-t border-solid border-t-[#dcdfe5] py-4 pr-2">
          <p className="text-[#636f88] text-sm font-normal leading-normal">Additional Details</p>
          <p className="text-[#111318] text-sm font-normal leading-normal">{reservation.additionalDetails}</p>
        </div>
      )}
    </>
  );
};

export default RestaurantDetails;
