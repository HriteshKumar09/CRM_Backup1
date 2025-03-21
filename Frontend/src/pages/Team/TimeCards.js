import React, { useState, useEffect, useCallback } from "react";
import api from "../../Services/api";  // Central API instance
import PageNavigation from "../../extra/PageNavigation";
import { useNavigate } from "react-router-dom";
import { FiPlusCircle, FiEdit } from "react-icons/fi";
import { LuColumns2 } from "react-icons/lu";
import AddTimeModal from "../../extra/AddTimeModal";
import DropdownButton from "../../extra/DropdownButton ";
import ExportSearchControls from "../../extra/ExportSearchControls";
import Dailycalender from "../../extra/Dailycalender";
import { BsChat } from "react-icons/bs";
import Select from "react-select";
import { SlClose } from "react-icons/sl";
import Pagination from "../../extra/Pagination";



const TimeCards = () => {
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCard, setSelectedCard] = useState(null);
  const [activeLabel, setActiveLabel] = useState("overview");
  const navigate = useNavigate(); // ✅ React Router Navigation Hook
  const [timeCardsData, setTimeCardsData] = useState([]);
  const [teammembers, setTeammembers] = useState([]); // State to store team members
  const [selectedTeammember, setSelectedTeammember] = useState(null);
  const [users, setUsers] = useState([]); 

  const handleOpenTab = (label) => {
    setActiveLabel(label);
    switch (label) {
      case "Custom":
        navigate("/dashboard/time-cards/custom"); // ✅ Absolute path
        break;
      case "Summary":
        navigate("/dashboard/time-cards/summary"); // ✅ Absolute path
        break;
      case "Summary details":
        navigate("/dashboard/time-cards/summary-details"); // ✅ Absolute path
        break;
      case "Members Clocked In":
        navigate("/dashboard/time-cards/member-clock"); // ✅ Absolute path
        break;
      case "Clock in-out":
        navigate("/dashboard/time-cards/clock-in-out"); // ✅ Absolute path
        break;
      default:
        navigate("/dashboard/time-cards"); // ✅ Fallback to default time-cards page
        break;
    }
  };

  const [visibleColumns, setVisibleColumns] = useState({
    firstName: true,
    lastName: true,
    inDate: true,
    inTime: true,
    outDate: true,
    outTime: true,
    duration: true,
    action: true,
  });

  // Define column headers
  const columns = [
    { key: "firstName", label: "First Name" },
    { key: "lastName", label: "Last Name" },
    { key: "inDate", label: "In Date" },
    { key: "inTime", label: "In Time" },
    { key: "outDate", label: "Out Date" },
    { key: "outTime", label: "Out Time" },
    { key: "duration", label: "Duration" },
    { key: "action", label: "Action" },
  ];

  // 📌 Fetch time cards and team members from backend
  useEffect(() => {
    fetchTimeCards();
    fetchTeammembers();
  }, []);

  // Fetch users (to map user data in time cards)
  const fetchUsers = useCallback(async () => {
    try {
      const response = await api.get(`/auth`);
      setUsers(response.data.users); // Assuming the response data contains users
    } catch (error) {
      console.error("❌ Error fetching users:", error);
    }
  }, []);

  // Fetch time cards data
  const fetchTimeCards = useCallback(async () => {
    try {
      const response = await api.get(`/my-timecard`);
      const formattedData = response.data.map((card) => {
        const user = users.find((u) => u.id === card.user_id) || {};
        return {
          id: card.id,
          firstName: user.first_name || "Unknown",
          lastName: user.last_name || "Unknown",
          inTime: new Date(card.in_time).toLocaleString(),
          outTime: card.out_time ? new Date(card.out_time).toLocaleString() : "--",
          status: card.status, // Pending, Approved, Rejected
        };
      });
      setTimeCardsData(formattedData);
    } catch (error) {
      console.error("❌ Error fetching time cards:", error);
    }
  }, [users]);

   
  const fetchTeammembers = async () => {
    try {
      const response = await api.get(`/team-members/get-members`);
      setTeammembers(response.data); // Assuming the response is an array of team members
    } catch (error) {
      console.error("❌ Error fetching team members:", error);
    }
  };

  // Toggle column visibility
  const toggleColumn = (key) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const teammemberOptions = teammembers.map((member) => ({
    value: member.id,
    label: member.name,
  }));

    // Handle saving the time data
  const handleSaveTime = async (data) => {
    try {
      if (selectedCard) {
        // Update existing timecard
        await api.put(`/timecards/${selectedCard.id}`, data);
        setTimeCardsData((prev) =>
          prev.map((card) => (card.id === selectedCard.id ? data : card))
        );
      } else {
        // Create new timecard
        const response = await api.post(`/timecards`, data);
        setTimeCardsData((prev) => [
          ...prev,
          { ...data, id: response.data.id },
        ]);
      }
      setShowModal(false); // Close the modal after saving
    } catch (error) {
      console.error("❌ Error saving time card:", error);
    }
  };

  

  // ✅ Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const totalItems = timeCardsData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedTimeCards = timeCardsData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const filteredData = timeCardsData.filter((card) =>
    card.firstName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = (card) => {
    setSelectedCard(card); // Set the selected card for editing
    setShowModal(true); // Open the modal
  };

  const handleCloseModal = () => {
    setShowModal(false); // Close the modal
    setSelectedCard(null); // Reset selected card
  };

  // ✅ Reject Timecard
  // Handle rejecting the timecard
  const handleRejectTimecard = async (timeCardId, rejectReason) => {
    try {
      await api.put(`/update-status`, {
        id: timeCardId,
        status: "rejected",
        reject_reason: rejectReason,
      });
      fetchTimeCards();
    } catch (error) {
      console.error("❌ Error rejecting timecard:", error);
    }
  };

  const handleApproveTimecard = async (timeCardId) => {
    try {
      await api.put(`/update-status`, {
        id: timeCardId,
        status: "approved",
      });
      fetchTimeCards();
    } catch (error) {
      console.error("❌ Error approving timecard:", error);
    }
  };

  const handleDeleteTimeCard = async (timeCardId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this timecard?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/delete/${timeCardId}`);
      fetchTimeCards();
      alert("Timecard deleted successfully!");
    } catch (error) {
      console.error("❌ Error deleting timecard:", error);
      alert("Failed to delete timecard. Please try again.");
    }
  };

  return (
    <div className=" ">
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
        buttons={[
          { label: "Add time manually", icon: FiPlusCircle, onClick: handleOpenModal },
        ]}
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
            options={teammemberOptions}
            value={selectedTeammember}
            onChange={setSelectedTeammember}
            placeholder="- Member -"
            isSearchable
            className="w-48"
          />
          <Dailycalender />
        </div>
        <div className="flex items-center gap-2">
          <ExportSearchControls
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            data={filteredData}
            fileName="Daily"
          />
        </div>
      </div>
      <table className="projects-table min-w-full divide-y divide-gray-200 border-t border-gray-200 w-full text-sm">
        <thead className="dark:bg-gray-700 dark:text-white">
          <tr>
            {columns.map(
              (col) =>
                visibleColumns[col.key] && (
                  <th key={col.key} className="px-4 py-2 text-left text-xs font-bold uppercase">
                    {col.label}
                  </th>
                )
            )}
          </tr>
        </thead>
        <tbody className="bg-black divide-y divide-gray-200 dark:bg-gray-700 dark:text-white">
          {paginatedTimeCards.map((card) => (
            <tr key={card.id}>
              {visibleColumns.firstName && <td className="px-4 py-2">{card.firstName}</td>}
              {visibleColumns.lastName && <td className="px-4 py-2">{card.lastName}</td>}
              {visibleColumns.inDate && <td className="px-4 py-2">{card.inDate}</td>}
              {visibleColumns.inTime && <td className="px-4 py-2">{card.inTime}</td>}
              {visibleColumns.outDate && <td className="px-4 py-2">{card.outDate}</td>}
              {visibleColumns.outTime && <td className="px-4 py-2">{card.outTime}</td>}
              {visibleColumns.duration && <td className="px-4 py-2">{card.duration}</td>}
              {visibleColumns.Note && (
                <td className="px-4 py-2">
                  <BsChat
                    onClick={() => handleOpenModal(card)}
                    className="cursor-pointer text-gray-500 hover:text-blue-500"
                    size={20}
                  />
                </td>
              )}
              {visibleColumns.action && (
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => handleOpenModal(card)}
                    className="p-1 rounded transition-colors duration-200 mr-2">
                    <FiEdit className="text-gray-400 hover:text-white hover:bg-green-500 rounded-lg" size={20} />
                  </button>
                  <button
                    onClick={() => handleDeleteTimeCard(card.id)}
                    className="p-1 rounded transition-colors duration-200">
                    <SlClose className="text-gray-400 hover:text-white hover:bg-red-500 rounded-xl" size={20} />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
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

export default TimeCards;