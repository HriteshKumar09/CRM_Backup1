import React, { useState, useEffect } from "react";
import axios from "axios";
import PageHeader from "../../extra/PageHeader";
import DropdownButton from "../../extra/DropdownButton ";
import ExportSearchControls from "../../extra/ExportSearchControls";
import Pagination from "../../extra/Pagination";
import { LuColumns2 } from "react-icons/lu";
import { FiPlusCircle, FiEdit } from "react-icons/fi";
import { SlClose } from "react-icons/sl";

const API_BASE_URL = "http://localhost:4008/api"; // ✅ Backend URL

const ClientPayments = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  
  const [visibleColumns, setVisibleColumns] = useState({
    invoiceid: true,
    paymentdate: true,
    paymentmethod: true,
    note: true,
    amount: true,
    action: true,
  });

  const columns = [
    { key: "invoiceid", label: "Invoice ID" },
    { key: "paymentdate", label: "Payment Date" },
    { key: "paymentmethod", label: "Payment Method" },
    { key: "note", label: "Note" },
    { key: "amount", label: "Amount" },
    { key: "action", label: "Action" },
  ];

  // ✅ Fetch payments from backend
  const fetchPayments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/payments`);
      setPayments(response.data);
    } catch (error) {
      console.error("❌ Error fetching payments:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const toggleColumn = (key) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // ✅ Pagination Logic
  const totalItems = payments.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedPayments = payments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 min-h-screen">
      <PageHeader title="Payments" buttons={[{ label: "Add Payment", icon: FiPlusCircle }]} />

      {/* ✅ Toolbar: Column Selection & Search */}
      <div className="border-t bg-white border-gray-200 w-full flex justify-between p-3 rounded-t-md dark:bg-gray-700 dark:text-white">
        <div className="flex items-center space-x-4">
          <DropdownButton icon={LuColumns2} options={columns} visibleItems={visibleColumns} toggleItem={toggleColumn} />
        </div>
        <div className="flex items-center gap-2">
          <ExportSearchControls searchQuery={searchQuery} setSearchQuery={setSearchQuery} fileName="Payments" />
        </div>
      </div>

      {/* ✅ Table Section */}
      <div className="overflow-x-auto rounded-md">
        {loading ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">Loading payments...</p>
        ) : (
          <table className="min-w-full border border-gray-200 rounded-md dark:border-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300">
              <tr>
                {columns.map((col) => visibleColumns[col.key] && <th key={col.key} className="text-left py-3 px-4">{col.label}</th>)}
              </tr>
            </thead>
            <tbody>
              {paginatedPayments.length > 0 ? (
                paginatedPayments.map((payment) => (
                  <tr key={payment._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    {columns.map((col) =>
                      visibleColumns[col.key] ? (
                        <td key={col.key} className="px-6 py-4 text-sm">
                          {col.key === "action" ? (
                            // ✅ Action Buttons (Edit & Delete)
                            <div className="flex items-center space-x-2">
                              <button onClick={() => alert(`Editing payment ${payment._id}`)} className="p-1 rounded hover:bg-green-500 hover:text-white">
                                <FiEdit size={20} />
                              </button>
                              <button onClick={() => alert(`Deleting payment ${payment._id}`)} className="p-1 rounded hover:bg-red-500 hover:text-white">
                                <SlClose size={20} />
                              </button>
                            </div>
                          ) : (
                            payment[col.key] || "—"
                          )}
                        </td>
                      ) : null
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="py-4 text-center text-gray-500">❌ No payments found.</td>
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

export default ClientPayments;
