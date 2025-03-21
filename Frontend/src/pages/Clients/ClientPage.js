import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PageNavigation from "../../extra/PageNavigation";
import { FiEdit, FiTag, FiPlusCircle, FiPlus } from "react-icons/fi";
import { SlClose } from "react-icons/sl";
import { MdOutlineFileUpload } from "react-icons/md";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
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

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const totalItems = clients.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
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

  // Fetch Clients Data from API
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await api.get("/clients");
        if (response.data.success) {
          const mappedClients = response.data.data.map((client) => ({
            id: client.id,
            name: client.company_name,
            primary: client.address,
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
        setClients((prev) => prev.filter((client) => client.id !== id));
      }
    } catch (error) {
      console.error("Error deleting client:", error);
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

  // Filter Clients Based on Search Query
  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Form State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    type: "Organization",
    companyName: "",
    owner: "Admin P",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    phone: "",
    email: "",
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
      owner: "Admin P",
      address: "",
      city: "",
      state: "",
      zip: "",
      country: "",
      phone: "",
      email: "",
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
    setFormData(client);
    setIsDialogOpen(true);
  };

  // Save New or Updated Client
  const handleSaveClient = async () => {
    try {
      if (isEditMode) {
        // Update existing client
        const response = await api.put(`/clients/${formData.id}`, formData);
        if (response.data.success) {
          setClients((prev) => prev.map((c) => (c.id === formData.id ? response.data.data : c)));
        }
      } else {
        // Add new client
        const response = await api.post("/clients", formData);
        if (response.data.success) {
          setClients((prev) => [...prev, response.data.data]);
        }
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving client:", error);
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
            options={[]} // Add your filter options here
            placeholder="- Quick filters -"
            isSearchable
            className="w-48"
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
            options={[]} // Add your label options here
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
            <tr key={client.id} className="border-t " >
              {visibleColumns.id && <td className="px-6 py-4 whitespace-nowrap text-sm">{client.id}</td>}
              {visibleColumns.name && <td className="px-6 py-4 whitespace-nowrap text-sm cursor-pointer" onClick={() => navigate(`/dashboard/clients/view/${client.id}`)}>{client.name}</td>}
              {visibleColumns.primary && <td className="px-6 py-4 whitespace-nowrap text-sm">{client.primary}</td>}
              {visibleColumns.client && <td className="px-6 py-4 whitespace-nowrap text-sm">{client.client}</td>}
              {visibleColumns.labels && <td className="px-6 py-4 whitespace-nowrap text-sm">{client.labels}</td>}
              {visibleColumns.projects && <td className="px-6 py-4 whitespace-nowrap text-sm">{client.projects}</td>}
              {visibleColumns.totalinvoiced && <td className="px-6 py-4 whitespace-nowrap text-sm">{client.totalinvoiced}</td>}
              {visibleColumns.paymentreceived && <td className="px-6 py-4 whitespace-nowrap text-sm">{client.paymentreceived}</td>}
              {visibleColumns.due && <td className="px-6 py-4 whitespace-nowrap text-sm">{client.due}</td>}
              {visibleColumns.action && (
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => handleEditClient(client)}
                    className="p-1 rounded transition-colors duration-200 mr-2"
                  >
                    <FiEdit className="hover:text-white hover:bg-green-500 rounded-lg" size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(client.id)}
                    className="p-1 rounded transition-colors duration-200"
                  >
                    <SlClose className="hover:text-white hover:bg-red-500 rounded-xl" size={20} />
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
          { name: "type", label: "Type", type: "radio", options: [
            { value: "Organization", label: "Organization" },
            { value: "Person", label: "Person" },
          ]},
          { name: "companyName", label: "Company Name", type: "text" },
          { name: "owner", label: "Owner", type: "select", options: [{ value: "admin_p", label: "Admin P" }] },
          { name: "address", label: "Address", type: "text", multiline: true, rows: 2 },
          { name: "city", label: "City", type: "text" },
          { name: "state", label: "State", type: "text" },
          { name: "zip", label: "Zip", type: "text" },
          { name: "country", label: "Country", type: "text" },
          { name: "phone", label: "Phone", type: "text" },
          { name: "email", label: "Email", type: "email" },
          { name: "vatNumber", label: "VAT Number", type: "text" },
          { name: "gstNumber", label: "GST Number", type: "text" },
          { name: "clientGroups", label: "Client Groups", type: "text" },
          { name: "currency", label: "Currency", type: "text" },
          { name: "currencySymbol", label: "Currency Symbol", type: "text" },
          { name: "labels", label: "Labels", type: "text" },
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
      />
    </div>
  );
};

export default ClientPage;