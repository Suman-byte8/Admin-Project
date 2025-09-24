import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import AboutUsSection from "../components/AboutManagement/AboutUsSection";
import ContentBlock from "../components/AboutManagement/ContentBlocks";
import AmenityCard from "../components/AboutManagement/AmenityCard";
import ServiceCard from "../components/AboutManagement/ServiceCard";
import AddContent from "../components/AboutManagement/AddContent";
import { aboutApi } from "../services/aboutApi";
import { AdminContext } from "@/context/AdminContext";

const AboutManagement = () => {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const { getToken, checkTokenAndRedirect } = useContext(AdminContext);
  const token = getToken();

  useEffect(() => {
    checkTokenAndRedirect();
    fetchAboutData();
  }, [token, checkTokenAndRedirect]);

  const fetchAboutData = async () => {
    try {
      setLoading(true);
      const data = await aboutApi.getAboutPage(token);
      setAboutData(data);
    } catch (error) {
      console.error("Error fetching About page data:", error);
      setMessage("Failed to load About page data");
    } finally {
      setLoading(false);
    }
  };

  const handleContentAdded = () => {
    fetchAboutData(); // Refresh data after adding content
  };



  // Enhanced handlers with toast notifications
  const handleAmenityDelete = async (amenityId) => {
    try {
      setAboutData(prevData => ({
        ...prevData,
        amenities: prevData.amenities.filter(amenity => amenity._id !== amenityId)
      }));
      toast.success("Amenity deleted successfully");
    } catch (error) {
      toast.error("Failed to delete amenity");
      console.error("Error deleting amenity:", error);
    }
  };

  const handleAmenityUpdate = (amenityId, updatedData) => {
    setAboutData(prevData => ({
      ...prevData,
      amenities: prevData.amenities.map(amenity =>
        amenity._id === amenityId ? { ...amenity, ...updatedData } : amenity
      )
    }));
    toast.success("Amenity updated successfully");
  };

  const handleServiceDelete = async (serviceId) => {
    try {
      setAboutData(prevData => ({
        ...prevData,
        services: prevData.services.filter(service => service._id !== serviceId)
      }));
      toast.success("Service deleted successfully");
    } catch (error) {
      toast.error("Failed to delete service");
      console.error("Error deleting service:", error);
    }
  };

  const handleServiceUpdate = (serviceId, updatedData) => {
    setAboutData(prevData => ({
      ...prevData,
      services: prevData.services.map(service =>
        service._id === serviceId ? { ...service, ...updatedData } : service
      )
    }));
    toast.success("Service updated successfully");
  };

  const handleContentBlockDelete = async (contentBlockId) => {
    try {
      setAboutData(prevData => ({
        ...prevData,
        contentBlocks: prevData.contentBlocks.filter(block => block._id !== contentBlockId)
      }));
      toast.success("Content block deleted successfully");
    } catch (error) {
      toast.error("Failed to delete content block");
      console.error("Error deleting content block:", error);
    }
  };

  const handleContentBlockUpdate = (contentBlockId, updatedData) => {
    setAboutData(prevData => ({
      ...prevData,
      contentBlocks: prevData.contentBlocks.map(block =>
        block._id === contentBlockId ? { ...block, ...updatedData } : block
      )
    }));
    toast.success("Content block updated successfully");
  };

  if (loading) {
    return (
      <div className="max-w-[1200px] mx-auto min-h-screen p-6">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="h-64 bg-gray-200 rounded mb-8"></div>
          <div className="h-64 bg-gray-200 rounded mb-8"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto min-h-screen p-6 bg-gray-50">
      
      {/* Page Header */}
      <header className="flex justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-sm">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          🔧 About Page Management
        </h1>
        {/* <button
          // onClick={handlePublish}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg shadow hover:bg-blue-700 transition font-medium"
        >
          Publish Changes
        </button> */}
      </header>
  
      {message && (
        <div className={`mb-6 p-4 rounded-lg text-sm font-medium shadow-sm
          ${message.includes("success") 
            ? "bg-green-100 text-green-700 border border-green-200" 
            : "bg-red-100 text-red-700 border border-red-200"}
        `}>
          {message}
        </div>
      )}
  
      <main className="space-y-10">
        
        {/* About Us Section */}
        <AboutUsSection />
  
        {/* Quick Add Section */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            ➕ Quick Add Content
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <AddContent type="content" onContentAdded={handleContentAdded} />
            <AddContent type="amenity" onContentAdded={handleContentAdded} />
            <AddContent type="service" onContentAdded={handleContentAdded} />
          </div>
        </section>
  
        {/* Content Blocks */}
        <section className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-3">
            📚 Content Blocks
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {aboutData?.contentBlocks?.length > 0 ? (
              aboutData?.contentBlocks.map((block) => (
                <ContentBlock
                  key={block._id}
                  {...block}
                  imageUrl={block.image?.url}
                  onDelete={handleContentBlockDelete}
                  onUpdate={handleContentBlockUpdate}
                />
              ))
            ) : (
              <p className="col-span-full text-gray-500 py-10 text-center italic">
                No Content Blocks added yet
              </p>
            )}
          </div>
        </section>
  
        {/* Amenities */}
        <section className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-3">
            🏨 Our Amenities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {aboutData?.amenities?.length > 0 ? (
              aboutData.amenities.map((amenity) => (
                <AmenityCard
                  key={amenity._id}
                  {...amenity}
                  imageUrl={amenity.image?.url}
                  onDelete={handleAmenityDelete}
                  onUpdate={handleAmenityUpdate}
                />
              ))
            ) : (
              <p className="text-gray-500 text-center col-span-full py-10 italic">
                No amenities available
              </p>
            )}
          </div>
        </section>
  
        {/* Services */}
        <section className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-3">
            💎 Our Exceptional Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aboutData?.services?.length > 0 ? (
              aboutData.services.map((service) => (
                <ServiceCard
                  key={service._id}
                  {...service}
                  imageUrl={service.image?.url}
                  onDelete={handleServiceDelete}
                  onUpdate={handleServiceUpdate}
                />
              ))
            ) : (
              <p className="text-gray-500 text-center col-span-full py-10 italic">
                No services available
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default AboutManagement;
