import React, { useState } from "react";
import PageNavigation from "../../extra/PageNavigation";
import AddTimeModal from "../../extra/AddTimeModal";
import { FiPlusCircle, FiRefreshCw } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import ExportSearchControls from "../../extra/ExportSearchControls";
import Pagination from "../../extra/Pagination";

const MembersCliok = () => {
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
  const [membersData, setMembersData] = useState([
    {
      id: 1,
      Teammember: "Bob Smith",
      indate: "-",
      intime: "08:00 AM",
    },
    {
      id: 2,
      Teammember: "Charlie Brown",
      indate: "-",
      intime: "09:30 AM",
    },
    {
      id: 3,
      Teammember: "Jane Smith",
      indate: "-",
      intime: "10:00 AM",
    },
  ]);
  // ✅ Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const totalItems = membersData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const displayedProjects = membersData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  

  const filteredData = membersData.filter((card) =>
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
          {/* Refresh Button */}
          <button
            onClick={() => window.location.reload()}
            className=" relative h-8 bg-transparent text-black px-4 py-2 rounded-lg border hover:bg-slate-100 flex items-center gap-6 "
          >
            <FiRefreshCw className="text-gray-500 hover:text-gray-700" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <ExportSearchControls
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            data={filteredData}
            fileName="MembersClockedIn"
          />
        </div>
      </div>

      {/* Table */}
      <table className="projects-table min-w-full divide-y divide-gray-200 border-t border-gray-200 w-full ">
        <thead className="bg-gray-50 dark:bg-gray-700 dark:text-white">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-bold  uppercase">Team member</th>
            <th className="px-6 py-3 text-left text-xs font-bold  uppercase">In Date</th>
            <th className="px-6 py-3 text-left text-xs font-bold uppercase">In Time</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-700 dark:text-white">
          {filteredData.length > 0 ? (
            filteredData.map((card) => (
              <tr key={card.id}>
                <td className="px-6 py-4">{card.Teammember}</td>
                <td className="px-6 py-4">{card.indate}</td>
                <td className="px-6 py-4">{card.intime}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                No record found.
              </td>
            </tr>
          )}
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

export default MembersCliok;
