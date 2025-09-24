import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ReservationHeader = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex flex-wrap justify-start items-center gap-3 p-4">
        <button
          onClick={() => navigate(-1)}
          className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 bg-[#f0f2f4] text-[#111318] text-sm font-medium leading-normal"
        >
          <span className="flex items-center gap-2">
            <FaArrowLeft className="fas fa-arrow-left mr-2" /> Go Back
          </span>
        </button>
        <p className="text-[#111318] tracking-light text-[32px] font-bold leading-tight min-w-72">Reservation Details</p>
      </div>
      {/* <div className="flex justify-stretch">
        <div className="flex flex-1 gap-3 flex-wrap px-4 py-3 justify-end">
          <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#f0f2f4] text-[#111318] text-sm font-bold leading-normal tracking-[0.015em]">
            <span className="truncate">Edit</span>
          </button>
          <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#f0f2f4] text-[#111318] text-sm font-bold leading-normal tracking-[0.015em]">
            <span className="truncate">Delete</span>
          </button>
        </div>
      </div> */}
    </>
  );
};

export default ReservationHeader;
