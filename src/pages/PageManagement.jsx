import React from "react";
import DistinctiveSection from "@/components/PageManagement/DistinctiveSection";
import HomePageBanner from "@/components/PageManagement/HomePageBanner";
import AdminBannerPreview from "@/components/PageManagement/AdminBannerPreview";
const PageManagement = () => {
  return (
    <div className="w-full p-10 bg-white min-h-screen">   {/* Page Title */}
    <h1 className="text-3xl font-semibold text-gray-800 mb-2">
      Page Management
    </h1>
    <p className="text-gray-500 mb-8">
      Manage the content and images for your main website.
    </p>
      <HomePageBanner />
      <DistinctiveSection />
    </div>
  );
};

export default PageManagement;
