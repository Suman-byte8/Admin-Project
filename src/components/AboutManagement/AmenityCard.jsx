import React, { useState, useContext } from "react";
import { aboutApi } from "../../services/aboutApi";
import { AdminContext } from "@/context/AdminContext";
import { Pencil, Trash2, Save, X } from "lucide-react";

const AmenityCard = ({ _id, title, imageUrl, alt, description, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState(description);
  const [isLoading, setIsLoading] = useState(false);

  const { getToken } = useContext(AdminContext);
  const token = getToken();

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this amenity?")) {
      setIsLoading(true);
      try {
        await aboutApi.deleteAmenity(_id, token);
        onDelete(_id);
      } catch (error) {
        alert("Failed to delete amenity");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      await aboutApi.updateAmenity(_id, { description: editedDescription }, token);
      onUpdate(_id, { description: editedDescription });
      setIsEditing(false);
    } catch (error) {
      alert("Failed to update amenity");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
<div className="bg-white border border-gray-200 p-4 rounded-xl hover:shadow-lg hover:-translate-y-1 transition transform relative">
  <div className="absolute top-3 right-3 flex gap-2">
    <button onClick={() => setIsEditing(!isEditing)} className="px-2 py-1 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 text-xs">
      {isEditing ? "Cancel" : "Edit"}
    </button>
    <button onClick={handleDelete} className="px-2 py-1 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 text-xs">
      Delete
    </button>
  </div>
  
  <h3 className="font-semibold text-xl text-gray-800 mb-3 mt-2">{title}</h3>
  
  <div className="mb-4">
    {imageUrl ? (
      <img src={imageUrl} alt={alt} className="w-full h-40 object-cover rounded-md" />
    ) : (
      <div className="w-full h-40 bg-gray-100 flex items-center justify-center text-gray-400">📷 No Image</div>
    )}
  </div>
  
  {isEditing ? (
    <div>
      <textarea
        value={editedDescription}
        onChange={(e) => setEditedDescription(e.target.value)}
        rows="3"
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
      />
      <div className="flex gap-2 mt-2">
        <button onClick={handleUpdate} className="flex-1 bg-green-600 text-white rounded-md py-1 hover:bg-green-700 text-sm">
          {isLoading ? "Saving..." : "Save"}
        </button>
        <button onClick={handleCancelEdit} className="flex-1 bg-gray-400 text-white rounded-md py-1 hover:bg-gray-500 text-sm">
          Cancel
        </button>
      </div>
    </div>
  ) : (
    <p className="bg-gray-50 p-3 rounded text-sm text-gray-700">{description}</p>
  )}
</div>
  );
};

export default AmenityCard;