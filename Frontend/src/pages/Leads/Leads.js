import React, { useState, useEffect } from 'react';
import Select from "react-select";
import PageNavigation from '../../extra/PageNavigation';
import { FiEdit, FiTag, FiPlusCircle, FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { MdOutlineFileUpload } from "react-icons/md";
import ManageLabels from "../../extra/ManageLabels";
import Import from '../../extra/Importfile';
import { LuColumns2 } from "react-icons/lu";
import { SlClose } from "react-icons/sl";
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import DropdownButton from '../../extra/DropdownButton ';
import ExportSearchControls from '../../extra/ExportSearchControls';
import Pagination from '../../extra/Pagination';
import { ToastContainer, toast } from "react-toastify";
import FormDialog from '../../extra/FormDialog';
import Swal from 'sweetalert2';
import api from "../../Services/api"; // Central API instance

const Leads = () => {
  const [activeLabel, setActiveLabel] = useState("overview");
  const navigate = useNavigate();
  const [openImport, setOpenImport] = useState(false);
  const [ismanageOpen, setIsManageOpen] = useState(false);
  const [labelsList, setLabelsList] = useState([]);
  const [editingStatusId, setEditingStatusId] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const context = "event";
  const [searchQuery, setSearchQuery] = useState("");
  const [leads, setLeads] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState({
    company_name: true,
    primary_contact: true,
    owner: true,
    label: true,
    created_date: true,
    status: true,
    action: true,
  });

  // Define column headers
  const columns = [
    { key: "company_name", label: "Company Name" },
    { key: "primary_contact", label: "Primary Contact" },
    { key: "owner", label: "Owner" },
    { key: "label", label: "Label" },
    { key: "source", label: "Source" },
    { key: "status", label: "Status" },
    { key: "phone", label: "Phone" },
    { key: "city", label: "City" },
    { key: "country", label: "Country" },
    { key: "created_date", label: "Created Date" },
    { key: "action", label: "Action" },
  ];

  // Toggle column visibility
  const toggleColumn = (key) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Fetch leads data
  const fetchData = async () => {
    try {
      const response = await api.get("/leads");
      console.log("API Response:", response.data);

      // Get saved statuses from localStorage
      const savedStatuses = JSON.parse(localStorage.getItem('leads_status') || '[]');
      
      // Check if response.data.leads exists (backend might be sending data in this format)
      const leadsData = response.data.leads || response.data;
      
      if (Array.isArray(leadsData)) {
        // Transform the data to match our frontend structure
        const transformedLeads = leadsData.map(lead => {
          // Find saved status for this lead
          const savedStatus = savedStatuses.find(s => s.id === lead.id);
          
          return {
            id: lead.id,
            company_name: lead.company_name || '',
            primary_contact: `${lead.first_name || ''} ${lead.last_name || ''}`.trim() || '-',
            owner: lead.owner || localStorage.getItem('user_id') || '-',
            label: lead.label || lead.labels || '-',
            source: lead.source || '-',
            status: savedStatus ? savedStatus.status : (lead.status || 'New'), // Use saved status if exists
            phone: lead.phone || '-',
            address: lead.address || '-',
            city: lead.city || '-',
            state: lead.state || '-',
            zip: lead.zip || '-',
            country: lead.country || '-',
            website: lead.website || '-',
            gstnumber: lead.gstnumber || '-',
            vatnumber: lead.vatnumber || '-',
            currency: lead.currency || '-',
            currencysymbol: lead.currencysymbol || '-',
            created_date: lead.created_date || new Date().toISOString(),
          };
        });
        
        console.log("Transformed Leads:", transformedLeads);
        setLeads(transformedLeads);
      } else {
        console.log("Invalid leads data format:", leadsData);
        setLeads([]);
        toast.warning("No leads data found in the response.");
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
      toast.error("Failed to fetch data. Please check your connection.");
      setLeads([]);
    }
  };

  // Update useEffect to fetch both leads and team members
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch leads first
        await fetchData();

        // Then fetch team members
        const teamMembersResponse = await api.get("/team-members/get-members");
        if (teamMembersResponse.data && teamMembersResponse.data.length) {
          const transformedOwners = teamMembersResponse.data.map((member) => ({
            label: `${member.first_name} ${member.last_name}`,
            value: member.user_id,
          }));
          // Add current user to owner options if not already present
          const currentUserId = localStorage.getItem('user_id');
          const currentUserName = localStorage.getItem('user_name');
          if (currentUserId && currentUserName && !transformedOwners.find(opt => opt.value === currentUserId)) {
            transformedOwners.push({
              label: currentUserName,
              value: currentUserId
            });
          }
          console.log("Owner Options:", transformedOwners);
          setOwnerOptions(transformedOwners);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch data. Please check your connection.");
      }
    };

    fetchAllData();
    // Cleanup function to remove old status data when component unmounts
    return () => {
      // You can add cleanup logic here if needed
    };
  }, []);

  // ✅ Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Pagination Logic
  const totalItems = leads.length;  // Directly use the updated `leads` length
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  // ✅ States for Select Options
  const [ownerOptions, setOwnerOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([
    { value: 'New', label: 'New' },
    { value: 'Qualified', label: 'Qualified' },
    { value: 'Discussion', label: 'Discussion' },
    { value: 'Negotiation', label: 'Negotiation' },
    { value: 'Won', label: 'Won' },
    { value: 'Lost', label: 'Lost' },
  ]);
  const [labelOptions, setLabelOptions] = useState([]);
  const [sourceOptions, setSourceOptions] = useState([
    { value: 'Google', label: 'Google' },
    { value: 'Facebook', label: 'Facebook' },
    { value: 'Twitter', label: 'Twitter' },
    { value: 'YouTube', label: 'YouTube' },
    { value: 'Elsewhere', label: 'Elsewhere' },
  ]);
  const [currencyOptions, setCurrencyOptions] = useState([
    { value: 'USD', label: 'USD - United States Dollar' },
    { value: 'EUR', label: 'EUR - Euro' },
    { value: 'GBP', label: 'GBP - British Pound' },
    { value: 'JPY', label: 'JPY - Japanese Yen' },
    { value: 'INR', label: 'INR - Indian Rupee' },
    { value: 'AUD', label: 'AUD - Australian Dollar' },
  ]);

  // ✅ Selected Values
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedLabel, setSelectedLabel] = useState(null);
  const [selectedSource, setSelectedSource] = useState(null);

  // Update the filtered leads logic
  const filteredLeads = leads.filter((lead) => {
    // Search query filter
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = (
      (lead.company_name || '').toLowerCase().includes(searchLower) ||
      (lead.primary_contact || '').toLowerCase().includes(searchLower) ||
      (lead.owner || '').toLowerCase().includes(searchLower)
    );

    // Owner filter
    const matchesOwner = !selectedOwner || lead.owner === selectedOwner.value;
    // Status filter
    const matchesStatus = !selectedStatus || lead.status === selectedStatus.value;
    // Label filter
    const matchesLabel = !selectedLabel || lead.label === selectedLabel.value;
    // Source filter
    const matchesSource = !selectedSource || lead.source === selectedSource.value;

    return matchesSearch && matchesOwner && matchesStatus && matchesLabel && matchesSource;
  });

  // Add filter apply handler
  const handleApplyFilters = () => {
    // The filters are already applied through the filteredLeads logic
    setShowFilters(false); // Hide the filter panel after applying
    toast.success("Filters applied successfully!");
  };

  // Update handleReset to also clear search query
  const handleReset = () => {
    setSelectedOwner(null);
    setSelectedStatus(null);
    setSelectedLabel(null);
    setSelectedSource(null);
    setSearchQuery(""); // Clear search query
    setShowFilters(false);
    toast.success("Filters reset successfully!");
  };

  const toggleDialog = () => setIsManageOpen(!ismanageOpen);

  // Update the table body to show filtered and paginated data
  const paginatedLeads = filteredLeads.slice(startIndex, startIndex + itemsPerPage);

  // Add debug logging for pagination
  console.log("Total Items:", totalItems);
  console.log("Current Page:", currentPage);
  console.log("Items Per Page:", itemsPerPage);
  console.log("Start Index:", startIndex);
  console.log("Paginated Leads:", paginatedLeads);

  const handleOpenTab = (label) => {
    setActiveLabel(label);
    switch (label) {
      case "Kanban":
        navigate("/dashboard/Leads/all-kanbab"); // ✅ Corrected
        break;
      default:
        navigate("/dashboard/Leads"); // ✅ Fallback to main leave page
        break;
    }
  };

  const handleSaveLead = async () => {
    try {
      // Transform the data to match backend structure
      const payload = {
        company_name: leadData.company_name,
        first_name: leadData.primary_contact.split(' ')[0] || '',
        last_name: leadData.primary_contact.split(' ')[1] || '',
        phone: leadData.phone,
        address: leadData.address,
        city: leadData.city,
        state: leadData.state,
        zip: leadData.zip,
        country: leadData.country,
        website: leadData.website,
        owner: leadData.owner || localStorage.getItem('user_id'), // Use selected owner or current user
        status: leadData.status || 'New',
        label: leadData.label || leadData.labels, // Handle both label and labels fields
        source: leadData.source,
        gstnumber: leadData.gstnumber,
        vatnumber: leadData.vatnumber,
        currency: leadData.currency,
        currencysymbol: leadData.currencysymbol,
      };

      if (isEditMode) {
        await api.put(`/leads/${leadData.id}`, payload);
        toast.success("Lead updated successfully!");
        await fetchData(); // Refresh the data
      } else {
        const response = await api.post("/leads", payload);
        toast.success("Lead created successfully!");
        await fetchData(); // Refresh the data
      }

      // Close form and reset data
      setShowModal(false);
      setLeadData({
        company_name: "",
        primary_contact: "",
        owner: "",
        label: "",
        source: "",
        status: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        country: "",
        website: "",
        gstnumber: "",
        vatnumber: "",
        currency: "",
        currencysymbol: "",
        created_date: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error saving lead:", error);
      toast.error("Failed to save lead. Please check your connection.");
    }
  };

  // Handle Updating Lead Status
  const handleUpdateStatus = async (id) => {
    const newStatus = prompt("Enter new status ID (1: New, 2: Qualified, etc.)");
    if (newStatus) {
      try {
        await api.put(`/leads/${id}/status`, { statusId: parseInt(newStatus) });
        fetchData(); // Refresh the data
      } catch (error) {
        console.error("Error updating status:", error);
        toast.error("Failed to update status. Please check your connection.");
      }
    }
  };

  // Handle Deleting a Lead
  const handleDelete = async (id) => {
    // Show the SweetAlert2 confirmation dialog
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You are about to delete this lead. This action cannot be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });
  
    if (result.isConfirmed) {
      try {
        // Call the API to delete the lead
        await api.delete(`/leads/${id}`);
        toast.success("Lead deleted successfully!");
  
        // Remove deleted lead from the state
        setLeads((prevLeads) => prevLeads.filter((lead) => lead.id !== id));
      } catch (error) {
        console.error("Error deleting lead:", error);
        toast.error("Failed to delete lead. Please check your connection.");
      }
    }
  };

  // Handle status change
  const handleStatusChange = (selectedOption, leadId) => {
    // Update the status in the local state
    setLeads(prevLeads => {
      const updatedLeads = prevLeads.map(lead => 
        lead.id === leadId 
          ? { ...lead, status: selectedOption.value }
          : lead
      );
      
      // Save to localStorage
      localStorage.setItem('leads_status', JSON.stringify(
        updatedLeads.map(lead => ({
          id: lead.id,
          status: lead.status
        }))
      ));
      
      return updatedLeads;
    });
    
    setEditingStatusId(null); // Close the dropdown
    toast.success("Status updated successfully!");
  };

   // ✅ Handle Owner Change
   const handleOwnerChange = (selectedOption) => {
    setLeadData(prev => ({
      ...prev,
      owner: selectedOption.value // Store the owner ID directly
    }));
  };

  // ✅ Handle Label Change
  const handleLabelChange = (selectedOption) => {
    setLeadData(prev => ({
      ...prev,
      label: selectedOption.value // Store the selected label value
    }));
  };

  const leadFields = [
    { name: "company_name", label: "Company Name", type: "text" },
    { name: "status", label: "Status", type: "select", options: statusOptions },
    { name: "owner", label: "Owner", type: "select", options: ownerOptions, onChange: handleOwnerChange },
    { name: "source", label: "Source", type: "select", options: sourceOptions },
    { name: "address", label: "Address", type: "textarea" },
    { name: "city", label: "City", type: "text" },
    { name: "state", label: "State", type: "text" },
    { name: "zip", label: "Zip", type: "text" },
    { name: "country", label: "Country", type: "text" },
    { name: "phone", label: "Phone Number", type: "text" },
    { name: "website", label: "Website", type: "text" },
    { name: "vatnumber", label: "VAT Number", type: "text" },
    { name: "gstnumber", label: "GST Number", type: "text" },
    { name: "currency", label: "Currency", type: "select", options: currencyOptions },
    { name: "currencysymbol", label: "Currency Symbol", type: "text" },
    { name: "label", label: "Label", type: "select", options: labelsList, onChange: handleLabelChange },
  ];

  const [isEditMode, setIsEditMode] = useState(false);

  const [leadData, setLeadData] = useState({
    company_name: "",
    primary_contact: "",
    owner: "",
    label: "",
    source: "",
    status: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    website: "",
    gstnumber: "",
    vatnumber: "",
    currency: "",
    currencysymbol: "",
    created_date: new Date().toISOString(),
  });

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div>
      <ToastContainer />
      <PageNavigation
        title="Leads"
        labels={[
          { label: "list", value: "List" },
          { label: "kanban", value: "Kanban" },
        ]}
        activeLabel={activeLabel}
        handleLabelClick={handleOpenTab} // ✅ Updated function
        buttons={[
          { label: "Manage Labels", icon: FiTag, onClick: () => setIsManageOpen(true) },
          { label: "Import tasks", icon: MdOutlineFileUpload, onClick: () => setOpenImport(true) },
          { label: "Add Lead", icon: FiPlusCircle, onClick: () => setShowModal(true) },
        ]}
      />
      <div className="border-t bg-white border-gray-200 w-full flex justify-between p-4 rounded-t-md dark:bg-gray-700 dark:text-white">
        <div className="flex items-center space-x-4">
          {/* Dropdown Button */}
          <DropdownButton
            icon={LuColumns2}
            options={columns}
            visibleItems={visibleColumns}
            toggleItem={toggleColumn}
          />
          {/* Add Filter Button */}
          {!showFilters && (
            <button
              className="h-8 bg-transparent dark:bg-gray-700 dark:text-white px-4 py-2 rounded-lg border hover:bg-slate-100 flex items-center gap-1"
              onClick={() => setShowFilters(true)}
            >
              <FiPlus className="hover:text-gray-700" /> Add new filter
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <ExportSearchControls
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            data={filteredLeads}
            fileName="clients"
          />
        </div>
      </div>
      {/* Select Filters */}
      {showFilters && (
        <div className="p-4 bg-white flex flex-wrap gap-2 dark:bg-gray-700 dark:text-white border-t">
          <Select options={ownerOptions} value={selectedOwner} onChange={setSelectedOwner} placeholder="Select Owner" isSearchable className="w-48" />
          <Select options={statusOptions} value={selectedStatus} onChange={setSelectedStatus} placeholder="Select Status" isSearchable className="w-48" />
          <Select options={labelsList} value={selectedLabel} onChange={setSelectedLabel} placeholder="Select Label" isSearchable className="w-48" />
          <Select options={sourceOptions} value={selectedSource} onChange={setSelectedSource} placeholder="Select Source" isSearchable className="w-48" />

          {/* Action Buttons */}
          <button 
            onClick={handleApplyFilters} 
            className="bg-green-400 text-white p-2 rounded flex items-center hover:bg-green-500 transition-colors"
          >
            <IoMdCheckmarkCircleOutline size={20} />
          </button>
          <button 
            onClick={handleReset} 
            className="bg-white text-black p-2 rounded hover:bg-gray-200 border border-gray-300 transition-colors"
          >
            <SlClose size={20} className='font-bold' />
          </button>
        </div>
      )}
      <table className="projects-table min-w-full divide-y divide-gray-200 border-t border-gray-200 w-full">
        <thead className="bg-gray-50 dark:bg-gray-700 dark:text-white">
          <tr>
            {columns.map(
              (col) =>
                visibleColumns[col.key] && (
                  <th key={col.key} className="py-3 px-6 text-left">
                    {col.label}
                  </th>
                )
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-700 dark:text-white">
          {paginatedLeads.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center p-4 text-gray-500">
                No record found.
              </td>
            </tr>
          ) : (
            paginatedLeads.map((lead) => (
              <tr key={lead.id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                {visibleColumns.company_name && ( <td className="p-3 border-b text-blue-400">{lead.company_name || "-"}</td> )}
                {visibleColumns.primary_contact && ( <td className="p-3 border-b">{lead.primary_contact || "-"}</td> )}
                {visibleColumns.owner && ( <td className="p-3 border-b"> {ownerOptions.find(opt => opt.value === lead.owner)?.label || lead.owner || "-"}  </td> )}
                {visibleColumns.label && ( <td className="p-3 border-b">{lead.label || "-"}</td> )}
                {visibleColumns.source && ( <td className="p-3 border-b">{lead.source || "-"}</td> )}
                {visibleColumns.status && (
                  <td className="p-3 border-b">
                    {editingStatusId === lead.id ? (
                      <Select
                        options={statusOptions}
                        value={statusOptions.find((option) => option.value === lead.status)}
                        onChange={(selectedOption) => handleStatusChange(selectedOption, lead.id)}
                        onBlur={() => setEditingStatusId(null)}
                        autoFocus
                        className="w-32"
                      />
                    ) : (
                      <span
                        onClick={() => setEditingStatusId(lead.id)}
                        className={`px-3 py-1 rounded-lg text-white text-xs font-bold cursor-pointer ${
                          lead.status && lead.status.toLowerCase() === "new"
                            ? "bg-blue-400"
                            : lead.status && lead.status.toLowerCase() === "qualified"
                            ? "bg-purple-400"
                            : lead.status && lead.status.toLowerCase() === "discussion"
                            ? "bg-yellow-400"
                            : lead.status && lead.status.toLowerCase() === "negotiation"
                            ? "bg-orange-400"
                            : lead.status && lead.status.toLowerCase() === "won"
                            ? "bg-green-400"
                            : lead.status && lead.status.toLowerCase() === "lost"
                            ? "bg-red-400"
                            : "bg-gray-300"
                        }`}
                      >
                        {lead.status || "-"}
                      </span>
                    )}
                  </td>
                )}
                {visibleColumns.phone && ( <td className="p-3 border-b">{lead.phone || "-"}</td> )}
                {visibleColumns.city && ( <td className="p-3 border-b">{lead.city || "-"}</td> )}
                {visibleColumns.country && ( <td className="p-3 border-b">{lead.country || "-"}</td> )}
                {visibleColumns.created_date && ( <td className="p-3 border-b"> {lead.created_date ? formatDate(lead.created_date) : "-"} </td> )}
                {visibleColumns.action && (
                  <td className="p-3 border-b">
                    <button
                      onClick={() => {
                        setLeadData(lead);
                        setIsEditMode(true);
                        setShowModal(true);
                      }}
                      className="p-1 rounded transition-colors duration-200 mr-2"
                    >
                      <FiEdit className="hover:text-white hover:bg-green-500 rounded-lg p-2" size={30} />
                    </button>
                    <button
                      onClick={() => handleDelete(lead.id)}
                      className="p-1 rounded transition-colors duration-200"
                    >
                      <SlClose className="hover:text-white hover:bg-red-500 rounded-xl p-2" size={30} />
                    </button>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* ✅ Pagination Component */}
      <Pagination currentPage={currentPage} totalPages={totalPages} itemsPerPage={itemsPerPage} setItemsPerPage={setItemsPerPage} setCurrentPage={setCurrentPage} totalItems={totalItems} />

      {/* Import Dialog */}
      <Import
        open={openImport}
        onClose={() => setOpenImport(false)}
        onFileUpload={(file) => console.log("Uploaded File:", file)}
        sampleDownload={() => console.log("Downloading Sample File")}
      />
      {/* Import Managelable */}
      <ManageLabels isOpen={ismanageOpen} onClose={toggleDialog} labelsList={labelsList} setLabelsList={setLabelsList} context={context} />

      <FormDialog
        open={showModal}
        handleClose={() => setShowModal(false)}
        type={isEditMode ? "Edit Lead" : "Add Lead"}
        fields={leadFields}
        formData={leadData}
        handleChange={(e) => { const { name, value } = e.target; setLeadData((prevData) => ({ ...prevData, [name]: value, }));}}
        handleOwnerChange={handleOwnerChange}
        handleSave={handleSaveLead}
        showUploadButton={true}
        extraButtons={[ { label: "Save", onClick: handleSaveLead, icon: IoMdCheckmarkCircleOutline, color: "#007bff", },]}
      />
    </div>
  );
};

export default Leads;