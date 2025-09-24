import React, { useState, useEffect, useContext } from "react";
import { FaRegEye } from "react-icons/fa";
import imageCompression from "browser-image-compression";
import { addHeroBanner } from "../../services/pageManagementApi";
import { Link } from "react-router-dom";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";

const HomePageBanner = () => {
  const [headline, setHeadline] = useState("");
  const [subHeadline, setSubHeadline] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const { getToken } = useContext(AdminContext);

  useEffect(() => {
    // Clean up preview URL when component unmounts or when a new file is selected
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Revoke previous preview URL if exists
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    // Create preview URL
    const preview = URL.createObjectURL(selectedFile);
    setPreviewUrl(preview);

    const options = {
      maxSizeMB: 2,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(selectedFile, options);

      // convert Blob -> File so multer detects it
      const newFile = new File([compressedFile], selectedFile.name, {
        type: selectedFile.type,
      });

      setFile(newFile);
    } catch (error) {
      console.error("Error compressing image:", error);
    }
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (!title || !description || !url || !file) {
      console.error(
        "All fields are required. Please fill in all text fields and select a file."
      );
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("subtitle", subHeadline);
    formData.append("description", description);
    formData.append("url", url);
    formData.append("page", "home");
    formData.append("section", "hero");
    formData.append("isActive", true);
    formData.append("image", file);

    // debug
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    const token = getToken();

    try {
      await addHeroBanner(formData, token);

      toast.success("Hero banner added successfully!");
      // Revoke preview URL and reset state
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setHeadline("");
      setSubHeadline("");
      setTitle("");
      setDescription("");
      setUrl("");
      setFile(null);
      setPreviewUrl(null);
    } catch (error) {
      console.error(
        "Failed to add hero banner:",
        error.response?.data || error
      );
      toast.error("Failed to add hero banner");
    }
  };
  return (
    <div>
      {" "}
      {/* Home Page Banner Section */}
      <div className="bg-white rounded-2xl shadow p-6 mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-medium text-gray-700 mb-4">
            Home Page Banner Section
          </h2>
            <Link to="/page-management/home-banner-preview" className="flex items-center gap-2 text-blue-500 cursor-pointer">
              <FaRegEye /> Preview
            </Link>
        </div>

        <form onSubmit={handleSaveChanges} className="space-y-6">
          {/* Upload File */}
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
            <label className="cursor-pointer">
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
              {previewUrl ? (
                <div className="flex flex-col items-center">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-h-40 rounded-lg mb-2"
                  />
                  <p className="text-sm text-gray-600 mt-2">
                    Selected: {file?.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Click to change image
                  </p>
                </div>
              ) : (
                <div className="text-gray-500">
                  <span className="text-blue-500">Upload a file</span> or Drag and
                  Drop
                  <p className="text-xs mt-1">PNG, JPG, GIF up to 10MB</p>
                </div>
              )}
            </label>
          </div>

          {/* Title and Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border rounded-full px-4 py-2 focus:ring-1 focus:ring-gray-300 outline-none"
            />
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border rounded-full px-4 py-2 focus:ring-1 focus:ring-gray-300 outline-none"
            />
          </div>

          {/* URL and Subheadline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="URL (e.g. https://example.com)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="border rounded-full px-4 py-2 focus:ring-1 focus:ring-gray-300 outline-none"
            />
            <input
              type="text"
              placeholder="Subtitle (optional)"
              value={subHeadline}
              onChange={(e) => setSubHeadline(e.target.value)}
              className="border rounded-full px-4 py-2 focus:ring-1 focus:ring-gray-300 outline-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="bg-gray-200 text-gray-700 px-5 py-2 rounded-full"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#2c5e6e] text-white px-5 py-2 rounded-full"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HomePageBanner;
