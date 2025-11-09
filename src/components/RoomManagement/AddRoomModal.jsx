import React, { useState } from "react";
import { MdCancel } from "react-icons/md";
import { FaUpload, FaTimes } from "react-icons/fa";
import { validateWordCount } from "../../utils/validation";
import { compressImage, shouldCompress } from "../../utils/imageCompression";
import { toast } from "react-toastify";

const AddRoomModal = ({ isOpen, onClose, onSave }) => {
  const [roomNumber, setRoomNumber] = useState("");
  const [roomType, setRoomType] = useState("Deluxe Room");
  const [capacity, setCapacity] = useState(2);
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

   const [loading, setLoading] = useState(false);
  

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const [heroImage, setHeroImage] = useState(null);
  const [heroImagePreview, setHeroImagePreview] = useState("");

  const [imageError, setImageError] = useState("");
  const [heroImageError, setHeroImageError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");

  if (!isOpen) return null;

  const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

  const validateFileSize = (file) => file.size <= MAX_FILE_SIZE;

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.some((f) => !validateFileSize(f))) {
      setImageError("Some images exceed 20MB");
      return;
    }
    setImageError("");
    setImages(files);
    setImagePreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const handleHeroChange = (e) => {
    const file = e.target.files[0];
    if (file && !validateFileSize(file)) {
      setHeroImageError("Hero image exceeds 20MB");
      return;
    }
    setHeroImageError("");
    setHeroImage(file || null);
    setHeroImagePreview(file ? URL.createObjectURL(file) : "");
  };

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    setDescription(value);

    const validation = validateWordCount(value, 1, 50);
    if (!validation.isValid) {
      setDescriptionError(validation.message);
    } else {
      setDescriptionError("");
    }
  };

  const handleSave = async () => {
    // Validate description before saving
    const validation = validateWordCount(description, 1, 50);
    if (!validation.isValid) {
      setDescriptionError(validation.message);
      return;
    }

    // Compress images if needed
    let processedHeroImage = heroImage;
    let processedImages = images;

    if (heroImage && shouldCompress(heroImage)) {
      toast.info("Compressing hero image...");
      processedHeroImage = await compressImage(heroImage);
    }

    if (images.length > 0) {
      toast.info("Compressing gallery images...");
      const compressedImages = await Promise.all(
        images.map(img => shouldCompress(img) ? compressImage(img) : Promise.resolve(img))
      );
      processedImages = compressedImages;
    }

    const formData = new FormData();
    formData.append("roomName", roomNumber);
    formData.append("roomType", roomType);
    formData.append("roomCapacity", capacity);
    formData.append("roomPrice", price);
    formData.append("roomDescription", description);
    if (processedHeroImage) formData.append("heroImage", processedHeroImage);
    processedImages.forEach((img) => formData.append("roomImages", img));
    onSave(formData);
  };

  const wordCount = description.trim().split(/\s+/).filter(word => word.length > 0).length;
  const isWordCountValid = wordCount <= 50;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-3">
      <div className={`bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col relative animate-fadeIn ${loading ? 'relative' : ''}`}>
        {loading && (
          <div className="absolute inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-20 rounded-2xl">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
              <p>Saving...</p>
            </div>
          </div>
        )}
        {/* Header */}
        <div className="sticky top-0 flex justify-between items-center border-b p-5 bg-white">
          <h2 className="text-xl font-semibold text-gray-800">
            ➕ Add New Room
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <MdCancel size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 overflow-y-auto space-y-5">
          {/* Room Number */}
          <div>
            <label className="block text-sm font-medium mb-1">Room Number</label>
            <input
              type="text"
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Room Type + Capacity + Price */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Room Type</label>
              <select
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              >
                <option>Deluxe Room</option>
                <option>Executive Deluxe Room</option>
                <option>Suite</option>
                <option>Family Suite</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Capacity</label>
              <input
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                min="1"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Price / Night</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Hero Image */}
          <div>
            <label className="block text-sm font-medium mb-1">Hero Image</label>
            <div
              onClick={() => document.getElementById("heroUpload").click()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition"
            >
              {heroImagePreview ? (
                <div className="relative inline-block">
                  <img
                    src={heroImagePreview}
                    alt="Hero preview"
                    className="w-40 h-28 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setHeroImage(null);
                      setHeroImagePreview("");
                    }}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1"
                  >
                    <FaTimes size={12} />
                  </button>
                </div>
              ) : (
                <div className="text-gray-400 flex flex-col items-center">
                  <FaUpload size={28} className="mb-1" />
                  <p className="text-sm">Click to upload hero image</p>
                </div>
              )}
            </div>
            <input
              type="file"
              id="heroUpload"
              accept="image/*"
              className="hidden"
              onChange={handleHeroChange}
            />
            {heroImageError && <p className="text-red-500 text-sm mt-1">{heroImageError}</p>}
          </div>

          {/* Additional Images */}
          <div>
            <label className="block text-sm font-medium mb-1">Gallery Images</label>
            <div
              onClick={() => document.getElementById("galleryUpload").click()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition"
            >
              {imagePreviews.length > 0 ? (
                <div className="flex flex-wrap gap-2 justify-center">
                  {imagePreviews.map((src, idx) => (
                    <div key={idx} className="relative">
                      <img src={src} alt={`preview-${idx}`} className="w-20 h-20 object-cover rounded-md" />
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1"
                        onClick={() => {
                          const newImages = [...images];
                          newImages.splice(idx, 1);
                          const newPreviews = [...imagePreviews];
                          newPreviews.splice(idx, 1);
                          setImages(newImages);
                          setImagePreviews(newPreviews);
                        }}
                      >
                        <FaTimes size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-400 flex flex-col items-center">
                  <FaUpload size={28} className="mb-1" />
                  <p className="text-sm">Click to upload gallery images</p>
                </div>
              )}
            </div>
            <input
              type="file"
              id="galleryUpload"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageChange}
            />
            {imageError && <p className="text-red-500 text-sm mt-1">{imageError}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">Description (Max 50 words)</label>
            <textarea
              rows="4"
              value={description}
              onChange={handleDescriptionChange}
              className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 resize-none ${
                descriptionError ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Write a short description..."
            />
            <div className="flex justify-between items-center mt-1">
              <span className={`text-sm ${isWordCountValid ? 'text-gray-500' : 'text-red-500'}`}>
                {wordCount}/50 words
              </span>
              {descriptionError && <span className="text-sm text-red-500">{descriptionError}</span>}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t p-4 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!isWordCountValid || wordCount === 0}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Save Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRoomModal;
