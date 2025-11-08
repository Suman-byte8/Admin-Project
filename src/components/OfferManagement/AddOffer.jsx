import React, { useState, useRef } from "react";
import { X, Upload, Trash2 } from "lucide-react";

const AddOffer = ({ offer = {}, onSave, onCancel, onDelete }) => {
  const [form, setForm] = useState({
    title: offer.title || "",
    description: offer.description || "",
    path: offer.path || "",
    details: offer.details?.length ? offer.details : [""],
    image: null,
  });
  const [preview, setPreview] = useState(offer.imageUrl || null);
  const fileInputRef = useRef(null);

  const handleChange = (e, field) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleDetailChange = (idx, value) => {
    const newDetails = [...form.details];
    newDetails[idx] = value;
    setForm({ ...form, details: newDetails });
  };

  const removeDetail = (idx) => {
    const newDetails = form.details.filter((_, i) => i !== idx);
    setForm({ ...form, details: newDetails });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
      setForm({ ...form, image: file });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === "details") {
        fd.append(key, JSON.stringify(value));
      } else if (value) {
        fd.append(key, value);
      }
    });
    onSave(fd);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
      {/* Background Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      ></div>

      {/* Modal */}
      <div className={`relative bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[95vh] flex flex-col overflow-hidden z-10 animate-fadeIn ${form.loading ? 'relative' : ''}`}>
        {form.loading && (
          <div className="absolute inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-20 rounded-xl">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
              <p>Saving...</p>
            </div>
          </div>
        )}
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">
            {offer._id ? "Edit Offer" : "Add New Offer"}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={22} className="text-gray-600" />
          </button>
        </div>

        {/* Form Content */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-6 py-4 space-y-5"
        >
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Offer Title
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleChange(e, "title")}
              placeholder="E.g., Summer Special Discount"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#2c5e6e] focus:outline-none"
              required
            />
          </div>

          {/* Path */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Offer URL Path
            </label>
            <input
              type="text"
              value={form.path}
              onChange={(e) => handleChange(e, "path")}
              placeholder="/special-offer"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#2c5e6e] focus:outline-none"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Short Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange(e, "description")}
              placeholder="Brief description of the offer..."
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#2c5e6e] focus:outline-none"
              required
            ></textarea>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Offer Banner Image
            </label>
            <div
              className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:border-[#2c5e6e] transition cursor-pointer"
              onClick={() => fileInputRef.current.click()}
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="rounded-lg max-h-48 object-cover mb-3"
                  loading="lazy"
                  width="400"
                  height="192"
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
          </div>

          {/* Details Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Offer Details
            </label>
            <div className="space-y-2">
              {form.details.map((detail, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={detail}
                    onChange={(e) => handleDetailChange(idx, e.target.value)}
                    placeholder={`Detail ${idx + 1}`}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#2c5e6e] focus:outline-none"
                  />
                  {form.details.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDetail(idx)}
                      className="p-2 bg-red-50 hover:bg-red-100 rounded-lg transition"
                    >
                      <Trash2 size={18} className="text-red-600" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() =>
                setForm({ ...form, details: [...form.details, ""] })
              }
              className="text-[#2c5e6e] text-sm font-medium mt-2 hover:underline"
            >
              + Add Detail
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          {offer._id && onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
            >
              Delete
            </button>
          )}
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg bg-[#2c5e6e] text-white hover:bg-[#234752] shadow-sm transition"
          >
            Save Offer
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddOffer;