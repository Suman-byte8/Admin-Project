import React, { useState, useEffect } from "react";
import { FaBed, FaBoxes, FaUsers } from "react-icons/fa";
import { adminApi } from "@/services/adminApi";
import { AdminContext } from "@/context/AdminContext";

const Card = ({
  icon,
  label,
  value,
  trend,
  trendUp,
  accent = "from-[#e6eefc] to-white",
}) => {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br ${accent} backdrop-blur supports-[backdrop-filter]:bg-white/70 border border-white/60 shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.10)] transition-all duration-300`}
    >
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[var(--accent-color)]/10 blur-2xl" />
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-[var(--accent-color)]/20 blur-md scale-90" />
            <div className="relative p-3 rounded-2xl bg-[var(--accent-color)] text-white shadow-md shadow-[var(--accent-color)]/20">
              {icon}
            </div>
          </div>
          <div>
            <p className="text-gray-600 text-xs font-semibold tracking-wide uppercase">
              {label}
            </p>
            <div className="flex items-end gap-3 mt-1">
              <p className="text-gray-900 text-xl font-bold leading-none">
                {value}
              </p>
              {typeof trend === "number" && (
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    trendUp
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {trendUp ? "+" : ""}
                  {trend}%
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent-color)]" />
          <span>Last 7 days</span>
        </div>
      </div>

      <div className="pointer-events-none absolute left-0 right-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-[var(--accent-color)]/30 to-transparent translate-y-1 group-hover:translate-y-0 transition-transform duration-300" />
    </div>
  );
};

export default function DashboardStatCards() {
  const [registeredUsers, setRegisteredUsers] = useState(0);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const { getToken } = React.useContext(AdminContext);

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const token = getToken();
        if (token) {
          const response = await adminApi.getTotalUsers(token);
          setRegisteredUsers(response.totalUsers);
        }
      } catch (error) {
        console.error("Error fetching user count:", error);
        setRegisteredUsers(0);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUserCount();
  }, [getToken]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card
        icon={<FaBed size={22} className="text-black" />}
        label="Total Rooms"
        value={250}
        trend={3.2}
        trendUp
        accent="from-[#eef7ff] to-white"
      />

      <Card
        icon={<FaBoxes size={22} className="text-black" />}
        label="Inventory Items"
        value={1500}
        trend={-1.1}
        trendUp={false}
        accent="from-[#fff6ec] to-white"
      />

      <Card
        icon={<FaUsers size={22} className="text-black" />}
        label="Registered Users"
        value={loadingUsers ? "..." : registeredUsers}
        trend={8.5}
        trendUp
        accent="from-[#f5f5ff] to-white"
      />
    </div>
  );
}
