import ApplicationsTable from "../components/MembershipApplications/ApplicationsTable";
import TabNavigation from "../components/MembershipApplications/TabNavigation";
import React, { useState, useEffect } from "react";
import { getMemberships } from "../services/membershipApi";
import { useNavigate } from "react-router-dom";

const MembershipApplications = () => {
  const [activeTab, setActiveTab] = useState("approved");
  const [applications, setApplications] = useState({
    approved: [],
    pending: [],
    rejected: [],
  });
  const [membershipTypeFilter, setMembershipTypeFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchMemberships(1);
  }, []);

  const fetchMemberships = async (page) => {
    try {
      setLoading(true);
      const { users, pagination } = await getMemberships(page, 50);

      // Group by status
      const grouped = {
        approved: [],
        pending: [],
        rejected: [],
      };

      users.forEach((user) => {
        const app = {
          id: user._id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          phone: `${user.phoneNumber}`,
          status: user.status,
          membershipType: user.memberShipType,
        };
        if (grouped[user.status]) {
          grouped[user.status].push(app);
        }
      });

      setApplications(grouped);
      // Optionally handle pagination info if needed
    } catch (err) {
      setError("Failed to fetch memberships");
      console.error("Error fetching memberships:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (app) => {
    navigate(`/members/${app.id}`);
  };

  const tabs = [
    { id: "approved", label: "Approved", count: applications.approved.length },
    { id: "pending", label: "Pending", count: applications.pending.length },
    { id: "rejected", label: "Rejected", count: applications.rejected.length },
  ];

  const currentData = (applications[activeTab] || []).filter((app) => {
    if (activeTab === "approved" && membershipTypeFilter) {
      return app.membershipType === membershipTypeFilter;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 text-sm">Loading applications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="flex-1 p-6 text-red-500">{error}</div>;
  }

  return (
    <main className="flex-1 p-6">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Toolbar: Tabs + Filter */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-200 px-4 py-3 sm:px-6">
          <TabNavigation
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {activeTab === "approved" && (
            <div className="mt-3 md:mt-0">
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Filter by Membership Type
              </label>
              <select
                value={membershipTypeFilter}
                onChange={(e) => setMembershipTypeFilter(e.target.value)}
                className="px-3 py-2 w-60 border border-gray-300 rounded-lg text-gray-700 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Types</option>
                <option value="Silver Guest">Silver Guest</option>
                <option value="Gold Traveler">Gold Traveler</option>
                <option value="Platinum Premier">Platinum Premier</option>
                <option value="Corporate/Business Elite">
                  Corporate/Business Elite
                </option>
              </select>
            </div>
          )}
        </div>

        {/* Table or Empty State */}
        {currentData.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-gray-400 text-5xl mb-3">📭</div>
            <p className="text-gray-600 font-medium">
              No applications found in this category
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="text-xs font-semibold uppercase tracking-wide text-gray-700 bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Phone</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <ApplicationsTable
                  data={currentData}
                  onDetailsClick={handleViewDetails}
                />
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
};

export default MembershipApplications;