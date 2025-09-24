import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { addGalleryImages } from "@/services/galleryApi";

const AddImageModal = ({ isOpen, onClose, onAddSuccess, activeTab }) => {
  const [imageFiles, setImageFiles] = useState([]);
  const [tab, setTab] = useState(activeTab || "Rooms");
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setTab(activeTab || "Rooms");
  }, [activeTab]);

  if (!isOpen) return null;

  // Handle file input / drag-drop
  const handleFileChange = (files) => {
    const fileList = Array.from(files);
    const oversized = fileList.find((file) => file.size > 10 * 1024 * 1024);
    if (oversized) {
      toast.error("Each image should be less than 10MB");
      setImageFiles([]);
    } else {
      setImageFiles(fileList);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFileChange(e.dataTransfer.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (imageFiles.length === 0) {
      toast.error("Please select at least one image file");
      return;
    }

    const formData = new FormData();
    imageFiles.forEach((file) => formData.append("images", file));
    formData.append("tab", tab);
    if (title.trim() !== "") formData.append("title", title.trim());
    if (caption.trim() !== "") formData.append("caption", caption.trim());

    try {
      const response = await addGalleryImages(formData);
      onAddSuccess(response);
      onClose();
      setImageFiles([]);
      setTab(activeTab || "Rooms");
      setTitle("");
      setCaption("");
      toast.success("Image(s) added successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add images");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 px-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fadeIn">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Add New Images</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          {error && <p className="text-red-600 text-sm">{error}</p>}

          {/* File Upload */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400"
          >
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleFileChange(e.target.files)}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              📂 <span className="font-medium text-blue-600">Click to upload</span> 
              or drag & drop
            </label>
            <p className="text-xs text-gray-500 mt-2">Max size: 10MB per file</p>
          </div>

          {/* Selected Files Preview */}
          {imageFiles.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-3 max-h-28 overflow-y-auto border border-gray-200">
              <strong className="text-sm text-gray-600 block mb-1">Selected Files:</strong>
              <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
                {imageFiles.map((file, idx) => (
                  <li key={idx}>{file.name}</li>
                ))}
              </ul>
            </div>
          )}

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

          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1">Title (Optional)</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter image title"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Caption */}
          <div>
            <label className="block text-sm font-medium mb-1">Caption (Optional)</label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Enter image caption"
              rows="3"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </form>

        {/* Footer */}
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
            Add Images
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddImageModal;