import React, { useState, useEffect } from "react";
import { FiPlusCircle } from "react-icons/fi";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import PageNavigation from "../../extra/PageNavigation";
import FormDialog from "../../extra/FormDialog";
import { Outlet } from "react-router-dom";
import api from "../../Services/api"; // Central API instance

const EstimateList = () => {
  // ✅ Expense Form Fields 
  const EstimateFields = [
    { name: "date", label: "Estimate date", type: "date" },
    { name: "valid", label: "Valid until", type: "date" },
    { name: "client", label: "Client", type: "select", options: [] },
    { name: "tax", label: "TAX", type: "select", options: [] },
    { name: "secondtax", label: "Second TAX", type: "select", options: [] },
    { name: "note", label: "Note", type: "textarea", multiline: true, rows: 2 },
  ];

  // ✅ State Management
  const [estimateData, setEstimateData] = useState({
    date: "",
    valid: "",
    client: "",
    tax: "",
    secondtax: "",
    note: "",
  });

  const [openSingleEstimate, setOpenSingleEstimate] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [taxOptions, setTaxOptions] = useState([]);
  const [clients, setClients] = useState([]); // ✅ Default to an empty array

  // ✅ Fetch Clients & Tax Options on Load (ONLY ONCE)
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [clientsRes, taxRes] = await Promise.all([
          api.get("/clients"),
          api.get("/taxes"),
        ]);

        // ✅ Ensure response data is an array before setting state
        setClients(Array.isArray(clientsRes.data) ? clientsRes.data : []);
        setTaxOptions(Array.isArray(taxRes.data) ? taxRes.data : []);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
        setClients([]); // ✅ Ensure state remains an array
        setTaxOptions([]);
      }
    };

    fetchDropdownData();
  }, []); // ✅ Removed duplicate useEffect

  // ✅ Update form fields dynamically
  const handleChange = (event) => {
    const { name, value } = event.target;
    setEstimateData((prevData) => ({ ...prevData, [name]: value }));
  };

  // ✅ Handle form submission (Add / Edit Estimate)
  const handleSaveEstimate = async () => {
    try {
      if (isEditMode) {
        await api.put(`/estimates/${estimateData.id}`, estimateData);
      } else {
        await api.post("/estimates", estimateData);
      }

      setOpenSingleEstimate(false); // Close dialog on success
    } catch (error) {
      console.error("Error saving estimate:", error);
    }
  };

  return (
    <div>
      <PageNavigation
        title="Estimates"
        navLinks={[
          { name: "Month", path: "/dashboard/Estimate-List" },
          { name: "Yearly", path: "/dashboard/Estimate-List/index" },
        ]}
        buttons={[
          {
            label: "Add estimates",
            icon: FiPlusCircle,
            onClick: () => {
              setIsEditMode(false);
              setEstimateData({
                date: "",
                valid: "",
                client: "",
                tax: "",
                secondtax: "",
                note: "",
              });
              setOpenSingleEstimate(true);
            },
          },
        ]}
      />

      <FormDialog
        open={openSingleEstimate}
        handleClose={() => setOpenSingleEstimate(false)}
        type={isEditMode ? "Edit Estimate" : "Add Estimate"}
        fields={EstimateFields.map((field) => ({
          ...field,
          options:
            field.name === "client"
              ? clients.map((c) => ({ value: c.id, label: c.name }))
              : field.name.includes("tax")
              ? taxOptions.map((t) => ({ value: t.id, label: t.name }))
              : field.options,
        }))}
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

      {/* ✅ Render Subpages Here */}
      <Outlet />
    </div>
  );
};

export default EstimateList;
