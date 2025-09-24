import React from 'react';

const GuestInfo = ({ guestInfo }) => {
  return (
    <>
      <h2 className="text-[#111318] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Guest Information</h2>
      <div className="p-4 grid grid-cols-2">
        <div className="flex flex-col gap-1 border-t border-solid border-t-[#dcdfe5] py-4 pr-2">
          <p className="text-[#636f88] text-sm font-normal leading-normal">Name</p>
          <p className="text-[#111318] text-sm font-normal leading-normal">{guestInfo.name || guestInfo.guestName || 'N/A'}</p>
        </div>
        <div className="flex flex-col gap-1 border-t border-solid border-t-[#dcdfe5] py-4 pl-2">
          <p className="text-[#636f88] text-sm font-normal leading-normal">Email</p>
          <p className="text-[#111318] text-sm font-normal leading-normal">{guestInfo.email || 'N/A'}</p>
        </div>
        <div className="flex flex-col gap-1 border-t border-solid border-t-[#dcdfe5] py-4 pr-2">
          <p className="text-[#636f88] text-sm font-normal leading-normal">Phone</p>
          <p className="text-[#111318] text-sm font-normal leading-normal">{guestInfo.phoneNumber || guestInfo.phone || 'N/A'}</p>
        </div>
        <div className="flex flex-col gap-1 border-t border-solid border-t-[#dcdfe5] py-4 pl-2">
        </div>
      </div>
    </>
  );
};

export default GuestInfo;
