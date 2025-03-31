
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PageNavigation from "../../extra/PageNavigation";
import { FiEdit, FiTag, FiPlusCircle, FiPlus } from "react-icons/fi";
import { SlClose } from "react-icons/sl";
import { MdOutlineFileUpload } from "react-icons/md";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import { GoIssueClosed } from "react-icons/go";
import { LuColumns2 } from "react-icons/lu";
import ExportSearchControls from "../../extra/ExportSearchControls";
import Select from "react-select";
import Importfile from "../../extra/Importfile";
import ManageLabels from "../../extra/ManageLabels";
import FormDialog from "../../extra/FormDialog";
import Pagination from "../../extra/Pagination";
import DropdownButton from "../../extra/DropdownButton ";
import * as XLSX from "xlsx";
import api from '../../Services/api.js'; // Adjust the path

const ClientPage = () => {
  const [clients, setClients] = useState([]);
  const [ismanageOpen, setIsManageOpen] = useState(false);
  const [labelsList, setLabelsList] = useState([]);
  const [activeLabel, setActiveLabel] = useState("");
  const [showTable, setShowTable] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openImport, setOpenImport] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const totalItems = clients.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const context = "client";
  const displayedClients = clients.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Column Visibility State
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    name: true,
    primary: true,
    client: true,
    labels: true,
    projects: true,
    totalinvoiced: true,
    paymentreceived: true,
    due: true,
    action: true,
  });

  // Column Headers
  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "primary", label: "Primary Contact" },
    { key: "client", label: "Client Groups" },
    { key: "labels", label: "Labels" },
    { key: "projects", label: "Projects" },
    { key: "totalinvoiced", label: "Total Invoiced" },
    { key: "paymentreceived", label: "Payment Received" },
    { key: "due", label: "Due" },
    { key: "action", label: "Action" },
  ];
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch team members
        const teamMembersResponse = await api.get("/team-members/get-members");
        if (teamMembersResponse.data && teamMembersResponse.data.length) {
          setTeamMembers(
            teamMembersResponse.data.map((member) => ({
              label: `${member.first_name} ${member.last_name}`,
              value: member.user_id,
            }))
          );
        } else {
          console.log("No team members found");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Fetch Clients Data from API
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await api.get("/clients");
        if (response.data.success) {
          const mappedClients = response.data.data.map((client) => ({
            id: client.id,
            name: client.company_name,
            primary: "",
            client: client.group_ids,
            labels: client.labels,
            projects: "",
            totalinvoiced: "",
            paymentreceived: "",
            due: "",
          }));
          setClients(mappedClients);
        } else {
          console.error("Failed to fetch clients:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

    fetchClients();
  }, []);

  // Toggle Column Visibility
  const toggleColumn = (key) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Handle Delete Client
  const handleDelete = async (id) => {
    try {
      const response = await api.delete(`/clients/${id}`);
      if (response.data.success) {
        // Update state to remove deleted client
        setClients((prev) => prev.filter((client) => client.id !== id));
        // Show success toast message
        toast.success("Client deleted successfully!");
      } else {
        // If the API returns a failure, show error toast message
        toast.error("Failed to delete client.");
      }
    } catch (error) {
      // Catch any errors and show error toast message
      console.error("Error deleting client:", error);
      toast.error("An error occurred while deleting the client.");
    }
  };

  // Handle Open Tab
  const handleOpenTab = (label) => {
    if (activeLabel !== label) {
      setActiveLabel(label);
      switch (label) {
        case "clients":
          navigate("/dashboard/clients/client");
          break;
        case "contacts":
          navigate("/dashboard/clients/contact");
          break;
        case "overview":
          navigate("/dashboard/clients");
          break;
        default:
          navigate("/dashboard/clients");
      }
    }
  };

  const quickFilters = [
    { value: "all", label: "- Quick filters -" },
    { value: "hasOpenProjects", label: "Has Open Projects" },
    { value: "hasCompletedProjects", label: "Has Completed Projects" },
    { value: "hasHoldProjects", label: "Has Hold Projects" },
    { value: "hasCanceledProjects", label: "Has Canceled Projects" },
    { value: "hasUnpaidInvoices", label: "Has Unpaid Invoices" },
    { value: "hasOverdueInvoices", label: "Has Overdue Invoices" },
  ];
  const [selectedQuickFilter, setSelectedQuickFilter] = useState(quickFilters[0]); // Default to "All Clients"

  // Filter Clients Based on Search Query and Quick Filter
  const filteredClients = clients.filter((client) => {
    const matchesSearchQuery = client.name.toLowerCase().includes(searchQuery.toLowerCase());

    switch (selectedQuickFilter.value) {
      case "hasOpenProjects":
        return matchesSearchQuery && client.openProjects > 0;
      case "hasCompletedProjects":
        return matchesSearchQuery && client.completedProjects > 0;
      case "hasHoldProjects":
        return matchesSearchQuery && client.holdProjects > 0;
      case "hasCanceledProjects":
        return matchesSearchQuery && client.canceledProjects > 0;
      case "hasUnpaidInvoices":
        return matchesSearchQuery && client.unpaidInvoices > 0;
      case "hasOverdueInvoices":
        return matchesSearchQuery && client.overdueInvoices > 0;
      default:
        return matchesSearchQuery; // Default: Show all clients
    }
  });

  // Form State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    type: "Organization",
    companyName: "",
    owner: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    phone: "",
    Website: "",
    vatNumber: "",
    gstNumber: "",
    clientGroups: "",
    currency: "",
    currencySymbol: "",
    labels: "",
    disablePayment: false,
  });

  // Open Add Client Dialog
  const handleAddClient = () => {
    setIsEditMode(false);
    setFormData({
      type: "Organization",
      companyName: "",
      owner: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      country: "",
      phone: "",
      Website: "",
      vatNumber: "",
      gstNumber: "",
      clientGroups: "",
      currency: "",
      currencySymbol: "",
      labels: "",
      disablePayment: false,
    });
    setIsDialogOpen(true);
  };

  // Open Edit Client Dialog
  const handleEditClient = (client) => {
    setIsEditMode(true);
    // Ensure form data is populated correctly for editing
    setFormData({
      id: client.id,
      type: client.type || "Organization", // Default type if undefined
      companyName: client.name, // Mapping name to companyName for editing
      owner: client.owner || "", // Default owner if undefined
      address: client.address || "",
      city: client.city || "",
      state: client.state || "",
      zip: client.zip || "",
      country: client.country || "",
      phone: client.phone || "",
      website: client.website || "",
      vatNumber: client.vat_number || "",
      gstNumber: client.gst_number || "",
      clientGroups: client.client_groups || "",
      currency: client.currency || "",
      currencySymbol: client.currency_symbol || "",
      labels: client.labels || "", // Ensure labels are set correctly
      disablePayment: client.disable_payment || false,
    });
    setIsDialogOpen(true);
  };

  // Save New or Updated Client
  const handleSaveClient = async () => {
    try {
      const clientPayload = {
        type: formData.type,
        company_name: formData.companyName,
        owner: formData.owner,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        country: formData.country,
        phone: formData.phone,
        Website: formData.website,
        vat_number: formData.vatNumber,
        gst_number: formData.gstNumber,
        client_groups: formData.clientGroups,
        currency: formData.currency,
        currency_symbol: formData.currencySymbol,
        labels: formData.labels,
        disable_payment: formData.disablePayment,
      };

      let response;
      if (isEditMode) {
        // Update existing client (PUT request)
        response = await api.put(`/clients/${formData.id}`, clientPayload);
        if (response.data.data.success) {
          setClients((prev) =>
            prev.map((client) =>
              client.id === formData.id ? { ...client, ...response.data.data } : client
            )
          );
          toast.success("Client updated successfully!");
        }
      } else {
        // Add new client (POST request)
        response = await api.post("/clients", clientPayload);
        if (response.data.data.success) {
          setClients((prev) => [...prev, response.data.data]);
          toast.success("Client created successfully!");
        }
      }

      setIsDialogOpen(false); // Close the dialog
    } catch (error) {
      console.error("Error saving client:", error);
      toast.error("Failed to save client.");
    }
  };

  // Download Sample Data
  const handleDownloadSample = () => {
    if (clients.length === 0) {
      alert("No clients available to download.");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(clients);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Clients");
    const fileName = `Clients_${new Date().toISOString().replace(/[:.-]/g, "_")}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <div className="h-full">
      <ToastContainer />
      <PageNavigation
        labels={[
          { label: "Overview", value: "overview" },
          { label: "Clients", value: "clients" },
          { label: "Contacts", value: "contacts" },
        ]}
        activeLabel={activeLabel}
        handleLabelClick={handleOpenTab}
        buttons={[
          { label: "Manage Labels", icon: FiTag, onClick: () => setIsManageOpen(true) },
          { label: "Import Clients", icon: MdOutlineFileUpload, onClick: () => setOpenImport(true) },
          { label: "Add Client", icon: FiPlusCircle, onClick: handleAddClient },
        ]}
      />
      <div className="border-t bg-white border-gray-200 w-full flex justify-between p-4 rounded-t-md dark:bg-gray-700 dark:text-white">
        <div className="flex items-center space-x-4">
          <DropdownButton
            icon={LuColumns2}
            options={columns}
            visibleItems={visibleColumns}
            toggleItem={toggleColumn}
          />
          {!showFilters && (
            <button
              className="h-8 bg-transparent text-black px-4 py-2 rounded-lg border hover:bg-slate-100 flex items-center gap-1"
              onClick={() => setShowFilters(true)}
            >
              <FiPlus className="text-gray-500 hover:text-gray-700" /> Add new filter
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <ExportSearchControls
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            data={filteredClients}
            fileName="clients"
          />
        </div>
      </div>
      {showFilters && (
        <div className="flex items-center bg-white border-t border-gray-200 p-4 gap-2 dark:bg-gray-700 dark:text-white" ref={dropdownRef}>
          <Select
            options={quickFilters}
            value={selectedQuickFilter}
            onChange={setSelectedQuickFilter}
            placeholder="- Quick filters -"
            isSearchable
            className="w-48 "
          />
          <Select
            options={[]} // Add your owner options here
            placeholder="- Owner -"
            isSearchable
            className="w-48"
          />
          <Select
            options={[]} // Add your client group options here
            placeholder="- Client groups -"
            isSearchable
            className="w-48"
          />
          <Select
            options={labelsList} // Add your label options here
            placeholder="- Label -"
            isSearchable
            className="w-48"
          />
          <button
            className="bg-green-500 text-white p-2 rounded"
            onClick={() => setShowTable(true)}
          >
            <GoIssueClosed />
          </button>
          <button
            className="bg-white text-black p-2 rounded hover:bg-gray-200 border border-gray-300"
            onClick={() => setShowFilters(false)}
          >
            <SlClose />
          </button>
        </div>
      )}
      <table className="projects-table min-w-full divide-y divide-gray-200 border-t border-gray-200 w-full">
        <thead className="bg-gray-50 dark:bg-gray-700 dark:text-white">
          <tr>
            {columns.map(
              (col) =>
                visibleColumns[col.key] && (
                  <th key={col.key} className="px-6 py-3 text-left text-xs font-bold uppercase">
                    {col.label}
                  </th>
                )
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-700 dark:text-white">
          {filteredClients.map((client) => (
            <tr key={client.id} className="border-t">
              {visibleColumns.id && <td className="px-6 py-4 whitespace-nowrap text-sm">{client.id}</td>}

              {visibleColumns.name && (
                <td className="px-6 py-4 whitespace-nowrap text-sm cursor-pointer text-blue-300" onClick={() => navigate(`/dashboard/clients/view/${client.id}/contacts`)}>
                  {client.name}
                </td>
              )}

              {visibleColumns.primary && <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-300">{client.primary || "-"}</td>}
              {visibleColumns.client && <td className="px-6 py-4 whitespace-nowrap text-sm">{client.client || "-"}</td>}
              {visibleColumns.labels && <td className="px-6 py-4 whitespace-nowrap text-sm">{client.labels || "-"}</td>}
              {visibleColumns.projects && <td className="px-6 py-4 whitespace-nowrap text-sm">{client.projects || "-"}</td>}

              {visibleColumns.totalinvoiced && (
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  ₹{client.totalinvoiced ? Number(client.totalinvoiced).toFixed(1) : "00.0"}
                </td>
              )}

              {visibleColumns.paymentreceived && (
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  ₹{client.paymentreceived ? Number(client.paymentreceived).toFixed(1) : "00.0"}
                </td>
              )}

              {visibleColumns.due && (
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  ₹{client.due ? Number(client.due).toFixed(1) : "00.0"}
                </td>
              )}

              {visibleColumns.action && (
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => handleEditClient(client)}
                    className="p-1 rounded transition-colors duration-200 mr-2"
                  >
                    <FiEdit className="text-blue-600 hover:bg-blue-200 rounded-lg" size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(client.id)}
                    className="p-1 rounded transition-colors duration-200"
                  >
                    <SlClose className="text-red-500 hover:bg-red-200 rounded-xl" size={20} />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        setCurrentPage={setCurrentPage}
        totalItems={totalItems}
      />
      <FormDialog
        open={isDialogOpen}
        handleClose={() => setIsDialogOpen(false)}
        fields={[
          {
            name: "type", label: "Type", type: "radio", options: [
              { value: "Organization", label: "Organization" },
              { value: "Person", label: "Person" },
            ]
          },
          { name: "companyName", label: "Company Name", type: "text" },
          { name: "owner", label: "Owner", type: "select", options: teamMembers },
          { name: "address", label: "Address", type: "text", multiline: true, rows: 2 },
          { name: "city", label: "City", type: "text" },
          { name: "state", label: "State", type: "text" },
          { name: "zip", label: "Zip", type: "text" },
          { name: "country", label: "Country", type: "text" },
          { name: "phone", label: "Phone", type: "text" },
          { name: "Website", label: "Website", type: "text" },
          { name: "vatNumber", label: "VAT Number", type: "text" },
          { name: "gstNumber", label: "GST Number", type: "text" },
          { name: "clientGroups", label: "Client Groups", type: "text" },
          { name: "currency", label: "Currency", type: "select", options: [] },
          { name: "currencySymbol", label: "Currency Symbol", type: "text" },
          { name: "labels", label: "Labels", type: "select", options: labelsList },
          { name: "disablePayment", label: "Disable Online Payment", type: "checkbox" },
        ]}
        formData={formData}
        handleChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
        handleSave={handleSaveClient}
        showUploadButton={false}
        extraButtons={[
          {
            label: "Save & Show",
            icon: IoMdCheckmarkCircleOutline,
            onClick: handleSaveClient,
            color: "#38a4f8",
          },
          {
            label: "Save",
            icon: IoMdCheckmarkCircleOutline,
            onClick: handleSaveClient,
            color: "#4caf50",
          },
        ]}
        isEditMode={isEditMode}
        type={isEditMode ? "Edit Client" : "Add Client"}
      />
      <Importfile
        open={openImport}
        onClose={() => setOpenImport(false)}
        onFileUpload={(file) => console.log("Uploaded File:", file)}
        sampleDownload={handleDownloadSample}
      />
      <ManageLabels
        isOpen={ismanageOpen}
        onClose={() => setIsManageOpen(false)}
        labelsList={labelsList}
        setLabelsList={setLabelsList}
        context={context}
      />
    </div>
  );
};

export default ClientPage;
