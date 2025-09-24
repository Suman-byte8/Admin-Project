import React, { useState, useEffect } from "react";
import { MdCancel } from "react-icons/md";
import { FaUpload, FaTimes } from "react-icons/fa";

const EditRoomModal = ({ isOpen, onClose, onSave, room }) => {
  const [roomData, setRoomData] = useState({
    roomType: "",
    roomPrice: "",
    roomDescription: "",
  });

  const [images, setImages] = useState([]); // newly added ones
  const [newImagePreviews, setNewImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);

  const [heroImage, setHeroImage] = useState(null);
  const [heroImagePreview, setHeroImagePreview] = useState("");

  const [imageError, setImageError] = useState("");
  const [heroImageError, setHeroImageError] = useState("");

  const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

  useEffect(() => {
    if (room) {
      setRoomData({
        roomType: room.roomType || "",
        roomPrice: room.roomPrice || "",
        roomDescription: room.roomDescription || "",
      });
      setExistingImages(room.roomImages || []);
      setHeroImagePreview(room.heroImage || "");
    }
  }, [room]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    setRoomData({ ...roomData, [e.target.name]: e.target.value });
  };

  const handleHeroImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > MAX_FILE_SIZE) {
      setHeroImageError("Hero image exceeds 20MB");
      return;
    }
    setHeroImageError("");
    setHeroImage(file || null);
    setHeroImagePreview(file ? URL.createObjectURL(file) : room.heroImage || "");
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.some((f) => f.size > MAX_FILE_SIZE)) {
      setImageError("Some images exceed 20MB");
      return;
    }
    setImageError("");
    setImages((prev) => [...prev, ...files]);
    setNewImagePreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
  };

  const handleRemoveExisting = (idx) => {
    const imageToRemove = existingImages[idx];
    setRemovedImages((prev) => [...prev, imageToRemove._id]);
    setExistingImages(existingImages.filter((_, i) => i !== idx));
  };

  const handleRemoveNew = (idx) => {
    setNewImagePreviews(newImagePreviews.filter((_, i) => i !== idx));
    setImages(images.filter((_, i) => i !== idx));
  };

  const handleSave = () => {
    const formData = new FormData();
    formData.append("roomType", roomData.roomType);
    formData.append("roomPrice", roomData.roomPrice);
    formData.append("roomDescription", roomData.roomDescription);
    formData.append("removedImages", JSON.stringify(removedImages));

    if (heroImage) formData.append("heroImage", heroImage);
    images.forEach((img) => formData.append("roomImages", img));

    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-3">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col relative animate-fadeIn">
        {/* Header */}
        <div className="sticky top-0 flex justify-between items-center border-b p-5 bg-white">
          <h2 className="text-xl font-semibold text-gray-800">✏️ Edit Room</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <MdCancel size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 overflow-y-auto space-y-5">
          {/* Room Type + Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Room Type</label>
              <select
                name="roomType"
                value={roomData.roomType}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              >
                <option>Deluxe Room</option>
                <option>Executive Deluxe Room</option>
                <option>Suite</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Price / Night</label>
              <input
                type="number"
                name="roomPrice"
                value={roomData.roomPrice}
                onChange={handleInputChange}
                min={0}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="roomDescription"
              rows="4"
              value={roomData.roomDescription}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Hero Image */}
          <div>
            <label className="block text-sm font-medium mb-1">Hero Image</label>
            <div
              onClick={() => document.getElementById("heroUploadEdit").click()}
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
              id="heroUploadEdit"
              className="hidden"
              accept="image/*"
              onChange={handleHeroImageChange}
            />
            {heroImageError && <p className="text-red-500 text-sm mt-1">{heroImageError}</p>}
          </div>

          {/* Gallery Images */}
          <div>
            <label className="block text-sm font-medium mb-1">Gallery Images</label>
            <div
              onClick={() => document.getElementById("galleryUploadEdit").click()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition"
            >
              {existingImages.length > 0 || newImagePreviews.length > 0 ? (
                <div className="flex flex-wrap gap-2 justify-center">
                  {existingImages.map((img, idx) => (
                    <div key={idx} className="relative">
                      <img src={img.url} className="w-20 h-20 object-cover rounded-md" />
                      <button
                        type="button"
                        onClick={() => handleRemoveExisting(idx)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1"
                      >
                        <FaTimes size={12} />
                      </button>
                    </div>
                  ))}
                  {newImagePreviews.map((src, idx) => (
                    <div key={idx} className="relative">
                      <img
                        src={src}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveNew(idx)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1"
                      >
                        <FaTimes size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-400 flex flex-col items-center">
                  <FaUpload size={28} className="mb-1" />
                  <p className="text-sm">Click to upload images</p>
                </div>
              )}
            </div>
            <input
              type="file"
              id="galleryUploadEdit"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageChange}
            />
            {imageError && <p className="text-red-500 text-sm mt-1">{imageError}</p>}
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
            className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditRoomModal;