import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../Services/api"; // Import the central API
import DropdownButton from "../../extra/DropdownButton ";
import { FiTag, FiPlus, FiPlusCircle, FiSettings, FiUpload } from "react-icons/fi";
import { LuColumns2 } from "react-icons/lu";
import { IoClose } from "react-icons/io5";
import { FaWrench } from "react-icons/fa";
import ManageLabels from "../../extra/ManageLabels";
import { Autocomplete, Chip, TextField, Button, IconButton, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Tickets = () => {
  const navigate = useNavigate();
  const [activeLabel, setActiveLabel] = useState("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState([]); // State to store fetched tickets
  const [isEditMode, setIsEditMode] = useState(false); // Determines Add/Edit mode
  const [openSingleTicket, setOpenSingleTicket] = useState(false);
  const [ticketsData, setTicketsData] = useState({});
  const [labels, setLabels] = useState([]);
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [clients, setClients] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [ticketTypes, setTicketTypes] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  const [visibleColumns, setVisibleColumns] = useState({
    ticketId: true,
    title: true,
    client: true,
    ticketType: true,
    assignedTo: true,
    lastActivity: true,
    status: true,
  });

  const columns = [
    { key: "ticketId", label: "Ticket ID" },
    { key: "title", label: "Title" },
    { key: "client", label: "Client" },
    { key: "ticketType", label: "Ticket type" },
    { key: "assignedTo", label: "Assigned to" },
    { key: "lastActivity", label: "Last activity" },
    { key: "status", label: "Status" }
  ];
  
  const TicketFields = [
    { name: "title", label: "Title", type: "text" },
    { name: "client", label: "Client", type: "select", options: [] },
    { name: "requestby", label: "Requested by", type: "select", options: [] },
    { name: "ticket", label: "Ticket type", type: "select", options: [] },
    { name: "assign", label: "Assign to", type: "select", options: [] },
  ];

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [clientsRes, teamRes, typesRes, labelsRes, ticketsRes] = await Promise.all([
          api.get("/clients"),
          api.get("/team-members/get-members"),
          api.get("/ticket-types"),
          api.get("/labels", { params: { context: "ticket" }}),
          api.get("/tickets")
        ]);

        if (clientsRes.data.success) {
          setClients(clientsRes.data.data.map(client => ({
            label: client.company_name,
            value: client.id
          })));
        }

        if (teamRes.data) {
          setTeamMembers(teamRes.data.map(member => ({
            label: `${member.first_name} ${member.last_name}`,
            value: member.user_id
          })));
        }

        if (typesRes.data.success) {
          setTicketTypes(typesRes.data.data.map(type => ({
            label: type.title,
            value: type.id
          })));
        }

        if (labelsRes.data.success) {
          setLabels(labelsRes.data.labels.map(label => ({
            id: label.id,
            label: label.title,
            color: label.color
          })));
        }

        if (ticketsRes.data.success) {
          setTickets(ticketsRes.data.tickets);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
          navigate("/dashboard/tickets");
          break;
        case "templates":
          navigate("/dashboard/tickets/ticket_template");
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
      const response = await api.delete(`/tickets/${ticketId}`);
      if (response.data.success) {
        setTickets(tickets.filter(ticket => ticket.id !== ticketId));
          toast.success("Ticket deleted successfully!");
      } else {
          toast.error("Failed to delete the ticket");
      }
    } catch (error) {
        console.error("Error deleting ticket:", error);
        toast.error("Error deleting the ticket");
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

  // Handle label selection
  const handleLabelChange = (event, newValue) => {
    setSelectedLabels(newValue);
    setTicketsData({
      ...ticketsData,
      labels: newValue.map(label => label.id).join(',')
    });
  };

  // Add function to fetch projects when client is selected
  const fetchClientProjects = async (clientId) => {
    try {
      const response = await api.get(`/client/${clientId}/projects`);
      if (response.data.success) {
        const projectsList = response.data.projects.map(project => ({
          label: project.title || '-',
          value: project.id
        }));
        
        // Always include a "-" option if there are no projects
        if (projectsList.length === 0) {
          projectsList.push({ label: '-', value: null });
        }
        
        setProjects(projectsList);
      } else {
        // If API call succeeds but returns no data, show "-" option
        setProjects([{ label: '-', value: null }]);
      }
    } catch (error) {
      console.error("Error fetching client projects:", error);
      // On error, still show the "-" option instead of empty
      setProjects([{ label: '-', value: null }]);
    }
  };

  // Modify the client selection handler
  const handleClientChange = async (_, newValue) => {
    setTicketsData({ ...ticketsData, client: newValue });
    if (newValue) {
      await fetchClientProjects(newValue.value);
    } else {
      setProjects([]);
      setSelectedProject(null);
    }
  };

  // Update handleSaveTicket
  const handleSaveTicket = async () => {
    try {
      // Validate required fields with tooltips
      if (!ticketsData.title) {
        toast.error("Please fill in the Title field");
        return;
      }
      if (!ticketsData.client) {
        toast.error("Please select a Client");
        return;
      }
      if (!ticketsData.ticket) {
        toast.error("Please select a Ticket Type");
        return;
      }
      if (!ticketsData.assign) {
        toast.error("Please select an Assignee");
        return;
      }
      if (!ticketsData.requestby) {
        toast.error("Please select a Requested By");
        return;
      }

      const formData = {
        title: ticketsData.title,
        client_id: ticketsData.client.value,
        project_id: selectedProject?.value || 0,
        ticket_type_id: ticketsData.ticket?.value || 0,
        assigned_to: ticketsData.assign?.value || 0,
        requested_by: ticketsData.requestby?.value || 0,
        labels: selectedLabels.map(label => label.id).join(","),
        status: "new",
        created_by: 1,
        created_at: new Date().toISOString(),
        last_activity_at: new Date().toISOString(),
        creator_name: "System User", // Required field
        creator_email: "system@example.com", // Required field
        task_id: 0, // Required field, default to 0
        closed_at: new Date().toISOString(), // Required field
        merged_with_ticket_id: 0, // Optional field, default to 0
        deleted: 0 // Optional field, default to 0
      };

      let response;
      if (isEditMode && selectedTicket) {
        response = await api.put(`/tickets/${selectedTicket.id}`, formData);
        toast.success("Ticket updated successfully");
      } else {
        response = await api.post("/tickets", formData);
        toast.success("Ticket created successfully");
      }

      if (response.data.success) {
        // Refresh tickets list
        const ticketsResponse = await api.get("/tickets");
        if (ticketsResponse.data.success) {
          setTickets(ticketsResponse.data.tickets);
        }
        
        // Reset form
    setOpenSingleTicket(false);
        setTicketsData({});
        setSelectedLabels([]);
        setSelectedProject(null);
        setProjects([]);
      }
    } catch (error) {
      console.error("Error saving ticket:", error);
      toast.error(error.response?.data?.message || "Failed to save ticket");
    }
  };

  // Handle marking a ticket as closed
  const handleMarkAsClosed = async (ticketId) => {
    try {
      const response = await api.put(`/tickets/${ticketId}/close`);
      if (response.data.success) {
        setTickets(tickets.map(ticket => 
          ticket.id === ticketId ? { ...ticket, status: 'closed' } : ticket
        ));
        toast.success("Ticket marked as closed");
      }
    } catch (error) {
      console.error("Error closing ticket:", error);
      toast.error("Failed to close ticket");
    }
  };

  const handleOpenActions = (event, ticket) => {
    setAnchorEl(event.currentTarget);
    setSelectedTicket(ticket);
  };

  const handleCloseActions = () => {
    setAnchorEl(null);
    setSelectedTicket(null);
  };

  const handleEdit = () => {
    setIsEditMode(true);
    setTicketsData({
      title: selectedTicket.title,
      client: clients.find(c => c.value === selectedTicket.client_id),
      requestby: teamMembers.find(m => m.value === selectedTicket.requested_by),
      ticket: ticketTypes.find(t => t.value === selectedTicket.ticket_type_id),
      assign: teamMembers.find(m => m.value === selectedTicket.assigned_to),
      labels: selectedTicket.labels ? selectedTicket.labels.split(',').map(id => 
        labels.find(l => l.id === parseInt(id))
      ).filter(Boolean) : []
    });
    setSelectedLabels(selectedTicket.labels ? selectedTicket.labels.split(',').map(id => 
      labels.find(l => l.id === parseInt(id))
    ).filter(Boolean) : []);
    setOpenSingleTicket(true);
    handleCloseActions();
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
    <div className="space-y-4">
      <ToastContainer position="top-right" />
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-semibold">Tickets</h1>
          <div className="flex space-x-2">
            <button 
              className={`px-4 py-2 ${activeLabel === 'list' ? 'border-b-2 border-blue-500' : ''}`}
              onClick={() => handleOpenTab('list')}
            >
              Tickets list
            </button>
            <button 
              className={`px-4 py-2 ${activeLabel === 'templates' ? 'border-b-2 border-blue-500' : ''}`}
              onClick={() => handleOpenTab('templates')}
            >
              Ticket templates
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            startIcon={<FiTag />}
            variant="outlined"
            onClick={() => setIsManageOpen(true)}
          >
            Manage labels
          </Button>
          <Button
            startIcon={<FiSettings />}
            variant="outlined"
          >
            Settings
          </Button>
          <Button
            startIcon={<FiPlusCircle />}
            variant="contained"
            color="primary"
            onClick={() => {
              setIsEditMode(false);
              setTicketsData({});
              setSelectedLabels([]);
              setOpenSingleTicket(true);
            }}
          >
            Add ticket
          </Button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow">
        <div className="flex items-center space-x-4">
          <DropdownButton
            icon={LuColumns2}
            options={columns}
            visibleItems={visibleColumns}
            toggleItem={(key) => setVisibleColumns(prev => ({ ...prev, [key]: !prev[key] }))}
          />
          <button className="flex items-center space-x-1 px-3 py-2 border rounded-lg hover:bg-gray-50">
            <FiPlus />
            <span>Add new filter</span>
            </button>
        </div>
        <div className="flex items-center space-x-4">
          <TextField
            size="small"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              {columns.map(column => 
                  visibleColumns[column.key] && (
                  <th key={column.key} className="px-4 py-2 text-left">
                      {column.label}
                    </th>
                  )
              )}
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map(ticket => (
              <tr key={ticket.id} className="border-b hover:bg-gray-50">
                {visibleColumns.ticketId && <td className="px-4 py-2">Ticket #{ticket.id}</td>}
                {visibleColumns.title && <td className="px-4 py-2">{ticket.title}</td>}
                {visibleColumns.client && (
                  <td className="px-4 py-2">
                    {clients.find(c => c.value === ticket.client_id)?.label || '-'}
                  </td>
                )}
                {visibleColumns.ticketType && (
                  <td className="px-4 py-2">
                    {ticketTypes.find(t => t.value === ticket.ticket_type_id)?.label || '-'}
                  </td>
                )}
                {visibleColumns.assignedTo && (
                  <td className="px-4 py-2">
                    {teamMembers.find(m => m.value === ticket.assigned_to)?.label || '-'}
                  </td>
                )}
                {visibleColumns.lastActivity && (
                  <td className="px-4 py-2">
                    {new Date(ticket.last_activity_at).toLocaleString()}
                  </td>
                )}
                {visibleColumns.status && (
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      ticket.status === 'new' ? 'bg-yellow-100 text-yellow-800' :
                      ticket.status === 'closed' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {ticket.status}
                    </span>
            </td>
                )}
                <td className="px-4 py-2">
                  <IconButton
                    size="small"
                    onClick={(e) => handleOpenActions(e, ticket)}
                  >
                    <FaWrench />
                  </IconButton>
      </td>
    </tr>
  ))}
</tbody>
        </table>
      </div>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseActions}
      >
        <MenuItem onClick={handleEdit}>
          <span className="text-gray-600">Edit</span>
        </MenuItem>
        <MenuItem onClick={() => handleMarkAsClosed(selectedTicket.id)}>
          <span className="text-gray-600">Mark as Closed</span>
        </MenuItem>
        <MenuItem onClick={() => handleDelete(selectedTicket.id)}>
          <span className="text-red-600">Delete</span>
        </MenuItem>
      </Menu>

      {/* Add/Edit Ticket Modal */}
      <Dialog
        open={openSingleTicket}
        onClose={() => {
          setOpenSingleTicket(false);
          setIsEditMode(false);
          setTicketsData({});
          setSelectedLabels([]);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="flex justify-between items-center border-b">
          <span className="text-xl">{isEditMode ? 'Edit Ticket' : 'Add Ticket'}</span>
          <IconButton 
            onClick={() => setOpenSingleTicket(false)}
            size="small"
          >
            <IoClose />
          </IconButton>
        </DialogTitle>
        <DialogContent className="py-4">
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <TextField
                fullWidth
                size="small"
                placeholder="Enter Title"
                value={ticketsData.title || ''}
                onChange={(e) => setTicketsData({ ...ticketsData, title: e.target.value })}
                required
                error={!ticketsData.title}
                helperText={!ticketsData.title ? "Title is required" : ""}
              />
            </div>

            {/* Client */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client <span className="text-red-500">*</span>
              </label>
              <Autocomplete
                size="small"
                options={clients}
                value={ticketsData.client || null}
                onChange={handleClientChange}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    placeholder="Select Client" 
                    required
                    error={!ticketsData.client}
                    helperText={!ticketsData.client ? "Client is required" : ""}
                  />
                )}
              />
            </div>

            {/* Project - New Field */}
            {ticketsData.client && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project <span className="text-red-500">*</span>
                </label>
                <Autocomplete
                  size="small"
                  options={projects}
                  value={selectedProject}
                  onChange={(_, newValue) => setSelectedProject(newValue)}
                  getOptionLabel={(option) => option?.label || '-'}
                  isOptionEqualToValue={(option, value) => option?.value === value?.value}
                  renderInput={(params) => (
                    <TextField 
                      {...params} 
                      placeholder="Select project" 
                      required
                      error={!selectedProject}
                      helperText={!selectedProject ? "Project is required" : ""}
                    />
                  )}
                  noOptionsText="No projects available"
                />
              </div>
            )}

            {/* Requested by */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Requested by <span className="text-red-500">*</span>
              </label>
              <Autocomplete
                size="small"
                options={teamMembers}
                value={ticketsData.requestby || null}
                onChange={(_, newValue) => setTicketsData({ ...ticketsData, requestby: newValue })}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    placeholder="Select Requested By" 
                    required
                    error={!ticketsData.requestby}
                    helperText={!ticketsData.requestby ? "Requested By is required" : ""}
                  />
                )}
              />
            </div>

            {/* Ticket type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ticket type <span className="text-red-500">*</span>
              </label>
              <Autocomplete
                size="small"
                options={ticketTypes}
                value={ticketsData.ticket || null}
                onChange={(_, newValue) => setTicketsData({ ...ticketsData, ticket: newValue })}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    placeholder="Select Ticket Type" 
                    required
                    error={!ticketsData.ticket}
                    helperText={!ticketsData.ticket ? "Ticket Type is required" : ""}
                  />
                )}
              />
            </div>

            {/* Assign to */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assign to <span className="text-red-500">*</span>
              </label>
              <Autocomplete
                size="small"
                options={teamMembers}
                value={ticketsData.assign || null}
                onChange={(_, newValue) => setTicketsData({ ...ticketsData, assign: newValue })}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    placeholder="Select Assignee" 
                    required
                    error={!ticketsData.assign}
                    helperText={!ticketsData.assign ? "Assignee is required" : ""}
                  />
                )}
              />
            </div>

            {/* Labels */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Labels</label>
              <Autocomplete
                size="small"
                multiple
                options={labels}
                value={selectedLabels}
                onChange={handleLabelChange}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => <TextField {...params} placeholder="Labels" />}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={option.id}
                      label={option.label}
                      style={{ backgroundColor: option.color, color: 'white' }}
                    />
                  ))
                }
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions className="border-t p-4 flex justify-between">
          <Button
            startIcon={<FiUpload />}
            variant="outlined"
            component="label"
          >
            Upload File
            <input type="file" hidden />
          </Button>
          <div className="space-x-2">
            <Button 
              variant="outlined"
              onClick={() => setOpenSingleTicket(false)}
            >
              Close
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveTicket}
            >
              Save
            </Button>
          </div>
        </DialogActions>
      </Dialog>

      {/* Manage Labels Modal */}
      <ManageLabels
        isOpen={isManageOpen}
        onClose={() => setIsManageOpen(false)}
        labelsList={labels}
        setLabelsList={setLabels}
        context="ticket"
      />
    </div>
  );
};

export default Tickets;
