import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import PageHeader from "../../extra/PageHeader";
import DropdownButton from "../../extra/DropdownButton ";
import ExportSearchControls from "../../extra/ExportSearchControls";
import Pagination from "../../extra/Pagination";
import { LuColumns2 } from "react-icons/lu";
import { FiPlusCircle, FiEdit } from "react-icons/fi";
import { SlClose } from "react-icons/sl";

const API_BASE_URL = "http://localhost:4008/api"; // ✅ Backend URL

const ClientInvoices = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [typeOptions, setTypeOptions] = useState([]);
  const [selectedtype, setSelectedtype] = useState(null);
  const [statusOptions, setStatusOptions] = useState([]);
  const [selectedstatus, setSelectedstatus] = useState(null);


  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    project: true,
    billdate: true,
    invoiced: true,
    paymentreceived: true,
    due: true,
    status: true,
    action: true,
  });

  const columns = [
    { key: "id", label: "ID" },
    { key: "project", label: "Project" },
    { key: "billdate", label: "Bill Date" },
    { key: "invoiced", label: "Total Invoiced" },
    { key: "paymentreceived", label: "Payment Received" },
    { key: "due", label: "Due" },
    { key: "status", label: "Status" },
    { key: "action", label: "Action" },
  ];

  const fetchType = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories`);
      setTypeOptions(response.data.map((cat) => ({ label: cat.name, value: cat.id })));
    } catch (error) {
      console.error("❌ Error fetching categories:", error);
    }
  };
  const fetchStatus = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories`);
      setStatusOptions(response.data.map((cat) => ({ label: cat.name, value: cat.id })));
    } catch (error) {
      console.error("❌ Error fetching categories:", error);
    }
  };

  // ✅ Fetch invoices from backend
  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/invoices`);
      setInvoices(response.data);
    } catch (error) {
      console.error("❌ Error fetching invoices:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInvoices();
    fetchType();
    fetchStatus();
  }, []);

  const toggleColumn = (key) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // ✅ Pagination Logic
  const totalItems = invoices.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedInvoices = invoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 min-h-screen">
      <PageHeader title="Invoices" buttons={[{ label: "Add Invoice", icon: FiPlusCircle }]} />

      {/* ✅ Toolbar: Column Selection & Search */}
      <div className="border-t bg-white border-gray-200 w-full flex justify-between p-3 rounded-t-md dark:bg-gray-700 dark:text-white">
        <div className="flex items-center space-x-4">
          <DropdownButton icon={LuColumns2} options={columns} visibleItems={visibleColumns} toggleItem={toggleColumn} />

          {/* Select Filters */}
          <Select options={typeOptions} value={selectedtype} onChange={setSelectedtype} placeholder="- Type -" className="w-48" />
          <Select options={statusOptions} value={selectedstatus} onChange={setSelectedstatus} placeholder="- Status -" className="w-48" />
        </div>
        <div className="flex items-center gap-2">
          <ExportSearchControls searchQuery={searchQuery} setSearchQuery={setSearchQuery} fileName="Invoices" />
        </div>
      </div>

      {/* ✅ Table Section */}
      <div className="overflow-x-auto rounded-md">
        {loading ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">Loading invoices...</p>
        ) : (
          <table className="min-w-full border border-gray-200 rounded-md dark:border-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300">
              <tr>
                {columns.map((col) => visibleColumns[col.key] && <th key={col.key} className="text-left py-3 px-4">{col.label}</th>)}
              </tr>
            </thead>
            <tbody>
              {paginatedInvoices.length > 0 ? (
                paginatedInvoices.map((invoice) => (
                  <tr key={invoice._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    {columns.map((col) =>
                      visibleColumns[col.key] ? (
                        <td key={col.key} className="px-6 py-4 text-sm">
                          {col.key === "status" ? (
                            // ✅ Status Badges
                            <span className={`px-3 py-1 rounded-lg text-white text-xs font-bold ${invoice.status.toLowerCase() === "completed"
                                ? "bg-green-500"
                                : invoice.status.toLowerCase() === "pending"
                                  ? "bg-yellow-500"
                                  : invoice.status.toLowerCase() === "overdue"
                                    ? "bg-red-500"
                                    : "bg-gray-300"
                              }`}>
                              {invoice.status}
                            </span>
                          ) : col.key === "action" ? (
                            // ✅ Action Buttons (Edit & Delete)
                            <div className="flex items-center space-x-2">
                              <button onClick={() => alert(`Editing invoice ${invoice._id}`)} className="p-1 rounded hover:bg-green-500 hover:text-white">
                                <FiEdit size={20} />
                              </button>
                              <button onClick={() => alert(`Deleting invoice ${invoice._id}`)} className="p-1 rounded hover:bg-red-500 hover:text-white">
                                <SlClose size={20} />
                              </button>
                            </div>
                          ) : (
                            invoice[col.key] || "—"
                          )}
                        </td>
                      ) : null
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="py-4 text-center text-gray-500">❌ No invoices found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* ✅ Pagination Component */}
      <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
    </div>
  );
};

export default ClientInvoices;
