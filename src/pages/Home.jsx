import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../context/AdminContext";
import { userActivityApi } from "../services/userActivity";
import DashboardHeader from "../components/Home/DashboardHeader";
import DashboardStatCards from "../components/Home/DashboardStatCards";
import RecentActivityTable from "../components/Home/RecentActivityTable";
import DeleteConfirmationDialog from "../components/Home/DeleteConfirmationDialog";
import { getActivityIcon, formatTimestamp, getDeviceInfo } from "../components/Home/activityUtils";

export default function Home() {
  const { getToken } = useContext(AdminContext);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ show: false, userId: null, userName: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const data = await userActivityApi.getRecentActivities(currentPage, 50);
        if (data.success) {
          // Activities are already sorted from server (latest first)
          setActivities(data.activities || []);
          setTotalPages(data.totalPages || 1);
        } else {
          setError(data.message || 'Failed to load activities');
        }
      } catch (err) {
        setError('Failed to load user activities');
        console.error('Error fetching activities:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [currentPage]);

  const handleDeleteUser = (userId, userName) => {
    setDeleteDialog({ show: true, userId, userName });
  };

  const confirmDeleteUser = async () => {
    try {
      const data = await userActivityApi.deleteUser(deleteDialog.userId);

      if (data.success) {
        // Remove the user from activities list
        setActivities(prev => prev.filter(activity =>
          !activity.userId || activity.userId._id !== deleteDialog.userId
        ));
        setDeleteDialog({ show: false, userId: null, userName: '' });
        alert('User deleted successfully');
      } else {
        alert(data.message || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  const cancelDelete = () => {
    setDeleteDialog({ show: false, userId: null, userName: '' });
  };

  return (
    <>
      <main className="flex-1 px-4 max-h-screen py-12">
        <div className="layout-content-container mx-auto flex flex-col max-w-full flex-1">
          <DashboardHeader />

          <DashboardStatCards />

          <h2 className="text-gray-900 text-2xl font-bold leading-tight tracking-tight mb-6">
            Recent User Activity
          </h2>

          <RecentActivityTable
            activities={activities}
            loading={loading}
            error={error}
            getDeviceInfo={getDeviceInfo}
            formatTimestamp={formatTimestamp}
            getActivityIcon={getActivityIcon}
            handleDeleteUser={handleDeleteUser}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </main>

      <DeleteConfirmationDialog
        deleteDialog={deleteDialog}
        confirmDeleteUser={confirmDeleteUser}
        cancelDelete={cancelDelete}
      />
    </>
  );
}
