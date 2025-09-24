import React from 'react';

const BasicInfo = ({ reservation, type }) => {
  return (
    <>
      <h2 className="text-[#111318] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Basic Information</h2>
      <div className="p-4 grid grid-cols-2">
        <div className="flex flex-col gap-1 border-t border-solid border-t-[#dcdfe5] py-4 pr-2">
          <p className="text-[#636f88] text-sm font-normal leading-normal">Reservation ID</p>
          <p className="text-[#111318] text-sm font-normal leading-normal">{reservation._id || 'N/A'}</p>
        </div>
        <div className="flex flex-col gap-1 border-t border-solid border-t-[#dcdfe5] py-4 pl-2">
          <p className="text-[#636f88] text-sm font-normal leading-normal">Type</p>
          <p className="text-[#111318] text-sm font-normal leading-normal">{type}</p>
        </div>
      </div>
    </>
  );
};

export default BasicInfo;
