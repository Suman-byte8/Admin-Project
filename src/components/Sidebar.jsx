import React, { useContext, useRef, memo } from "react";
import { Link } from "react-router-dom";
import { FaPowerOff, FaPager, FaAngleDoubleUp, FaImages } from "react-icons/fa";
import { TbLayoutDashboardFilled, TbReservedLine } from "react-icons/tb";
import { MdMeetingRoom } from "react-icons/md";
import {} from "react-icons/fa";
import { BiSolidOffer } from "react-icons/bi";
import { RiServiceFill } from "react-icons/ri";

import { AdminContext } from "@/context/AdminContext";
import FullLogo from "./FullLogo";
import logo from "../../public/logo.png";

function Sidebar() {
  const ref = useRef(null);
  const { logout, admin, loading } = useContext(AdminContext);
  console.log(admin);

  return (
    <aside
      ref={ref}
      className="w-64 bg-gray-800 text-white flex flex-col p-4 space-y-6 overflow-y-auto sticky top-0 h-screen"
      style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}
    >
      <div className="flex flex-col items-center space-y-2">
        <div className="w-24 h-24 rounded-full p-3 border-1 border-white">
          <img src={logo} alt="logo" className="h-full w-full" />
        </div>
        <div className="font-semibold text-2xl uppercase">
          {loading || !admin?.firstName ? (
            <span className="inline-block h-6 w-32 bg-gray-700/50 animate-pulse rounded" />
          ) : (
            admin.firstName
          )}
        </div>
        <div className="text-xs opacity-90">
          {loading || !admin?.email ? (
            <span className="inline-block h-4 w-40 bg-gray-700/50 animate-pulse rounded" />
          ) : (
            admin.email
          )}
        </div>
      </div>

      <ul className="flex flex-col space-y-1">
        <li>
          <Link
            to="/"
            className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-700 cursor-pointer gap-2"
          >
            <TbLayoutDashboardFilled />
            <span className="">Dashboard</span>
          </Link>
        </li>

       

        <li>
          <Link
            to="/reservation-management"
            className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-700 cursor-pointer gap-2"
          >
            <TbReservedLine />
            <span className="">Reservations</span>
          </Link>
        </li>


        <li>
          <Link
            to="/membership-applications"
            className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-700 cursor-pointer gap-2"
          >
            <MdMeetingRoom />
            <span className="">Membership</span>
          </Link>
        </li>


        <li>
          <Link
            to="/room-management"
            className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-700 cursor-pointer gap-2"
          >
            <MdMeetingRoom />
            <span className="">Room Management</span>
          </Link>
        </li>


        <li>
          <Link
            to="/page-management"
            className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-700 cursor-pointer gap-2"
          >
            <FaPager />
            <span className="">Page Management</span>
          </Link>
        </li>

        <li>
          <Link
            to="/about-management"
            className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-700 cursor-pointer gap-2"
          >
            <FaAngleDoubleUp />
            <span className="">About Management</span>
          </Link>
        </li>

        <li>
          <Link
            to="/gallery-management"
            className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-700 cursor-pointer gap-2"
          >
            <FaImages />
            <span className="">Gallery Management</span>
          </Link>
        </li>

        <li>
          <Link
            to="/offer-management"
            className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-700 cursor-pointer gap-2"
          >
            <BiSolidOffer />
            <span className="">Offers</span>
          </Link>
        </li>

        <li>
          <Link
            to="/facility-management"
            className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-700 cursor-pointer gap-2"
          >
            <RiServiceFill />
            <span className="">Facilities</span>
          </Link>
        </li>

        {/* <li>
          <Link to="/reservations" className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-700 cursor-pointer gap-2">
            <RiReservedFill />
            <span className="">Reservation</span>
          </Link>
        </li>

        <li>
          <Link to="/membership" className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-700 cursor-pointer gap-2">
            <MdCardMembership />
            <span className="">Membership</span>
          </Link>
        </li>

        <li>
          <Link to="/payments-links-management" className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-700 cursor-pointer gap-2">
            <MdPayment />
            <span className="">Payment Links</span>
          </Link>
        </li>

        <li>
          <Link to="/staff-management" className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-700 cursor-pointer gap-2">
            <IoIosPeople />
            <span className="">Staff Management</span>
          </Link>
        </li>

        <li>
          <Link to="/settings" className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-700 cursor-pointer gap-2">
            <IoMdSettings />
            <span className="">Settings</span>
          </Link>
        </li> */}
      </ul>

      <div
        className="mt-auto flex items-center space-x-3 p-2 rounded-md hover:bg-gray-700 cursor-pointer"
        onClick={logout}
      >
        <FaPowerOff />
        <span>Logout</span>
      </div>
    </aside>
  );
}

export default memo(Sidebar);
