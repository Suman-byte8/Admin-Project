import React from "react";
import AccommodationDetails from "./AccommodationDetails";
import RestaurantDetails from "./RestaurantDetails";
import MeetingDetails from "./MeetingDetails";
import { labelToSlug } from "../../utils/typeMapper";

const ReservationDetails = ({ reservation, type }) => {
  const slug = labelToSlug(type); // normalize "Meeting & Wedding" → "meeting", etc.

  return (
    <>
      <h2 className="text-[#111318] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
        Reservation Details
      </h2>
      <div className="p-4 grid grid-cols-2">
        {slug === "accommodation" && (
          <AccommodationDetails reservation={reservation} />
        )}
        {slug === "restaurant" && (
          <RestaurantDetails reservation={reservation} />
        )}
        {slug === "meeting" && (
          <MeetingDetails reservation={reservation} />
        )}
      </div>
    </>
  );
};

export default ReservationDetails;