import React, { useState, useContext } from "react";
import { aboutApi } from "../../services/aboutApi";
import { AdminContext } from "@/context/AdminContext";

const ContentBlock = ({
  _id,
  title,
  imageUrl,
  alt,
  description,
  descriptionLabel,
  rows,
  onDelete,
  onUpdate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState(description);
  const [editedImage, setEditedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { getToken } = useContext(AdminContext);
  const token = getToken();

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this content block?")) {
      setIsLoading(true);
      try {
        await aboutApi.deleteContentBlock(_id, token);
        onDelete(_id);
      } catch (error) {
        console.error("Error deleting content block:", error);
        alert("Failed to delete content block");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("description", editedDescription);
      if (editedImage) {
        formData.append("image", editedImage);
      }
      await aboutApi.updateContentBlock(_id, formData, token);
      setIsEditing(false);
      onUpdate(_id, { description: editedDescription });
    } catch (error) {
      console.error("Error updating content block:", error);
      alert("Failed to update content block");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setEditedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleCancelEdit = () => {
    setEditedDescription(description);
    setEditedImage(null);
    setImagePreview(null);
    setIsEditing(false);
  };

  return (
    <div className="border border-gray-300 p-4 rounded-lg relative">
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
          <div className="mt-1 flex items-center">
            {imagePreview ? (
              <img
                alt="Preview"
                className="w-40 h-20 object-cover rounded-md mr-4"
                src={imagePreview}
              />
            ) : imageUrl ? (
              <img
                alt={alt}
                className="w-40 h-20 object-cover rounded-md mr-4"
                src={imageUrl}
              />
            ) : (
              <div className="w-40 h-20 bg-gray-100 flex items-center justify-center text-gray-400">📷 No Image</div>
            )}
            {isEditing ? (
              <input
                className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                type="file"
                onChange={handleImageChange}
              />
            ) : null}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">
            {descriptionLabel}
          </label>
          {isEditing ? (
            <>
              <textarea
                className="w-full mt-1 p-2 border border-gray-300 rounded-md outline-0"
                rows={rows}
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
              />
              <div className="flex gap-2 mt-2">
                <button onClick={handleUpdate} className="flex-1 bg-green-600 text-white rounded-md py-1 hover:bg-green-700 text-sm">
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

export default ContentBlock;