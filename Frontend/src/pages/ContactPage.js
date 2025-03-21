import React, { useState, useRef } from 'react';
import { FiEdit, FiTag, FiPlusCircle, FiPlus } from "react-icons/fi";
import { SlClose } from "react-icons/sl";
import { MdOutlineFileUpload } from "react-icons/md";
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import { LuColumns2 } from "react-icons/lu";
import Select from "react-select";
import FormDialog from "../extra/FormDialog";
import Pagination from "../extra/Pagination";
import Importfile from "../extra/Importfile";
import ManageLabels from '../extra/ManageLabels';
import PageNavigation from '../extra/PageNavigation';
import DropdownButton from '../extra/DropdownButton ';
import ExportSearchControls from '../extra/ExportSearchControls';
import { useNavigate } from "react-router-dom";

const ContactPage = () => {
  const [labelsList, setLabelsList] = useState([]);
  const [ismanageOpen, setIsManageOpen] = useState(false);
  const [activeLabel, setActiveLabel] = useState("overview");
  const [openImport, setOpenImport] = useState(false);
  const navigate = useNavigate(); // ✅ Hook for navigation
  // ✅ Column Visibility State
  const [visibleColumns, setVisibleColumns] = useState({
    name: true,
    clientname: true,
    jobtitle: true,
    email: true,
    phone: true,
    skype: true,
    action: true,
  });

  // ✅ Define Column Headers (Match Keys with Data)
  const columns = [
    { key: "name", label: "Name" },
    { key: "clientname", label: "Client Name" },
    { key: "jobtitle", label: "Job Title" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "skype", label: "Skype" },
    { key: "action", label: "Action" },
  ];

  // ✅ Toggle Column Visibility
  const toggleColumn = (key) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // ✅ Handle Delete
  const handleDelete = (id) => {
    setContacts(contacts.filter((contact) => contact.id !== id));
  };

  const [searchQuery, setSearchQuery] = useState("");
  // ✅ Sample Data (Ensure Key Names Match)
  const [contacts, setContacts] = useState([ ]);

  // Filter clients based on search query
  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ✅ Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const itemsPerPageOptions = [5, 10, 15, 20];

  // ✅ Pagination Logic
  const totalItems = contacts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProjects = contacts.slice(startIndex, startIndex + itemsPerPage);

  const handleOpenTab = (label) => {
    setActiveLabel(label);
  
    switch (label) {
      case "contacts":
        navigate("/dashboard/contact");   // ✅ Navigate to Contacts Page
        break;
      case "clients":
        navigate("/dashboard/client");   // ✅ Navigate to Clients Page
        break;
      case "overview":
        navigate("/dashboard/clients");    // ✅ Navigate to Overview (Default)
        break;
      default:
        navigate("/dashboard/contact");    // ✅ Fallback to Client Overview
    }
  };
  

  const quickFilters = [
    { value: "", label: "- Quick filters -" },
    { value: "logged_today", label: "Logged in today" },
    { value: "logged_7_days", label: "Logged in last 7 days" },
  ];
  const [selectedQuickFilter, setSelectedQuickFilter] = useState(null);

  const toggleDialog = () => setIsManageOpen(!ismanageOpen);

  // ✅ Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // ✅ Form State
  const [formData, setFormData] = useState({
    type: "Organization", companyName: "", owner: "Admin P", address: "", city: "",
    state: "", zip: "", country: "", phone: "", email: "", vatNumber: "",
    gstNumber: "", clientGroups: "", currency: "", currencySymbol: "", labels: "", disablePayment: false,
  });

  // ✅ Form Fields Definition
  const fields = [
    {
      name: "type",
      label: "Type",
      type: "radio",
      options: [
        { value: "Organization", label: "Organization" },
        { value: "Person", label: "Person" }
      ],
    },
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
  ];

  // ✅ Open Add Client Dialog
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

  // ✅ Save New or Updated Client
  const handleSaveClient = () => {
    if (isEditMode) {
      setContacts((prev) => prev.map((c) => (c.id === formData.id ? formData : c)));
    } else {
      setContacts((prev) => [...prev, { ...formData, id: contacts.length + 1 }]);
    }
    setIsDialogOpen(false);
  };

  return (
    <div>
     <PageNavigation
        labels={[
          { label: "Overview", value: "overview" },
          { label: "Clients", value: "clients" },
          { label: "Contacts", value: "contacts" },
        ]}
        activeLabel={activeLabel}
        handleLabelClick={handleOpenTab} // ✅ Updated function
        buttons={[
          { label: "Manage Labels", icon: FiTag, onClick: () => setIsManageOpen(true) },
          { label: "Import Clients", icon: MdOutlineFileUpload, onClick: () => setOpenImport(true) },
          { label: "Add Client", icon: FiPlusCircle, onClick: handleAddClient },
        ]}
      />

      <div class=" border-t bg-white border-gray-200 w-full flex justify-between p-4 rounded-t-md ">
        <div className="flex items-center space-x-4">
          {/* Dropdown Button */}
          <DropdownButton
            icon={LuColumns2}
            options={columns}
            visibleItems={visibleColumns}
            toggleItem={toggleColumn}
          />

          <Select
            options={quickFilters}
            value={selectedQuickFilter}
            onChange={setSelectedQuickFilter}
            placeholder="- Quick filters -"
            isSearchable
            className="w-48 "
          />
        </div>
        <ExportSearchControls
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            data={filteredContacts}
            fileName="clients"
          />
      </div>
      {/* ✅ Contacts Table */}
      <table className="projects-table min-w-full divide-y divide-gray-200   border-t  border-gray-200 w-full">
        <thead className="bg-gray-50">
          <tr>
            {columns.map(
              (col) =>
                visibleColumns[col.key] && (
                  <th key={col.key} className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">
                    {col.label}
                  </th>
                )
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredContacts.map((contact) => (
            <tr key={contact.id} className="border-t">
              {visibleColumns.name && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contact.name}</td>}
              {visibleColumns.clientname && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contact.clientname}</td>}
              {visibleColumns.jobtitle && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contact.jobtitle}</td>}
              {visibleColumns.email && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contact.email}</td>}
              {visibleColumns.phone && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contact.phone}</td>}
              {visibleColumns.skype && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contact.skype}</td>}
              {visibleColumns.action && (
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <button
                    onClick={() => handleDelete(contact.id)}
                    className="p-1 rounded transition-colors duration-200"
                  >
                    <SlClose className="text-gray-400 hover:text-white hover:bg-red-500 rounded-xl" size={20} />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {/* ✅ Pagination Component */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        setCurrentPage={setCurrentPage}
        totalItems={totalItems}
      />
      {/* Material-UI Dialog for Add Client */}
      <FormDialog
        open={isDialogOpen}
        handleClose={() => setIsDialogOpen(false)}
        fields={fields}
        formData={formData}
        handleChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
        handleSave={handleSaveClient}
        showUploadButton={false}
        extraButtons={[
            { 
              label: "Save & Show", 
              icon: IoMdCheckmarkCircleOutline, 
              onClick: handleSaveClient, 
              color: "#38a4f8" 
            },
            { 
              label: "Save", 
              icon: IoMdCheckmarkCircleOutline,  // A different icon to represent create
              onClick: handleSaveClient, // A new function for creating a client
              color: "#4caf50"  // Different color for distinction
            }
          ]}
        isEditMode={isEditMode}
        type={isEditMode ? "Edit Client" : "Add client"} // 🔹 This automatically updates the title
      />
      {/* Import Dialog */}
      <Importfile
        open={openImport}
        onClose={() => setOpenImport(false)}
        onFileUpload={(file) => console.log("Uploaded File:", file)}
        sampleDownload={() => console.log("Downloading Sample File")}
      />
      {/* Import Managelable */}
      <ManageLabels
        isOpen={ismanageOpen}
        onClose={toggleDialog}
        labelsList={labelsList}
        setLabelsList={setLabelsList}
      />
    </div>
  )
}

export default ContactPage