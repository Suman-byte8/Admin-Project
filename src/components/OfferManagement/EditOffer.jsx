import React, { useRef, useState } from "react";
import { X, Upload, Edit3 } from "lucide-react";

const EditOffer = ({
  offer,
  onChange,
  onDetailChange,
  onSave,
  onCancel,
  onDelete,
}) => {
  const [preview, setPreview] = useState(offer?.image || null);
  const fileInputRef = useRef(null);

  if (!offer) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file); 
      onChange({ target: { value: file } }, "image");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Background Blur */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
        onClick={onCancel}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto z-10 animate-in fade-in-90 slide-in-from-bottom-10">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Edit Offer</h1>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            aria-label="Close modal"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSave();
            }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Left Inputs */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={offer.title}
                  onChange={(e) => onChange(e, "title")}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#2c5e6e] focus:border-transparent transition-all duration-200"
                  placeholder="Enter offer title"
                  required
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subtitle *
                </label>
                <input
                  type="text"
                  value={offer.description}
                  onChange={(e) => onChange(e, "description")}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#2c5e6e] focus:border-transparent transition-all duration-200"
                  placeholder="Enter offer subtitle"
                  required
                />
              </div>

              {/* Details */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Offer Details
                </label>
                <div className="space-y-3">
                  {(offer.details || []).map((detail, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={detail}
                        onChange={(e) => {
                          // Update the specific detail and pass the entire array
                          const newDetails = [...(offer.details || [])];
                          newDetails[idx] = e.target.value;
                          onDetailChange(newDetails);
                        }}
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#2c5e6e] focus:border-transparent transition-all duration-200"
                        placeholder={`Detail ${idx + 1}`}
                      />
                      {(offer.details || []).length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            // Remove the specific detail section completely
                            const newDetails = [...(offer.details || [])];
                            newDetails.splice(idx, 1);
                            // Update all details with the removed section
                            onDetailChange(newDetails);
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      // Add a new empty detail to the array
                      const newDetails = [...(offer.details || []), ""];
                      onDetailChange(newDetails);
                    }}
                    className="flex items-center gap-2 text-[#2c5e6e] text-sm font-medium hover:text-[#244c58] transition-colors duration-200"
                  >
                    <span>+</span>
                    Add another detail
                  </button>
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Offer Image
              </label>
              <div
                className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:border-[#2c5e6e] transition-all duration-200 cursor-pointer group"
                onClick={() => fileInputRef.current.click()}
              >
                {preview ? (
                  <div className="relative">
                    <img
                      src={preview}
                      alt="Preview"
                      className="rounded-lg max-h-48 object-cover mb-4"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                      <Edit3 size={24} className="text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload size={32} className="text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 font-medium">
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
          </form>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onDelete}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
            >
              Delete Offer
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onSave}
              className="px-6 py-3 bg-[#2c5e6e] text-white rounded-lg hover:bg-[#244c58] transition-colors duration-200 font-medium"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditOffer;
