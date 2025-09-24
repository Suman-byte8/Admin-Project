import React, { useRef, memo, useContext } from "react";
import { CiSearch } from "react-icons/ci";
import { FaSun, FaMoon } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import { AdminContext } from "@/context/AdminContext";

function Topbar(){
  const ref = useRef(null);
  // const { theme, toggleTheme } = useTheme();
  const { admin, loading } = useContext(AdminContext);
  const displayName = admin?.firstName;
  
  return (
    <div ref={ref} className="bg-white shadow-md p-2 flex items-center justify-between dark:bg-card">
      <div className="text-xl font-semibold">
        {loading || !displayName ? (
          <span className="inline-block h-6 w-40 bg-gray-200 animate-pulse rounded" />
        ) : (
          <>Welcome {displayName}!</>
        )}
      </div>

      {/* <div className="flex-1 max-w-xl mx-4">
        <div className="flex items-center bg-white border border-gray-300 rounded-full px-4 py-2 dark:bg-card dark:border-gray-600">
          <input className="flex-1 outline-none bg-transparent" placeholder="Search" />
          <div className="w-8 h-8 flex items-center justify-center">
            <CiSearch className="text-gray-500 dark:text-muted"/>
          </div>
        </div>
      </div> */}

      {/* <div className="flex items-center space-x-2">
        <button onClick={toggleTheme} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
          {theme === 'dark' ? <FaSun className="text-yellow-500" /> : <FaMoon className="text-gray-500" />}
        </button>
      </div> */}
    </div>
  );
}

export default memo(Topbar);
