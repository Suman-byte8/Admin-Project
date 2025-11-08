import React, { useState, useContext } from "react";
import { toast } from "react-toastify";
import { aboutApi } from "../../services/aboutApi";
import { AdminContext } from "@/context/AdminContext";
import { compressImage, shouldCompress } from "../../utils/imageCompression";

const AddContent = ({ type, onContentAdded }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const { getToken } = useContext(AdminContext);
  const token = getToken();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);

      // Compress image if needed
      if (image) {
        let processedImage = image;
        if (shouldCompress(image)) {
          toast.info("Compressing image...");
          processedImage = await compressImage(image);
        }
        formData.append("image", processedImage);
      }

      if (type === "content") {
        await aboutApi.addContentBlock(formData, token);
        toast.success("Content block added successfully!");
      } else if (type === "amenity") {
        await aboutApi.addAmenity(formData, token);
        toast.success("Amenity added successfully!");
      } else if (type === "service") {
        await aboutApi.addService(formData, token);
        toast.success("Service added successfully!");
      }
      // Reset form
      setTitle("");
      setDescription("");
      setImage(null);
      setPreview(null);
      onContentAdded();
    } catch (error) {
      console.error("Error adding item:", error);
      toast.error(`Failed to add ${type}.`);
    } finally {
      setLoading(false);
    }
  };

  return (
<div className={`bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition transform hover:-translate-y-1 ${loading ? 'relative' : ''}`}>
  {loading && (
    <div className="absolute inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-10 rounded-xl">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
        <p>Adding...</p>
      </div>
    </div>
  )}
  <h2 className="text-lg font-semibold mb-4 text-gray-800">
    ➕ Add {type.charAt(0).toUpperCase() + type.slice(1)}
  </h2>
  <form onSubmit={handleSubmit} className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-600">Title</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        required
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-600">Description</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows="4"
        className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        required
      ></textarea>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-600">Image</label>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="mt-1 text-sm"
      />
      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="mt-3 w-full h-32 object-cover rounded-lg border"
          loading="lazy"
          width="320"
          height="128"
        />
      )}
    </div>
    <button
      type="submit"
      disabled={loading}
      className="bg-blue-600 w-full text-center text-white py-2 rounded-lg shadow hover:bg-blue-700 transition disabled:opacity-50"
    >
      {loading ? "Adding..." : `Add ${type}`}
    </button>
  </form>
</div>
  );
};

export default AddContent;
