import React, { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import DropdownButton from "../../extra/DropdownButton ";
import ExportSearchControls from "../../extra/ExportSearchControls";
import { LuColumns2 } from "react-icons/lu";
import Select from "react-select";
import Pagination from "../../extra/Pagination";

const TimesheetsSummary = () => {
  const location = useLocation(); // Detects current active path
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ State for Column Visibility Toggle
  const [visibleColumns, setVisibleColumns] = useState({
    member: true,
    task: true,
    duration: true,
    hours: true,
  });

  const columns = [
    { key: "member", label: "Member" },
    { key: "task", label: "Task" },
    { key: "duration", label: "Duration" },
    { key: "hours", label: "Hours" },
  ];

  const toggleColumn = (key) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // ✅ Dummy Data for Timesheets Summary
  const [timesheetSummary, setTimesheetSummary] = useState([]);

  // ✅ Pagination Logic
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalItems = timesheetSummary.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedSummary = timesheetSummary.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // ✅ Search Filter Logic
  const filteredSummary = paginatedSummary.filter((entry) =>
    Object.values(entry).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // ✅ Dropdown Options
  const memberOptions = [
    { value: "John Doe", label: "John Doe" },
    { value: "Alice Smith", label: "Alice Smith" },
    { value: "Mark Johnson", label: "Mark Johnson" },
  ];

  const taskOptions = [
    { value: "Develop Backend", label: "Develop Backend" },
    { value: "UI Design", label: "UI Design" },
    { value: "Testing", label: "Testing" },
  ];

  const groupOptions = [
    { value: "By Member", label: "By Member" },
    { value: "By Task", label: "By Task" },
    { value: "By Duration", label: "By Duration" },
  ];

  return (
    <div className="  dark:bg-gray-800 ">
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
                  `px-4 py-2 font-medium transition rounded-md ${
                    isActive || location.pathname === tab.path
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "border-b-2 border-transparent hover:text-blue-600 hover:border-blue-600  hover:scale-110"
                  }`
                }
              >
                {tab.name}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Right Section: Log Time Button */}
        <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          Log Time
        </button>
      </div>

      {/* Outlet for Nested Routes */}
      <div className="p-3 bg-white shadow-lg dark:bg-gray-700 dark:text-white">
        <Outlet />

        {/* Table Header with Column Controls */}
        <div className="border-t bg-white border-gray-200 w-full flex justify-between p-3 rounded-t-md dark:bg-gray-700 dark:text-white">
          <div className="flex items-center space-x-4">
            {/* Column Toggle Dropdown */}
            <DropdownButton
              icon={LuColumns2}
              options={columns}
              visibleItems={visibleColumns}
              toggleItem={toggleColumn}
            />

            {/* Member Select Dropdown */}
            <Select
              options={memberOptions}
              className="w-48"
              classNamePrefix="select"
              placeholder="- Select Member -"
            />

            {/* Task Select Dropdown */}
            <Select
              options={taskOptions}
              className="w-48"
              classNamePrefix="select"
              placeholder="- Select Task -"
            />

            {/* Group By Select Dropdown */}
            <Select
              options={groupOptions}
              className="w-48"
              classNamePrefix="select"
              placeholder="- Group By -"
            />
          </div>

          {/* Search and Export Controls */}
          <div className="flex items-center gap-2">
            <ExportSearchControls
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              fileName="TimesheetsSummary"
            />
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full bg-white dark:bg-gray-700 dark:text-white border border-gray-200">
            <thead className="bg-gray-200 dark:bg-gray-800">
              <tr>
                {columns.map((col) =>
                  visibleColumns[col.key] ? (
                    <th key={col.key} className="px-4 py-2 text-left border">
                      {col.label}
                    </th>
                  ) : null
                )}
              </tr>
            </thead>
            <tbody>
              {filteredSummary.length > 0 ? (
                filteredSummary.map((entry, index) => (
                  <tr key={index} className="border-b hover:bg-gray-100 dark:hover:bg-gray-600">
                    {columns.map((col) =>
                      visibleColumns[col.key] ? (
                        <td key={col.key} className="px-4 py-2 border">{entry[col.key]}</td>
                      ) : null
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="text-center py-4 text-gray-500 dark:text-gray-400">
                    No timesheets found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          setCurrentPage={setCurrentPage}
          totalItems={totalItems}
        />
      </div>
    </div>
  );
};

export default TimesheetsSummary;
