import React from "react";
import { FaSearch } from "react-icons/fa";

const ReservationSearch = ({ filters, setFilters }) => {
  const handleChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      search: e.target.value,   // ✅ update filters.search directly
      page: 1,                  // reset to first page when searching
    }));
  };

  return (
    <div className="px-4 py-3">
      <label className="flex flex-col min-w-40 h-12 w-full">
        <div className="flex w-full items-stretch rounded-lg h-full shadow-sm">
          <div className="text-[#60838a] flex bg-[#f0f4f5] items-center justify-center pl-4 rounded-l-lg">
            <FaSearch />
          </div>
          <input
            type="text"
            value={filters.search}
            onChange={handleChange}
            placeholder="Search by guest name, email or phone number"
            className="form-input flex w-full rounded-lg text-[#111718] focus:outline-0 bg-[#f0f4f5] h-full placeholder:text-[#60838a] px-4 rounded-l-none text-base"
          />
        </div>
      </label>
    </div>
  );
};

export default ReservationSearch;