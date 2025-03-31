import React, { useState, useEffect } from "react";
import { BiBarChart } from "react-icons/bi";
import { FiEdit } from "react-icons/fi";
import { SlClose } from "react-icons/sl";
import { LuColumns2 } from "react-icons/lu";
import { RiArrowRightDoubleLine } from "react-icons/ri";
import PageHeader from "../extra/PageHeader";
import DropdownButton from "../extra/DropdownButton ";
import ExportSearchControls from "../extra/ExportSearchControls";
import { toast, ToastContainer } from "react-toastify";
import FormDialog from "../extra/FormDialog";
import PollDetail from "./PollDetails";
import Pagination from "../extra/Pagination";
import api from "../Services/api"; // Central API instance

const Polls = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [filterType, setFilterType] = useState("active"); // Default to active
  const [polls, setPolls] = useState([]);
  const [selectedPoll, setSelectedPoll] = useState(null); // To store selected poll for modal
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [visibleColumns, setVisibleColumns] = useState({
    title: true,
    created_by: true,
    created_at: true,
    expire_at: true,
    status: true,
    action: true,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pollData, setPollData] = useState({
    title: "",
    description: "",
    expireAt: "",
  });
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [pollToDelete, setPollToDelete] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null); // State to track which poll is clicked for dropdown

  // Fetch all polls from backend
  const fetchPolls = async () => {
    try {
      const response = await api.get("/team-members/polls");
      if (response.data && Array.isArray(response.data)) {
        setPolls(response.data);
      } else {
        console.error("Invalid response format:", response.data);
        toast.error("Invalid response format from server");
        setPolls([]);
      }
    } catch (error) {
      console.error("Error fetching polls:", error);
      toast.error(error.response?.data?.error || "Failed to fetch polls");
      setPolls([]);
    }
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  // Get username from token
  const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return 1; // Default to user ID 1 (Admin) if no token found

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.userId || 1; // Ensure this matches the field in your token
    } catch (error) {
      console.error("Error parsing token:", error);
      return 1; // Default to user ID 1 (Admin)
    }
  };

  // Handle Status Change (Active / Inactive)
  const handleStatusChange = async (pollId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      const response = await api.put(`/team-members/polls/${pollId}`, { status: newStatus });
      if (response.data) {
        // Show success toast with status change
        toast.success(`Poll status changed from ${currentStatus} to ${newStatus}`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        fetchPolls(); // Re-fetch the polls after the update
        setDropdownOpen(null); // Close the dropdown after selection
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Error updating poll status:", error);
      toast.error(error.response?.data?.error || "Failed to update poll status", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  // Open Dialog to Add/Edit Poll
  const handleOpenDialog = (poll = null) => {
    if (poll) {
      setIsEditMode(true);
      setPollData({
        ...poll,
        expireAt: poll.expire_at || "", // Map existing expire_at field
      });
    } else {
      setIsEditMode(false);
      setPollData({
        title: "",
        description: "",
        expireAt: "",
      });
    }
    setIsDialogOpen(true);
  };

  // Close Dialog
  const handleCloseDialog = () => setIsDialogOpen(false);

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPollData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Save New Poll or Update Existing One
  const handleSavePoll = async () => {
    try {
      const payload = {
        ...pollData,
        created_by: getUserIdFromToken(),
        expire_at: pollData.expireAt || null,
        poll_answer_id: pollData.iteams || null,
      };

      if (isEditMode) {
        await api.put(`/team-members/polls/${pollData.id}`, payload);
        toast.success("Poll updated successfully!");
      } else {
        await api.post("/team-members/polls", payload);
        toast.success("Poll created successfully!");
      }

      fetchPolls();
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving poll:", error);
      toast.error(error.response?.data?.error || "Failed to save poll.");
    }
  };

  // Helper function to check if the expire_at date has passed
  const isExpireDatePassed = (expireAt) => {
    const today = new Date();
    const expireDate = new Date(expireAt);
    return expireDate < today;  // Returns true if the expire date has passed
  };

  // Open Delete Confirmation Dialog
  const handleDeleteClick = (pollId) => {
    setPollToDelete(pollId);
    setDeleteDialog(true);
  };

  // Confirm Delete Poll
  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/team-members/polls/${pollToDelete}`);
      setDeleteDialog(false);
      fetchPolls();
      toast.success("Poll deleted successfully!");
    } catch (error) {
      console.error("Error deleting poll:", error);
      toast.error(error.response?.data?.error || "Failed to delete poll.");
    }
  };

  // Filtering polls based on status & search query
  const filteredPolls = polls.filter(
    (poll) =>
      (filterType === "" || poll.status.toLowerCase() === filterType.toLowerCase()) &&
      poll.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination Logic
  const totalItems = filteredPolls.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const displayedPolls = filteredPolls.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Define columns
  const columns = [
    { key: "title", label: "Title" },
    { key: "created_by", label: "Created by" },
    { key: "created_at", label: "Created date" },
    { key: "expire_at", label: "Expire at" },
    { key: "status", label: "Status" },
    { key: "action", label: "Action" },
  ];

  // Toggle Column Visibility
  const toggleColumn = (key) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Define fields for the FormDialog
  const fields = [
    { name: "title", label: "Title", type: "text", placeholder: "What do you want to ask?" },
    { name: "description", label: "Description", type: "text", multiline: true, rows: 3, placeholder: "Description" },
    { name: "expireAt", label: "Expire at", type: "date", placeholder: "Select expiration date" },
  ];

  // Handle Poll Click (Open Modal with Poll Details)
  const handlePollClick = (pollId) => {
    setSelectedPoll(pollId);
  };

  // Close Modal
  const closeModal = () => {
    setSelectedPoll(null);
  };

  // Add click outside handler for dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest('.status-dropdown')) {
        setDropdownOpen(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />
      <PageHeader
        title="Polls"
        buttons={[{ label: "Create poll", icon: BiBarChart, onClick: () => handleOpenDialog() }]}
      />

      {/* Filters and Actions */}
      <div className="border-t bg-white border-gray-200 w-full flex justify-between p-3 dark:bg-gray-700 dark:text-white">
        <div className="flex items-center space-x-4">
          <DropdownButton
            icon={LuColumns2}
            options={columns}
            visibleItems={visibleColumns}
            toggleItem={toggleColumn}
          />
          <div className="flex border rounded-lg overflow-hidden">
            <button
              onClick={() => setFilterType("active")}
              className={`h-8 px-4 py-2 flex items-center justify-center ${filterType === "active" ? "bg-blue-500 text-white" : "text-gray-500 hover:bg-slate-100"
                }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilterType("inactive")}
              className={`h-8 px-4 py-2 flex items-center justify-center ${filterType === "inactive" ? "bg-blue-500 text-white" : "text-gray-500 hover:bg-slate-100"
                }`}
            >
              Inactive
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ExportSearchControls
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            data={polls}
            fileName="Poll"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md dark:bg-gray-700 dark:text-white">
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              {columns.map((col) => visibleColumns[col.key] && <th key={col.key} className="py-3 px-6 text-left font-semibold text-sm">{col.label}</th>)}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-700 dark:text-white">
            {displayedPolls.map((poll) => (
              <tr key={poll.id} className="hover:bg-gray-50">
                {columns.map(
                  (col) =>
                    visibleColumns[col.key] && (
                      <td key={col.key} className="py-3 px-6 text-sm">
                        {col.key === "title" ? (
                          <span onClick={() => handlePollClick(poll.id)}
                            className="hover:underline cursor-pointer">
                            {poll.title}
                          </span>
                        ) : col.key === "status" ? (
                          <div className="relative status-dropdown">
                            <button
                              className={`px-4 py-1.5 rounded-lg text-white text-sm font-medium flex items-center gap-2 transition-all duration-200 ${
                                poll.status.toLowerCase() === "active" 
                                  ? "bg-green-500 hover:bg-green-600" 
                                  : "bg-red-500 hover:bg-red-600"
                              }`}
                              onClick={() => setDropdownOpen(dropdownOpen === poll.id ? null : poll.id)}
                            >
                              <span className="w-2 h-2 rounded-full bg-white"></span>
                              {poll.status}
                              <svg
                                className="w-4 h-4 transition-transform duration-200"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                style={{ transform: dropdownOpen === poll.id ? 'rotate(180deg)' : 'rotate(0)' }}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            </button>
                            {dropdownOpen === poll.id && (
                              <div className="absolute z-50 right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg py-1">
                                <button
                                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors duration-200"
                                  onClick={() => handleStatusChange(poll.id, poll.status)}
                                >
                                  <span className={`w-2 h-2 rounded-full ${
                                    poll.status.toLowerCase() === "active" ? "bg-red-500" : "bg-green-500"
                                  }`}></span>
                                  {poll.status.toLowerCase() === "active" ? "Mark as Inactive" : "Mark as Active"}
                                </button>
                              </div>
                            )}
                          </div>
                        ) : col.key === "created_at" ? (
                          <span>{new Date(poll.created_at).toLocaleDateString()}</span>
                        ) : col.key === "expire_at" ? (
                          <span className={isExpireDatePassed(poll.expire_at) ? "text-red-500" : ""}>
                            {poll.expire_at ? new Date(poll.expire_at).toLocaleDateString() : "N/A"}
                          </span>
                        ) : col.key === "action" ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleOpenDialog(poll)}
                              className="p-2 rounded-md transition-colors duration-200"
                            >
                              <FiEdit className="text-green-500 hover:bg-green-200" size={22} />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(poll.id)}
                              className="p-1 rounded-md transition-colors duration-200"
                            >
                              <SlClose className="text-red-500 hover:bg-red-200" size={22} />
                            </button>
                          </div>
                        ) : (
                          poll[col.key]
                        )}
                      </td>
                    )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Show Modal if a poll is selected */}
      {selectedPoll && (
        <PollDetail
          pollId={selectedPoll}
          closeModal={closeModal}
          handleDeleteClick={handleDeleteClick}
          handleOpenDialog={handleOpenDialog}
        />
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        setCurrentPage={setCurrentPage}
        totalItems={totalItems}
      />

      {/* Add/Edit Poll Dialog */}
      <FormDialog
        open={isDialogOpen}
        handleClose={handleCloseDialog}
        type={isEditMode ? "Edit Poll" : "Create Poll"}
        fields={fields}
        formData={pollData}
        handleChange={handleChange}
        showUploadButton={false}
        extraButtons={[
          {
            label: isEditMode ? "Update Poll" : "Save & Add Options",
            onClick: handleSavePoll,
            icon: RiArrowRightDoubleLine,
            color: "#007bff",
          },
        ]}
      />

      {/* Delete Confirmation Dialog */}
      {deleteDialog && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p>Are you sure you want to delete this poll?</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setDeleteDialog(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="ml-4 px-4 py-2 bg-red-500 text-white rounded-lg"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Polls;