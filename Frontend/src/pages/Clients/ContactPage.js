import React, { useState, useEffect, useRef } from 'react';
import { FiEdit, FiTag, FiPlusCircle, FiPlus } from "react-icons/fi";
import { SlClose } from "react-icons/sl";
import { MdOutlineFileUpload } from "react-icons/md";
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import { LuColumns2 } from "react-icons/lu";
import Select from "react-select";
import FormDialog from "../../extra/FormDialog";
import Pagination from "../../extra/Pagination";
import Importfile from "../../extra/Importfile";
import ManageLabels from '../../extra/ManageLabels';
import PageNavigation from '../../extra/PageNavigation';
import DropdownButton from '../../extra/DropdownButton ';
import ExportSearchControls from '../../extra/ExportSearchControls';
import { useNavigate } from "react-router-dom";
import api from '../../Services/api.js'; // Adjust the path

const ContactPage = () => {
  const [labelsList, setLabelsList] = useState([]);
  const [ismanageOpen, setIsManageOpen] = useState(false);
  const [activeLabel, setActiveLabel] = useState("");
  const [openImport, setOpenImport] = useState(false);
  const navigate = useNavigate();

  // Column Visibility State
  const [visibleColumns, setVisibleColumns] = useState({
    name: true,
    clientname: true,
    jobtitle: true,
    email: true,
    phone: true,
    skype: true,
    action: true,
  });

  // Define Column Headers
  const columns = [
    { key: "name", label: "Name" },
    { key: "clientname", label: "Client Name" },
    { key: "jobtitle", label: "Job Title" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "skype", label: "Skype" },
    { key: "action", label: "Action" },
  ];

  // Toggle Column Visibility
  const toggleColumn = (key) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Handle Delete
  const handleDelete = async (id) => {
    try {
      const response = await api.delete(`/clients/${id}`);
      if (response.data.success) {
        setContacts((prev) => prev.filter((contact) => contact.id !== id));
      }
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [contacts, setContacts] = useState([]);

  // Fetch Contacts Data from API
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await api.get("/clients");
        if (response.data.success) {
          // Map API data to match table structure
          const mappedContacts = response.data.data.map((client) => ({
            id: client.id,
            name: client.company_name, // Use company_name as the name
            clientname: client.company_name, // Use company_name as clientname
            jobtitle: "", // No job title in the API response
            email: "", // No email in the API response
            phone: client.phone, // Use phone from the API
            skype: "", // No Skype in the API response
          }));
          setContacts(mappedContacts);
        } else {
          console.error("Failed to fetch contacts:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };

    fetchContacts();
  }, []);

  // Filter Contacts Based on Search Query
  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const itemsPerPageOptions = [5, 10, 15, 20];

  // Pagination Logic
  const totalItems = contacts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedContacts = contacts.slice(startIndex, startIndex + itemsPerPage);

  const handleOpenTab = (label) => {
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
    }
  };

  const quickFilters = [];
  const [selectedQuickFilter, setSelectedQuickFilter] = useState(null);

  const toggleDialog = () => setIsManageOpen(!ismanageOpen);

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    clientname: "",
    jobtitle: "",
    email: "",
    phone: "",
    skype: "",
  });

  // Form Fields Definition
  const fields = [
    { name: "name", label: "Name", type: "text" },
    { name: "clientname", label: "Client Name", type: "text" },
    { name: "jobtitle", label: "Job Title", type: "text" },
    { name: "email", label: "Email", type: "email" },
    { name: "phone", label: "Phone", type: "text" },
    { name: "skype", label: "Skype", type: "text" },
  ];

  // Open Add Contact Dialog
  const handleAddContact = () => {
    setIsEditMode(false);
    setFormData({
      name: "",
      clientname: "",
      jobtitle: "",
      email: "",
      phone: "",
      skype: "",
    });
    setIsDialogOpen(true);
  };

  // Save New or Updated Contact
  const handleSaveContact = async () => {
    try {
      if (isEditMode) {
        // Update existing contact
        const response = await api.put(`/clients/${formData.id}`, formData);
        if (response.data.success) {
          setContacts((prev) => prev.map((c) => (c.id === formData.id ? response.data.data : c)));
        }
      } else {
        // Add new contact
        const response = await api.post("/clients", formData);
        if (response.data.success) {
          setContacts((prev) => [...prev, response.data.data]);
        }
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving contact:", error);
    }
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
        handleLabelClick={handleOpenTab}
        buttons={[
          { label: "Manage Labels", icon: FiTag, onClick: () => setIsManageOpen(true) },
          { label: "Import Contacts", icon: MdOutlineFileUpload, onClick: () => setOpenImport(true) },
          { label: "Add Contact", icon: FiPlusCircle, onClick: handleAddContact },
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

          <Select
            options={quickFilters}
            value={selectedQuickFilter}
            onChange={setSelectedQuickFilter}
            placeholder="- Quick filters -"
            isSearchable
            className="w-48"
          />
        </div>
        <ExportSearchControls
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          data={filteredContacts}
          fileName="contacts"
        />
      </div>

      {/* Contacts Table */}
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
          {filteredContacts.map((contact) => (
            <tr key={contact.id} className="border-t">
              {visibleColumns.name && <td className="px-6 py-4 whitespace-nowrap text-sm">{contact.name}</td>}
              {visibleColumns.clientname && <td className="px-6 py-4 whitespace-nowrap text-sm">{contact.clientname}</td>}
              {visibleColumns.jobtitle && <td className="px-6 py-4 whitespace-nowrap text-sm">{contact.jobtitle}</td>}
              {visibleColumns.email && <td className="px-6 py-4 whitespace-nowrap text-sm">{contact.email}</td>}
              {visibleColumns.phone && <td className="px-6 py-4 whitespace-nowrap text-sm">{contact.phone}</td>}
              {visibleColumns.skype && <td className="px-6 py-4 whitespace-nowrap text-sm">{contact.skype}</td>}
              {visibleColumns.action && (
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <button
                    onClick={() => handleDelete(contact.id)}
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

      {/* Pagination Component */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        setCurrentPage={setCurrentPage}
        totalItems={totalItems}
      />

      {/* Form Dialog for Add/Edit Contact */}
      <FormDialog
        open={isDialogOpen}
        handleClose={() => setIsDialogOpen(false)}
        fields={fields}
        formData={formData}
        handleChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
        handleSave={handleSaveContact}
        showUploadButton={false}
        extraButtons={[
          {
            label: "Save & Show",
            icon: IoMdCheckmarkCircleOutline,
            onClick: handleSaveContact,
            color: "#38a4f8",
          },
          {
            label: "Save",
            icon: IoMdCheckmarkCircleOutline,
            onClick: handleSaveContact,
            color: "#4caf50",
          },
        ]}
        isEditMode={isEditMode}
        type={isEditMode ? "Edit Contact" : "Add Contact"}
      />

      {/* Import Dialog */}
      <Importfile
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
      />
    </div>
  );
};

export default ContactPage;