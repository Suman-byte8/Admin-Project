import React, { useState, useContext, useEffect, useRef } from "react";
import { X, Upload } from "lucide-react";
import { addFacility } from "@/services/facilities";
import { AdminContext } from "@/context/AdminContext";
import { validateWordCount } from "../../utils/validation";

export default function AddFacilityModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [descriptionError, setDescriptionError] = useState("");
  const fileInputRef = useRef(null);

  const { getToken } = useContext(AdminContext);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({ title: "", subtitle: "", description: "" });
      setImage(null);
      setPreview(null);
      setErrors({});
      setDescriptionError("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      description: value,
    }));

    const validation = validateWordCount(value, 60, 80);
    if (!validation.isValid) {
      setDescriptionError(validation.message);
    } else {
      setDescriptionError("");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 10 * 1024 * 1024) {
      setErrors({ image: "Image must be less than 10MB" });
      return;
    }
    setImage(file);
    setPreview(file ? URL.createObjectURL(file) : null);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Validate description
    const validation = validateWordCount(formData.description, 60, 80);
    if (!validation.isValid) {
      setDescriptionError(validation.message);
      return;
    }

    const submitData = new FormData();
    submitData.append("title", formData.title);
    submitData.append("subtitle", formData.subtitle);
    submitData.append("description", formData.description);
    submitData.append("path", "/default-path"); // backend-safe defaults
    submitData.append("order", "0");
    submitData.append("isActive", "true");
    if (image) submitData.append("image", image);

    try {
      const token = getToken();
      const newFacility = await addFacility(submitData, token);
      if (onSave) onSave(newFacility);
      onClose();
    } catch (error) {
      console.error("Error adding facility:", error);
      setErrors({ submit: "Error adding facility. Please try again." });
    }
  };

  const wordCount = formData.description.trim().split(/\s+/).filter(word => word.length > 0).length;
  const isWordCountValid = wordCount >= 60 && wordCount <= 80;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className={`relative bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[95vh] flex flex-col overflow-hidden z-10 animate-fadeIn ${loading ? 'relative' : ''}`}>
        {loading && (
          <div className="absolute inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-20 rounded-xl">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
              <p>Saving...</p>
            </div>
          </div>
        )}
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">
            Add New Facility
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={22} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-6 py-4 space-y-4"
        >
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter facility title"
            />
            {errors.title && (
              <p className="text-xs text-red-600 mt-1">{errors.title}</p>
            )}
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subtitle
            </label>
            <input
              type="text"
              name="subtitle"
              value={formData.subtitle}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter subtitle (optional)"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (60-80 words) *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleDescriptionChange}
              rows="4"
              className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none ${
                descriptionError ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter facility description"
            />
            <div className="flex justify-between items-center mt-1">
              <span className={`text-sm ${isWordCountValid ? 'text-gray-500' : 'text-red-500'}`}>
                {wordCount}/60-80 words
              </span>
              {descriptionError && <span className="text-sm text-red-500">{descriptionError}</span>}
            </div>
            {errors.description && (
              <p className="text-xs text-red-600 mt-1">{errors.description}</p>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Facility Image
            </label>
            <div
              className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:border-blue-500 transition cursor-pointer"
              onClick={() => fileInputRef.current.click()}
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="rounded-lg max-h-48 object-cover mb-3"
                />
              ) : (
                <div className="flex flex-col items-center">
                  <Upload size={32} className="text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 font-medium">
                    Click to upload image
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    PNG, JPG, JPEG up to 10MB
                  </p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
            {errors.image && (
              <p className="text-xs text-red-600 mt-1">{errors.image}</p>
            )}
          </div>

          {errors.submit && (
            <p className="text-sm text-red-600">{errors.submit}</p>
          )}
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
            disabled={!isWordCountValid || wordCount === 0}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Add Facility
          </button>
        </div>
      </div>
    </div>
  );
}
