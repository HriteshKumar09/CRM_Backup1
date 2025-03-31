import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DropdownButton from "../../extra/DropdownButton ";
import ExportSearchControls from "../../extra/ExportSearchControls";
import Pagination from "../../extra/Pagination";
import { LuColumns2 } from "react-icons/lu";
import FormDialog from "../../extra/FormDialog";
import Select from "react-select";
import { FiPlusCircle, FiEdit } from "react-icons/fi";
import { SlClose } from "react-icons/sl";
import api from "../../Services/api"; // Import API instance
import { toast } from "react-toastify";

const ProposalMonth = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [filteredProposals, setFilteredProposals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentProposal, setCurrentProposal] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Column Visibility State
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    client: true,
    proposalDate: true,
    validUntil: true,
    amount: true,
    status: true,
    action: true,
  });

  // Column Headers
  const columns = [
    { key: "id", label: "Proposal ID" },
    { key: "client", label: "Client" },
    { key: "proposalDate", label: "Proposal Date" },
    { key: "validUntil", label: "Valid Until" },
    { key: "amount", label: "Amount" },
    { key: "status", label: "Status" },
    { key: "action", label: "Action" },
  ];

  // Status options
  const statusOptions = [
    { value: "draft", label: "Draft" },
    { value: "sent", label: "Sent" },
    { value: "accepted", label: "Accepted" },
    { value: "declined", label: "Declined" },
  ];

  // Fetch Proposals from API
  useEffect(() => {
    const fetchProposals = async () => {
      try {
        setLoading(true);
        const response = await api.get("/estimate/proposals");
        if (response.data.success) {
          setProposals(response.data.proposals);
          setFilteredProposals(response.data.proposals);
        } else {
          toast.error("Failed to fetch proposals");
        }
      } catch (error) {
        console.error("Error fetching proposals:", error);
        toast.error(error.response?.data?.message || "Failed to fetch proposals");
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, []);

  // Filter Proposals by Search and Status
  useEffect(() => {
    let filtered = proposals;

    if (searchQuery) {
      filtered = filtered.filter((proposal) =>
        proposal.client_name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedStatus) {
      filtered = filtered.filter((proposal) => proposal.status === selectedStatus.value);
    }

    setFilteredProposals(filtered);
  }, [searchQuery, selectedStatus, proposals]);

  // Handle View Proposal
  const handleViewProposal = (id) => {
    navigate(`/dashboard/Prospects-Proposals/view/${id}`);
  };

  // Handle Delete Proposal
  const handleDeleteProposal = async (proposalId) => {
    try {
      const response = await api.delete(`/estimate/proposals/${proposalId}`);
      if (response.data.success) {
        toast.success("Proposal deleted successfully");
        setProposals(prev => prev.filter(p => p.id !== proposalId));
      } else {
        toast.error("Failed to delete proposal");
      }
    } catch (error) {
      console.error("Error deleting proposal:", error);
      toast.error(error.response?.data?.message || "Failed to delete proposal");
    }
  };

  // Paginate Data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProposals = filteredProposals.slice(indexOfFirstItem, indexOfLastItem);

  // Calculate Total Amount
  const totalAmount = filteredProposals.reduce((sum, proposal) => sum + (proposal.amount || 0), 0);

  // Proposal Fields
  const ProposalFields = [
    { name: "date", label: "Proposal Date", type: "date" },
    { name: "valid", label: "Valid Until", type: "date" },
    { name: "client", label: "Client", type: "text" },
    { name: "amount", label: "Amount", type: "number" },
    { name: "status", label: "Status", type: "text" },
  ];

  // ✅ Handle Form Submission (Save / Update)
  const handleSaveProposal = async (formData) => {
    try {
      if (isEditMode) {
        // Update Proposal (PUT request)
        await api.put(`/proposals/${formData.id}`, formData);
        alert("Proposal updated successfully!");
      }

      setIsFormOpen(false);
      setCurrentProposal(null);
    } catch (error) {
      console.error("Error saving proposal:", error);
      alert("Failed to save proposal!");
    }
  };

  // Update isEditMode when opening form for editing
  const handleEditClick = (proposal) => {
    setCurrentProposal(proposal);
    setIsEditMode(true);
    setIsFormOpen(true);
  };

  return (
    <div>
      {/* Header Section */}
      <div className="border-t bg-white border-gray-200 w-full flex justify-between p-4 dark:bg-gray-700 dark:text-white">
        <div className="flex items-center space-x-4">
          <DropdownButton
            icon={LuColumns2}
            options={columns}
            visibleItems={visibleColumns}
            toggleItem={(key) => setVisibleColumns(prev => ({ ...prev, [key]: !prev[key] }))}
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
            fileName="proposals" 
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              {columns.map(
                (col) =>
                  visibleColumns[col.key] && (
                    <th key={col.key} className="px-4 py-2 border">{col.label}</th>
                  )
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : currentProposals.length > 0 ? (
              currentProposals.map((proposal) => (
                <tr key={proposal.id} className="border hover:bg-gray-50">
                  {visibleColumns.id && (
                    <td className="px-4 py-2 cursor-pointer text-blue-600 hover:underline" 
                        onClick={() => handleViewProposal(proposal.id)}>
                      {proposal.id}
                    </td>
                  )}
                  {visibleColumns.client && (
                    <td className="px-4 py-2 cursor-pointer text-blue-600 hover:underline"
                        onClick={() => navigate(`/dashboard/clients/view/${proposal.client_id}`)}>
                      {proposal.client_name}
                    </td>
                  )}
                  {visibleColumns.proposalDate && <td className="px-4 py-2">{proposal.proposal_date}</td>}
                  {visibleColumns.validUntil && <td className="px-4 py-2">{proposal.valid_until}</td>}
                  {visibleColumns.amount && <td className="px-4 py-2">₹{proposal.amount?.toFixed(2) || '0.00'}</td>}
                  {visibleColumns.status && (
                    <td className="px-4 py-2">
                      <span className={`px-3 py-1 rounded-lg text-white text-xs font-bold ${
                        proposal.status === "draft" ? "bg-gray-500" :
                        proposal.status === "sent" ? "bg-blue-500" :
                        proposal.status === "accepted" ? "bg-green-500" :
                        proposal.status === "declined" ? "bg-red-500" : "bg-gray-300"
                      }`}>
                        {proposal.status}
                      </span>
                    </td>
                  )}
                  {visibleColumns.action && (
                    <td className="px-4 py-2">
                      <button 
                        className="p-1 rounded hover:bg-blue-200 mr-2"
                        onClick={() => handleEditClick(proposal)}
                      >
                        <FiEdit className="text-blue-600" />
                      </button>
                      <button 
                        className="p-1 rounded hover:bg-red-200"
                        onClick={() => handleDeleteProposal(proposal.id)}
                      >
                        <SlClose className="text-red-500" />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center py-4">
                  No Proposals Found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Total Amount Row */}
        <div className="flex justify-center bg-gray-200 p-4 text-lg font-serif border-t">
          Total Amount: <span className="ml-2 text-blue-600">₹{totalAmount.toFixed(2)}</span>
        </div>
      </div>

      {/* Form Dialog for Editing */}
      <FormDialog
        open={isFormOpen}
        handleClose={() => setIsFormOpen(false)}
        type="Edit Proposal"
        fields={ProposalFields}
        formData={currentProposal}
        handleChange={(e) => setCurrentProposal({ ...currentProposal, [e.target.name]: e.target.value })}
        handleSave={() => handleSaveProposal(currentProposal)}
        extraButtons={[
          {
            label: "Update",
            onClick: () => handleSaveProposal(currentProposal),
            icon: FiEdit,
            color: "#007bff",
          },
        ]}
      />

      {/* Pagination Component */}
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(filteredProposals.length / itemsPerPage)}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default ProposalMonth;
