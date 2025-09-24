import React, { useState, useEffect, useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import { fetchReservations } from "../services/reservationApi";
import ReservationFilters from "../components/reservationManagement/ReservationFilters";
import ReservationTable from "../components/reservationManagement/ReservationTable";
import ReservationSearch from "../components/reservationManagement/ReservationSearch";
import ReservationHeader from "../components/reservationManagement/ReservationHeader";
import { debounce } from "lodash";
import { loadFiltersFromStorage, saveFiltersToStorage } from "../utils/filterStorage";
import { MdOutlineRefresh } from "react-icons/md";

const ReservationManagement = () => {
  const { getToken } = useContext(AdminContext);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load initial filters from localStorage
  const [filters, setFilters] = useState(() => loadFiltersFromStorage());

  const [total, setTotal] = useState(0);

  // ✅ Load reservations with forced delay
  const loadData = async () => {
    const token = getToken();
    if (!token) return;

    setLoading(true);
    try {
      const result = await fetchReservations(token, filters);
      setData(result.items || []);
      setTotal(result.total);

      // Force loading state for 5-8 seconds (random between 5-8 seconds)
      const delayTime = 5000 + Math.random() * 3000; // 5000-8000ms
      await new Promise(resolve => setTimeout(resolve, delayTime));

    } finally {
      setLoading(false);
    }
  };

  // ✅ Load reservations without delay for refresh button
  const refreshData = async () => {
    const token = getToken();
    if (!token) return;

    setLoading(true);
    try {
      const result = await fetchReservations(token, filters);
      setData(result.items || []);
      setTotal(result.total);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Debounced effect when filters change
  useEffect(() => {
    const debounced = debounce(loadData, 400);
    debounced();
    return () => debounced.cancel();
  }, [filters]);

  // ✅ Save filters to localStorage whenever they change
  useEffect(() => {
    saveFiltersToStorage(filters);
  }, [filters]);

  return (
    <div className="layout-content-container flex flex-col w-full flex-1">
      <div className="flex justify-between items-center mb-4">
        <ReservationHeader />
        <button
          onClick={refreshData}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white  rounded-md text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 "
        >
          <MdOutlineRefresh />
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
      <ReservationSearch filters={filters} setFilters={setFilters} />
      <ReservationFilters filters={filters} setFilters={setFilters} />
      <ReservationTable
        reservations={data}
        total={total}
        loading={loading}
        filters={filters}
        onActionComplete={loadData}
        setFilters={setFilters}
      />
    </div>
  );
};

export default ReservationManagement;
