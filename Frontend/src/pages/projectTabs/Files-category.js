import React, { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import DropdownButton from "../../extra/DropdownButton ";
import ExportSearchControls from "../../extra/ExportSearchControls";
import { LuColumns2 } from "react-icons/lu";
import Pagination from "../../extra/Pagination";

const FilesCategory = () => {
  const location = useLocation(); // Detects current active path
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([])

  // ✅ Column Visibility Toggle State
  const [visibleColumns, setVisibleColumns] = useState({
    name: true,
  });

  const columns = [{ key: "name", label: "Name" }];

  const toggleColumn = (key) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // ✅ Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalItems = categories.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // ✅ Apply Pagination
  const paginatedCategories = categories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="  dark:bg-gray-800">
      {/* Files Navigation Tabs */}
      <div className="bg-white shadow-md rounded-t-md p-4 dark:bg-gray-700 dark:text-white flex justify-between items-center">
        {/* Left Section: Title and Navigation Tabs */}
        <div className="flex items-center gap-4">
          <label className="font-semibold">Files</label>
          <nav className="flex flex-wrap text-sm font-medium">
            {[
              { name: "Files", path: "/dashboard/projects/view/file" },
              { name: "Category", path: "/dashboard/projects/view/filesCategory" },
            ].map((tab, index) => (
              <NavLink
                key={index}
                to={tab.path}
                className={({ isActive }) =>
                  `px-4 py-2 font-medium transition rounded-md transform hover:scale-105 ${
                    isActive || location.pathname === tab.path
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

        {/* Right Section: Add Category Button */}
        <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          Add Category
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
          </div>

          {/* Search and Export Controls */}
          <div className="flex items-center gap-2">
            <ExportSearchControls
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              fileName="FilesCategory"
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
              {paginatedCategories.length > 0 ? (
                paginatedCategories.map((category, index) => (
                  <tr
                    key={index}
                    className="border-b hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    {columns.map((col) =>
                      visibleColumns[col.key] ? (
                        <td key={col.key} className="px-4 py-2 border">
                          {category[col.key]}
                        </td>
                      ) : null
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="text-center py-4 text-gray-500 dark:text-gray-400">
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ✅ Pagination Component */}
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

export default FilesCategory;
