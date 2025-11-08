import React, { useState, useContext } from "react";
import { aboutApi } from "../../services/aboutApi";
import { AdminContext } from "@/context/AdminContext";
import { validateWordCount } from "../../utils/validation";

const ServiceCard = ({ _id, title, imageUrl, alt, description, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState(description);
  const [editedImage, setEditedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [descriptionError, setDescriptionError] = useState("");

  const { getToken } = useContext(AdminContext);
  const token = getToken();

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      setIsLoading(true);
      try {
        await aboutApi.deleteService(_id, token);
        onDelete(_id);
      } catch (error) {
        console.error("Error deleting service:", error);
        alert("Failed to delete service");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDescriptionChange = (value) => {
    setEditedDescription(value);

    const validation = validateWordCount(value, 1, 25);
    if (!validation.isValid) {
      setDescriptionError(validation.message);
    } else {
      setDescriptionError("");
    }
  };

  const handleUpdate = async () => {
    // Validate description
    const validation = validateWordCount(editedDescription, 1, 25);
    if (!validation.isValid) {
      setDescriptionError(validation.message);
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("description", editedDescription);
      if (editedImage) {
        formData.append("image", editedImage);
      }
      await aboutApi.updateService(_id, formData, token);
      setIsEditing(false);
      onUpdate(_id, { description: editedDescription, image: editedImage ? imagePreview : imageUrl });
    } catch (error) {
      console.error("Error updating service:", error);
      alert("Failed to update service");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedDescription(description);
    setEditedImage(null);
    setImagePreview(null);
    setIsEditing(false);
    setDescriptionError("");
  };

  const wordCount = editedDescription.trim().split(/\s+/).filter(word => word.length > 0).length;
  const isWordCountValid = wordCount <= 25;

  return (
    <div className="border p-4 rounded-lg border-gray-300 relative">
      <div className="absolute top-3 right-3 flex gap-2">
        <button onClick={() => setIsEditing(!isEditing)} className="px-2 py-1 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 text-xs">
          {isEditing ? "Cancel" : "Edit"}
        </button>
        <button onClick={handleDelete} className="px-2 py-1 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 text-xs">
          Delete
        </button>
      </div>

      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600">Image</label>
          <div className="mt-1 flex items-center flex-col">
            {imagePreview ? (
              <img
                alt={alt}
                className="w-full h-32 object-cover rounded-md mb-2"
                src={imagePreview}
              />
            ) : imageUrl ? (
              <img
                alt={alt}
                className="w-full h-32 object-cover rounded-md mb-2"
                src={imageUrl}
              />
            ) : (
              <div className="w-full h-32 bg-gray-100 flex items-center justify-center text-gray-400">📷 No Image</div>
            )}
            {isEditing && (
              <input
                onChange={handleImageChange}
                className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                type="file"
                accept="image/*"
              />
            )}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Description (Max 25 words)
          </label>
          {isEditing ? (
            <>
              <textarea
                className={`w-full mt-1 p-2 border rounded-md outline-0 resize-none ${
                  descriptionError ? 'border-red-500' : 'border-gray-300'
                }`}
                rows="3"
                value={editedDescription}
                onChange={(e) => handleDescriptionChange(e.target.value)}
              />
              <div className="flex justify-between items-center mt-1 mb-2">
                <span className={`text-sm ${isWordCountValid ? 'text-gray-500' : 'text-red-500'}`}>
                  {wordCount}/25 words
                </span>
                {descriptionError && <span className="text-sm text-red-500">{descriptionError}</span>}
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleUpdate}
                  disabled={!isWordCountValid || wordCount === 0}
                  className="flex-1 bg-green-600 text-white rounded-md py-1 hover:bg-green-700 text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Saving..." : "Save"}
                </button>
                <button onClick={handleCancelEdit} className="flex-1 bg-gray-400 text-white rounded-md py-1 hover:bg-gray-500 text-sm">
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <p className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-gray-50">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
