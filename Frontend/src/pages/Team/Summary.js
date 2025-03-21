import React, { useState } from "react";
import PageNavigation from "../../extra/PageNavigation";
import AddTimeModal from "../../extra/AddTimeModal";
import { FiPlusCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import DateRangePicker from "../../extra/DateRangePicker";
import DropdownButton from "../../extra/DropdownButton ";
import ExportSearchControls from "../../extra/ExportSearchControls";
import { LuColumns2 } from "react-icons/lu";
import Pagination from "../../extra/Pagination";
import Select from "react-select";

const Summary = ({darkMode}) => {
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

  const [visibleColumns, setVisibleColumns] = useState({
    Teammember: true,
    Duration: true,
    Hours: true,
  });

  // Define column headers
  const columns = [
    { key: "Teammember", label: "Team member" },
    { key: "Duration", label: "Duration" },
    { key: "Hours", label: "Hours" },
  ];

  // Toggle column visibility
  const toggleColumn = (key) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const teammember = [
    { value: "", label: "- Member -" },
    { value: "bob", label: "Bob Smith" },
    { value: "charlie", label: "Charlie Brown" },
  ];
  const [selectedTeammember, setSelectedTeammember] = useState(null);

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
  const [summaryData, setSummaryData] = useState([
    {
      id: 1,
      Teammember: "Bob Smith",
      Duration: "8 ",
      Hours: "8",
    },
    {
      id: 2,
      Teammember: "Charlie Brown",
      Duration: "7 ",
      Hours: "7",
    },
    {
      id: 3,
      Teammember: "Jane Smith",
      Duration: "6 ",
      Hours: "6",
    },
  ]);

  // ✅ Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const totalItems = summaryData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const displayedProjects = summaryData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const filteredData = summaryData.filter((card) =>
    card.Teammember.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <PageNavigation
        title="Time Cards"
        labels={[
          { label: "Daily", value: "Daily" },
          { label: "Custom", value: "Custom" },
          { label: "Summary", value: "Summary" },
          { label: "Summary details", value: "Summary details" },
          { label: "Members Clocked In", value: "Members Clocked In" },
          { label: "Clock In-Out", value: "Clock in-out" },
        ]}
        activeLabel={activeLabel}
        handleLabelClick={handleOpenTab} // ✅ Corrected function
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
         <Select
            options={teammember}
            value={selectedTeammember}
            onChange={setSelectedTeammember}
            placeholder="- Member -"
            isSearchable
            className="w-48 dark:bg-gray-700 dark:text-white"
            styles={{
              control: (base, { isFocused }) => ({
                ...base,
                backgroundColor: darkMode ? "#374151" : "white", // Dark mode: gray-700
                color: darkMode ? "white" : "black",
                borderColor: isFocused ? "#2563eb" : darkMode ? "#4B5563" : "#D1D5DB",
                boxShadow: isFocused ? "0 0 0 2px rgba(37, 99, 235, 0.5)" : "none",
              }),
              singleValue: (base) => ({
                ...base,
                color: darkMode ? "white" : "black",
              }),
              menu: (base) => ({
                ...base,
                backgroundColor: darkMode ? "#374151" : "white", // Dark mode: gray-700
                color: darkMode ? "white" : "black",
              }),
              option: (base, { isFocused, isSelected }) => ({
                ...base,
                backgroundColor: isSelected
                  ? "#2563eb"
                  : isFocused
                    ? darkMode
                      ? "#4B5563"
                      : "#E5E7EB"
                    : darkMode
                      ? "#374151"
                      : "white",
                color: isSelected ? "white" : darkMode ? "white" : "black",
              }),
            }}
          />
          <DateRangePicker />
        </div>
        <div className="flex items-center gap-2">
          <ExportSearchControls
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            data={filteredData}
            fileName="Summary"
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
              {visibleColumns.Duration && <td className="px-6 py-4">{card.Duration}</td>}
              {visibleColumns.Hours && <td className="px-6 py-4">{card.Hours}</td>}
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

export default Summary;
