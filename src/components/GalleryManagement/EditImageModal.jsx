import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { AdminContext } from "@/context/AdminContext";
import { updateGalleryImage } from "@/services/galleryApi";

const EditImageModal = ({ isOpen, onClose, onUpdateSuccess, image, activeTab }) => {
  const [imageFile, setImageFile] = useState(null);
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [tab, setTab] = useState(activeTab || "Rooms");
  const [error, setError] = useState("");

  const { getToken } = useContext(AdminContext);
  const token = getToken();

  useEffect(() => {
    if (image) {
      setTitle(image.title || "");
      setCaption(image.caption || "");
      setTab(image.tab || activeTab || "Rooms");
    }
  }, [image, activeTab]);

  if (!isOpen || !image) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 10 * 1024 * 1024) {
      toast.error("Image should be less than 10MB");
      setImageFile(null);
    } else {
      setImageFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const formData = new FormData();
    if (imageFile) formData.append("image", imageFile);
    formData.append("title", title);
    formData.append("caption", caption);
    formData.append("tab", tab);

    try {
      const data = await updateGalleryImage(image._id, formData, token);
      onUpdateSuccess(data);
      onClose();
      setImageFile(null);
      setTitle("");
      setCaption("");
      toast.success("Image updated successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update image");
      toast.error(err.response?.data?.message || "Failed to update image");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 px-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col animate-fadeIn">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Edit Image</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Scrollable Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {error && <p className="text-red-600 text-sm">{error}</p>}

          {/* Current Image */}
          <div>
            <p className="text-sm text-gray-600 mb-1">Current Image</p>
            <img
              src={image.url}
              alt={image.title || "Gallery Image"}
              className="w-full rounded-lg border border-gray-200 object-cover max-h-52"
            />
          </div>

          {/* Update File */}
          <div>
            <label className="block text-sm font-medium mb-1">
              New Image File (Optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Leave empty to keep current image
            </p>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Update image title"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Caption */}
          <div>
            <label className="block text-sm font-medium mb-1">Caption</label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Update image caption"
              rows="3"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Tab Dropdown */}
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              value={tab}
              onChange={(e) => setTab(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="Rooms">Rooms</option>
              <option value="Restaurant">Restaurant</option>
              <option value="Hotel Overview">Hotel Overview</option>
              <option value="Party Room">Party Room</option>
              <option value="Bar">Bar</option>
            </select>
          </div>
        </form>

        {/* Sticky Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition"
          >
            Update Image
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditImageModal;