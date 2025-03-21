import { useState } from "react";
import PageHeader from "../../extra/PageHeader";
import DropdownButton from "../../extra/DropdownButton ";
import ExportSearchControls from "../../extra/ExportSearchControls";
import { LuColumns2 } from "react-icons/lu";
import Pagination from "../../extra/Pagination";
import { FiPlusCircle } from "react-icons/fi";


const Milestones = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [milestones, setMilestone] = useState ([])

  const [visibleColumns, setVisibleColumns] = useState({
    date: true,
    title: true,
    progress: true,
  });

  const columns = [
    { key: "date", label: "Due Date" },
    { key: "title", label: "Title" },
    { key: "progress", label: "Progress" },
  ];

  const toggleColumn = (key) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };
  // ✅ Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const totalItems = milestones.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedMilestones = Array.isArray(milestones) ? milestones.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) : [];

  // Filter milestones based on search query
  const filteredMilestones = milestones.filter((milestone) =>
    Object.values(milestone).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 min-h-screen">
      {/* Page Header */}
      <PageHeader title="Milestones" buttons={[{ label: "Add Milestones",icon: FiPlusCircle, }]} />

      {/* Toolbar: Column Selection & Search */}
      <div className="border-t bg-white border-gray-200 w-full flex justify-between p-3 rounded-t-md dark:bg-gray-700 dark:text-white">
        <div className="flex items-center space-x-4">
          <DropdownButton
            icon={LuColumns2}
            options={columns}
            visibleItems={visibleColumns}
            toggleItem={toggleColumn}
          />
        </div>
        <div className="flex items-center gap-2">
          <ExportSearchControls
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            fileName="Milestones"
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
            {filteredMilestones.length > 0 ? (
              filteredMilestones.map((milestone, index) => (
                <tr key={index} className="border-b hover:bg-gray-100 dark:hover:bg-gray-600">
                  {columns.map((col) =>
                    visibleColumns[col.key] ? (
                      <td key={col.key} className="px-4 py-2 border">
                        {col.key === "progress" ? (
                          <div className="relative w-36 bg-gray-300 rounded-full h-5">
                            <div
                              className="absolute top-0 left-0 h-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center"
                              style={{ width: `${milestone.progress}%` }}
                            >
                              {milestone.progress}%
                            </div>
                          </div>
                        ) : (
                          milestone[col.key]
                        )}
                      </td>
                    ) : null
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center py-4 text-gray-500 dark:text-gray-400">
                  No milestones found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        setCurrentPage={setCurrentPage}
        totalItems={totalItems}
      />
    </div>
  );
};

export default Milestones;
