import React, { useState, useEffect, useContext } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getRoomById, updateRoom } from "../../services/rooms";
import { AdminContext } from "@/context/AdminContext";

export default function EditRoomPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [roomData, setRoomData] = useState({
    roomType: "",
    roomPrice: "",
    roomDescription: "",
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [heroImage, setHeroImage] = useState(null);
  const [heroImagePreview, setHeroImagePreview] = useState("");
  const [imageError, setImageError] = useState("");
  const [heroImageError, setHeroImageError] = useState("");

  const { getToken } = useContext(AdminContext);
  const token = getToken();

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const room = await getRoomById(roomId, token);
        setRoomData({
          roomType: room.roomType,
          roomPrice: room.roomPrice,
          roomDescription: room.roomDescription,
        });
        console.log(room);
        console.log(room.roomImages);
        console.log(room.heroImage);
        // Assuming images and heroImage are URLs
        setImagePreviews(room.roomImages || []);
        setHeroImagePreview(room.heroImage || "");
      } catch (error) {
        console.error("Failed to fetch room:", error);
        // Handle error (e.g., show a notification)
      }
    };

    fetchRoom();
  }, [roomId, token]);

  const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB limit

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRoomData({ ...roomData, [name]: value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    const oversizedFiles = files.filter(file => file.size > MAX_FILE_SIZE);
    if (oversizedFiles.length > 0) {
      setImageError(`One or more files exceed the maximum size of 20MB`);
      setImages([]);
      setImagePreviews([]);
      e.target.value = null;
      return;
    }
    
    setImageError("");
    setImages(files);
    
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleHeroImageChange = (e) => {
    const file = e.target.files[0];
    
    if (file && file.size > MAX_FILE_SIZE) {
      setHeroImageError(`The hero image exceeds the maximum size of 20MB.`);
      setHeroImage(null);
      setHeroImagePreview("");
      e.target.value = null;
      return;
    }
    
    setHeroImageError("");
    if (file) {
        setHeroImage(file);
        setHeroImagePreview(URL.createObjectURL(file));
    } else {
        setHeroImage(null);
        setHeroImagePreview("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("roomType", roomData.roomType);
    formData.append("roomPrice", roomData.roomPrice);
    formData.append("roomDescription", roomData.roomDescription);

    if (heroImage) {
      formData.append("heroImage", heroImage);
    }

    for (let i = 0; i < images.length; i++) {
      formData.append("roomImages", images[i]);
    }

    try {
      
      await updateRoom(roomId, formData, token);
      navigate("/room-management");
    } catch (error) {
      console.error("Failed to update room:", error);
      // Handle error
    }
  };

  return (
    <div className="w-full bg-white p-8 rounded-lg">
      <Link to="/room-management" className="flex items-center text-gray-700 cursor-pointer mb-6">
        <FaArrowLeft className="mr-2" />
        <span className="text-sm font-medium">Back to Room Management</span>
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 pb-4">Edit Room</h1>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-800 mb-2 text-sm font-medium">
              Room Type
            </label>
            <select
              name="roomType"
              value={roomData.roomType}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-full px-4 py-2 text-gray-700 bg-gray-100 focus:outline-none"
            >
              <option value="Deluxe Room">Deluxe Room</option>
              <option value="Executive Deluxe Room">Executive Deluxe Room</option>
              <option value="Suite">Suite</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-800 mb-2 text-sm font-medium">
              Price per night ($)
            </label>
            <input
              type="number"
              name="roomPrice"
              min={0}
              value={roomData.roomPrice}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-full px-4 py-2 text-gray-700 bg-gray-100 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-800 mb-2 text-sm font-medium">
            Images
          </label>
          <input
            type="file"
            multiple
            onChange={handleImageChange}
            className="w-full border border-gray-300 rounded-full px-4 py-2 text-gray-700 bg-gray-100 focus:outline-none"
          />
          {imageError && <span className="text-red-500 text-sm">{imageError}</span>}
        </div>
        <div>
          <label className="block text-gray-800 mb-2 text-sm font-medium">
            Hero Image
          </label>
          <input
            type="file"
            onChange={handleHeroImageChange}
            className="w-full border border-gray-300 rounded-full px-4 py-2 text-gray-700 bg-gray-100 focus:outline-none"
          />
          {heroImageError && <span className="text-red-500 text-sm">{heroImageError}</span>}
          {heroImagePreview && (
            <img src={heroImagePreview} alt="Hero preview" className="w-20 h-20 object-cover mt-2" />
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {roomData.roomImages?.map((preview, index) => (
            <img key={index} src={preview.url} alt={`Preview ${index}`} className="w-20 h-20 object-cover" />
          ))}
        </div>

        <div>
          <label className="block text-gray-800 mb-2 text-sm font-medium">
            Description
          </label>
          <textarea
            name="roomDescription"
            placeholder="Description..."
            value={roomData.roomDescription}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-500 bg-gray-100 focus:outline-none"
            rows="4"
          ></textarea>
        </div>

        <div className="flex gap-4 pt-4">
          <Link to="/room-management">
            <button
              type="button"
              className="px-6 py-2 rounded-full bg-gray-300 text-gray-800 text-sm font-medium hover:bg-gray-400"
            >
              Cancel
            </button>
          </Link>
          <button
            type="submit"
            className="px-6 py-2 rounded-full bg-[#9fc9d6] text-gray-900 text-sm font-medium hover:bg-[#8fb9c6]"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}