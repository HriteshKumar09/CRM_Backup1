import React, { useState, useEffect } from "react";
import { BiBarChart } from "react-icons/bi";
import { FiEdit } from "react-icons/fi";
import { SlClose } from "react-icons/sl";
import { LuColumns2 } from "react-icons/lu";
import { RiArrowRightDoubleLine } from "react-icons/ri";
import { Dialog, DialogActions, DialogTitle, Button } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import PageHeader from "../extra/PageHeader";
import DropdownButton from "../extra/DropdownButton ";
import ExportSearchControls from "../extra/ExportSearchControls";
import FormDialog from "../extra/FormDialog";
import Pagination from "../extra/Pagination";
import api from "../Services/api"; // Central API instance

const Polls = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [filterType, setFilterType] = useState("active"); // Default to active
  const [polls, setPolls] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [visibleColumns, setVisibleColumns] = useState({
    title: true,
    createdby: true,
    createddate: true,
    expire: true,
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

  // Fetch all polls from backend
  const fetchPolls = async () => {
    try {
      const response = await api.get("/team-members/polls"); // Use central API
      setPolls(response.data);
    } catch (error) {
      console.error("Error fetching polls:", error);
    }
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  // Get username from token
  const getUsernameFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return "Admin"; // Default to Admin if no token found

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.username || "Admin";
    } catch (error) {
      console.error("Error parsing token:", error);
      return "Admin";
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
      createdby: getUsernameFromToken(),
      created_at: new Date().toISOString(), // Automatically set created_at to the current date and time
      expire_at: pollData.expireAt, // Use the expireAt value from the form
    };

    if (isEditMode) {
      await api.put(`/team-members/polls/${pollData.id}`, payload);
      toast("Poll updated successfully!"); // Use toast for success
    } else {
      await api.post("/team-members/polls", payload);
      toast.success("Poll created successfully!"); // Use toast for success
    }

    fetchPolls(); // Refresh the polls list
    handleCloseDialog(); // Close the dialog
  } catch (error) {
    console.error("Error saving poll:", error);
    toast.error("Failed to save poll."); // Using toast for error message
  }
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
      toast.success("Poll deleted successfully!");
      setDeleteDialog(false);
      fetchPolls();
    } catch (error) {
      console.error("Error deleting poll:", error);
      toast.error("Failed to delete poll.");
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
    { key: "createdby", label: "Created by" },
    { key: "createddate", label: "Created date" },
    { key: "expire", label: "Expire at" },
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
    { name: "expireAt", label: "Expire at", type: "date" },
  ];

  return (
    <div>
      <PageHeader
        title="Polls"
        buttons={[
          {
            label: "Create poll",
            icon: BiBarChart,
            onClick: () => handleOpenDialog(),
          },
        ]}
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
              className={`h-8 px-4 py-2 flex items-center justify-center ${
                filterType === "active" ? "bg-blue-500 text-white" : "text-gray-500 hover:bg-slate-100"
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilterType("in active")}
              className={`h-8 px-4 py-2 flex items-center justify-center ${
                filterType === "in active" ? "bg-blue-500 text-white" : "text-gray-500 hover:bg-slate-100"
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
      <div className="overflow-x-auto bg-white rounded-lg shadow-md mt-4 dark:bg-gray-700 dark:text-white">
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              {columns.map((col) =>
                visibleColumns[col.key] ? (
                  <th key={col.key} className="py-3 px-6 text-left font-semibold text-sm">
                    {col.label}
                  </th>
                ) : null
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-700 dark:text-white">
            {displayedPolls.map((poll) => (
              <tr key={poll.id} className="hover:bg-gray-50">
                {columns.map((col) =>
                  visibleColumns[col.key] ? (
                    <td key={col.key} className="py-3 px-6 text-sm">
                      {col.key === "status" ? (
                        <span
                          className={`px-3 py-1 rounded-lg text-white text-xs font-bold ${
                            poll.status.toLowerCase() === "active"
                              ? "bg-green-500"
                              : poll.status.toLowerCase() === "in active"
                              ? "bg-red-500"
                              : "bg-gray-300"
                          }`}
                        >
                          {poll.status}
                        </span>
                      ) : col.key === "createdby" ? (
                        <span>{poll.createdby || "Admin"}</span>
                      ) : col.key === "createddate" ? (
                        <span>{new Date(poll.created_at).toLocaleDateString()}</span>
                      ) : col.key === "expire" ? (
                        <span>{poll.expire_at ? new Date(poll.expire_at).toLocaleDateString() : "N/A"}</span>
                      ) : col.key === "action" ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleOpenDialog(poll)}
                            className="p-1 rounded transition-colors duration-200 hover:bg-green-500"
                          >
                            <FiEdit className="text-gray-700 hover:text-white" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(poll.id)}
                            className="p-1 rounded transition-colors duration-200 hover:bg-red-500"
                          >
                            <SlClose className="text-gray-700 hover:text-white" />
                          </button>
                        </div>
                      ) : (
                        poll[col.key]
                      )}
                    </td>
                  ) : null
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Are you sure you want to delete this poll?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default Polls;