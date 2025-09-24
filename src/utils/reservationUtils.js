export const calculateTotalGuests = (rooms, totalAdults, totalChildren) => {
  if (Array.isArray(rooms) && rooms.length > 0) {
    const adults = rooms.reduce((sum, room) => sum + (typeof room.adults === 'object' ? 0 : (room.adults || 0)), 0);
    const children = rooms.reduce((sum, room) => sum + (typeof room.children === 'object' ? 0 : (room.children || 0)), 0);
    return adults + children;
  } else {
    const adults = typeof totalAdults === 'object' ? 0 : (totalAdults || 0);
    const children = typeof totalChildren === 'object' ? 0 : (totalChildren || 0);
    return adults + children;
  }
};

export const calculateRoomSummary = (rooms) => {
  if (!Array.isArray(rooms) || rooms.length === 0) return 'N/A';
  const totalRooms = rooms.length;
  const totalAdults = rooms.reduce((sum, room) => sum + (typeof room.adults === 'object' ? 0 : (room.adults || 0)), 0);
  const totalChildren = rooms.reduce((sum, room) => sum + (typeof room.children === 'object' ? 0 : (room.children || 0)), 0);
  if (totalRooms === 1) {
    return `1 room: ${totalAdults} adult${totalAdults !== 1 ? 's' : ''}${totalChildren > 0 ? `, ${totalChildren} child${totalChildren !== 1 ? 'ren' : ''}` : ''}`;
  } else {
    return `${totalRooms} rooms: ${totalAdults} adult${totalAdults !== 1 ? 's' : ''}${totalChildren > 0 ? `, ${totalChildren} child${totalChildren !== 1 ? 'ren' : ''}` : ''}`;
  }
};
