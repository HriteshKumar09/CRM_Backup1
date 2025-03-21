import React, { useState, useEffect } from "react";
import axios from "axios";
import PageHeader from "../../extra/PageHeader";
import DropdownButton from "../../extra/DropdownButton ";
import ExportSearchControls from "../../extra/ExportSearchControls";
import Pagination from "../../extra/Pagination";
import { LuColumns2 } from "react-icons/lu";
import { FiEdit, FiTrash2,FiPlusCircle } from "react-icons/fi";

const API_BASE_URL = "http://localhost:4008/api"; // ✅ Backend URL

const ClientTickets = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    ticketID: true,
    ticketType: true,
    assignedTo: true,
    lastActivity: true,
    status: true,
    action: true,
  });

  const columns = [
    { key: "ticketID", label: "Ticket ID" },
    { key: "ticketType", label: "Ticket Type" },
    { key: "assignedTo", label: "Assigned To" },
    { key: "lastActivity", label: "Last Activity" },
    { key: "status", label: "Status" },
    { key: "action", label: "Action" },
  ];

  // ✅ Fetch Tickets from Backend
  const fetchTickets = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/tickets`);
      setTickets(response.data);
    } catch (error) {
      console.error("❌ Error fetching tickets:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const toggleColumn = (key) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // ✅ Pagination Logic
  const totalItems = tickets.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedTickets = tickets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ✅ Delete Ticket
  const handleDelete = async (id) => {
    if (window.confirm("❗ Are you sure you want to delete this ticket?")) {
      try {
        await axios.delete(`${API_BASE_URL}/tickets/${id}`);
        alert("✅ Ticket deleted successfully!");
        fetchTickets();
      } catch (error) {
        console.error("❌ Error deleting ticket:", error);
      }
    }
  };

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 min-h-screen">
      <PageHeader title="Tickets" buttons={[{ label: "Add tickets", icon: FiPlusCircle }]} />

      {/* ✅ Toolbar: Column Selection & Search */}
      <div className="border-t bg-white border-gray-200 w-full flex justify-between p-3 rounded-t-md dark:bg-gray-700 dark:text-white">
        <div className="flex items-center space-x-4">
          <DropdownButton icon={LuColumns2} options={columns} visibleItems={visibleColumns} toggleItem={toggleColumn} />
        </div>
        <div className="flex items-center gap-2">
          <ExportSearchControls searchQuery={searchQuery} setSearchQuery={setSearchQuery} fileName="Tickets" />
        </div>
      </div>

      {/* ✅ Table Section */}
      <div className="overflow-x-auto rounded-md">
        {loading ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">Loading tickets...</p>
        ) : (
          <table className="min-w-full border border-gray-200 rounded-md dark:border-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300">
              <tr>
                {columns.map((col) => visibleColumns[col.key] && <th key={col.key} className="text-left py-3 px-4">{col.label}</th>)}
              </tr>
            </thead>
            <tbody>
              {paginatedTickets.length > 0 ? (
                paginatedTickets.map((ticket, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    {columns.map((col) =>
                      visibleColumns[col.key] ? (
                        <td key={col.key} className="px-6 py-4 text-sm">
                          {col.key === "status" ? (
                            // ✅ Status Badges
                            <span className={`px-3 py-1 rounded-lg text-white text-xs font-bold ${
                              ticket.status.toLowerCase() === "resolved"
                                ? "bg-green-500"
                                : ticket.status.toLowerCase() === "pending"
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}>
                              {ticket.status}
                            </span>
                          ) : col.key === "action" ? (
                            // ✅ Action Buttons (Edit & Delete)
                            <div className="flex items-center space-x-2">
                              <button className="p-1 rounded hover:bg-green-500 hover:text-white">
                                <FiEdit size={20} />
                              </button>
                              <button onClick={() => handleDelete(ticket._id)} className="p-1 rounded hover:bg-red-500 hover:text-white">
                                <FiTrash2 size={20} />
                              </button>
                            </div>
                          ) : (
                            ticket[col.key] || "—"
                          )}
                        </td>
                      ) : null
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="py-4 text-center text-gray-500">❌ No tickets found.</td>
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

export default ClientTickets;
