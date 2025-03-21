import React, { useState } from "react";
import PageNavigation from "../../extra/PageNavigation";
import AddTimeModal from "../../extra/AddTimeModal";
import { FiPlusCircle, FiEdit } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import DateRangePicker from "../../extra/DateRangePicker";
import DropdownButton from "../../extra/DropdownButton ";
import ExportSearchControls from "../../extra/ExportSearchControls";
import { LuColumns2 } from "react-icons/lu";
import Select from "react-select";
import { SlClose } from "react-icons/sl";
import { BsChat } from "react-icons/bs";
import Pagination from "../../extra/Pagination";

const Custom = ({ darkMode }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null); // Store the selected card for editing
  const [searchQuery, setSearchQuery] = useState("");
  const [activeLabel, setActiveLabel] = useState("overview");
  const navigate = useNavigate();

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
    InDate: true,
    InTime: true,
    OutDate: true,
    OutTime: true,
    Duration: true,
    Note: true,
    action: true,
  });

  const columns = [
    { key: "Teammember", label: "Team member" },
    { key: "InDate", label: "In Date" },
    { key: "InTime", label: "In Time" },
    { key: "OutDate", label: "Out Date" },
    { key: "OutTime", label: "Out Time" },
    { key: "Duration", label: "Duration" },
    { key: "Note", label: <BsChat /> },
    { key: "action", label: "Action" },
  ];

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

  const handleOpenModal = (card) => {
    setSelectedCard(card); // Set the selected card for editing
    setShowModal(true); // Open the modal
  };

  const handleCloseModal = () => {
    setShowModal(false); // Close the modal
    setSelectedCard(null); // Reset selected card
  };

  const handleSaveTime = (updatedNote) => {
    const updatedData = timeCardsData.map((card) =>
      card.id === selectedCard.id ? { ...card, Note: updatedNote } : card
    );
    setTimeCardsData(updatedData); // Update the time cards data with the new note
    handleCloseModal(); // Close the modal after saving
  };

  // Sample data for table body
  const [timeCardsData, setTimeCardsData] = useState([
    {
      id: 1,
      Teammember: "Bob Smith",
      InDate: "2025-02-05",
      InTime: "08:00 AM",
      OutDate: "2025-02-05",
      OutTime: "04:00 PM",
      Duration: "8 hours",
      Note: "On time",
    },
    {
      id: 2,
      Teammember: "Charlie Brown",
      InDate: "2025-02-06",
      InTime: "09:00 AM",
      OutDate: "2025-02-06",
      OutTime: "05:00 PM",
      Duration: "8 hours",
      Note: "Late arrival",
    },
  ]);
  // ✅ Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const totalItems = timeCardsData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const displayedProjects = timeCardsData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const filteredData = timeCardsData.filter((card) =>
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
        buttons={[{ label: "Add time manually", icon: FiPlusCircle, onClick: () => setShowModal(true) }]}
      />

      <div className="border-t bg-white border-gray-200 w-full flex justify-between p-4 rounded-t-md dark:bg-gray-700 dark:text-white">
        <div className="flex items-center space-x-4">
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
            fileName="Custom"
          />
        </div>
      </div>

      {/* Table */}
      <table className="projects-table min-w-full divide-y divide-gray-200 border-t border-gray-200 w-full">
        <thead className=" dark:bg-gray-700 dark:text-white">
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
              {visibleColumns.InDate && <td className="px-6 py-4">{card.InDate}</td>}
              {visibleColumns.InTime && <td className="px-6 py-4">{card.InTime}</td>}
              {visibleColumns.OutDate && <td className="px-6 py-4">{card.OutDate}</td>}
              {visibleColumns.OutTime && <td className="px-6 py-4">{card.OutTime}</td>}
              {visibleColumns.Duration && <td className="px-6 py-4">{card.Duration}</td>}
              {visibleColumns.Note && (
                <td className="px-6 py-4">
                  <BsChat
                    onClick={() => handleOpenModal(card)} // Open modal when the icon is clicked
                    className="cursor-pointer text-gray-500 hover:text-blue-500"
                    size={20}
                  />
                </td>
              )}
              {visibleColumns.action && (
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button className="p-1 rounded transition-colors duration-200 mr-2">
                    <FiEdit className="text-gray-400 hover:text-white hover:bg-green-500 rounded-lg" size={20} />
                  </button>
                  <button className="p-1 rounded transition-colors duration-200">
                    <SlClose className="text-gray-400 hover:text-white hover:bg-red-500 rounded-xl" size={20} />
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

export default Custom;
