import React, { useState, useEffect } from "react";
import { FiPlusCircle, FiEdit, FiRefreshCw, FiCheck, FiPause, FiX } from "react-icons/fi";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import PageNavigation from "../../extra/PageNavigation";
import FormDialog from "../../extra/FormDialog";
import { Outlet } from "react-router-dom";
import api from "../../Services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Proposals = () => {
  // State Management
  const [proposalData, setProposalData] = useState({
    client_id: "",
    proposal_date: "",
    valid_until: "",
    note: "",
    tax_id: "",
    tax_id2: "",
    status: "draft"
  });

  const [clients, setClients] = useState([]);
  const [taxes, setTaxes] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentProposal, setCurrentProposal] = useState(null);

  // Fetch clients & tax options
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoading(true);
        const [clientsRes, taxesRes] = await Promise.all([
          api.get("/clients"),
          api.get("/taxes")
        ]);

        if (clientsRes.data.success) {
          setClients(clientsRes.data.clients || []);
        } else {
          toast.error("Failed to fetch clients");
          setClients([]);
        }

        if (taxesRes.data.success) {
          setTaxes(taxesRes.data.taxes || []);
        } else {
          toast.error("Failed to fetch taxes");
          setTaxes([]);
        }
      } catch (error) {
        console.error("Error fetching options:", error);
        toast.error("Failed to fetch form options");
        setClients([]);
        setTaxes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, []);

  // Proposal Fields with dynamic options
  const ProposalFields = [
    { 
      name: "client_id", 
      label: "Client/Lead", 
      type: "select",
      options: Array.isArray(clients) ? clients.map(c => ({ value: c.id, label: c.name })) : []
    },
    { name: "proposal_date", label: "Proposal date", type: "date" },
    { name: "valid_until", label: "Valid until", type: "date" },
    { 
      name: "tax_id", 
      label: "TAX", 
      type: "select",
      options: Array.isArray(taxes) ? taxes.map(t => ({ value: t.id, label: t.name })) : []
    },
    { 
      name: "tax_id2", 
      label: "Second TAX", 
      type: "select",
      options: Array.isArray(taxes) ? taxes.map(t => ({ value: t.id, label: t.name })) : []
    },
    { name: "note", label: "Note", type: "textarea", multiline: true, rows: 2 },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "draft", label: "Draft" },
        { value: "sent", label: "Sent" },
        { value: "accepted", label: "Accepted" },
        { value: "declined", label: "Declined" }
      ]
    }
  ];

  // Handle form submission
  const handleSaveProposal = async () => {
    try {
      setLoading(true);
      const response = await api.post("/estimate/proposals", proposalData);
      
      if (response.data.success) {
        toast.success("Proposal created successfully!");
        setIsFormOpen(false);
        setProposalData({
          client_id: "",
          proposal_date: "",
          valid_until: "",
          note: "",
          tax_id: "",
          tax_id2: "",
          status: "draft"
        });
      } else {
        toast.error("Failed to create proposal");
      }
    } catch (error) {
      console.error("Error saving proposal:", error);
      toast.error(error.response?.data?.message || "Failed to save proposal");
    } finally {
      setLoading(false);
    }
  };

  // Use isEditMode when opening form for editing
  const handleEditClick = (proposal) => {
    setCurrentProposal(proposal);
    setIsEditMode(true);
    setIsFormOpen(true);
  };

  // Reset isEditMode when closing form
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setIsEditMode(false);
    setCurrentProposal(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      
      <PageNavigation
        title="Proposals"
        navLinks={[
          { name: "Month", path: "/dashboard/Prospects-Proposals" },
          { name: "Yearly", path: "/dashboard/Prospects-Proposals/index" },
        ]}
        buttons={[
          {
            label: "Add proposal",
            icon: FiPlusCircle,
            onClick: () => setIsFormOpen(true),
          },
        ]}
      />

      <FormDialog
        open={isFormOpen}
        handleClose={handleCloseForm}
        type={isEditMode ? "Edit Proposal" : "Add Proposal"}
        fields={ProposalFields}
        formData={proposalData}
        handleChange={(e) => {
          const { name, value } = e.target;
          setProposalData(prev => ({
            ...prev,
            [name]: value
          }));
        }}
        handleSave={handleSaveProposal}
        showUploadButton={true}
        extraButtons={[
          {
            label: "Save",
            onClick: handleSaveProposal,
            icon: IoMdCheckmarkCircleOutline,
            color: "#007bff",
            disabled: loading
          },
        ]}
      />

      <Outlet />
    </div>
  );
};

export default Proposals;
