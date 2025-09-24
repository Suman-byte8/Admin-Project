import React from "react";
import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AdminProvider } from "./context/AdminContext";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Auth/Login";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import Signup from "./pages/Auth/Signup";
import RoomManagement from "./pages/RoomManagement";
import EditRoomPage from "./components/RoomManagement/EditRoomPage";

// Layouts
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import MenuManagement from "./pages/MenuManagement";
import PageManagement from "./pages/PageManagement";
import AdminBannerPreview from "./components/PageManagement/AdminBannerPreview";
import AdminDistinctivePreview from "./components/PageManagement/AdminDistinctivePreview";
import OfferManagement from "./pages/OfferManagement";
import AddOfferPage from "./pages/AddOfferPage";
import FacilityManagement from "./pages/FacilityManagement";
import AboutManagement from "./pages/AboutManagement";
import GalleryManagement from "./pages/GalleryManagement";
import UserProfile from "./pages/UserProfile";
import ReservationManagement from "./pages/ReservationManagement";
import ViewReservation from "./pages/ViewReservation";
import MembershipApplications from "./pages/MembershipApplications";
import MemberDetailsPage from "./pages/MemberDetailsPage";

const MainLayout = () => (
  <div className="flex h-screen bg-page dark:bg-page">
    <Sidebar />
    <div className="flex flex-col flex-1">
      <Topbar />
      <main className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  </div>
);

const App = () => {
  return (
    <BrowserRouter>
      <AdminProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/sign-up" element={<Signup />} />
          <Route path="/log-in" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected routes */}
          <Route element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="room-management" element={<RoomManagement />} />
            <Route path="room-management/edit-room" element={<EditRoomPage />} />
            <Route path="menu-management" element={<MenuManagement />} />
            <Route path="page-management" element={<PageManagement />} />
            <Route path="page-management/home-banner-preview" element={<AdminBannerPreview />} />
            <Route path="page-management/distinctive-preview" element={<AdminDistinctivePreview />} />
            <Route path="offer-management" element={<OfferManagement />} />
            <Route path="offer-management/add-offer" element={<AddOfferPage />} />
            <Route path="facility-management" element={<FacilityManagement />} />
            <Route path="about-management" element={<AboutManagement />} />
            <Route path="gallery-management" element={<GalleryManagement />} />
            <Route path="user-profile/:userId" element={<UserProfile />} />
            <Route path="reservation-management" element={<ReservationManagement />} />
            <Route path="view-reservation/:id/:type" element={<ViewReservation />} />
            <Route path="membership-applications" element={<MembershipApplications />} />
            <Route path="members/:id" element={<MemberDetailsPage />} />
          </Route>
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </AdminProvider>
    </BrowserRouter>
  );
};

export default App;
