import React, { useEffect, useState, useContext } from "react";
import { toast } from "react-toastify";
import { FaPlus, FaEdit, FaTrash, FaSpinner } from "react-icons/fa";
import AddFacilityModal from "../components/Facility Management/AddFacilityModal";
import EditFacilityModal from "../components/Facility Management/EditFacilityModal";
import { getFacilities, addFacility, updateFacility, deleteFacility } from "../services/facilities";
import { AdminContext } from "@/context/AdminContext";

export default function FacilityManagement() {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState(null);

  const { getToken, checkTokenAndRedirect } = useContext(AdminContext);
  const token = getToken();

  useEffect(() => {
    checkTokenAndRedirect();
    const fetchFacilities = async () => {
      try {
        const data = await getFacilities(token);
        setFacilities(data);
      } catch (err) {
        console.error(err);
        setError(err?.response?.status === 401 ? "Unauthorized. Please log in again." : "Failed to fetch facilities");
      } finally {
        setLoading(false);
      }
    };
    fetchFacilities();
  }, [token, checkTokenAndRedirect]);

  // CRUD Handlers
  const handleAddFacility = async (formData) => {
    try {
      await addFacility(formData, token);
      const updatedFacilities = await getFacilities(token);
      setFacilities(updatedFacilities);
      setIsAddOpen(false);
      toast.success("Facility added successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Error adding facility");
    }
  };

  const handleUpdateFacility = async (id, formData) => {
    try {
      const updated = await updateFacility(id, formData, token);
      setFacilities((prev) =>
        prev.map((facility) => (facility._id === id ? updated : facility))
      );
      setIsEditOpen(false);
      setSelectedFacility(null);
      toast.success("Facility updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Error updating facility");
    }
  };

  const handleDeleteFacility = async (id) => {
    if (!confirm("Are you sure you want to delete this facility?")) return;
    try {
      await deleteFacility(id, token);
      setFacilities((prev) => prev.filter((facility) => facility._id !== id));
      toast.success("Facility deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Error deleting facility");
    }
  };

  // Loading & Error States
  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-[#2c5e6e]" />
      </div>
    );
  }

  if (error) {
    return <div className="p-8 text-red-600 font-medium">{error}</div>;
  }

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold tracking-wide">Our Facilities</h1>
        <button
          onClick={() => setIsAddOpen(true)}
          className="bg-[#2c5e6e] text-white px-6 py-3 rounded-lg hover:bg-[#244c58] flex items-center gap-2 shadow"
        >
          <FaPlus /> Add Facility
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {facilities.map((facility) => (
          <div
            key={facility._id}
            className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transform transition flex flex-col overflow-hidden"
          >
            {/* Image */}
            {facility.image ? (
              <img
                src={facility.image}
                alt={facility.title}
                className="w-full h-56 object-cover"
              />
            ) : (
              <div className="w-full h-56 flex items-center justify-center bg-gray-100 text-gray-400">
                📷 No Image
              </div>
            )}

            {/* Content */}
            <div className="flex-1 p-5 text-center">
              <h3 className="text-xl font-semibold text-gray-800">{facility.title}</h3>
              {facility.subtitle && (
                <p className="text-sm text-gray-500">{facility.subtitle}</p>
              )}
              <p className="text-gray-600 text-sm mt-3">{facility.description}</p>
            </div>

            {/* Actions */}
            <div className="flex justify-center gap-4 p-4 border-t">
              <button
                onClick={() => {
                  setSelectedFacility(facility);
                  setIsEditOpen(true);
                }}
                className="px-4 py-2 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition flex items-center gap-2 text-sm font-medium"
              >
                <FaEdit /> Edit
              </button>
              <button
                onClick={() => handleDeleteFacility(facility._id)}
                className="px-4 py-2 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition flex items-center gap-2 text-sm font-medium"
              >
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {facilities.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No facilities found. Add your first facility to get started.
        </div>
      )}

      {/* Modals */}
      <AddFacilityModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSave={handleAddFacility}
      />

      {selectedFacility && (
        <EditFacilityModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          onSave={(formData) => handleUpdateFacility(selectedFacility._id, formData)}
          facility={selectedFacility}
        />
      )}
    </div>
  );
}