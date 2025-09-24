import React, { useEffect, useState, useContext } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import imageCompression from "browser-image-compression";
import {
  fetchBanners,
  deleteBanner,
  addHeroBanner,
  updateBanner,
} from "../../services/pageManagementApi";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";

const AdminBannerPreview = () => {
  const [banners, setBanners] = useState([]);
  const [editingBanner, setEditingBanner] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
  });

  const [preview, setPreview] = useState(null);

  const { getToken } = useContext(AdminContext);
  const navigate = useNavigate();

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    try {
      const token = getToken();
      const data = await fetchBanners(token);
      if (Array.isArray(data.heroBanners)) {
        setBanners(data.heroBanners);
        console.log("Fetched banners:", data.heroBanners);
      } else {
        console.error("Fetched data is not an array:", data);
        setBanners([]);
      }
    } catch (err) {
      console.error("Error fetching banners:", err);
      setBanners([]);
    }
  };

  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      description: banner.description,
      image: banner.image,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      // Create FormData object for multipart upload
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      if (typeof formData.image !== "string") {
        // if it's a new file
        formDataToSend.append("image", formData.image);
      }

      const token = getToken();
      await updateBanner(editingBanner._id, formDataToSend, token);

      await loadBanners();

      setEditingBanner(null);
      setFormData({ title: "", description: "", image: "" });
      toast.success("Banner updated successfully");
    } catch (error) {
      console.error("Error updating banner:", error);
      toast.error("Failed to update banner");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this banner?")) {
      try {
        const token = getToken();
        await deleteBanner(id, token);
        setBanners((prev) => prev.filter((banner) => banner._id !== id));
        toast.success("Banner deleted successfully");
      } catch (error) {
        console.error("Error deleting banner:", error);
        toast.error("Failed to delete banner");
      }
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const compressedFile = await imageCompression(file, {
          maxSizeMB: 2,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        });

        const compressedFileAsFile = new File([compressedFile], file.name, {
          type: compressedFile.type,
          lastModified: Date.now(),
        });

        setFormData({ ...formData, image: compressedFileAsFile });

        const previewUrl = URL.createObjectURL(compressedFileAsFile);

        if (preview) URL.revokeObjectURL(preview);

        setPreview(previewUrl);
      } catch (error) {
        console.error("Error compressing image:", error);
        setFormData({ ...formData, image: file });

        const previewUrl = URL.createObjectURL(file);

        if (preview) URL.revokeObjectURL(preview);

        setPreview(previewUrl);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <div className="p-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Previous Page
      </button>
      <h2 className="text-xl font-medium text-gray-700 mb-4">
        Home Page Banner
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {banners.map((banner, i) => (
          <div key={banner._id || i} className="bg-white rounded-lg shadow p-4">
            <img
              src={banner.image}
              alt={banner.title}
              className="rounded-lg mb-2 w-full h-40 object-cover"
            />
            <h3 className="text-lg font-semibold">{banner.title}</h3>
            <p className="text-gray-600">{banner.description}</p>
            <div className="flex justify-between mt-4">
              <button
                className="text-blue-500 flex items-center"
                onClick={() => handleEdit(banner)}
              >
                <FaEdit className="mr-1" /> Update Banner
              </button>
              <button
                className="text-red-500 flex items-center"
                onClick={() => handleDelete(banner._id)}
              >
                <FaTrash className="mr-1" /> Delete Banner
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingBanner && (
        <form onSubmit={handleUpdate} className="mt-6">
          <h3 className="text-lg font-semibold">Edit Banner</h3>
          <input
            type="text"
            placeholder="Banner Headline"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="border rounded p-2 mb-2 w-full"
          />
          <input
            type="text"
            placeholder="Banner Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="border rounded p-2 mb-2 w-full"
          />
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="border rounded p-2 mb-2 w-full"
            />

            {/* Show preview if image is selected */}
            {preview && (
              <div className="mt-2">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-48 object-contain rounded-lg shadow-md"
                />
              </div>
            )}
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 my-4 rounded"
          >
            Save Changes
          </button>
        </form>
      )}
    </div>
  );
};

export default AdminBannerPreview;
