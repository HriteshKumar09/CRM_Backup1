import React, { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import Select from "react-select";

const Timesheets = () => {
  const location = useLocation(); // Detects current active path
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal
  const [selectedTask, setSelectedTask] = useState(null);

  const taskOptions = [];

  return (
    <div className="  dark:bg-gray-800 min-h-screen">
      {/* Timesheets Navigation Tabs */}
      <div className="bg-white mt-2 shadow-md rounded-t-md p-4 dark:bg-gray-700 dark:text-white flex justify-between items-center">
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
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Log Time
        </button>
      </div>

      {/* Outlet for Nested Routes */}
      <div className="p-3 bg-white shadow-lg dark:bg-gray-700 dark:text-white">
        <Outlet />
      </div>

      {/* Log Time Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-[600px] p-6 dark:bg-gray-700 dark:text-white">
            {/* Header */}
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-lg font-semibold">Log time</h2>
              <IoClose className="text-xl cursor-pointer" onClick={() => setIsModalOpen(false)} />
            </div>

            {/* Modal Body */}
            <div className="mt-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Start Date & Time */}
                <div>
                  <label className="block text-sm font-medium">Start date</label>
                  <input type="date" className="w-full p-2 border rounded-md bg-gray-100 dark:bg-gray-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium">Start time</label>
                  <input type="time" className="w-full p-2 border rounded-md bg-gray-100 dark:bg-gray-600" />
                </div>

                {/* End Date & Time */}
                <div>
                  <label className="block text-sm font-medium">End date</label>
                  <input type="date" className="w-full p-2 border rounded-md bg-gray-100 dark:bg-gray-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium">End time</label>
                  <input type="time" className="w-full p-2 border rounded-md bg-gray-100 dark:bg-gray-600" />
                </div>
              </div>

              {/* Notes Section */}
              <div className="mt-4">
                <label className="block text-sm font-medium">Note</label>
                <textarea className="w-full p-2 border rounded-md bg-gray-100 dark:bg-gray-600 h-20"></textarea>
              </div>

              {/* Task Selection */}
              <div className="mt-4">
                <label className="block text-sm font-medium">Task</label>
                <Select
                  value={selectedTask}
                  onChange={setSelectedTask}
                  options={taskOptions}
                  className="basic-single p-1"
                  classNamePrefix="select"
                  placeholder="- Select Task -"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border rounded-md text-gray-700 dark:text-white hover:bg-gray-200"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timesheets;
