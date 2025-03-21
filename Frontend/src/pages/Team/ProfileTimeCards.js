import React, { useState, useEffect, useCallback } from "react";
import api from "../../Services/api";  // Central API instance
import PageNavigation from "../../extra/PageNavigation";
import { useNavigate } from "react-router-dom";
import { FiPlusCircle, FiEdit } from "react-icons/fi";
import { LuColumns2 } from "react-icons/lu";
import AddTimeModal from "../../extra/AddTimeModal";  // Modal for adding/editing timecards
import DropdownButton from "../../extra/DropdownButton ";
import ExportSearchControls from "../../extra/ExportSearchControls";
import Pagination from "../../extra/Pagination";
import { BsChat } from "react-icons/bs";
import { SlClose } from "react-icons/sl";
import DailyCalendar from "../../extra/Dailycalender";  // Corrected import for DailyCalendar

const ProfileTimeCards = () => {
  const [timeCardsData, setTimeCardsData] = useState([]); // Timecards data
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const [selectedCard, setSelectedCard] = useState(null); // Selected card for editing
  const [currentPage, setCurrentPage] = useState(1); // Pagination
  const [itemsPerPage, setItemsPerPage] = useState(10); // Items per page
  const totalItems = timeCardsData.length; // Total items for pagination
  const totalPages = Math.ceil(totalItems / itemsPerPage); // Total pages for pagination
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const [visibleColumns, setVisibleColumns] = useState({
    inDate: true,
    inTime: true,
    outDate: true,
    outTime: true,
    duration: true,
    action: true,
  });
  const [user, setUser] = useState(null); // To store logged-in user data
  const navigate = useNavigate();

  // Columns for table
  const columns = [
    { key: "inDate", label: "In Date" },
    { key: "inTime", label: "In Time" },
    { key: "outDate", label: "Out Date" },
    { key: "outTime", label: "Out Time" },
    { key: "duration", label: "Duration" },
    { key: "action", label: "Action" },
  ];

  // Fetch current user's profile (logged-in user)
  const fetchCurrentUser = useCallback(async () => {
    try {
      const response = await api.get(`/auth/profile`);
      setUser(response.data); // Set the logged-in user's profile data
    } catch (error) {
      console.error("❌ Error fetching user profile:", error);
    }
  }, []);

  // Fetch timecards data for the logged-in user
  const fetchTimeCards = useCallback(async () => {
    try {
      if (user) {
        const response = await api.get(`/timecards/my-timecard`);
        
        // Check if response.data.data is an array before mapping
        if (Array.isArray(response.data.data)) {
          const formattedData = response.data.data.map((card) => {
            let formattedDuration = "N/A"; // Default to N/A for duration
            let outTime = card.out_time ? new Date(card.out_time) : null;
            let inTime = new Date(card.in_time);

            // Only calculate duration if out_time exists
            if (outTime) {
              const durationMs = outTime - inTime;
              const durationHours = Math.floor(durationMs / 3600000);
              const durationMinutes = Math.floor((durationMs % 3600000) / 60000);
              formattedDuration = `${durationHours}h ${durationMinutes}m`;
            }

            return {
              id: card.id,
              firstName: user.first_name || "Unknown",
              lastName: user.last_name || "Unknown",
              inDate: inTime.toLocaleDateString(),
              inTime: inTime.toLocaleTimeString(),
              outDate: outTime ? outTime.toLocaleDateString() : "N/A",
              outTime: outTime ? outTime.toLocaleTimeString() : "N/A",
              duration: formattedDuration,
              note: card.note || "",
            };
          });
          setTimeCardsData(formattedData);
        } else {
          console.error("❌ Response data is not an array:", response.data);
        }
      }
    } catch (error) {
      console.error("❌ Error fetching time cards:", error);
    }
  }, [user]);

  // Fetch timecards and users when component mounts
  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  useEffect(() => {
    if (user) {
      fetchTimeCards();
    }
  }, [user, fetchTimeCards]);

  // Pagination logic
  const paginatedTimeCards = timeCardsData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleOpenModal = (card) => {
    setSelectedCard(card); // Set selected card for editing
    setShowModal(true); // Open the modal
  };

  const handleCloseModal = () => {
    setShowModal(false); // Close modal
    setSelectedCard(null); // Reset selected card
  };

  // Handle saving the timecard
  const handleSaveTime = async (data) => {
    try {
      if (selectedCard) {
        await api.put(`/timecards/${selectedCard.id}`, data);
        setTimeCardsData((prev) =>
          prev.map((card) => (card.id === selectedCard.id ? data : card))
        );
      } else {
        const response = await api.post(`/timecards`, data);
        setTimeCardsData((prev) => [...prev, { ...data, id: response.data.id }]);
      }
      setShowModal(false);
    } catch (error) {
      console.error("❌ Error saving time card:", error);
    }
  };

  // Handle deleting the timecard
  const handleDeleteTimeCard = async (timeCardId) => {
    try {
      await api.delete(`/timecards/${timeCardId}`);
      fetchTimeCards(); // Refresh timecards after deletion
    } catch (error) {
      console.error("❌ Error deleting timecard:", error);
    }
  };

  // Handle rejecting the timecard
  const handleRejectTimecard = async (timeCardId, rejectReason) => {
    try {
      await api.put(`/attendance/reject`, {
        id: timeCardId,
        reject_reason: rejectReason,
      });
      fetchTimeCards(); // Refresh timecards after rejection
    } catch (error) {
      console.error("❌ Error rejecting timecard:", error);
    }
  };

  // Handle approving the timecard
  const handleApproveTimecard = async (timeCardId) => {
    try {
      await api.put(`/attendance/approve`, {
        id: timeCardId,
      });
      fetchTimeCards(); // Refresh timecards after approval
    } catch (error) {
      console.error("❌ Error approving timecard:", error);
    }
  };

  return (
    <div className=" ">
      <PageNavigation
        title="My Time Cards"
        activeLabel="Monthly"
        handleLabelClick={() => navigate("/dashboard/time-cards/overview")}
      />

      <div className="border-t bg-white border-gray-200 w-full flex justify-between p-4 rounded-t-md dark:bg-gray-700 dark:text-white">
        <div className="flex items-center space-x-4">
          {/* Dropdown Button */}
          <DropdownButton
            icon={LuColumns2}
            options={columns}
            visibleItems={visibleColumns}
            toggleItem={(key) => setVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }))}
          />
          <DailyCalendar />
        </div>
        <div className="flex items-center gap-2">
          <ExportSearchControls
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            data={timeCardsData}
            fileName="Time Cards"
          />
        </div>
      </div>

      {/* Table */}
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
        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-700 dark:text-white">
          {paginatedTimeCards.map((card) => (
            <tr key={card.id}>
              {visibleColumns.inDate && <td className="px-4 py-2">{card.inDate}</td>}
              {visibleColumns.inTime && <td className="px-4 py-2">{card.inTime}</td>}
              {visibleColumns.outDate && <td className="px-4 py-2">{card.outDate}</td>}
              {visibleColumns.outTime && <td className="px-4 py-2">{card.outTime}</td>}
              {visibleColumns.duration && <td className="px-4 py-2">{card.duration}</td>}
              {visibleColumns.action && (
                <td className="px-4 py-2 text-sm">
                  <button
                    onClick={() => handleOpenModal(card)}
                    className="p-1 rounded transition-colors duration-200  mr-2"
                  >
                    <FiEdit className="text-gray-400 hover:text-white hover:bg-green-500 rounded-lg" size={20} />
                  </button>
                  <button
                    onClick={() => handleDeleteTimeCard(card.id)}
                    className="p-1 rounded transition-colors duration-200 "
                  >
                    <SlClose className="text-gray-400 hover:text-white hover:bg-red-500 rounded-xl" size={20} />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Component */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        setCurrentPage={setCurrentPage}
        totalItems={totalItems}
      />

      {/* Add/Edit Time Modal */}
      {showModal && <AddTimeModal onClose={handleCloseModal} onSave={handleSaveTime} />}
    </div>
  );
};

export default ProfileTimeCards;
