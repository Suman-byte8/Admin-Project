import React from 'react'

const GalleryHeader = ({ onAdd }) => (
    <div className="flex flex-wrap justify-between gap-3 p-4">
      <p className="text-[#111418] tracking-light text-[32px] font-bold leading-tight min-w-72">
        Website Gallery
      </p>
      <button
        onClick={onAdd}
        className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 bg-[#f0f2f5] text-[#111418] text-sm font-medium leading-normal"
      >
        <span className="truncate">Add New Image</span>
      </button>
    </div>
  );

export default GalleryHeader