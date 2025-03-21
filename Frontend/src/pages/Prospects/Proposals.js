import React, { useState, useEffect } from "react";
import { FiPlusCircle } from "react-icons/fi";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import PageNavigation from "../../extra/PageNavigation";
import FormDialog from "../../extra/FormDialog";
import { Outlet } from "react-router-dom";
import api from "../../Services/api"; // Central API instance

const Proposals = () => {
  // ✅ State Management
  const [proposalData, setProposalData] = useState({
    date: "",
    valid: "",
    client: "",
    tax: "",
    secondtax: "",
    note: "",
  });

  const [clients, setClients] = useState([]);
  const [taxes, setTaxes] = useState([]);
  const [secondTaxes, setSecondTaxes] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // ✅ Fetch clients & tax options
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const clientsRes = await api.get("/clients");
        const taxRes = await api.get("/taxes");
        const secondTaxRes = await api.get("/second-taxes");

        setClients(clientsRes.data);
        setTaxes(taxRes.data);
        setSecondTaxes(secondTaxRes.data);
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    fetchOptions();
  }, []);

  // ✅ Proposal Fields with dynamic options
  const ProposalFields = [
    { name: "date", label: "Proposal date", type: "date" },
    { name: "valid", label: "Valid until", type: "date" },
    {
      name: "client",
      label: "Client/Lead",
      type: "select",
      options: clients.map((c) => ({ value: c.id, label: c.name })),
    },
    {
      name: "tax",
      label: "TAX",
      type: "select",
      options: taxes.map((t) => ({ value: t.id, label: t.name })),
    },
    {
      name: "secondtax",
      label: "Second TAX",
      type: "select",
      options: secondTaxes.map((st) => ({ value: st.id, label: st.name })),
    },
    { name: "note", label: "Note", type: "textarea", multiline: true, rows: 2 },
  ];

  // ✅ Handle form submission
  const handleSaveProposal = async () => {
    try {
      await api.post("/proposals", proposalData);
      alert("Proposal added successfully!");
      setIsFormOpen(false);
      setProposalData({ date: "", valid: "", client: "", tax: "", secondtax: "", note: "" });
    } catch (error) {
      console.error("Error saving proposal:", error);
      alert("Failed to save proposal!");
    }
  };

  return (
    <div>
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
        handleClose={() => setIsFormOpen(false)}
        type={isEditMode ? "proposal" : " proposal"}
        fields={ProposalFields}
        formData={proposalData}
        handleChange={(e) => setProposalData({ ...proposalData, [e.target.name]: e.target.value })}
        handleSave={handleSaveProposal}
        showUploadButton={true}
        extraButtons={[
          {
            label: "Save",
            onClick: handleSaveProposal,
            icon: IoMdCheckmarkCircleOutline,
            color: "#007bff",
          },
        ]}
      />

      <Outlet />
    </div>
  );
};

export default Proposals;
