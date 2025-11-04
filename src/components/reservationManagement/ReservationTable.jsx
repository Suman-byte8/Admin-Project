import React, { useState, useContext } from "react";
import { AdminContext } from "../../context/AdminContext";
import {
  updateReservationStatus,
  deleteReservation,
} from "../../services/reservationApi";
import { slugToLabel } from "../../utils/typeMapper";
import { toast } from "react-toastify";

const ReservationTable = ({
  reservations,
  loading,
  total,
  filters,
  setFilters,        // ✅ for reset & search
  onActionComplete,
}) => {
  const { getToken } = useContext(AdminContext);
  const [updating, setUpdating] = useState(null);

  const handleAction = async (reservation, action) => {
    const token = getToken();
    if (!token) return toast.error("Auth token missing");

    setUpdating(reservation._id);
    try {
      if (action === "delete") {
        await deleteReservation(token, filters.type, reservation._id);
        toast.success("Reservation deleted");
      } else {
        await updateReservationStatus(
          token,
          filters.type,
          reservation._id,
          action
        );
        toast.success(`Reservation ${action}`);
      }
      onActionComplete && onActionComplete(); // ✅ Refresh data only
    } catch (err) {
      toast.error("Action failed");
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  /** ---------------- 🟢 Empty State UI ---------------- */
  if (!loading && reservations.length === 0) {
    return (
      <div className="p-10 flex flex-col items-center justify-center text-center bg-gray-50 rounded-lg border border-dashed border-gray-200 mt-4 shadow-sm">
        {/* Icon */}
        <div className="bg-white rounded-full p-5 shadow mb-4 border border-gray-200">
          <i className="fas fa-calendar-times text-4xl text-gray-400"></i>
        </div>

        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-700 mb-1">
          No Reservations Found
        </h2>

        {/* Subtitle */}
        <p className="text-sm text-gray-500 mb-4 max-w-sm">
          We couldn’t find any reservations matching your filters or search.
          Try adjusting the filters, search again, or reset everything.
        </p>

        {/* Inline search box */}
        <div className="flex w-full max-w-md items-center gap-2 mb-4">
          <div className="flex w-full items-stretch rounded-lg shadow-sm border border-gray-200">
            <div className="text-[#60838a] flex bg-[#f0f4f5] items-center justify-center pl-4 rounded-l-lg">
              <i className="fas fa-search"></i>
            </div>
            <input
              type="text"
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value, page: 1 }))
              }
              placeholder="Search by guest name, email or phone number"
              className="form-input flex w-full rounded-lg text-[#111718] bg-[#f0f4f5] h-10 placeholder:text-[#60838a] px-4 rounded-l-none text-sm"
            />
          </div>
        </div>

        {/* Reset Filters Button */}
        <button
          onClick={() =>
            setFilters({
              type: "accommodation",
              status: "All Status",
              search: "",
              sortBy: "date_desc",
              page: 1,
              limit: 50,
            })
          }
          className="px-5 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition"
        >
          Reset Filters
        </button>
      </div>
    );
  }

  /** ---------------- 🟢 Loading State ---------------- */
  if (loading) {
    return (
      <div className="mt-4 bg-white border border-gray-200 rounded-lg shadow overflow-hidden">
        <div className="flex justify-between items-center px-4 py-2 bg-gray-50 border-b border-gray-200">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-48"></div>
          <div className="h-3 bg-gray-200 rounded animate-pulse w-24"></div>
        </div>

        {/* Table Skeleton */}
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 text-left border-b border-gray-200">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              </th>
              <th className="p-3 text-left border-b border-gray-200">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              </th>
              <th className="p-3 text-left border-b border-gray-200">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              </th>
              <th className="p-3 text-left border-b border-gray-200">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              </th>
              <th className="p-3 text-left border-b border-gray-200">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              </th>
              <th className="p-3 text-left border-b border-gray-200">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              </th>
              <th className="p-3 text-left border-b border-gray-200">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              </th>
              <th className="p-3 text-left border-b border-gray-200">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              </th>
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, index) => (
              <tr key={index} className="border-t border-gray-200">
                <td className="p-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
                </td>
                <td className="p-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-48"></div>
                </td>
                <td className="p-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-28"></div>
                </td>
                <td className="p-3">
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-20"></div>
                </td>
                <td className="p-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                </td>
                <td className="p-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-8 mx-auto"></div>
                </td>
                <td className="p-3">
                  <div className="h-6 bg-gray-200 rounded-full animate-pulse w-16"></div>
                </td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <div className="h-6 bg-gray-200 rounded-full animate-pulse w-12"></div>
                    <div className="h-6 bg-gray-200 rounded-full animate-pulse w-16"></div>
                    <div className="h-6 bg-gray-200 rounded-full animate-pulse w-14"></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="mt-4 bg-white border border-gray-200 rounded-lg shadow overflow-hidden">
      <div className="flex justify-between items-center px-4 py-2 bg-gray-50 border-b border-gray-200">
        <p className="text-sm text-gray-700 font-medium">
          Showing <span className="font-semibold">{reservations.length}</span> of{" "}
          <span className="font-semibold">{total}</span> reservations
        </p>
        {updating && (
          <span className="text-xs text-gray-500 animate-pulse">
            Updating row...
          </span>
        )}
      </div>

      {/* Table */}
      <table className="w-full text-sm">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="p-3 text-left border-b border-gray-200">Guest</th>
            <th className="p-3 text-left border-b border-gray-200">Email</th>
            <th className="p-3 text-left border-b border-gray-200">Phone</th>
            <th className="p-3 text-left border-b border-gray-200">Type</th>
            <th className="p-3 text-left border-b border-gray-200">Date</th>
            <th className="p-3 text-left border-b border-gray-200">Room Details</th>
            <th className="p-3 text-left border-b border-gray-200">Status</th>
            <th className="p-3 text-left border-b border-gray-200">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((r) => (
            <tr
              key={r._id}
              className="border-t border-gray-200 hover:bg-gray-50"
            >
              <td className="p-3 font-medium">{r.guestInfo?.name || (r.guest?.name)}</td>
              <td className="p-3 text-gray-600">{r.guestInfo?.email || (r.guest?.email)}</td>
              <td className="p-3 text-gray-600">{r.guestInfo?.phoneNumber || (r.guest?.phoneNumber)}</td>
              <td className="p-3">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-medium">
                  {slugToLabel(filters.type)}
                </span>
              </td>
              <td className="p-3 text-gray-600">
                {new Date(r.arrivalDate || r.createdAt).toLocaleDateString()} 
                {r.departureDate && (
                  <div className="text-xs text-gray-500">
                    to {new Date(r.departureDate).toLocaleDateString()}
                  </div>
                )}
              </td>
              <td className="p-3">
                {filters.type === 'accommodation' && r.selectedRoomTypes ? (
                  <div className="space-y-1">
                    {r.selectedRoomTypes.map((room, idx) => (
                      <div key={idx} className="text-xs">
                        {room.type}: {room.count} {room.count > 1 ? 'rooms' : 'room'}
                      </div>
                    ))}
                    <div className="text-xs text-gray-500 mt-1">
                      Total Guests: {r.totalAdults + r.totalChildren}
                    </div>
                  </div>
                ) : (
                  <span className="text-center">
                    {r.numberOfGuests || r.noOfDiners || (r.totalAdults + r.totalChildren)}
                  </span>
                )}
              </td>
              <td className="p-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                    r.status === "confirmed"
                      ? "bg-green-100 text-green-800 border border-gray-200"
                      : r.status === "cancelled"
                      ? "bg-red-100 text-red-800 border border-gray-200"
                      : "bg-yellow-100 text-yellow-800 border border-gray-200"
                  }`}
                >
                  {r.status}
                </span>
                {filters.type === 'room' && r.room && (
                  <div className="mt-1 text-xs text-gray-500">
                    Room: {r.room.roomName || r.room}
                  </div>
                )}
              </td>
              <td className="p-3 flex gap-2 flex-wrap">
                <button
                  onClick={() =>
                    (window.location.href = `/view-reservation/${r._id}/${slugToLabel(
                      filters.type
                    )}`)
                  }
                  className="px-3 py-1 border border-gray-200 text-blue-600 rounded-full text-xs hover:bg-blue-50"
                >
                  <i className="fas fa-eye"></i> View
                </button>
                {r.status !== "confirmed" && (
                  <button
                    disabled={updating === r._id}
                    onClick={() => handleAction(r, "confirmed")}
                    className="px-3 py-1 border border-gray-200 text-green-600 rounded-full text-xs hover:bg-green-50 disabled:opacity-50"
                  >
                    <i className="fas fa-check"></i> Confirm
                  </button>
                )}
                {r.status !== "cancelled" && (
                  <button
                    disabled={updating === r._id}
                    onClick={() => handleAction(r, "cancelled")}
                    className="px-3 py-1 border border-gray-200 text-yellow-700 rounded-full text-xs hover:bg-yellow-50 disabled:opacity-50"
                  >
                    <i className="fas fa-ban"></i> Cancel
                  </button>
                )}
                <button
                  disabled={updating === r._id}
                  onClick={() => handleAction(r, "delete")}
                  className="px-3 py-1 border border-gray-200 text-red-600 rounded-full text-xs hover:bg-red-50 disabled:opacity-50"
                >
                  <i className="fas fa-trash"></i> Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReservationTable;
