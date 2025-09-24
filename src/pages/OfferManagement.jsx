import React, { useEffect, useState, useContext } from "react";
import { toast } from "react-toastify";
import OfferCard from "../components/OfferManagement/OfferCard";
import EditOffer from "../components/OfferManagement/EditOffer";
import { getOffers, updateOffer, deleteOffer } from "../services/offers";
import { Link } from "react-router-dom";
import { AdminContext } from "@/context/AdminContext";

const OfferManagement = () => {
  const [offers, setOffers] = useState([]);
  const [editingOffer, setEditingOffer] = useState(null);

  const { getToken, checkTokenAndRedirect } = useContext(AdminContext);
  const token = getToken();
  
  // Fetch offers on mount
  useEffect(() => {
    checkTokenAndRedirect();
    (async () => {
      const data = await getOffers(token);
      setOffers(data);
      console.log("Fetched offers:", data);
    })();
  }, [token, checkTokenAndRedirect]);

  // Save updates
  const handleUpdate = async (id, formData,token) => {
    try {
      const updated = await updateOffer(id, formData,token);
      setOffers((prev) => prev.map((o) => (o._id === id ? updated : o)));
      setEditingOffer(null);
      toast.success("Offer updated successfully!");
    } catch (err) {
      toast.error("Failed to update offer");
    }
  };

  // Delete offer
  const handleDelete = async (id,token) => {
    try {
      await deleteOffer(id,token);
      setOffers((prev) => prev.filter((o) => o._id !== id));
      toast.success("Offer deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete offer");
    }
  };

  const handleOfferChange = (e, field) => {
    setEditingOffer(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleDetailChange = (newDetails) => {
    setEditingOffer(prev => ({
      ...prev,
      details: newDetails
    }));
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Offers</h1>
          <p className="text-gray-600 mt-2">Current Offers</p>
        </div>
        <Link
          to="/offer-management/add-offer"
          className="bg-[#2c5e6e] text-white px-5 py-2 rounded-full hover:bg-[#244c58] transition"
        >
          + Add Offer
        </Link>
      </div>

  {editingOffer && (
    <EditOffer
      offer={editingOffer}
      onChange={handleOfferChange}
      onDetailChange={handleDetailChange}
      onSave={() => handleUpdate(editingOffer._id, editingOffer, token)}
      onCancel={() => setEditingOffer(null)}
      onDelete={() => handleDelete(editingOffer._id, token)}
    />
  )}

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {offers.map((offer) => (
          <OfferCard
            key={offer._id}
            offer={offer}
            onEdit={() => setEditingOffer(offer)}
            onDelete={() => handleDelete(offer._id, token)}
          />
        ))}
      </div>
    </div>
  );
};

export default OfferManagement;
