import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import PageHeader from "../../extra/PageHeader";
import DropdownButton from "../../extra/DropdownButton ";
import ExportSearchControls from "../../extra/ExportSearchControls";
import Pagination from "../../extra/Pagination";
import { LuColumns2 } from "react-icons/lu";
import { FiPlusCircle, FiEdit, FiTrash2 } from "react-icons/fi";
import { MdOutlineMail } from "react-icons/md";

const API_BASE_URL = "http://localhost:4008/api"; // ✅ Replace with your backend URL

const Contacts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [contacts, setContacts] = useState([]); // ✅ Store contacts
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState("");
  const [itemsPerPage] = useState(10);
  const [filterOptions, setFilterOptions] = useState([]);
  const [selectedfilter, setSelectedfilter] = useState(null);

  const [visibleColumns, setVisibleColumns] = useState({
    name: true,
    title: true,
    email: true,
    phone: true,
    skype: true,
    action: true,
  });

  const columns = [
    { key: "name", label: "Name" },
    { key: "title", label: "Job Title" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "skype", label: "Skype" },
    { key: "action", label: "Action" },
  ];

  const fetchFilter = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories`);
      setFilterOptions(response.data.map((cat) => ({ label: cat.name, value: cat.id })));
    } catch (error) {
      console.error("❌ Error fetching categories:", error);
    }
  };

  // ✅ Fetch Contacts from API
  const fetchContacts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/contacts`);
      setContacts(response.data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchContacts();
    fetchFilter();
  }, []);

  // ✅ Delete Contact
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      try {
        await axios.delete(`${API_BASE_URL}/contacts/${id}`);
        fetchContacts(); // Refresh data
      } catch (error) {
        console.error("Error deleting contact:", error);
      }
    }
  };

  // ✅ Toggle Column Visibility
  const toggleColumn = (key) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // ✅ Search & Filter Data
  const filteredContacts = contacts.filter((contact) =>
    Object.values(contact).some((value) =>
      value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // ✅ Paginate Data
  const paginatedContacts = filteredContacts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 min-h-screen">
      <PageHeader
        title="Contacts"
        buttons={[
          { label: "Send Invitation", icon: MdOutlineMail },
          { label: "Add Contact", icon: FiPlusCircle },
        ]}
      />

      {/* ✅ Toolbar Section */}
      <div className="border-t bg-white border-gray-200 w-full flex justify-between p-3 rounded-t-md dark:bg-gray-700 dark:text-white">
        <div className="flex items-center space-x-4">
          <DropdownButton
            icon={LuColumns2}
            options={columns}
            visibleItems={visibleColumns}
            toggleItem={toggleColumn}
          />
          {/* Select Filters */}
          <Select options={filterOptions} value={selectedfilter} onChange={setSelectedfilter} placeholder="- Quick filters -" className="w-48" />
        </div>
        <div className="flex items-center gap-2">
          <ExportSearchControls
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            fileName="Contacts"
          />
        </div>
      </div>

      {/* ✅ Table Section */}
      <div className="overflow-x-auto rounded-md">
        {loading ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">
            Loading contacts...
          </p>
        ) : (
          <table className="min-w-full bg-white dark:bg-gray-700 dark:text-white border border-gray-200">
            <thead className="bg-gray-200 dark:bg-gray-800">
              <tr>
                {columns.map(
                  (col) =>
                    visibleColumns[col.key] && (
                      <th key={col.key} className="px-4 py-2 text-left border">
                        {col.label}
                      </th>
                    )
                )}
              </tr>
            </thead>
            <tbody>
              {paginatedContacts.length > 0 ? (
                paginatedContacts.map((contact) => (
                  <tr
                    key={contact.id}
                    className="border-b hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    {columns.map(
                      (col) =>
                        visibleColumns[col.key] && (
                          <td key={col.key} className="px-4 py-2 border">
                            {col.key === "action" ? (
                              <div className="flex items-center space-x-2">
                                <button className="p-1 rounded hover:bg-green-500 hover:text-white">
                                  <FiEdit size={20} />
                                </button>
                                <button
                                  onClick={() => handleDelete(contact.id)}
                                  className="p-1 rounded hover:bg-red-500 hover:text-white"
                                >
                                  <FiTrash2 size={20} />
                                </button>
                              </div>
                            ) : (
                              contact[col.key]
                            )}
                          </td>
                        )
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="py-4 text-center text-gray-500">
                    No contacts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* ✅ Pagination Component */}
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(filteredContacts.length / itemsPerPage)}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default Contacts;
