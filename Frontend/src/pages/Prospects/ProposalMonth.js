import React, { useState, useEffect } from "react";
import DropdownButton from "../../extra/DropdownButton ";
import ExportSearchControls from "../../extra/ExportSearchControls";
import Pagination from "../../extra/Pagination";
import { LuColumns2 } from "react-icons/lu";
import FormDialog from "../../extra/FormDialog";
import Select from "react-select";
import { FiPlusCircle, FiEdit } from "react-icons/fi";
import { SlClose } from "react-icons/sl";
import api from "../../Services/api"; // Import API instance

const ProposalMonth = () => {
  // const [searchQuery, setSearchQuery] = useState("");
  // const [selectedStatus, setSelectedStatus] = useState(null);
  // const [proposals, setProposals] = useState([]);
  // const [filteredProposals, setFilteredProposals] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [proposals, setProposals] = useState([]);
    const [filteredProposals, setFilteredProposals] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentProposal, setCurrentProposal] = useState(null);

  // ✅ Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // ✅ Status options for filtering
  const [statusOptions, setStatusOptions] = useState([]);

  // ✅ Column Visibility State
  const [visibleColumns, setVisibleColumns] = useState({
    proposal: true,
    client: true,
    proposalDate: true,
    validuntil: true,
    amount: true,
    status: true,
    action: true,
  });

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

  // ✅ Column Headers
  const columns = [
    { key: "proposal", label: "Proposal" },
    { key: "client", label: "Client" },
    { key: "proposalDate", label: "Proposal Date" },
    { key: "validuntil", label: "Valid Until" },
    { key: "amount", label: "Amount" },
    { key: "status", label: "Status" },
    { key: "action", label: "Action" },
  ];

  // ✅ Fetch Proposals from API
  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const response = await api.get("/proposals");
        setProposals(response.data);
        setFilteredProposals(response.data);
      } catch (error) {
        console.error("Error fetching proposals:", error);
      }
    };

    fetchProposals();
  }, []);

  // ✅ Toggle Column Visibility
  const toggleColumn = (key) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // ✅ Filter Proposals by Search and Status
  useEffect(() => {
    let filtered = proposals;

    if (searchQuery) {
      filtered = filtered.filter((proposal) =>
        proposal.client.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedStatus) {
      filtered = filtered.filter((proposal) => proposal.status === selectedStatus.value);
    }

    setFilteredProposals(filtered);
  }, [searchQuery, selectedStatus, proposals]);

  // ✅ Paginate Data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProposals = filteredProposals.slice(indexOfFirstItem, indexOfLastItem);

  // ✅ Calculate Total Amount for Displayed Proposals
  const totalAmount = currentProposals.reduce((sum, proposal) => sum + (proposal.amount || 0), 0);

  // ✅ Proposal Fields
  const ProposalFields = [
    { name: "date", label: "Proposal Date", type: "date" },
    { name: "valid", label: "Valid Until", type: "date" },
    { name: "client", label: "Client", type: "text" },
    { name: "amount", label: "Amount", type: "number" },
    { name: "status", label: "Status", type: "text" },
  ];

  return (
    <div>
      {/* Header Section */}
      <div className="border-t bg-white border-gray-200 w-full flex justify-between p-4 dark:bg-gray-700 dark:text-white">
        <div className="flex items-center space-x-4">
          <DropdownButton
            icon={LuColumns2}
            options={columns}
            visibleItems={visibleColumns}
            toggleItem={toggleColumn}
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
          <ExportSearchControls searchQuery={searchQuery} setSearchQuery={setSearchQuery} fileName="estimates" />
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
            {currentProposals.length > 0 ? (
              currentProposals.map((proposal) => (
                <tr key={proposal.id} className="border">
                  {visibleColumns.proposal && <td className="px-4 py-2">{proposal.id}</td>}
                  {visibleColumns.client && <td className="px-4 py-2">{proposal.client}</td>}
                  {visibleColumns.proposalDate && <td className="px-4 py-2">{proposal.proposalDate}</td>}
                  {visibleColumns.validuntil && <td className="px-4 py-2">{proposal.validUntil}</td>}
                  {visibleColumns.amount && <td className="px-4 py-2">${proposal.amount.toFixed(2)}</td>}

                  {/* ✅ Status Section with Color Labels */}
                  {visibleColumns.status && (
                    <td className="px-4 py-2">
                      <span
                        className={`px-3 py-1 rounded-lg text-white text-xs font-bold ${proposal.status === "Draft"
                          ? "bg-gray-500"
                          : proposal.status === "Sent"
                            ? "bg-blue-500"
                            : proposal.status === "Accepted"
                              ? "bg-green-500"
                              : proposal.status === "Declined"
                                ? "bg-red-500"
                                : "bg-gray-300"
                          }`}
                      >
                        {proposal.status}
                      </span>
                    </td>
                  )}

                  {/* ✅ Action Buttons */}
                  {visibleColumns.action && (
                    <td className="px-4 py-2">
                      <button className="p-1 rounded hover:bg-blue-200">
                        <FiEdit className="text-blue-600" />
                      </button>
                      <button className="p-1 rounded hover:bg-red-200">
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

        {/* ✅ Total Amount Row */}
        <div className="flex justify-center bg-gray-200 p-4 text-lg font-serif border-t">
          Total Amount: <span className="ml-2 text-blue-600">${totalAmount.toFixed(2)}</span>
        </div>
      </div>

       {/* ✅ Form Dialog for Editing */}
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
