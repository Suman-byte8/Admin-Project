import React, { useState, useEffect, useRef, useContext } from "react";
import { toast } from "react-toastify";
import { aboutApi } from "../../services/aboutApi";
import { AdminContext } from "@/context/AdminContext";

const AboutUsSection = () => {
  const [aboutData, setAboutData] = useState({
    title: "",
    description: "",
    headerImage: null
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const fileInputRef = useRef(null);

  const { getToken } = useContext(AdminContext);
  const token = getToken();

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      setLoading(true);
      const data = await aboutApi.getAboutPage(token);
      if (data.aboutUsSection) {
        setAboutData({
          title: data.aboutUsSection.title || "",
          description: data.aboutUsSection.description || "",
          headerImage: data.aboutUsSection.headerImage || null
        });
      }
    } catch (error) {
      console.error("Error fetching About data:", error);
      setMessage("Failed to load About data");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setAboutData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAboutData(prev => ({
          ...prev,
          headerImage: {
            url: e.target.result,
            file: file,
            isNew: true
          }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setAboutData(prev => ({
      ...prev,
      headerImage: null
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage("");

      const formData = new FormData();
      formData.append('title', aboutData.title);
      formData.append('description', aboutData.description);

      if (aboutData.headerImage && aboutData.headerImage.file) {
        formData.append('headerImage', aboutData.headerImage.file);
      }

      await aboutApi.updateAboutUs(formData, token);
      toast.success("About Us section updated successfully!");
      fetchAboutData(); // Refresh data to get the actual image URL from server
    } catch (error) {
      console.error("Error updating About Us:", error);
      toast.error("Failed to update About Us section");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <section className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          About Us Section
        </h2>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-10 bg-gray-200 rounded w-1/3"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white p-6 rounded-lg shadow-md mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-700">
          About Us Section
        </h2>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {saving ? "Saving..." : "Publish Changes"}
        </button>
      </div>
      
      {message && (
        <div className={`mb-4 p-3 rounded ${
          message.includes("success") 
            ? "bg-green-100 text-green-700 border border-green-200" 
            : "bg-red-100 text-red-700 border border-red-200"
        }`}>
          {message}
        </div>
      )}

      <div className="space-y-4">
        {/* Header Image Section */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Header Image
          </label>
          {aboutData.headerImage ? (
            <div className="relative">
              <img
                src={aboutData.headerImage.url}
                alt="Header preview"
                className="w-full h-[18rem] object-cover rounded-md mb-2"
              />
              <button
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded text-xs hover:bg-red-700 transition-colors"
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
              <p className="text-sm text-gray-500 mb-2">No header image selected</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
              >
                Upload Image
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          )}
        </div>

        <div>
          <label
            className="block text-sm font-medium text-gray-600"
            htmlFor="about-title"
          >
            Title
          </label>
          <input
            className="w-full mt-1 p-2 border border-gray-300 rounded-md outline-0 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            id="about-title"
            type="text"
            value={aboutData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            placeholder="Enter About Us title"
          />
        </div>
        <div>
          <label
            className="block text-sm font-medium text-gray-600"
            htmlFor="about-description"
          >
            Description
          </label>
          <textarea
            className="w-full mt-1 p-2 border border-gray-300 rounded-md outline-0 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            id="about-description"
            rows="6"
            value={aboutData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="Enter About Us description"
          ></textarea>
        </div>
      </div>
    </section>
  );
};

export default AboutUsSection;
