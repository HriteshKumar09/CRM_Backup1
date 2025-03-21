import React, { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import Select from "react-select";

const TimesheetsChart = () => {
  const location = useLocation(); // Detects current active path

   const [memberOption, setMemberOption] = useState(null);

   const memberOptions = [];

  return (
    <div className=" bg-gray-100 dark:bg-gray-800 ">
      {/* Timesheets Navigation Tabs */}
      <div className="bg-white shadow-md rounded-t-md p-4 dark:bg-gray-700 dark:text-white flex justify-between items-center">
        {/* Left Section: Title and Navigation Tabs */}
        <div className="flex items-center gap-4">
          <label className="font-semibold">TimeSheets</label>
          <nav className="flex flex-wrap text-sm font-medium">
            {[
              { name: "Details", path: "/dashboard/projects/view/timesheets_details" },
              { name: "Summary", path: "/dashboard/projects/view/timesheets_summary" },
              { name: "Chart", path: "/dashboard/projects/view/timesheets_chart" },
            ].map((tab, index) => (
              <NavLink
                key={index}
                to={tab.path}
                className={({ isActive }) =>
                  `px-4 py-2 font-medium transition rounded-md ${isActive || location.pathname === tab.path
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "border-b-2 border-transparent hover:text-blue-600 hover:border-blue-600"
                  }`
                }
              >
                {tab.name}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Right Section: Log Time Button */}
        <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 hover:scale-110">
          Log Time
        </button>
      </div>

      {/* Outlet for Nested Routes */}
      <div className="p-3 bg-white shadow-lg dark:bg-gray-700 dark:text-white">
        <Outlet />
        <Select
        value={memberOption}
        onChange={setMemberOption}
        options={memberOptions}
        className="w-48"
        classNamePrefix="select"
        placeholder="- Select Member -"
      />
      </div>
     
    </div>
  )
}

export default TimesheetsChart;
