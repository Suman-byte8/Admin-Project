import React from 'react'

const GalleryTabs = ({ active, setActive }) => {
    const tabs = ["Rooms", "Restaurant", "Hotel Overview", "Party Room", "Bar"];
    return (
      <div className="pb-3">
        <div className="flex border-b border-[#dbe0e6] px-4 gap-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 ${
                active === tab
                  ? "border-b-[#111418] text-[#111418]"
                  : "border-b-transparent text-[#60758a]"
              }`}
            >
              <p className="text-sm font-bold leading-normal tracking-[0.015em]">
                {tab}
              </p>
            </button>
          ))}
        </div>
      </div>
    );
  };

export default GalleryTabs