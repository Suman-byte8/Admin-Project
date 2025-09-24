import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaCreditCard } from "react-icons/fa";
import { AdminContext } from "../context/AdminContext";

export default function UserProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { getToken } = useContext(AdminContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const token = getToken();
        const API_BASE = import.meta.env.VITE_BACKEND_URL;

        const response = await fetch(`${API_BASE}/admin/user-profile/${userId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setUser(data.user);
        } else {
          setError(data.message || 'Failed to load user profile');
        }
      } catch (err) {
        setError('Failed to load user profile');
        console.error('Error fetching user profile:', err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserProfile();
    }
  }, [userId, getToken]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <main className="flex-1 px-4 py-12">
        <div className="layout-content-container mx-auto flex flex-col max-w-4xl">
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading user profile...</div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-1 px-4 py-12">
        <div className="layout-content-container mx-auto flex flex-col max-w-4xl">
          <div className="flex items-center justify-center h-64">
            <div className="text-red-500">{error}</div>
          </div>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex-1 px-4 py-12">
        <div className="layout-content-container mx-auto flex flex-col max-w-4xl">
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">User not found</div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 px-4 py-12">
      <div className="layout-content-container mx-auto flex flex-col max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <FaArrowLeft />
            Back
          </button>
          <h1 className="text-gray-900 tracking-tight text-3xl font-bold leading-tight">
            User Profile
          </h1>
        </div>

        {/* User Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* User Avatar and Basic Info */}
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <FaUser className="text-white text-2xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-gray-600 flex items-center gap-2">
                <FaEnvelope />
                {user.email}
              </p>
            </div>
          </div>

          {/* User Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FaUser className="text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium">{user.firstName} {user.lastName}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FaEnvelope className="text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FaPhone className="text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p className="font-medium">{user.phoneNumber}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FaPhone className="text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">WhatsApp Number</p>
                  <p className="font-medium">{user.whatsAppNumber}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FaPhone className="text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Alternate Number</p>
                  <p className="font-medium">{user.alternateNumber || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Membership & Account Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Membership & Account</h3>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FaCreditCard className="text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Membership Type</p>
                  <p className="font-medium">{user.memberShipType || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FaCalendarAlt className="text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Membership Start</p>
                  <p className="font-medium">{formatDate(user.memberShipStartDate)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FaCalendarAlt className="text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Membership End</p>
                  <p className="font-medium">{formatDate(user.memberShipEndDate)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FaMapMarkerAlt className="text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium">{user.address}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FaCalendarAlt className="text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Account Created</p>
                  <p className="font-medium">{formatDate(user.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
