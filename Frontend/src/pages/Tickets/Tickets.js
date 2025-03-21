import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../Services/api"; // Import the central API
import PageNavigation from "../../extra/PageNavigation";
import DropdownButton from "../../extra/DropdownButton ";
import ExportSearchControls from "../../extra/ExportSearchControls";
import { FiTag, FiPlus, FiPlusCircle } from "react-icons/fi";
import { LuColumns2 } from "react-icons/lu";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import FormDialog from "../../extra/FormDialog";

const Tickets = () => {
  const navigate = useNavigate();
  const [activeLabel, setActiveLabel] = useState("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState([]); // State to store fetched tickets
  const [isEditMode, setIsEditMode] = useState(false); // Determines Add/Edit mode
  const [openSingleTicket, setOpenSingleTicket] = useState(false);
  const [ticketsData, setTicketsData] = useState({}); // Manage ticket form data

  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    title: true,
    client: true,
    ticketType: true,
    assignedTo: true,
    lastActivity: true,
    status: true,
    action: true,
  });

  const columns = [
    { key: "id", label: "Ticket ID" },
    { key: "title", label: "Title" },
    { key: "client_id", label: "Client" }, // client_id is being returned in the response
    { key: "ticket_type_id", label: "Ticket type" },
    { key: "assigned_to", label: "Assigned to" },
    { key: "last_activity_at", label: "Last activity" },
    { key: "status", label: "Status" },
    { key: "action", label: "Action" },
  ];
  
  const TicketFields = [
    { name: "title", label: "Title", type: "text" },
    { name: "client", label: "Client", type: "select", options: [] },
    { name: "requestby", label: "Requested by", type: "select", options: [] },
    { name: "ticket", label: "Ticket type", type: "select", options: [] },
    { name: "description", label: "Description", type: "textarea", multiline: true, rows: 2 },
    { name: "assign", label: "Assign to", type: "select", options: [] },
    { name: "labels", label: "Labels", type: "select", options: [] },
  ];

  // Fetch tickets data from API
  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      try {
        const response = await api.get("/tickets"); // API call to fetch all tickets
        setTickets(response.data.tickets); // Map the tickets to state
      } catch (err) {
        console.error("Failed to fetch tickets:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets(); // Trigger fetch on page load
  }, []);

  // Handle Tab Navigation with Loading Effect
  const handleOpenTab = (label) => {
    if (activeLabel !== label) {
      setLoading(true);
      setTimeout(() => {
        setActiveLabel(label);
        setLoading(false);
      }, 1500);

      switch (label) {
        case "list":
          navigate("/dashboard/Tickets");
          break;
        case "templates":
          navigate("/dashboard/Tickets/ticket_Template");
          break;
        default:
          break;
      }
    }
  };

  // Handle Delete Ticket
  const handleDelete = async (ticketId) => {
  if (window.confirm("Are you sure you want to delete this ticket?")) {
    try {
      // Sending the delete request to the backend
      const response = await api.delete(`/tickets/${ticketId}`);
      
      if (response.data.success) {
        // Remove the ticket from the state if deletion is successful
        setTickets(tickets.filter(ticket => ticket.id !== ticketId));
        alert("Ticket deleted successfully!");
      } else {
        alert("Failed to delete the ticket.");
      }
    } catch (error) {
      console.error("❌ Error deleting ticket:", error);
      alert("Error deleting the ticket. Please try again later.");
      }
    }
  };

  // Handle Column Visibility
  const toggleColumn = (key) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Handle Form Field Changes
  const handleChange = (e) => {
    setTicketsData({ ...ticketsData, [e.target.name]: e.target.value });
  };

  // Handle saving a ticket (either add or edit)
  const handleSaveTicket = async () => {
    console.log("Ticket saved:", ticketsData);
    setOpenSingleTicket(false);
    // Add or update logic to save the ticket (API call here)
  };

  // Render Loading Indicator
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen w-full dark:bg-gray-800">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Navigation */}
      <PageNavigation
        title="Tickets"
        labels={[
          { label: "Tickets List", value: "list" },
          { label: "Ticket Templates", value: "templates" },
        ]}
        activeLabel={activeLabel}
        handleLabelClick={handleOpenTab}
        buttons={[
          { label: "Manage Labels", icon: FiTag, onClick: () => {} },
          {
            label: "Add Ticket",
            icon: FiPlusCircle,
            onClick: () => {
              setIsEditMode(false); // Set "Add" mode
              setOpenSingleTicket(true); // Open Form Dialog
            },
          },
        ]}
      />

      {/* Controls Section */}
      <div className="border-t bg-white border-gray-200 w-full flex justify-between p-4 rounded-t-md dark:bg-gray-700 dark:text-white">
        <div className="flex items-center space-x-4">
          {/* Column Visibility */}
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
              <FiPlus className="hover:text-gray-700" /> Add New Filter
            </button>
          )}
        </div>

        {/* Search & Export Controls */}
        <div className="flex items-center gap-2">
          <ExportSearchControls searchQuery={searchQuery} setSearchQuery={setSearchQuery} fileName="tickets" />
        </div>
      </div>

      {/* Ticket List Table */}
      <div className="overflow-x-auto bg-white p-4 rounded-md shadow-lg">
        <table className="w-full table-auto">
          <thead>
            <tr>
              {columns.map(
                (column) =>
                  visibleColumns[column.key] && (
                    <th key={column.key} className="p-2 text-left">
                      {column.label}
                    </th>
                  )
              )}
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
  {tickets.map((ticket) => (
    <tr key={ticket.id}>
      {columns.map(
        (column) =>
          visibleColumns[column.key] && (
            <td key={column.key} className="p-2">
              {ticket[column.key]}
            </td>
          )
      )}
      <td className="p-2">
        <button
          onClick={() => navigate(`/ticket/${ticket.id}`)}
          className="text-blue-500 hover:text-blue-700"
        >
          View
        </button>
        <button
          onClick={() => navigate(`/ticket/edit/${ticket.id}`)}
          className="ml-2 text-green-500 hover:text-green-700"
        >
          Edit
        </button>
        <button
          onClick={() => handleDelete(ticket.id)} // Assuming you have a delete function
          className="ml-2 text-red-500 hover:text-red-700"
        >
          Delete
        </button>
      </td>
    </tr>
  ))}
</tbody>
        </table>
      </div>

      {/* Add/Edit Ticket Form Dialog */}
      <FormDialog
        open={openSingleTicket}
        handleClose={() => setOpenSingleTicket(false)}
        type={isEditMode ? "Edit Ticket" : "Add Ticket"}
        fields={TicketFields}
        formData={ticketsData}
        handleChange={handleChange}
        handleSave={handleSaveTicket}
        showUploadButton={true}
        extraButtons={[
          {
            label: "Save",
            onClick: handleSaveTicket,
            icon: IoMdCheckmarkCircleOutline,
            color: "#007bff",
          },
        ]}
      />
    </div>
  );
};

export default Tickets;
