import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { addGalleryImages } from "@/services/galleryApi";
import { AdminContext } from "../../context/AdminContext";
import { compressImages, shouldCompress } from "../../utils/imageCompression";

const AddImageModal = ({ isOpen, onClose, onAddSuccess, activeTab }) => {
  const { getToken } = useContext(AdminContext);
  const [imageFiles, setImageFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [tab, setTab] = useState(activeTab || "Rooms");
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTab(activeTab || "Rooms");
  }, [activeTab]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setImageFiles([]);
      setPreviewUrls([]);
      setTab(activeTab || "Rooms");
      setTitle("");
      setCaption("");
    }
  }, [isOpen, activeTab]);

  // Clean up preview URLs
  useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  if (!isOpen) return null;

  // Handle file input / drag-drop
  const handleFileChange = (files) => {
    const fileList = Array.from(files);
    const oversized = fileList.find((file) => file.size > 10 * 1024 * 1024);
    if (oversized) {
      toast.error("Each image should be less than 10MB");
      setImageFiles([]);
      setPreviewUrls([]);
    } else {
      setImageFiles(fileList);
      // Create preview URLs
      const urls = fileList.map(file => URL.createObjectURL(file));
      setPreviewUrls(urls);
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

    setLoading(true);

    try {
      // Compress images that need compression
      const filesToCompress = imageFiles.filter(shouldCompress);
      const uncompressedFiles = imageFiles.filter(file => !shouldCompress(file));

      let processedFiles = [...uncompressedFiles];

      if (filesToCompress.length > 0) {
        toast.info("Compressing images...");
        const compressedFiles = await compressImages(filesToCompress);
        processedFiles = [...processedFiles, ...compressedFiles];
      }

      const formData = new FormData();
      processedFiles.forEach((file) => formData.append("images", file));
      formData.append("tab", tab);
      if (title.trim() !== "") formData.append("title", title.trim());
      if (caption.trim() !== "") formData.append("caption", caption.trim());

      const token = getToken();
      if (!token) {
        toast.error("Authentication token missing");
        return;
      }
      const response = await addGalleryImages(formData, token);
      onAddSuccess(response);
      onClose();
      setImageFiles([]);
      setTab(activeTab || "Rooms");
      setTitle("");
      setCaption("");
      toast.success("Image(s) added successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add images");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 px-4">
      <div className={`bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fadeIn ${loading ? 'relative' : ''}`}>
        {loading && (
          <div className="absolute inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-20 rounded-xl">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
              <p>Adding...</p>
            </div>
          </div>
        )}
        
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
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <strong className="text-sm text-gray-600 block mb-2">Selected Images:</strong>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                {imageFiles.map((file, idx) => (
                  <div key={idx} className="relative">
                    <img
                      src={previewUrls[idx]}
                      alt={`Preview ${idx + 1}`}
                      className="w-full h-20 object-cover rounded-lg border border-gray-300"
                      loading="lazy"
                      width="80"
                      height="80"
                    />
                    <p className="text-xs text-gray-500 mt-1 truncate">{file.name}</p>
                  </div>
                ))}
              </div>
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