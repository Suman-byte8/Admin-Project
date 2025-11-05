// src/utils/typeMapper.js

// Maps human-friendly labels to backend slugs
export const labelToSlug = (label) => {
  switch (label) {
    case "Accommodation":
    case "accommodation":
      return "accommodation";
    case "Restaurant Reservation":
    case "restaurant":
      return "restaurant";
    case "Meeting & Wedding":
    case "meeting":
      return "meeting";
    default:
      return "accommodation";
  }
};

// Maps slugs to human-friendly labels
export const slugToLabel = (slug) => {
  switch (slug) {
    case "accommodation":
      return "Accommodation";
    case "restaurant":
      return "Restaurant Reservation";
    case "meeting":
      return "Meeting & Wedding";
    default:
      return "Accommodation";
  }
};