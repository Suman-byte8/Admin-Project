import React, { useEffect, useState, useContext } from "react";
import { FaPlus, FaEdit, FaTrash, FaSpinner, FaUsers, FaTag, FaRupeeSign, FaCircle, FaSync } from "react-icons/fa";
import { toast } from "react-toastify";
import AddRoomModal from "../components/RoomManagement/AddRoomModal";
import EditRoomModal from "../components/RoomManagement/EditRoomModal";
import { getRooms, addRoom, updateRoom, deleteRoom, updateRoomStatus } from "../services/rooms";
import { AdminContext } from "@/context/AdminContext";
import { getCachedData, setCachedData } from "../utils/cache";

const CACHE_KEY = 'rooms';

const STATUS_COLORS = {
  available: 'text-green-500',
  booked: 'text-red-500',
  maintenance: 'text-yellow-500'
};

const STATUS_LABELS = {
  available: 'Available',
  booked: 'Booked',
  maintenance: 'Under Maintenance'
};

export default function RoomManagement() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const { getToken, checkTokenAndRedirect } = useContext(AdminContext);
  const token = getToken();

  const fetchRooms = async (forceFresh = false) => {
    try {
      setLoading(true);
      if (!forceFresh) {
        const cached = await getCachedData(CACHE_KEY);
        if (cached) {
          setRooms(cached);
          setError(null);
          setLoading(false);
          return;
        }
      }
      const data = await getRooms(token, 1, 20, true);
      setRooms(data.rooms);
      await setCachedData(CACHE_KEY, data.rooms);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.status === 401
          ? "Unauthorized. Please log in again."
          : "Failed to fetch rooms"
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch Rooms
  useEffect(() => {
    checkTokenAndRedirect();
    fetchRooms();
  }, [token, checkTokenAndRedirect]);

  // CRUD Handlers
  const handleAddRoom = async (formData) => {
    try {
      const newRoom = await addRoom(formData, token);
      const updatedRooms = [...rooms, newRoom];
      setRooms(updatedRooms);
      await setCachedData(CACHE_KEY, updatedRooms);
      setIsAddOpen(false);
      toast.success("Room added successfully");
    } catch (err) {
      console.error(err);
      toast.error("Error adding room");
    }
  };

  const handleUpdateRoom = async (id, formData) => {
    try {
      const updated = await updateRoom(id, formData, token);
      const updatedRooms = rooms.map((room) => (room._id === id ? updated : room));
      setRooms(updatedRooms);
      await setCachedData(CACHE_KEY, updatedRooms);
      setIsEditOpen(false);
      setSelectedRoom(null);
      toast.success("Room updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Error updating room");
    }
  };

  const handleDeleteRoom = async (id) => {
    if (!confirm("Delete this room?")) return;
    try {
      await deleteRoom(id, token);
      const updatedRooms = rooms.filter((room) => room._id !== id);
      setRooms(updatedRooms);
      await setCachedData(CACHE_KEY, updatedRooms);
      toast.success("Room deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Error deleting room");
    }
  };

  const handleStatusChange = async (roomId, newStatus) => {
    try {
      const updated = await updateRoomStatus(roomId, newStatus, token);
      const updatedRooms = rooms.map(room => (room._id === roomId ? updated : room));
      setRooms(updatedRooms);
      await setCachedData(CACHE_KEY, updatedRooms);
      toast.success(`Room status updated to ${STATUS_LABELS[newStatus]}`);
    } catch (err) {
      console.error(err);
      toast.error("Error updating room status");
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="p-12 flex items-center justify-center">
        <FaSpinner className="animate-spin text-5xl text-[#2c5e6e]" />
      </div>
    );
  }

  // Error
  if (error) {
    return <div className="p-8 text-red-600 text-lg font-medium">{error}</div>;
  }

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-10 bg-white p-6 rounded-xl shadow-sm">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">
          🏨 Room Management
        </h1>
        <div className="flex gap-4">
          <button
            onClick={() => fetchRooms(true)}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2.5 rounded-lg shadow hover:bg-blue-700 disabled:bg-blue-400 flex items-center gap-2 font-medium"
          >
            <FaSync className={`text-sm ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
          <button
            onClick={() => setIsAddOpen(true)}
            className="bg-[#2c5e6e] text-white px-5 py-2.5 rounded-lg shadow hover:bg-[#244c58] flex items-center gap-2 font-medium"
          >
            <FaPlus /> Add Room
          </button>
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {rooms.map((room) => (
          <div
            key={room._id}
            className="bg-white rounded-xl border min-h-[300px] border-gray-200 shadow hover:shadow-lg hover:-translate-y-1 transition transform flex flex-col overflow-hidden"
          >
            {/* Image */}
            {room.heroImage ? (
              <img
                src={room.heroImage}
                alt={room.roomName}
                className="w-full h-48 object-cover"
                loading="lazy"
                width="400"
                height="192"
              />
            ) : (
              <div className="w-full h-48 flex items-center justify-center bg-gray-100 text-gray-400">
                📷 No Image
              </div>
            )}

            {/* Content */}
            <div className="flex-1 p-5 space-y-2">
              <div className="flex justify-between items-start">
                <h2 className="text-lg font-semibold text-gray-800">
                  {room.roomName}
                </h2>
                <div className="flex items-center gap-2">
                  <FaCircle className={`${STATUS_COLORS[room.roomStatus]} text-xs`} />
                  <select
                    value={room.roomStatus}
                    onChange={(e) => handleStatusChange(room._id, e.target.value)}
                    className="text-sm border rounded px-2 py-1 bg-gray-50 hover:bg-gray-100"
                  >
                    <option value="available">Available</option>
                    <option value="booked">Booked</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              </div>
              <p className="text-sm text-gray-500">{room.roomType}</p>

              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <FaUsers /> Capacity: {room.roomCapacity}
              </div>
              <div className="flex items-center gap-2 text-gray-700 font-medium">
                <FaRupeeSign /> {room.roomPrice.toLocaleString()}
              </div>

              <p className="text-sm text-gray-500 line-clamp-3 bg-gray-50 p-2 rounded">
                {room.roomDescription}
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-between gap-3 border-t border-gray-200 p-4">
              <button
                onClick={() => {
                  setSelectedRoom(room);
                  setIsEditOpen(true);
                }}
                className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-lg hover:bg-blue-100 flex items-center justify-center gap-2 text-sm font-medium transition"
              >
                <FaEdit /> Edit
              </button>
              <button
                onClick={() => handleDeleteRoom(room._id)}
                className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg hover:bg-red-100 flex items-center justify-center gap-2 text-sm font-medium transition"
              >
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {rooms.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg">No rooms available yet</p>
          <p className="text-sm">Click "Add Room" to create your first room.</p>
        </div>
      )}

      {/* Modals */}
      <AddRoomModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSave={handleAddRoom}
      />
      {selectedRoom && (
        <EditRoomModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          onSave={(formData) => handleUpdateRoom(selectedRoom._id, formData)}
          room={selectedRoom}
        />
      )}
    </div>
  );
}