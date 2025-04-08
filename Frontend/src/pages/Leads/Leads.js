import React, { useState, useEffect } from 'react';
import Select from "react-select";
import PageNavigation from '../../extra/PageNavigation';
import { FiEdit, FiTag, FiPlusCircle, FiPlus } from "react-icons/fi";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
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
  const location = useLocation();
  const [openImport, setOpenImport] = useState(false);
  const [ismanageOpen, setIsManageOpen] = useState(false);
  const [labelsList, setLabelsList] = useState([]);
  const [editingStatusId, setEditingStatusId] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const context = "event";
  const [searchQuery, setSearchQuery] = useState("");
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleColumns, setVisibleColumns] = useState({
    company_name: true,
    primary_contact: true,
    owner: true,
    label: true,
    source: true,
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
    setLoading(true);
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
            first_name: lead.first_name || '',
            last_name: lead.last_name || '',
            primary_contact: `${lead.first_name || ''} ${lead.last_name || ''}`.trim() || '-',
            email: lead.email || '',
            owner: lead.owner || localStorage.getItem('user_id') || '-',
            label: lead.label || lead.labels || '-',
            source: lead.source || '-',
            status: savedStatus ? savedStatus.status : (lead.status || 'New'),
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
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch leads first
        await fetchData();

        // Then fetch team members
        try {
          const teamMembersResponse = await api.get("/team-members/get-members");
          if (teamMembersResponse.data && Array.isArray(teamMembersResponse.data)) {
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
          console.warn("Team members API failed:", error);
          // Set default owner as current user
          const currentUserId = localStorage.getItem('user_id');
          const currentUserName = localStorage.getItem('user_name');
          if (currentUserId && currentUserName) {
            setOwnerOptions([{
              label: currentUserName,
              value: currentUserId
            }]);
          }
        }

        // Try to fetch lead sources
        try {
          const sourcesResponse = await api.get("/lead-sources");
          if (sourcesResponse.data && sourcesResponse.data.sources) {
            setSourceOptions(
              sourcesResponse.data.sources.map(source => ({
                label: source.title,
                value: source.id.toString()
              }))
            );
          }
        } catch (error) {
          console.warn("Lead sources API not available, using defaults");
        }

        // Try to fetch lead labels/statuses
        try {
          const statusesResponse = await api.get("/lead-statuses");
          if (statusesResponse.data && statusesResponse.data.statuses) {
            const labelOpts = statusesResponse.data.statuses.map(status => ({
              label: status.title,
              value: status.id.toString()
            }));
            setLabelsList(labelOpts);
          }
        } catch (error) {
          console.warn("Lead statuses API not available, using defaults");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch data. Please check your connection.");
      }
    };

    fetchAllData();
  }, []);

  // ✅ Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

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

  // Filter the leads based on search query and filters
  const filteredLeads = leads.filter((lead) => {
    // Search query filter
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = (
      (lead.company_name || '').toLowerCase().includes(searchLower) ||
      (lead.primary_contact || '').toLowerCase().includes(searchLower) ||
      (lead.email || '').toLowerCase().includes(searchLower) ||
      (lead.status || '').toLowerCase().includes(searchLower)
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

  // Pagination Logic - using filteredLeads for calculations
  const totalItems = filteredLeads.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
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
      case "kanban":
        navigate("/dashboard/Leads/all-kanbab");
        break;
      default:
        navigate("/dashboard/Leads");
        break;
    }
  };

  const [isEditMode, setIsEditMode] = useState(false);

  const [leadData, setLeadData] = useState({
    company_name: "",
    primary_contact: "",
    email: "",
    owner: localStorage.getItem('user_id') || "",
    label: "",
    source: "",
    status: "New",
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

  // Form field definitions for lead form
  const leadFields = [
    { name: "company_name", label: "Company Name", type: "text", required: true },
    { name: "primary_contact", label: "Primary Contact Name", type: "text", placeholder: "First Last" },
    { name: "email", label: "Email Address", type: "email" },
    { name: "status", label: "Status", type: "select", options: statusOptions },
    { name: "owner", label: "Owner", type: "select", options: ownerOptions },
    { name: "source", label: "Source", type: "select", options: sourceOptions },
    { name: "phone", label: "Phone Number", type: "text" },
    { name: "address", label: "Address", type: "textarea" },
    { name: "city", label: "City", type: "text" },
    { name: "state", label: "State", type: "text" },
    { name: "zip", label: "Zip", type: "text" },
    { name: "country", label: "Country", type: "text" },
    { name: "website", label: "Website", type: "text" },
    { name: "vatnumber", label: "VAT Number", type: "text" },
    { name: "gstnumber", label: "GST Number", type: "text" },
    { name: "currency", label: "Currency", type: "select", options: currencyOptions },
    { name: "currencysymbol", label: "Currency Symbol", type: "text" },
    { name: "label", label: "Label", type: "select", options: labelsList },
  ];

  // Form change handlers
  const handleSelectChange = (name, selectedOption) => {
    if (!selectedOption) {
      setLeadData(prev => ({ ...prev, [name]: "" }));
      return;
    }
    
    setLeadData(prev => ({
      ...prev,
      [name]: selectedOption.value
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLeadData(prevData => ({ ...prevData, [name]: value }));
  };

  // Save lead (create or update)
  const handleSaveLead = async () => {
    try {
      // Validate required fields
      if (!leadData.company_name) {
        toast.error("Company name is required!");
        return;
      }

      // Parse primary contact into first and last name
      let firstName = "";
      let lastName = "";

      if (leadData.primary_contact) {
        const nameParts = leadData.primary_contact.trim().split(/\s+/);
        firstName = nameParts[0] || "";
        lastName = nameParts.slice(1).join(" ") || "";
      }

      // Transform the data to match backend structure
      const payload = {
        company_name: leadData.company_name,
        first_name: firstName,
        last_name: lastName,
        email: leadData.email || "",
        phone: leadData.phone || "",
        address: leadData.address || "",
        city: leadData.city || "",
        state: leadData.state || "",
        zip: leadData.zip || "",
        country: leadData.country || "",
        website: leadData.website || "",
        owner: leadData.owner || localStorage.getItem('user_id') || "",
        status: leadData.status || 'New',
        label: leadData.label || "",
        source: leadData.source || "",
        gstnumber: leadData.gstnumber || "",
        vatnumber: leadData.vatnumber || "",
        currency: leadData.currency || "",
        currencysymbol: leadData.currencysymbol || "",
      };

      console.log("Saving lead with payload:", payload);

      if (isEditMode) {
        await api.put(`/leads/${leadData.id}`, payload);
        toast.success("Lead updated successfully!");
      } else {
        await api.post("/leads", payload);
        toast.success("Lead created successfully!");
      }

      // Close form and reset data
      setShowModal(false);
      setLeadData({
        company_name: "",
        primary_contact: "",
        email: "",
        owner: localStorage.getItem('user_id') || "",
        label: "",
        source: "",
        status: "New",
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
      
      // Refresh the data
      fetchData();
    } catch (error) {
      console.error("Error saving lead:", error);
      toast.error("Failed to save lead: " + (error.response?.data?.message || "Please check your connection."));
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

  // Filter handlers
  const handleApplyFilters = () => {
    setShowFilters(false); // Hide the filter panel after applying
    toast.success("Filters applied successfully!");
  };

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

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Check if we need to open the Add Lead form on mount (coming from kanban view)
  useEffect(() => {
    if (location.state?.openAddLeadForm) {
      setIsEditMode(false);
      setLeadData({
        company_name: "",
        primary_contact: "",
        email: "",
        owner: localStorage.getItem('user_id') || "",
        label: "",
        source: "",
        status: "New",
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
      setShowModal(true);
      
      // Clear the navigation state to prevent reopening on refresh
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-800">
      <ToastContainer />
      <PageNavigation
        title="Leads"
        labels={[
          { label: "list", value: "List" },
          { label: "kanban", value: "Kanban" },
        ]}
        activeLabel={activeLabel}
        handleLabelClick={handleOpenTab}
        buttons={[
          { label: "Import leads", icon: MdOutlineFileUpload, onClick: () => setOpenImport(true) },
          { label: "Add lead", icon: FiPlusCircle, onClick: () => {
            setIsEditMode(false);
            setLeadData({
              company_name: "",
              primary_contact: "",
              email: "",
              owner: localStorage.getItem('user_id') || "",
              label: "",
              source: "",
              status: "New",
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
            setShowModal(true);
          }},
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
            fileName="leads"
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

      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Leads Table */}
      {!loading && (
        <>
          <div className="overflow-x-auto">
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
                    <td colSpan={Object.values(visibleColumns).filter(v => v).length} className="text-center p-4 text-gray-500 dark:text-gray-300">
                      No leads found. Add a new lead to get started.
                    </td>
                  </tr>
                ) : (
                  paginatedLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-100 dark:hover:bg-gray-600">
                      {visibleColumns.company_name && ( 
                        <td className="p-3 border-b text-blue-400">{lead.company_name || "-"}</td> 
                      )}
                      {visibleColumns.primary_contact && ( 
                        <td className="p-3 border-b">{lead.primary_contact || "-"}</td> 
                      )}
                      {visibleColumns.owner && ( 
                        <td className="p-3 border-b"> {ownerOptions.find(opt => opt.value === lead.owner)?.label || lead.owner || "-"}  </td> 
                      )}
                      {visibleColumns.label && ( 
                        <td className="p-3 border-b">{lead.label || "-"}</td> 
                      )}
                      {visibleColumns.source && ( 
                        <td className="p-3 border-b">{lead.source || "-"}</td> 
                      )}
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
                                lead.status?.toLowerCase() === "new"
                                  ? "bg-blue-400"
                                  : lead.status?.toLowerCase() === "qualified"
                                  ? "bg-purple-400"
                                  : lead.status?.toLowerCase() === "discussion"
                                  ? "bg-yellow-400"
                                  : lead.status?.toLowerCase() === "negotiation"
                                  ? "bg-orange-400"
                                  : lead.status?.toLowerCase() === "won"
                                  ? "bg-green-400"
                                  : lead.status?.toLowerCase() === "lost"
                                  ? "bg-red-400"
                                  : "bg-gray-300"
                              }`}
                            >
                              {lead.status || "New"}
                            </span>
                          )}
                        </td>
                      )}
                      {visibleColumns.phone && ( <td className="p-3 border-b">{lead.phone || "-"}</td> )}
                      {visibleColumns.city && ( <td className="p-3 border-b">{lead.city || "-"}</td> )}
                      {visibleColumns.country && ( <td className="p-3 border-b">{lead.country || "-"}</td> )}
                      {visibleColumns.created_date && ( 
                        <td className="p-3 border-b"> {lead.created_date ? formatDate(lead.created_date) : "-"} </td> 
                      )}
                      {visibleColumns.action && (
                        <td className="p-3 border-b">
                          <button
                            onClick={() => {
                              // Create a properly formatted primary contact name from first and last name
                              const fullName = `${lead.first_name || ''} ${lead.last_name || ''}`.trim();
                              
                              setLeadData({
                                ...lead,
                                primary_contact: fullName || ''
                              });
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
          </div>

          {/* Pagination */}
          <div className="mt-4 p-2">
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              totalItems={totalItems}
              itemsPerPage={itemsPerPage} 
              setItemsPerPage={setItemsPerPage} 
              setCurrentPage={setCurrentPage} 
            />
          </div>
        </>
      )}

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
        onClose={toggleDialog} 
        labelsList={labelsList} 
        setLabelsList={setLabelsList} 
        context={context} 
      />

      {/* Lead Form Dialog */}
      <FormDialog
        open={showModal}
        handleClose={() => setShowModal(false)}
        type={isEditMode ? "Edit Lead" : "Add Lead"}
        fields={leadFields}
        formData={leadData}
        handleChange={handleInputChange}
        handleSelectChange={handleSelectChange}
        handleSave={handleSaveLead}
        showUploadButton={true}
        extraButtons={[
          { 
            label: "Save", 
            onClick: handleSaveLead, 
            icon: IoMdCheckmarkCircleOutline, 
            color: "#007bff"
          },
        ]}
      />
      
      <Outlet />
    </div>
  );
};

export default Leads;