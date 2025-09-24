import React, { useContext } from "react";
import { AdminContext } from "@/context/AdminContext";
import { Link } from "react-router-dom";

export default function DashboardHeader() {
  const { admin, loading } = useContext(AdminContext);
  const displayName = admin?.firstName;

  const today = new Date();
  const dateStr = today.toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
      <div className="flex flex-col gap-1">
      
        <div className="text-sm text-gray-500">{dateStr}</div>
      </div>

    </div>
  );
}
