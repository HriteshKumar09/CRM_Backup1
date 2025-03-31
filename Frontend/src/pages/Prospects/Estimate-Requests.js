import React, { useState, useEffect } from "react";
import PageNavigation from "../../extra/PageNavigation";
import { FiPlusCircle } from "react-icons/fi";
import DropdownButton from "../../extra/DropdownButton ";
import { LuColumns2 } from "react-icons/lu";
import ExportSearchControls from "../../extra/ExportSearchControls";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import FormDialog from "../../extra/FormDialog.js";
import { FiEdit, FiRefreshCw, FiCheck, FiPause, FiX, FiPlus } from 'react-icons/fi';
import Select from "react-select";
import api from "../../Services/api.js";
import { useNavigate } from "react-router-dom";
import { CiSettings } from "react-icons/ci";
import Pagination from "../../extra/Pagination.js"; // ✅ Import Pagination Component
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EstimateRequests = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [selectedAssigned, setSelectedAssigned] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false); // State to toggle popup
  const [isEditMode, setIsEditMode] = useState(false);
  const [openSingleEstimate, setOpenSingleEstimate] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);

  // Status mapping for styling
  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "new":
        return "bg-yellow-500";
      case "processing":
        return "bg-blue-500";
      case "hold":
        return "bg-orange-500";
      case "estimated":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleSaveEstimate = () => {
    console.log("Saving estimate...", estimateData);
    // Add logic to save data (e.g., API call)
    setOpenSingleEstimate(false); // Close the modal after saving
  };

  // ✅ Function to Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEstimateData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOpenEditForm = (request) => {
    setEstimateData({
      assigned: request.assigned || "",
    });
    setIsEditMode(true);
    setOpenSingleEstimate(true);
  };

  const handleOpenEstimateForm = () => {
    setEstimateData({
      date: "",
      valid: "",
      tax: "",
      secondtax: "",
      note: "",
    });
    setIsEditMode(false);
    setOpenSingleEstimate(true);
  };

  const AddEstimateFields = [
    { name: "date", label: "Estimate date", type: "date" },
    { name: "valid", label: "Valid until", type: "date" },
    { name: "tax", label: "TAX", type: "select", options: [] },
    { name: "secondtax", label: "Second TAX", type: "select", options: [] },
    { name: "note", label: "Note", type: "textarea", multiline: true, rows: 2 },
  ];

  const EditEstimateFields = [
    { name: "assigned", label: "Assigned", type: "select", options: [] },
  ];

  const [estimateData, setEstimateData] = useState({
    assigned: "",
    date: "",
    valid: "",
    tax: "",
    secondtax: "",
    note: "",
  });

  // ✅ Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Adjust per page count

  // ✅ Dropdown Filter States
  const [assignedOptions, setAssignedOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);

  // ✅ Column Visibility State
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    client: true,
    title: true,
    assigned: true,
    createDate: true,
    status: true,
    action: true,
  });

  // ✅ Column Headers
  const columns = [
    { key: "id", label: "ID" },
    { key: "client", label: "Client" },
    { key: "title", label: "Title" },
    { key: "assigned", label: "Assigned to" },
    { key: "createDate", label: "Created date" },
    { key: "status", label: "Status" },
    { key: "action", label: "Action" },
  ];

  // ✅ Fetch API Data (Estimate Requests)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log("Fetching estimate requests...");
        const response = await api.get("/estimate/estimate-requests");
        console.log("API Response:", response.data);
        
        if (response.data.success) {
          // Map the data to match the frontend structure
          const formattedData = response.data.data.map(request => ({
            id: request.id,
            client: request.client_id,
            title: `Estimate Request #${request.id}`, // Use a generated title since it's not in the database
            assigned: request.assigned_to,
            createDate: new Date(request.created_at).toLocaleDateString(),
            status: request.status || "New",
            estimate_form_id: request.estimate_form_id
          }));
          console.log("Formatted Data:", formattedData);
          setRequests(formattedData);
          setFilteredRequests(formattedData);
        } else {
          console.error("API returned success: false");
          setError(response.data.message || "Failed to fetch estimate requests");
        }
      } catch (error) {
        console.error("API Error Details:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        setError(error.response?.data?.message || "Error fetching estimate requests");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ✅ Fetch Assigned Users for Dropdown
  useEffect(() => {
    const fetchAssignedUsers = async () => {
      try {
        const response = await api.get("/assigned-users");
        const formattedOptions = response.data.map(user => ({
          value: user.id,
          label: user.name,
        }));
        setAssignedOptions(formattedOptions);
      } catch (error) {
        console.error("Error fetching assigned users:", error);
      }
    };
    fetchAssignedUsers();
  }, []);

  // ✅ Fetch Status Options for Dropdown
  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const response = await api.get("/statuses");
        const formattedOptions = response.data.map(status => ({
          value: status.value,
          label: status.label,
        }));
        setStatusOptions(formattedOptions);
      } catch (error) {
        console.error("Error fetching statuses:", error);
      }
    };
    fetchStatuses();
  }, []);

  // ✅ Filter Data
  useEffect(() => {
    let filtered = requests;

    if (searchQuery) {
      filtered = filtered.filter(request =>
        request.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedAssigned) {
      filtered = filtered.filter(request => request.assigned === selectedAssigned.value);
    }

    if (selectedStatus) {
      filtered = filtered.filter(request => request.status === selectedStatus.value);
    }

    setFilteredRequests(filtered);
    setCurrentPage(1); // Reset pagination on filter change
  }, [searchQuery, selectedAssigned, selectedStatus, requests]);

  // ✅ Get Current Page Data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRequests.slice(indexOfFirstItem, indexOfLastItem);

  // ✅ Handle status change & close dropdown
  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await api.put(`/estimate-requests/${id}`, { status: newStatus });
      if (response.data.success) {
        // Update the local state
        setRequests(prev => prev.map(request => 
          request.id === id ? { ...request, status: newStatus } : request
        ));
        setFilteredRequests(prev => prev.map(request => 
          request.id === id ? { ...request, status: newStatus } : request
        ));
        toast.success("Status updated successfully");
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  // ✅ Delete Function
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this estimate request?")) {
      return;
    }

    try {
      const response = await api.delete(`/estimate-requests/${id}`);
      if (response.data.success) {
        setRequests(prev => prev.filter(request => request.id !== id));
        setFilteredRequests(prev => prev.filter(request => request.id !== id));
        toast.success("Estimate request deleted successfully");
      } else {
        toast.error("Failed to delete estimate request");
      }
    } catch (error) {
      console.error("Error deleting estimate request:", error);
      toast.error(error.response?.data?.message || "Failed to delete estimate request");
    }
  };

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
      />
      <PageNavigation
        title="Estimate Requests"
        buttons={[{ label: "Create estimate request", icon: FiPlusCircle, onClick: () => setShowForm(true) }]}
      />

      {/* Filter and Export Section */}
      <div className="border-t bg-white border-gray-200 w-full flex justify-between p-4 dark:bg-gray-700 dark:text-white">
        <div className="flex items-center space-x-4">
          <DropdownButton
            icon={LuColumns2}
            options={columns}
            visibleItems={visibleColumns}
            toggleItem={(key) =>
              setVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }))
            }
          />
          <Select
            options={assignedOptions}
            value={selectedAssigned}
            onChange={setSelectedAssigned}
            placeholder="- Assigned to -"
            className="w-48"
          />
          <Select
            options={statusOptions}
            value={selectedStatus}
            onChange={setSelectedStatus}
            placeholder="- Status -"
            className="w-48"
          />
        </div>
        <div className="flex items-center gap-2">
          <ExportSearchControls
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            data={filteredRequests}
            fileName="yearly_estimates"
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        {loading ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">
            Loading estimates...
          </p>
        ) : error ? (
          <p className="text-center text-red-500 dark:text-red-400 py-4">
            {error}
          </p>
        ) : (
          <>
            <table className="min-w-full border-collapse border border-gray-300 bg-white dark:bg-gray-800">
              {/* Table Header */}
              <thead className="bg-gray-50 dark:bg-gray-600">
                <tr>
                  {columns.map(
                    (col) =>
                      visibleColumns[col.key] && (
                        <th key={col.key} className="border border-gray-300 px-4 py-2 text-left">
                          {col.label}
                        </th>
                      )
                  )}
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-100 dark:hover:bg-gray-700 relative">
                      {columns.map(
                        (col) =>
                          visibleColumns[col.key] && (
                            <td key={col.key} className="border border-gray-300 px-4 py-2">
                              {/* Handle ID and Client Navigation */}
                              {col.key === "id" ? (
                                <button
                                  onClick={() => navigate(`/dashboard/Prospects-Estimate Requests/view/${request.id}`)}
                                  className="text-blue-500 hover:text-blue-700"
                                >
                                  {request.id}
                                </button>
                              ) : col.key === "client" ? (
                                <button
                                  onClick={() => navigate(`/dashboard/clients/view/${request.client}`)}
                                  className="text-blue-500 hover:text-blue-700"
                                >
                                  {request.client}
                                </button>
                              ) : col.key === "status" ? (
                                <span
                                  className={`px-3 py-1 rounded-lg text-white text-xs font-bold ${getStatusStyle(request.status)}`}
                                >
                                  {request.status || "New"}
                                </span>
                              ) : col.key === "action" ? (
                                /* Action Button */
                                <div className="relative">
                                  <button
                                    className="p-1 rounded transition-colors duration-200 hover:bg-green-200"
                                    onClick={() =>
                                      setDropdownOpen((prev) =>
                                        prev === request.id ? null : request.id
                                      )
                                    }
                                  >
                                    <CiSettings size={18} className="text-green-600" />
                                  </button>

                                  {/* Dropdown Menu */}
                                  {dropdownOpen === request.id && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                                      <button
                                        onClick={() => handleOpenEditForm(request)}
                                        className="w-full text-left p-2 flex items-center hover:bg-gray-100">
                                        <FiEdit size={18} className="mr-2" />
                                        Edit
                                      </button>
                                      <button
                                        onClick={() => handleStatusChange(request.id, "Processing")}
                                        className="w-full text-left p-2 flex items-center hover:bg-gray-100"
                                      >
                                        <FiRefreshCw size={18} className="mr-2" />
                                        Mark as Processing
                                      </button>
                                      <button
                                        onClick={() => handleStatusChange(request.id, "Estimated")}
                                        className="w-full text-left p-2 flex items-center hover:bg-gray-100"
                                      >
                                        <FiCheck size={18} className="mr-2" />
                                        Mark as Estimated
                                      </button>
                                      <button
                                        onClick={() => handleStatusChange(request.id, "Hold")}
                                        className="w-full text-left p-2 flex items-center hover:bg-gray-100"
                                      >
                                        <FiPause size={18} className="mr-2" />
                                        Mark as Hold
                                      </button>
                                      <button
                                        onClick={handleOpenEstimateForm}
                                        className="w-full text-left p-2 flex items-center hover:bg-gray-100"
                                      >
                                        <FiPlus size={18} className="mr-2" />
                                        Add Estimate
                                      </button>
                                      <button
                                        onClick={() => handleDelete(request.id)}
                                        className="w-full text-left p-2 flex items-center hover:bg-gray-100"
                                      >
                                        <FiX size={18} className="mr-2" />
                                        Delete
                                      </button>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                /* Display Other Columns */
                                request[col.key] ?? "N/A"
                              )}
                            </td>
                          )
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={columns.length} className="text-center p-4 text-gray-500">
                      No estimates found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination Component */}
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(filteredRequests.length / itemsPerPage)}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>

      {/* Background overlay and modal (shown when showForm is true) */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          {/* Popup Modal */}
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Add a New Form</h2>

            <p className="text-gray-600 mb-4">
              Please select a form from the following list to submit your request.
            </p>

            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 
                      hover:border-primary/30 hover:bg-gray-50 transition-all duration-200 
                      focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40">
                <span className="text-primary font-medium" onClick={() => navigate(`/dashboard/submit_estimate_request_form`)}>Form</span>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowForm(false)} // Close popup
                className="px-4 py-2 mr-3 bg-gray-200 hover:bg-gray-300 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <FormDialog
        open={openSingleEstimate}
        handleClose={() => setOpenSingleEstimate(false)}
        type={isEditMode ? "Edit Estimate" : "Add Estimate"}
        fields={isEditMode ? EditEstimateFields : AddEstimateFields} // ✅ Use different fields for add/edit
        formData={estimateData}
        handleChange={handleChange}
        handleSave={handleSaveEstimate}
        showUploadButton={true}
        extraButtons={[
          {
            label: "Save",
            onClick: handleSaveEstimate,
            icon: IoMdCheckmarkCircleOutline,
            color: "#007bff",
          },
        ]}
      />

    </div>
  );
};

export default EstimateRequests;
