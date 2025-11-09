// src/pages/PageManagement/DistinctiveSection.jsx
import React, { useState, useContext } from "react";
import { FiTrash2 } from "react-icons/fi";
import { FaRegEye, FaSync } from "react-icons/fa";
import imageCompression from "browser-image-compression";
import { addDistinctive } from "@/services/distinctive";
import { Link } from "react-router-dom";
import { AdminContext } from "@/context/AdminContext";
import { toast } from "react-toastify";
import { validateWordCount } from "../../utils/validation";

const DistinctiveSection = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]); // Files to upload
  const [previews, setPreviews] = useState([]); // Local preview URLs
  const [descriptionError, setDescriptionError] = useState("");

  const { getToken } = useContext(AdminContext);
  const token = getToken();

  const handleFileChange = async (e) => {
    const selected = Array.from(e.target.files || []);
    if (!selected.length) return;

    try {
      const compressed = await Promise.all(
        selected.map((file) =>
          imageCompression(file, {
            maxSizeMB: 2,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
          })
        )
      );

      const asFiles = compressed.map(
        (blob, i) => new File([blob], selected[i].name, { type: blob.type })
      );

      setFiles((prev) => [...prev, ...asFiles]);
      setPreviews((prev) => [...prev, ...asFiles.map((f) => URL.createObjectURL(f))]);
    } catch (err) {
      console.error("Failed to compress:", err);
    }
  };

  const handleRemoveImage = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    setDescription(value);

    const validation = validateWordCount(value, 40, 50);
    if (!validation.isValid) {
      setDescriptionError(validation.message);
    } else {
      setDescriptionError("");
    }
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();

    // Validate description
    const validation = validateWordCount(description, 40, 50);
    if (!validation.isValid) {
      setDescriptionError(validation.message);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    files.forEach((file) => formData.append("images", file));

    try {
      await addDistinctive(formData, token);
      setTitle("");
      setDescription("");
      setFiles([]);
      setPreviews([]);
      setDescriptionError("");
      toast.success("Distinctive section saved successfully");
    } catch (error) {
      console.error("Failed to save distinctive section:", error?.response?.data || error);
      toast.error("Failed to save distinctive section");
    }
  };

  const wordCount = description.trim().split(/\s+/).filter(word => word.length > 0).length;
  const isWordCountValid = wordCount >= 40 && wordCount <= 50;

  return (
    <form onSubmit={handleSaveChanges}>
      <div className="bg-white rounded-2xl shadow p-6 mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium text-gray-700">Distinctive & Description</h2>
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-3 py-1.5 rounded-lg shadow hover:bg-blue-700 flex items-center gap-2 text-sm font-medium"
            >
              <FaSync className="text-xs" /> Refresh
            </button>
            <Link
              to="/page-management/distinctive-preview"
              className="flex items-center gap-2 text-blue-500 cursor-pointer"
            >
              <FaRegEye /> Preview
            </Link>
          </div>
        </div>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter title..."
          className="w-full border rounded-full px-4 py-2 mb-4 focus:ring-1 focus:ring-gray-300 outline-none"
        />

        <div>
          <textarea
            rows="3"
            placeholder="Enter description (40-50 words)..."
            className={`w-full border rounded-lg px-4 py-2 focus:ring-1 focus:ring-gray-300 outline-none resize-none ${
              descriptionError ? 'border-red-500' : ''
            }`}
            value={description}
            onChange={handleDescriptionChange}
          />
          <div className="flex justify-between items-center mt-1">
            <span className={`text-sm ${isWordCountValid ? 'text-gray-500' : 'text-red-500'}`}>
              {wordCount}/40-50 words
            </span>
            {descriptionError && <span className="text-sm text-red-500">{descriptionError}</span>}
          </div>
        </div>
      </div>

      {/* Upload Images */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-medium text-gray-700 mb-4">Upload Images</h2>

        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
          <input
            id="fileUpload"
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <label htmlFor="fileUpload" className="cursor-pointer block">
            {previews.length ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {previews.map((src, i) => (
                  <div key={i} className="relative group">
                    <img
                      src={src}
                      alt={`preview-${i}`}
                      className="w-full h-32 object-cover rounded-xl border"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(i)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500">
                <span className="text-blue-500">Upload files</span> or Drag and Drop
                <p className="text-xs mt-1">PNG, JPG, GIF up to 10MB</p>
              </div>
            )}
          </label>
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end mt-6">
        <button
          type="submit"
          disabled={!isWordCountValid}
          className="bg-[#2c5e6e] text-white px-5 py-2 rounded-full disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Save Distinctive Section Changes
        </button>
      </div>
    </form>
  );
};

export default DistinctiveSection;
