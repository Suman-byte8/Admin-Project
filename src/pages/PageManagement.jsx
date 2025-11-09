import React, { useState } from "react";
import { FaSync } from "react-icons/fa";
import DistinctiveSection from "@/components/PageManagement/DistinctiveSection";
import HomePageBanner from "@/components/PageManagement/HomePageBanner";
import AdminBannerPreview from "@/components/PageManagement/AdminBannerPreview";

const PageManagement = () => {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh - you can add actual refresh logic here if needed
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  return (
    <div className="w-full p-10 bg-white min-h-screen">
      {/* Page Title */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800 mb-2">
            Page Management
          </h1>
          <p className="text-gray-500">
            Manage the content and images for your main website.
          </p>
        </div>
      </div>
      <HomePageBanner refreshTrigger={refreshing} />
      <DistinctiveSection refreshTrigger={refreshing} />
    </div>
  );
};

export default PageManagement;
