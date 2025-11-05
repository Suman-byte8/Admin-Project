// components/reservationManagement/ReservationFilters.jsx
import React from "react";
import { clearFiltersFromStorage } from "../../utils/filterStorage";

const ReservationFilters = ({ filters, setFilters }) => {
  const [openDropdown, setOpenDropdown] = React.useState(null);

  const handleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const handleSelect = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value, page: 1 }));
    setOpenDropdown(null);
  };

  const handleReset = () => {
    // Clear filters from localStorage
    clearFiltersFromStorage();

    // Reset to default values
    setFilters({
      type: "accommodation",
      status: "All Status",
      search: "",
      sortBy: "date_desc",
      page: 1,
      limit: 10,
    });
  };

  return (
    <div className="flex gap-3 p-3 flex-wrap pr-4">
      {/* Reservation Type */}
      <div className="relative">
        <button
          onClick={() => handleDropdown("type")}
          className="flex h-9 items-center gap-x-2 rounded-lg bg-[#f0f4f5] pl-4 pr-3"
        >
          <i className="fas fa-bed text-[#60838a]" />
          <p className="text-sm font-medium text-[#111718]">
            {filters.type === "accommodation"
              ? "Accommodation"
              : filters.type === "restaurant"
              ? "Restaurant Reservation"
              : "Meeting & Wedding"}
          </p>
          <i
            className={`fas ${
              openDropdown === "type" ? "fa-caret-up" : "fa-caret-down"
            } text-sm`}
          />
        </button>
        {openDropdown === "type" && (
          <div className="absolute mt-1 w-56 bg-white shadow-lg rounded-md border">
            <ul className="py-1 text-sm text-gray-700">
              {[
                ["accommodation", "Accommodation"],
                ["restaurant", "Restaurant Reservation"],
                ["meeting", "Meeting & Wedding"],
              ].map(([val, label]) => (
                <li
                  key={val}
                  onClick={() => handleSelect("type", val)}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {label}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Status Filter */}
      <div className="relative">
        <button
          onClick={() => handleDropdown("status")}
          className="flex h-9 items-center gap-x-2 rounded-lg bg-[#f0f4f5] px-4"
        >
          <i className="fas fa-info-circle text-[#60838a]" />
          <p className="text-sm font-medium text-[#111718]">{filters.status}</p>
          <i
            className={`fas ${
              openDropdown === "status" ? "fa-caret-up" : "fa-caret-down"
            } text-sm`}
          />
        </button>
        {openDropdown === "status" && (
          <div className="absolute mt-1 w-48 bg-white shadow-lg rounded-md border">
            <ul className="py-1 text-sm text-gray-700">
              {["All Status", "Confirmed", "Pending", "Cancelled"].map((opt) => (
                <li
                  key={opt}
                  onClick={() => handleSelect("status", opt)}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {opt}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Sort By */}
      <div className="relative">
        <button
          onClick={() => handleDropdown("sortBy")}
          className="flex h-9 items-center gap-x-2 rounded-lg bg-[#f0f4f5] px-4"
        >
          <i className="fas fa-sort text-[#60838a]" />
          <p className="text-sm font-medium text-[#111718]">
            {filters.sortBy === "name" ? "Name (Alphabetical)" : "Date"}
          </p>
          <i
            className={`fas ${
              openDropdown === "sortBy" ? "fa-caret-up" : "fa-caret-down"
            } text-sm`}
          />
        </button>
        {openDropdown === "sortBy" && (
          <div className="absolute mt-1 w-48 bg-white shadow-lg rounded-md border">
            <ul className="py-1 text-sm text-gray-700">
              <li
                onClick={() => handleSelect("sortBy", "date_desc")}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                Date
              </li>
              <li
                onClick={() => handleSelect("sortBy", "name")}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                Name (Alphabetical)
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Reset Button */}
      <div className="flex items-center">
        <button
          onClick={handleReset}
          className="flex items-center gap-x-2 rounded-lg bg-red-100 px-4 h-9 text-red-600 hover:bg-red-200"
        >
          <i className="fas fa-undo" />
          <p className="text-sm font-medium">Reset</p>
        </button>
      </div>
    </div>
  );
};

export default ReservationFilters;
