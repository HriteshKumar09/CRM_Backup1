import React, { useState, useEffect } from "react";
import { FiSearch, FiEdit, FiPlusCircle, FiTag, FiPlus } from "react-icons/fi"; // Added FiPlus
import { BsFileEarmarkExcel, BsPrinter } from "react-icons/bs";
import { AiOutlineDelete } from "react-icons/ai";
import { IoMdClose, IoMdCheckmarkCircleOutline } from "react-icons/io";
import { MdOutlineFileUpload } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import PageNavigation from "../../extra/PageNavigation";
import FormDialog from "../../extra/FormDialog";
import Import from "../../extra/Importfile";
import ManageLabels from "../../extra/ManageLabels";
import ExportSearchControls from "../../extra/ExportSearchControls";
import Pagination from "../../extra/Pagination";
import api from "../../Services/api"; // Central API instance

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeLabel, setActiveLabel] = useState("overview");
  const [ismanageOpen, setIsManageOpen] = useState(false);
  const [labelsList, setLabelsList] = useState([]);
  const [openImport, setOpenImport] = useState(false);
  const [showFilters, setShowFilters] = useState(false); // Added showFilters state
  const navigate = useNavigate();

  // New lead state
  const [newLead, setNewLead] = useState({
    company_name: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    website: "",
  });

  // Fetch Leads from Backend
  const fetchLeads = async () => {
    try {
      const response = await api.get("/leads"); // Use central API
      setLeads(response.data.leads);
    } catch (error) {
      console.error("❌ Error fetching leads:", error);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Handle Deleting a Lead
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      await api.delete(`/leads/${id}`); // Use central API
      fetchLeads();
    }
  };

  // Handle Updating Lead Status
  const handleUpdateStatus = async (id) => {
    const newStatus = prompt("Enter new status ID (1: New, 2: Qualified, etc.)");
    if (newStatus) {
      await api.put(`/leads/${id}/status`, { statusId: parseInt(newStatus) }); // Use central API
      fetchLeads();
    }
  };

  // Handle Adding a New Lead
  const handleAddLead = async () => {
    if (newLead.company_name && newLead.first_name && newLead.last_name && newLead.email) {
      try {
        const response = await api.post("/leads", newLead); // Use central API
        setNewLead({
          company_name: "",
          first_name: "",
          last_name: "",
          email: "",
          phone: "",
          address: "",
          city: "",
          state: "",
          zip: "",
          country: "",
          website: "",
        });
        setShowModal(false);
        fetchLeads();
        alert("Lead created successfully!");
      } catch (error) {
        console.error("Error adding lead:", error);
        alert("Failed to add lead.");
      }
    } else {
      alert("⚠️ Please fill all fields.");
    }
  };

  // Pagination Logic
  const totalItems = leads.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  // Filtered Leads
  const filteredLeads = leads.filter(
    (lead) =>
      lead.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company_name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const currentLeads = filteredLeads.slice(startIndex, startIndex + itemsPerPage);

  // Handle Navigation
  const handleOpenTab = (label) => {
    setActiveLabel(label);
    switch (label) {
      case "kanban":
        navigate("/dashboard/leads/kanban");
        break;
      default:
        navigate("/dashboard/leads");
        break;
    }
  };

  // Lead Fields for Form
  const leadFields = [
    { name: "company_name", label: "Company Name", type: "text" },
    { name: "first_name", label: "First Name", type: "text" },
    { name: "last_name", label: "Last Name", type: "text" },
    { name: "email", label: "Email", type: "email" },
    { name: "phone", label: "Phone", type: "text" },
    { name: "address", label: "Address", type: "text" },
    { name: "city", label: "City", type: "text" },
    { name: "state", label: "State", type: "text" },
    { name: "zip", label: "Zip", type: "text" },
    { name: "country", label: "Country", type: "text" },
    { name: "website", label: "Website", type: "text" },
  ];

  return (
    <div>
      {/* Page Navigation */}
      <PageNavigation
        title="Leads"
        labels={[
          { label: "Overview", value: "overview" },
          { label: "Kanban", value: "kanban" },
        ]}
        activeLabel={activeLabel}
        handleLabelClick={handleOpenTab}
        buttons={[
          { label: "Manage Labels", icon: FiTag, onClick: () => setIsManageOpen(true) },
          { label: "Import Leads", icon: MdOutlineFileUpload, onClick: () => setOpenImport(true) },
          { label: "Add Lead", icon: FiPlusCircle, onClick: () => setShowModal(true) },
        ]}
      />

      {/* Filters and Actions */}
      <div className="border-t bg-white border-gray-200 w-full flex justify-between p-4 rounded-t-md dark:bg-gray-700 dark:text-white">
        <div className="flex items-center space-x-4">
          <button
            className="h-8 bg-transparent dark:bg-gray-700 dark:text-white px-4 py-2 rounded-lg border hover:bg-slate-100 flex items-center gap-1"
            onClick={() => setShowFilters(true)}
          >
            <FiPlus className="hover:text-gray-700" /> Add new filter
          </button>
        </div>
        <div className="flex items-center gap-2">
          <ExportSearchControls
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            data={filteredLeads}
            fileName="leads"
          />
        </div>
      </div>

      {/* Leads Table */}
      <div className="shadow-md rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-gray-50 dark:bg-gray-700 dark:text-white">
            <tr>
              <th className="text-left p-3">Company Name</th>
              <th className="text-left p-3">Primary Contact</th>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Created Date</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentLeads.length > 0 ? (
              currentLeads.map((lead) => (
                <tr key={lead.id} className="border-b">
                  <td className="p-3">{lead.company_name}</td>
                  <td className="p-3">{lead.first_name} {lead.last_name}</td>
                  <td className="p-3">{lead.email}</td>
                  <td className="p-3">{new Date(lead.created_date).toLocaleDateString()}</td>
                  <td className="p-3">{lead.status}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleUpdateStatus(lead.id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(lead.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded ml-2"
                    >
                      <AiOutlineDelete />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center text-gray-500 p-6">
                  No records found.
                </td>
              </tr>
            )}
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

      {/* Add/Edit Lead Dialog */}
      <FormDialog
        open={showModal}
        handleClose={() => setShowModal(false)}
        type={isEditMode ? "Edit Lead" : "Add Lead"}
        fields={leadFields}
        formData={newLead}
        handleChange={(e) => {
          const { name, value } = e.target;
          setNewLead((prevData) => ({
            ...prevData,
            [name]: value,
          }));
        }}
        handleSave={handleAddLead}
        showUploadButton={false}
        extraButtons={[
          {
            label: "Save",
            icon: IoMdCheckmarkCircleOutline,
            onClick: handleAddLead,
            color: "#4caf50",
          },
        ]}
      />

      {/* Import Dialog */}
      <Import
        open={openImport}
        onClose={() => setOpenImport(false)}
        onFileUpload={(file) => console.log("Uploaded File:", file)}
        sampleDownload={() => console.log("Downloading Sample File")}
      />

      {/* Manage Labels Dialog */}
      <ManageLabels
        isOpen={ismanageOpen}
        onClose={() => setIsManageOpen(false)}
        labelsList={labelsList}
        setLabelsList={setLabelsList}
      />
    </div>
  );
};

export default Leads;