import React, { useState } from "react";
import { FiSettings, FiClock } from "react-icons/fi";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import ReminderModal from "../../extra/Reminders";
import { RiLayoutGridFill } from "react-icons/ri";
import { IoMdStarOutline } from "react-icons/io";

const ProjectDetail = () => {
  const [timerRunning, setTimerRunning] = useState(false);
  const [isReminderModalOpen, setReminderModalOpen] = useState(false);
  const location = useLocation(); // Detects current path

  const toggleTimer = () => {
    setTimerRunning(!timerRunning); 
  };

  const toggleReminderModal = () => {
    setReminderModalOpen((prev) => !prev);
  };

  return (
    <div className="min-h-screen dark:bg-gray-800 p-4">
      {/* Header Section */}
      <div className="header flex justify-between items-center bg-white dark:bg-gray-700 p-4 shadow-md rounded-md">
        <h2 className="text-xl font-bold dark:text-white flex gap-2"> <RiLayoutGridFill/> <IoMdStarOutline className=" text-yellow-400"/> </h2>
        <div className="flex gap-4">
          {/* Reminders Button */}
          <button
            onClick={toggleReminderModal}
            class="relative w-32 h-10 rounded-md border text-md font-semibold 
           flex items-center justify-start  transition-all duration-500 ease-in-out focus:outline-none active:scale-95 group hover:bg-blue-100"
          >
            <span class="absolute left-0 h-8 w-10 flex items-center justify-center rounded-md transition-all duration-500 group-hover:w-32 ">
              <FiClock size={22} />
            </span>
            <span class="ml-10 transition-all duration-500 group-hover:opacity-0">
            Reminders
            </span>
          </button>

          <button class="relative w-32 h-10 rounded-md border text-md font-semibold 
           flex items-center justify-start  transition-all duration-500 ease-in-out focus:outline-none active:scale-95 group hover:bg-blue-100">

            <span class="absolute left-0 h-8 w-10 flex items-center justify-center rounded-md transition-all duration-500 group-hover:w-32">
              <FiSettings size={22} />
            </span>

            <span class="ml-12 transition-all duration-500 group-hover:opacity-0">
              Settings
            </span>
          </button>

          {/* Actions Select Dropdown */}
          <select className="px-3 py-2 border rounded-md bg-gray-200 dark:bg-gray-600 dark:text-white focus:outline-none hover:-translate-y-1">
            <option value="" disabled selected>
              Actions
            </option>
            <option value="clone-project">Clone Project</option>
            <option value="edit-project">Edit Project</option>
          </select>

          {/* Start Timer Button */}
          <button
            onClick={toggleTimer}
            className={`px-3 py-2 border text-white  rounded-md flex items-center gap-2 ${timerRunning ? "bg-red-500 hover:bg-red-600" : " bg-green-500 hover:bg-green-400 hover:-translate-y-1"
              }`}
          >
            <FiClock size={20} />
            {timerRunning ? "Stop Timer" : "Start Timer"}
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-md mt-6  rounded-lg  dark:bg-gray-700 dark:text-white">
        <nav className="flex  justify-start text-sm font-medium p-3">
          <div className="w-full flex  justifystart items-center gap-4">
            {[
              { name: "Overview", path: "overview" },
              { name: "TaskList", path: "TaskList" },
              { name: "Tasks Kanban", path: "kanban" },
              { name: "Milestones", path: "milestones" },
              { name: "Gantt", path: "gantt" },
              { name: "Notes", path: "notes" },
              { name: "Files", path: "Files" },
              { name: "Comments", path: "comments" },
              { name: "Payments", path: "payments" },
              { name: "Payments", path: "payments" },
              { name: "Timesheets", path: "timesheets" },
              { name: "Invoices", path: "invoice" },
              { name: "Customer feedback", path: "feedback" },
              
            ].map((tab, index) => (
              <NavLink
                key={index}
                to={tab.path}
                className={({ isActive }) =>
                  `px-4 py-2 font-medium transition ${isActive || location.pathname.includes(tab.path)
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "border-b-2 border-transparent hover:text-blue-600 hover:border-blue-600 hover:scale-110"
                  }`
                }
              >
                {tab.name}
              </NavLink>
            ))}
          </div>
        </nav>
        <div className="w-full flex  justifystart items-center gap-4">
            {[
              { name: "Expenses", path: "Expenses" },
              { name: "Contracts", path: "Contracts" },
           
            ].map((tab, index) => (
              <NavLink
                key={index}
                to={tab.path}
                className={({ isActive }) =>
                  `px-4 py-2 font-medium transition ${isActive || location.pathname.includes(tab.path)
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "border-b-2 border-transparent hover:text-blue-600 hover:border-blue-600 hover:scale-110"
                  }`
                }
              >
                {tab.name}
              </NavLink>
            ))}
          </div>
      </div>
      {/* Outlet for Nested Routes */}
      <div className=" shadow-lg rounded-lg dark:bg-gray-700 dark:text-white">
        <Outlet />
      </div>

      {/* Reminder Modal */}
      <ReminderModal isOpen={isReminderModalOpen} onClose={toggleReminderModal} />
    </div>
  );
};

export default ProjectDetail;
