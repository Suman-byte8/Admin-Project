// src/pages/ViewReservation.jsx
import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { getReservationById } from "../services/reservationApi";
import { AdminContext } from "../context/AdminContext";
import ReservationHeader from "../components/viewReservation/ReservationHeader";
import BasicInfo from "../components/viewReservation/BasicInfo";
import GuestInfo from "../components/viewReservation/GuestInfo";
import ReservationDetails from "../components/viewReservation/ReservationDetails";
import LoadingState from "../components/viewReservation/LoadingState";
import ErrorState from "../components/viewReservation/ErrorState";
import NotFoundState from "../components/viewReservation/NotFoundState";

const ViewReservation = () => {
  const { id: encodedId, type: encodedType } = useParams();
  const id = decodeURIComponent(encodedId);
  const type = decodeURIComponent(encodedType);

  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getToken } = useContext(AdminContext);

  const token = getToken();
  if (!token) {
    alert("Auth token not found. Please log in again.");
    return;
  }

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        const resp = await getReservationById(token, type, id);
        setReservation(resp.data); // backend returns {success:true,data:{}}
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id && type) fetchReservation();
  }, [id, type, token]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!reservation) return <NotFoundState />;

  return (
    <div className="flex flex-1 justify-center py-5">
      <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
        <ReservationHeader />
        <BasicInfo reservation={reservation} type={type} />
        <GuestInfo guestInfo={reservation.guestInfo || {}} />
        <ReservationDetails reservation={reservation} type={type} />
      </div>
    </div>
  );
};

export default ViewReservation;