// src/utils/reservationManagementUtils.js

/**
 * Format a date string into DD/MM/YYYY.
 * @param {string|Date} dateString
 * @returns {string}
 */
export const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB"); // => 15/02/2025
  } catch {
    return "N/A";
  }
};

/**
 * Calculate total guests depending on the reservation type.
 * @param {object} reservation
 * @returns {string}
 */
export const calculateTotalGuests = (reservation) => {
  switch (reservation.typeOfReservation) {
    case "accommodation": {
      const adults = Number(reservation.totalAdults || 0);
      const children = Number(reservation.totalChildren || 0);
      const total = adults + children;
      return total > 0 ? `${total} person${total > 1 ? "s" : ""}` : "N/A";
    }
    case "restaurant": {
      const diners = Number(reservation.noOfDiners || 0);
      return diners > 0 ? `${diners} person${diners > 1 ? "s" : ""}` : "N/A";
    }
    case "room": {
      const guests = Number(reservation.numberOfGuests || 0);
      return guests > 0 ? `${guests} person${guests > 1 ? "s" : ""}` : "N/A";
    }
    case "Reception":
    case "Marriage":
    case "Engagement":
    case "Birthday":
    case "Corporate Event": {
      const guests = Number(reservation.numberOfGuests || 0);
      return guests > 0 ? `${guests} person${guests > 1 ? "s" : ""}` : "N/A";
    }
    default:
      return "N/A";
  }
};

/**
 * Extract arrival/start date display depending on type.
 */
export const getArrivalDate = (reservation) => {
  const { typeOfReservation: type } = reservation;
  if (type === "accommodation") return formatDate(reservation.arrivalDate);
  if (type === "restaurant") return formatDate(reservation.date);
  if (type === "room") return formatDate(reservation.checkIn);
  if (["Reception", "Marriage", "Engagement", "Birthday", "Corporate Event"].includes(type))
    return formatDate(reservation.reservationDate);
  return "N/A";
};

/**
 * Extract departure/end info depending on type.
 */
export const getDepartureInfo = (reservation) => {
  const { typeOfReservation: type } = reservation;
  if (type === "accommodation") return formatDate(reservation.departureDate);
  if (type === "restaurant") return reservation.timeSlot || "N/A";
  if (type === "room") return formatDate(reservation.checkOut);
  if (["Reception", "Marriage", "Engagement", "Birthday", "Corporate Event"].includes(type))
    return formatDate(reservation.reservationEndDate);
  return "N/A";
};

/**
 * Get guest name/email/phone cleanly.
 */
export const getGuestName = (reservation) =>
  reservation.guestInfo?.name || reservation.guestInfo?.guestName || "N/A";

export const getGuestEmail = (reservation) =>
  reservation.guestInfo?.email || "N/A";

export const getGuestPhone = (reservation) =>
  reservation.guestInfo?.phoneNumber || reservation.guestInfo?.phone || "N/A";

/**
 * Reservation type string (safe fallback).
 */
export const getReservationType = (reservation) =>
  reservation.typeOfReservation || "N/A";

/* -------------------------------
   Local Preferences Helpers
--------------------------------*/

/**
 * Save filters/preferences to localStorage.
 */
export const saveReservationPreferences = (preferences) => {
  try {
    localStorage.setItem("reservationPreferences", JSON.stringify(preferences));
  } catch (err) {
    console.error("Error saving reservation preferences:", err);
  }
};

/**
 * Load saved filters/preferences from localStorage.
 */
export const loadReservationPreferences = () => {
  try {
    const saved = localStorage.getItem("reservationPreferences");
    return saved ? JSON.parse(saved) : null;
  } catch (err) {
    console.error("Error loading reservation preferences:", err);
    return null;
  }
};

/**
 * Clear saved preferences.
 */
export const clearReservationPreferences = () => {
  try {
    localStorage.removeItem("reservationPreferences");
  } catch (err) {
    console.error("Error clearing reservation preferences:", err);
  }
};