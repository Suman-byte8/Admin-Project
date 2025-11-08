import React from "react";
import { FaEye, FaTrash, FaUserPlus, FaSignInAlt, FaSignOutAlt, FaCalendarCheck, FaCreditCard, FaUserEdit, FaCalendarAlt, FaInfoCircle, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function RecentActivityTable({
  activities,
  loading,
  error,
  getDeviceInfo,
  formatTimestamp,
  getActivityIcon,
  handleDeleteUser,
  currentPage,
  totalPages,
  onPageChange,
}) {
  const navigate = useNavigate();

  return (
    <div className="overflow-hidden shadow-lg bg-white w-full pb-8">
      <div className="overflow-y-auto overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[var(--accent-color)]/70 sticky top-0 z-10 backdrop-blur-md">
            <tr>
              <th className="px-6 py-4 text-left text-gray-800 text-sm font-bold uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-4 text-left text-gray-800 text-sm font-bold uppercase tracking-wider">
                Device Info
              </th>
              <th className="px-6 py-4 text-left text-gray-800 text-sm font-bold uppercase tracking-wider">
                Timestamp
              </th>
              <th className="px-6 py-4 text-left text-gray-800 text-sm font-bold uppercase tracking-wider">
                Activity
              </th>
              <th className="px-6 py-4 text-left text-gray-800 text-sm font-bold uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={`skeleton-${i}`} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4">
                    <div className="h-4 w-40 bg-gray-200 animate-pulse rounded" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 w-56 bg-gray-200 animate-pulse rounded" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 w-32 bg-gray-200 animate-pulse rounded" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 w-36 bg-gray-200 animate-pulse rounded" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-8 w-28 bg-gray-200 animate-pulse rounded" />
                  </td>
                </tr>
              ))
            ) : error ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-red-500">
                  {error}
                </td>
              </tr>
            ) : activities.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No recent activities found
                </td>
              </tr>
            ) : (
              activities.map((activity, index) => (
                <tr
                  key={activity._id || index}
                  className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-[var(--accent-color)]/10 transition-colors`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 text-sm font-medium">
                    {activity.userId ? (
                      <button
                        onClick={() => navigate(`/user-profile/${activity.userId._id}`)}
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {activity.userId.firstName && activity.userId.lastName
                          ? `${activity.userId.firstName} ${activity.userId.lastName}`
                          : activity.userId.email || 'Unknown User'}
                      </button>
                    ) : (
                      'Unknown User'
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600 text-sm">
                    {getDeviceInfo(activity.userAgent, activity.ipAddress)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 text-sm font-medium">
                    {formatTimestamp(activity.timestamp)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600 text-sm font-normal">
                    <span className="inline-flex items-center gap-2">
                      {getActivityIcon(activity.action)}
                      {activity.action === 'signup' ? 'User Registration' :
                       activity.action === 'login' ? 'User Login' :
                       activity.action || 'Unknown Activity'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {activity.userId ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/user-profile/${activity.userId._id}`)}
                          className="inline-flex items-center gap-2 px-3 py-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-200"
                        >
                          <FaEye size={12} />
                          View Profile
                        </button>
                        <button
                          onClick={() => handleDeleteUser(activity.userId._id, activity.userId.firstName + ' ' + activity.userId.lastName)}
                          className="inline-flex items-center gap-2 px-3 py-1 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors duration-200"
                        >
                          <FaTrash size={12} />
                          Delete User
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs">N/A</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {activities.length > 0 && (
        <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-gray-200">
          <div className="text-sm text-gray-700">
            Showing page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaChevronLeft size={12} />
              Previous
            </button>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <FaChevronRight size={12} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
