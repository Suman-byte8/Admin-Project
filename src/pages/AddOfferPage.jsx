import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AddOffer from "../components/OfferManagement/AddOffer";
import { addOffer } from "../services/offers";
import { AdminContext } from "@/context/AdminContext";

const AddOfferPage = () => {
  const navigate = useNavigate();
  const { getToken } = useContext(AdminContext);
  const token = getToken();

  const handleSave = async (formData) => {
    try {
      await addOffer(formData, token);
      navigate("/offer-management"); // Navigate back to offer management after saving
    } catch (error) {
      console.error("Error adding offer:", error);
    }
  };

  const handleCancel = () => {
    navigate("/offer-management"); // Navigate back to offer management on cancel
  };

  return (
    <div className="p-8">
      <AddOffer
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default AddOfferPage;
