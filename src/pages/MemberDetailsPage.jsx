import React, { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaEnvelope,
  FaPhone,
  FaGlobe,
  FaMapMarkedAlt,
  FaCity,
  FaCheckCircle,
  FaCalendarAlt,
  FaCheck,
  FaTimes,
  FaTrash,
} from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import {
  getMemberById,
  updateMembershipStatus,
  deleteMembership,
} from "../services/membershipApi";
import { toast } from "react-toastify";

// 1️⃣ Back navigation link — enhanced with hover transition
const BackLink = () => (
  <div className="mb-8">
    <a
      href="/membership-applications"
      className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors duration-200"
    >
      <FaArrowLeft />
      Back to Members
    </a>
  </div>
);

// 2️⃣ Animated Status Badge
const StatusBadge = React.memo(({ status }) => {
  const statusStyles = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    approved: "bg-green-100 text-green-800 border-green-200",
    rejected: "bg-red-100 text-red-800 border-red-200",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border animate-fade-in ${
        statusStyles[status] || "bg-gray-100 text-gray-800"
      }`}
    >
      <span className="capitalize">{status}</span>
    </span>
  );
});

// Keyframe animation for fade-in (add to global CSS or inject here via style tag if needed)
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(4px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in {
      animation: fadeIn 0.3s ease-out forwards;
    }
  `;
  document.head.appendChild(style);
}

// 3️⃣ Detail Row — cleaner spacing + icon color matching theme
const DetailRow = ({ icon: Icon, label, value, isBordered = false }) => (
  <div
    className={`flex items-start gap-4 p-5 md:p-6 ${
      isBordered ? "border-t md:border-l border-gray-100" : ""
    } hover:bg-gray-50 transition-colors duration-150`}
  >
    <Icon className="text-indigo-500 mt-1 flex-shrink-0" size={20} />
    <div className="flex-grow min-w-0">
      <dt className="text-xs uppercase tracking-wide font-semibold text-gray-500 mb-1">
        {label}
      </dt>
      <dd className="text-base text-gray-900 break-words">{value || "— Not provided —"}</dd>
    </div>
  </div>
);

// 4️⃣ Member Card — modernized with header gradient, avatar ring, and clean section dividers
const MemberCard = ({ member, membershipType, setMembershipType }) => (
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 transition-shadow duration-300 hover:shadow-xl">
    {/* Header */}
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 md:p-8">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="flex-grow">
          <h2 className="text-2xl font-extrabold text-gray-900 leading-tight">
            {member.firstName} {member.lastName}
          </h2>
          <p className="text-indigo-600 font-medium">{member.email}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <StatusBadge status={member.status} />
            <span className="inline-flex items-center text-xs text-gray-500">
              <FaCalendarAlt className="mr-1" /> Joined{" "}
              {new Date(member.memberShipStartDate).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>

    {/* Details Grid */}
    <div className="border-t border-gray-100">
      <dl className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
        <DetailRow icon={FaEnvelope} label="Email Address" value={member.email} />
        <DetailRow icon={FaPhone} label="Phone Number" value={member.phoneNumber} isBordered />
        <DetailRow icon={FaMapMarkedAlt} label="Full Address" value={member.address} isBordered />

        {/* Membership Status */}
        <div className="flex items-start gap-4 p-5 md:p-6 border-t md:border-l border-gray-100 hover:bg-gray-50 transition">
          <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
          <div className="flex-grow min-w-0">
            <dt className="text-xs uppercase tracking-wide font-semibold text-gray-500 mb-1">
              Membership Status
            </dt>
            <dd><StatusBadge status={member.status} /></dd>
          </div>
        </div>

        {/* Membership Type */}
        <div className="flex items-start gap-4 p-5 md:p-6 border-t md:border-l border-gray-100 hover:bg-gray-50 transition">
          <FaGlobe className="text-indigo-500 mt-1 flex-shrink-0" size={20} />
          <div className="flex-grow min-w-0">
            <dt className="text-xs uppercase tracking-wide font-semibold text-gray-500 mb-1">
              Membership Type
            </dt>
            <dd>
              {member.status === "approved" ? (
                <span className="text-base text-gray-900">{member.memberShipType || "—"}</span>
              ) : member.status === "pending" ? (
                <select
                  value={membershipType}
                  onChange={(e) => setMembershipType(e.target.value)}
                  className="mt-1 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm p-2 outline-gray-300"
                >
                  <option value="">Select Type</option>
                  <option value="Silver Guest">Silver Guest</option>
                  <option value="Gold Traveler">Gold Traveler</option>
                  <option value="Platinum Premier">Platinum Premier</option>
                  <option value="Corporate/Business Elite">Corporate/Business Elite</option>
                </select>
              ) : (
                <span className="text-sm italic text-gray-500">N/A</span>
              )}
            </dd>
          </div>
        </div>

        <DetailRow
          icon={FaCalendarAlt}
          label="Start Date"
          value={new Date(member.memberShipStartDate).toLocaleDateString()}
          isBordered
        />
        <DetailRow
          icon={FaCalendarAlt}
          label="End Date"
          value={
            member.memberShipEndDate
              ? new Date(member.memberShipEndDate).toLocaleDateString()
              : "Lifetime / Ongoing"
          }
          isBordered
        />
      </dl>
    </div>
  </div>
);

// 5️⃣ Action Buttons — modern pill-shaped, better disabled states, loading states (optional), focus rings
const ActionButtons = ({ member, setMember, membershipType }) => {
  const navigate = useNavigate();
  const [loadingAction, setLoadingAction] = useState(null);

  const handleUpdateStatus = async (status) => {
    // No type? Don't even trigger the request
    if (status === "approved" && !membershipType) {
      toast.error("Please select a membership type before approving.");
      return;
    }

    setLoadingAction(status);
    try {
      const updatedMember = await updateMembershipStatus(member._id, status, membershipType);
      setMember(updatedMember);
      toast.success(`✅ Membership ${status.toLowerCase()} successfully!`);
    } catch (error) {
      toast.error(`❌ Failed to ${status} membership. Please try again.`);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete this membership?`)) {
      setLoadingAction("delete");
      try {
        await deleteMembership(member._id);
        toast.success("🗑️ Membership deleted successfully!");
        navigate("/membership-applications");
      } catch (error) {
        toast.error("❌ Failed to delete membership.");
      } finally {
        setLoadingAction(null);
      }
    }
  };

  const isPending = (action) => loadingAction === action;

  return (
    <div className="flex flex-col sm:flex-row justify-end items-stretch gap-3 mt-6">
      {member.status === "pending" && (
        <>
          {/* ✅ Approve disabled until type is chosen */}
          <button
            onClick={() => handleUpdateStatus("approved")}
            disabled={isPending("approved") || !membershipType}
            className={`flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-white shadow transition
              ${
                !membershipType
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
          >
            {isPending("approved") ? (
              "Approving..."
            ) : (
              <>
                <FaCheck /> Approve
              </>
            )}
          </button>

          <button
            onClick={() => handleUpdateStatus("rejected")}
            disabled={isPending("rejected")}
            className="flex items-center justify-center gap-2 rounded-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 px-5 py-3 text-sm font-medium text-white shadow transition"
          >
            {isPending("rejected") ? "Rejecting..." : <><FaTimes /> Reject</>}
          </button>
        </>
      )}

      {member.status === "approved" && (
        <span className="flex items-center justify-center gap-2 rounded-full bg-green-100 px-5 py-3 text-sm font-medium text-green-800 border border-green-200">
          <FaCheck className="text-green-600" /> Approved
        </span>
      )}

      {member.status === "rejected" && (
        <span className="flex items-center justify-center gap-2 rounded-full bg-red-100 px-5 py-3 text-sm font-medium text-red-800 border border-red-200">
          <FaTimes className="text-red-600" /> Rejected
        </span>
      )}

      {/* Delete always available */}
      <button
        onClick={handleDelete}
        disabled={isPending("delete")}
        className="flex items-center justify-center gap-2 rounded-full border border-red-600/50 bg-white hover:bg-red-50 disabled:bg-gray-100 px-5 py-3 text-sm font-medium text-red-600 hover:text-red-700 transition"
      >
        <FaTrash /> {isPending("delete") ? "Deleting..." : "Delete"}
      </button>
    </div>
  );
};

// 6️⃣ Main Page — added container padding, better heading, optional skeleton loader
const MemberDetailsPage = () => {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [membershipType, setMembershipType] = useState(""); // added here
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const memberData = await getMemberById(id);
        setMember(memberData);
        if (memberData.memberShipType) {
          setMembershipType(memberData.memberShipType);
        }
      } catch (err) {
        setError(err.message || "Failed to load member details.");
      } finally {
        setLoading(false);
      }
    };
    fetchMember();
  }, [id]);

  if (loading) return <div>Loading…</div>;
  if (error) return <div>Error: {error}</div>;
  if (!member) return <div>Member not found</div>;

  return (
    <main className="container mx-auto p-4 sm:p-6 lg:p-8">
      <BackLink />
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-extrabold mb-2">Membership Details</h1>
        <p className="text-gray-600 mb-8">Review and manage member information.</p>
        <MemberCard member={member} membershipType={membershipType} setMembershipType={setMembershipType} />
        <ActionButtons member={member} setMember={setMember} membershipType={membershipType} />
      </div>
    </main>
  );
};

export default MemberDetailsPage;