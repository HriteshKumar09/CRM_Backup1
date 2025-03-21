import React, { useState } from "react";
import PageNavigation from "../../extra/PageNavigation";
import AddTimeModal from "../../extra/AddTimeModal";
import { FiPlusCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import DropdownButton from "../../extra/DropdownButton ";
import ExportSearchControls from "../../extra/ExportSearchControls";
import { LuColumns2 } from "react-icons/lu";
import { RxExit } from "react-icons/rx";
import Pagination from "../../extra/Pagination";

const Clockinout = () => {
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeLabel, setActiveLabel] = useState("overview");
  const navigate = useNavigate(); // React Router Navigation Hook

  const handleOpenTab = (label) => {
    setActiveLabel(label);
    switch (label) {
      case "Custom":
        navigate("/dashboard/time-cards/custom"); // ✅ Correct absolute path
        break;
      case "Summary":
        navigate("/dashboard/time-cards/summary"); // ✅ Correct absolute path
        break;
      case "Summary details":
        navigate("/dashboard/time-cards/summary-details"); // ✅ Correct absolute path
        break;
      case "Members Clocked In":
        navigate("/dashboard/time-cards/member-clock"); // ✅ Correct absolute path
        break;
      case "Clock in-out":
        navigate("/dashboard/time-cards/clock-in-out"); // ✅ Correct absolute path
        break;
      default:
        navigate("/dashboard/time-cards"); // ✅ Fallback to main time-cards page
        break;
    }
  };  

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSaveTime = (data) => {
    console.log("Time Saved:", data);
    setShowModal(false);
  };

  // Sample data for table body
  const [clockData, setClockData] = useState([
    {
      id: 1,
      Teammember: "Bob Smith",
      Status: "Clock started at : 09:49:02 am",
      Clock: "08:00 AM",
    },
    {
      id: 2,
      Teammember: "Charlie Brown",
      Status: "Clock started at : 09:49:02 am",
      Clock: "09:30 AM",
    },
    {
      id: 3,
      Teammember: "Jane Smith",
      Status: "Clock started at : 09:49:02 am",
      Clock: "10:00 AM",
    },
  ]);

  // ✅ Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const totalItems = clockData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const displayedProjects = clockData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  
  const [visibleColumns, setVisibleColumns] = useState({
    Teammember: true,
    Status: true,
    Clock: true,
  });

  // Define column headers
  const columns = [
    { key: "Teammember", label: "Team member" },
    { key: "Status", label: "Status" },
    { key: "Clock", label: "Clock in-out" },
  ];

  // Toggle column visibility
  const toggleColumn = (key) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const filteredData = clockData.filter((card) =>
    card.Teammember.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <PageNavigation
        title="Time cards"
        labels={[
          { label: "Daily", value: "Daily" },
          { label: "Custom", value: "Custom" },
          { label: "Summary", value: "Summary" },
          { label: "Summary details", value: "Summary details" },
          { label: "Members Clocked In", value: "Members Clocked In" },
          { label: "Clock In-Out", value: "Clock in-out" },
        ]}
        activeLabel={activeLabel}
        handleLabelClick={handleOpenTab}
        buttons={[{ label: "Add time manually", icon: FiPlusCircle, onClick: handleOpenModal }]}
      />

      <div className="border-t bg-white border-gray-200 w-full flex justify-between p-4 rounded-t-md dark:bg-gray-700 dark:text-white">
        <div className="flex items-center space-x-4">
          {/* Dropdown Button */}
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
            data={filteredData}
            fileName="ClockInOut"
          />
        </div>
      </div>

      {/* Table */}
      <table className="projects-table min-w-full divide-y divide-gray-200 border-t border-gray-200 w-full">
        <thead className="bg-gray-50 dark:bg-gray-700 dark:text-white">
          <tr>
            {columns.map(
              (col) =>
                visibleColumns[col.key] && (
                  <th key={col.key} className="px-6 py-3 text-left text-xs font-bold uppercase">
                    {col.label}
                  </th>
                )
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-700 dark:text-white">
          {filteredData.map((card) => (
            <tr key={card.id}>
              {visibleColumns.Teammember && <td className="px-6 py-4">{card.Teammember}</td>}
              {visibleColumns.Status && <td className="px-6 py-4">{card.Status}</td>}
              {visibleColumns.Clock && (
                <td className="px-6 py-4">
                  <button className="px-2 py-2 bg-transparent text-gray-500 rounded-md border flex items-center gap-2">
                    <span className="ml-2 ">
                      {card.Status === "Clocked In" ? (
                        <RxExit className="text-gray-500" /> // Use RxExit for Clock Out
                      ) : (
                        <RxExit className="text-gray-500" /> // Use RxExit for Clock In
                      )}
                    </span>
                    <span>{card.Status === "Clocked In" ? "Clock Out" : "Clock In"}</span>
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {/* ✅ Pagination Component */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        setCurrentPage={setCurrentPage}
        totalItems={totalItems}
      />
      {showModal && <AddTimeModal onClose={handleCloseModal} onSave={handleSaveTime} />}
    </div>
  );
};

export default Clockinout;
