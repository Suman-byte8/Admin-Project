import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";

import GalleryHeader from "@/components/GalleryManagement/GalleryHeader";
import GalleryTabs from "@/components/GalleryManagement/GalleryTabs";
import AddImageModal from "@/components/GalleryManagement/AddImageModal";
import EditImageModal from "@/components/GalleryManagement/EditImageModal";
import ImageSkeleton from "@/components/GalleryManagement/ImageSkeleton";
import { RefreshCw } from "lucide-react";

import { fetchGalleryImages, deleteGalleryImage } from "@/services/galleryApi";
import { AdminContext } from "@/context/AdminContext";
import { getCachedData, setCachedData } from "../utils/cache";

const CACHE_KEY_PREFIX = 'gallery_';

const GalleryManagement = () => {
  const { getToken } = useContext(AdminContext);

  // States
  const [activeTab, setActiveTab] = useState("Rooms");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [loadingStates, setLoadingStates] = useState({}); // Per-image load tracker
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // Lightbox viewer
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerImage, setViewerImage] = useState(null);

  // Fetch images
  const fetchImages = async (tab) => {
    try {
      setLoading(true);
      const token = getToken();
      const data = await fetchGalleryImages(tab, token);
      setImages(data);
      await setCachedData(CACHE_KEY_PREFIX + tab, data);
      setError("");
    } catch (err) {
      setError("Failed to fetch images");
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages(activeTab);
  }, [activeTab]);

  // Image handlers
  const handleAddClick = () => setIsModalOpen(true);
  const handleModalClose = () => {
    setIsModalOpen(false);
    setError("");
  };

  const handleAddImage = (newImages) => {
    const imgs = Array.isArray(newImages) ? newImages : [newImages];
    const updatedImages = [...imgs, ...images];
    setImages(updatedImages);
    setCachedData(CACHE_KEY_PREFIX + activeTab, updatedImages);
  };

  const handleUpdateClick = (image) => {
    setSelectedImage(image);
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setSelectedImage(null);
    setError("");
  };

  const handleUpdateImage = (updatedImage) => {
    const updatedImages = images.map((img) => (img._id === updatedImage._id ? updatedImage : img));
    setImages(updatedImages);
    setCachedData(CACHE_KEY_PREFIX + activeTab, updatedImages);
  };

  const handleDeleteClick = async (imageId) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    try {
      const token = getToken();
      await deleteGalleryImage(imageId, token);
      const updatedImages = images.filter((img) => img._id !== imageId);
      setImages(updatedImages);
      await setCachedData(CACHE_KEY_PREFIX + activeTab, updatedImages);
      toast.success("Image deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete image");
    }
  };

  // Track loaded images for fade-in
  const handleImageLoad = (id) => {
    setLoadingStates((prev) => ({ ...prev, [id]: true }));
  };

  // Lightbox handlers
  const openViewer = (image) => {
    setViewerImage(image);
    setViewerOpen(true);
  };
  const closeViewer = () => {
    setViewerImage(null);
    setViewerOpen(false);
  };

  return (
    <div className="w-full h-full">
      <div className="px-8 flex flex-1 justify-center py-5">
        <div className="layout-content-container flex flex-col flex-1">
          {/* Header + Tabs */}
          <GalleryHeader onAdd={handleAddClick} />
          <GalleryTabs active={activeTab} setActive={setActiveTab} />

          <div className="flex items-center justify-between px-4 pb-2 pt-4">
            <h3 className="text-[#111418] text-lg font-bold">
              Current Gallery
            </h3>
            <button
              onClick={() => fetchImages(activeTab)}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-md transition-colors duration-200"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {error && <p className="text-red-600 px-4">{error}</p>}

          {/* Gallery Grid Section */}
          <div className="p-6">
            {loading ? (
              // Skeleton grid while fetching
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 place-items-center">
                {Array.from({ length: 8 }).map((_, idx) => (
                  <div key={idx} className="w-full max-w-[350px]">
                    <ImageSkeleton />
                  </div>
                ))}
              </div>
            ) : images.length > 0 ? (
              // Actual images grid
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 place-items-center">
                {images.map((photo, idx) => {
                  const id = photo._id || idx;
                  const isLoaded = loadingStates[id];
                  return (
                    <div
                      key={id}
                      className="relative w-full max-w-[450px] aspect-[4/3] rounded-xl overflow-hidden shadow-lg group hover:shadow-2xl transition-shadow duration-300"
                    >
                      {/* Skeleton while loading */}
                      {!isLoaded && <ImageSkeleton />}

                      {/* Image */}
                      <img
                        onClick={() => openViewer(photo)}
                        src={photo.url}
                        alt={photo.title || "Gallery Image"}
                        onLoad={() => handleImageLoad(id)}
                        loading="lazy"
                        className={`
                        w-full h-full object-cover rounded-xl cursor-pointer
                        transition-transform duration-300 group-hover:scale-105
                        ${isLoaded ? "opacity-100" : "opacity-0"}
                        transition-opacity duration-500
                      `}
                      />

                      {/* Hover Action Buttons */}
                      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          onClick={() => handleUpdateClick(photo)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm font-medium shadow-md transition-colors duration-200"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(photo._id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm font-medium shadow-md transition-colors duration-200"
                        >
                          🗑️ Delete
                        </button>
                      </div>

                      {/* Enhanced Caption Overlay */}
                      {(photo.title || photo.caption) && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 text-white">
                          {photo.title && (
                            <h3 className="text-base font-semibold leading-snug drop-shadow-sm truncate">
                              {photo.title}
                            </h3>
                          )}
                          {photo.caption && (
                            <p className="text-sm opacity-90 leading-snug mt-1 line-clamp-2">
                              {photo.caption}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              // No Images Fallback
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📷</div>
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  No images found
                </h3>
                <p className="text-gray-500">
                  Click "Add New Image" to upload your first image
                </p>
              </div>
            )}
          </div>

          {/* Add / Edit Modals */}
          <AddImageModal
            isOpen={isModalOpen}
            onClose={handleModalClose}
            onAddSuccess={handleAddImage}
            activeTab={activeTab}
          />
          <EditImageModal
            isOpen={isEditModalOpen}
            onClose={handleEditModalClose}
            onUpdateSuccess={handleUpdateImage}
            image={selectedImage}
            activeTab={activeTab}
          />
        </div>
      </div>

      {/* Lightbox Image Viewer */}
      {viewerOpen && viewerImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-6">
          {/* Close Button */}
          <button
            onClick={closeViewer}
            className="absolute top-6 right-8 text-white text-3xl font-bold bg-black/50 px-3 py-1 rounded-lg hover:bg-black/80"
          >
            ✕
          </button>

          {/* Viewer Content */}
          <div className="max-w-4xl max-h-[85vh] flex flex-col items-center relative">
            {/* Skeleton/Loader overlay while big image is loading */}
            {!loadingStates[viewerImage._id] && (
              <div className="w-full max-w-3xl aspect-[16/10] bg-gray-300 animate-pulse rounded-lg flex items-center justify-center text-white">
                Loading...
              </div>
            )}

            {/* The actual viewer image */}
            <img
              src={viewerImage.url}
              alt={viewerImage.title || "Full Image"}
              onLoad={() =>
                setLoadingStates((prev) => ({
                  ...prev,
                  [viewerImage._id]: true,
                }))
              }
              className={`
          max-h-[75vh] w-auto rounded-lg shadow-2xl
          transition-opacity duration-500
          ${loadingStates[viewerImage._id] ? "opacity-100" : "opacity-0"}
        `}
            />

            {/* Title / Caption */}
            {(viewerImage.title || viewerImage.caption) && (
              <div className="text-center text-white mt-4 space-y-1">
                {viewerImage.title && (
                  <h2 className="text-lg font-semibold">{viewerImage.title}</h2>
                )}
                {viewerImage.caption && (
                  <p className="text-sm opacity-80">{viewerImage.caption}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryManagement;
