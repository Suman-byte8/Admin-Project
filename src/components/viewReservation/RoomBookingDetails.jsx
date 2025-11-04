import React from "react";

const RoomBookingDetails = ({ reservation }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-500">Check-in Date</label>
          <p className="mt-1">{new Date(reservation.checkIn).toLocaleDateString()}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500">Check-out Date</label>
          <p className="mt-1">{new Date(reservation.checkOut).toLocaleDateString()}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500">Number of Guests</label>
          <p className="mt-1">{reservation.numberOfGuests}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500">Total Price</label>
          <p className="mt-1">₹{reservation.totalPrice}</p>
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-500">Room Details</label>
          <div className="mt-1 p-3 bg-gray-50 rounded-md">
            <p className="font-medium">{reservation.room?.roomName || 'Room information not available'}</p>
            {reservation.room?.roomType && (
              <p className="text-sm text-gray-600 mt-1">Type: {reservation.room.roomType}</p>
            )}
          </div>
        </div>
        {reservation.specialRequests && (
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-500">Special Requests</label>
            <p className="mt-1 text-gray-700">{reservation.specialRequests}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomBookingDetails;