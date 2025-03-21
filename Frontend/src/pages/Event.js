import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {FiTag, FiPlusCircle } from "react-icons/fi";
import PageHeader from "../extra/PageHeader";
import ManageLabels from "../extra/ManageLabels";
import EventModal from "../extra/EventForm"; // Ensure this is imported correctly
import Select from "react-select";
import api from "../Services/api";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  Button,
} from "@mui/material";
import { IoClose } from "react-icons/io5";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [eventToEdit, setEventToEdit] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [labelsList, setLabelsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [eventOption, setEventOption] = useState(null);
  const [clients, setClients] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);

  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    start_time: "",
    end_time: "",
    created_by: 1,
    location: "",
    client_id: null,
    labels: "",
    share_with: "Only me",
    color: "#4A90E2",
  });

  // Fetch events, clients, and team members on component mount
  useEffect(() => {
    fetchEvents();
    fetchClients();
    fetchTeamMembers();
  }, []);

  // Fetch events from backend
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await api.get("/events");
      const formattedEvents = response.data.data.map((event) => {
        const start = event.start_date
          ? `${event.start_date.split("T")[0]}T${event.start_time || "00:00:00"}`
          : null;
        const end = event.end_date
          ? `${event.end_date.split("T")[0]}T${event.end_time || "00:00:00"}`
          : null;

        return {
          id: event.id,
          title: event.title,
          start: start,
          end: end,
          backgroundColor: event.color || "#4A90E2",
          extendedProps: {
            description: event.description,
            client_id: event.client_id,
            share_with: event.share_with,
            location: event.location,
          },
        };
      });
      setEvents(formattedEvents);
    } catch (error) {
      toast.error("Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  // Fetch clients from backend
  const fetchClients = async () => {
    try {
      const response = await api.get("/clients");
      setClients(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch clients");
    }
  };

  // Fetch team members from backend
  const fetchTeamMembers = async () => {
    try {
      const response = await api.get("/team-members/get-members");
      setTeamMembers(response.data);
    } catch (error) {
      toast.error("Failed to fetch team members");
    }
  };

  // Handle create event
  const handleCreateEvent = async (e) => {
    e.preventDefault(); // Prevent default form submission
  
    // Validate required fields
    if (!newEvent.title || !newEvent.start_date) {
      toast.error("Title and Start Date are required!");
      return;
    }
  
    try {
      // Format the event data for the API
      const eventData = {
        title: newEvent.title,
        description: newEvent.description,
        start_date: newEvent.start_date,
        end_date: newEvent.end_date || null,
        start_time: newEvent.start_time || "00:00:00",
        end_time: newEvent.end_time || "00:00:00",
        created_by: 1, // Replace with the actual user ID
        location: newEvent.location,
        client_id: newEvent.client_id || null,
        share_with: newEvent.share_with,
        color: newEvent.color,
      };
  
      // Log the data being sent to the API
      console.log("Creating event with data:", eventData);
  
      // Send the request to the API
      const response = await api.post("/events", eventData);
  
      // Log the response from the API
      console.log("API Response:", response.data);
  
      // Format the event for FullCalendar
      const formattedEvent = {
        id: response.data.id,
        title: eventData.title,
        start: `${eventData.start_date}T${eventData.start_time}`,
        end: eventData.end_date ? `${eventData.end_date}T${eventData.end_time}` : null,
        backgroundColor: eventData.color,
        extendedProps: {
          description: eventData.description,
          client_id: eventData.client_id,
          share_with: eventData.share_with,
          location: eventData.location,
        },
      };
  
      // Update the events state
      setEvents([...events, formattedEvent]);
  
      // Show success message
      toast.success("Event added successfully!");
  
      // Close the modal and reset the form
      setShowModal(false);
      resetForm();
    } catch (error) {
      // Log the error and show an error message
      console.error("Error creating event:", error);
      toast.error("Failed to add event");
    }
  };

  // Handle date click (open modal with pre-filled date)
  const handleDateClick = (info) => {
    setNewEvent({
      ...newEvent,
      start_date: info.dateStr,
      end_date: info.dateStr,
      start_time: "10:00:00",
      end_time: "12:00:00",
    });
    setShowModal(true);
  };

  // Handle event click (open details modal)
  const handleEventClick = (info) => {
    setSelectedEvent(info.event);
    setShowDetailsModal(true);
  };

  // Handle delete event
  const handleDeleteEvent = async (event) => {
    try {
      await api.delete(`/events/${event.id}`);
      setEvents(events.filter((e) => e.id !== event.id));
      toast.success("Event deleted successfully!");
      setShowDetailsModal(false);
    } catch (error) {
      toast.error("Failed to delete event");
    }
  };

  // Handle edit event (open event form modal)
  const handleEditEvent = (event) => {
    setEventToEdit(event);
    setNewEvent({
      title: event.title,
      description: event.extendedProps.description || "",
      start_date: event.startStr.split("T")[0],
      start_time: event.startStr.split("T")[1] || "00:00:00",
      end_date: event.end ? event.endStr.split("T")[0] : "",
      end_time: event.end ? event.endStr.split("T")[1] : "00:00:00",
      color: event.backgroundColor || "#4A90E2",
      client_id: event.extendedProps.client_id || null,
      share_with: event.extendedProps.share_with || "Only me",
      location: event.extendedProps.location || "",
    });
    setShowModal(true);
    setShowDetailsModal(false);
  };

  // Handle update event
  const handleUpdateEvent = async (e) => {
    e.preventDefault(); // Prevent default form submission
  
    // Validate required fields
    if (!newEvent.title || !newEvent.start_date) {
      toast.error("Title and Start Date are required!");
      return;
    }
  
    try {
      // Format the event data for the API
      const eventData = {
        title: newEvent.title,
        description: newEvent.description,
        start_date: newEvent.start_date,
        end_date: newEvent.end_date || null,
        start_time: newEvent.start_time || "00:00:00",
        end_time: newEvent.end_time || "00:00:00",
        created_by: 1, // Replace with the actual user ID
        location: newEvent.location,
        client_id: newEvent.client_id || null,
        share_with: newEvent.share_with,
        color: newEvent.color,
      };
  
      // Log the data being sent to the API
      console.log("Updating event with data:", eventData);
  
      // Send the request to the API
      const response = await api.put(`/events/${eventToEdit.id}`, eventData);
  
      // Log the response from the API
      console.log("API Response:", response.data);
  
      // Format the updated event for FullCalendar
      const updatedEvent = {
        id: eventToEdit.id,
        title: eventData.title,
        start: `${eventData.start_date}T${eventData.start_time}`,
        end: eventData.end_date ? `${eventData.end_date}T${eventData.end_time}` : null,
        backgroundColor: eventData.color,
        extendedProps: {
          description: eventData.description,
          client_id: eventData.client_id,
          share_with: eventData.share_with,
          location: eventData.location,
        },
      };
  
      // Update the events state
      setEvents(events.map((event) => (event.id === updatedEvent.id ? updatedEvent : event)));
  
      // Show success message
      toast.success("Event updated successfully!");
  
      // Close the modal and reset the form
      setShowModal(false);
      resetForm();
    } catch (error) {
      // Log the error and show an error message
      console.error("Error updating event:", error);
      toast.error("Failed to update event");
    }
  };
  // Reset form fields
  const resetForm = () => {
    setNewEvent({
      title: "",
      description: "",
      start_date: "",
      start_time: "",
      end_date: "",
      end_time: "",
      created_by: 1,
      location: "",
      client_id: null,
      labels: "",
      share_with: "Only me",
      color: "#4A90E2",
    });
    setEventToEdit(null);
  };

  return (
    <div>
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <PageHeader
        title="Event Calendar"
        customContent={
          <div className="flex gap-1">
            <Select
              value={eventOption}
              options={[]}
              onChange={(selectedOption) => setEventOption(selectedOption)}
              className="basic-single p-1"
              classNamePrefix="select"
              placeholder="- Event label -"
            />
            <select className="border h-8 rounded bg-gray-50 mt-1.5">
              <option value="" disabled selected hidden>
                Event Type
              </option>
              <option value="event">Events</option>
              <option value="leave">Leave</option>
              <option value="taskstart">Task Start Date</option>
              <option value="taskdeadline">Task Deadline</option>
              <option value="projectstart">Project Start Date</option>
              <option value="projectdeadline">Project Deadline</option>
            </select>
          </div>
        }
        buttons={[
          {
            label: "Manage Labels",
            icon: FiTag,
            onClick: () => setIsManageOpen(true),
          },
          {
            label: "Add Event",
            icon: FiPlusCircle,
            onClick: () => setShowModal(true),
          },
        ]}
      />

      {/* Event Form Modal */}
      <EventModal
        showModal={showModal}
        setShowModal={setShowModal}
        newEvent={newEvent}
        setNewEvent={setNewEvent}
        eventToEdit={eventToEdit}
        resetForm={resetForm}
        handleSubmit={eventToEdit ? handleUpdateEvent : handleCreateEvent} // Pass the correct handler
        clients={clients}
        teamMembers={teamMembers}
      />

      {/* Event Details Modal */}
      {selectedEvent && (
        <Dialog
          open={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          fullWidth
          maxWidth="sm"
          sx={{
            "& .MuiDialog-paper": {
              borderRadius: "12px",
            },
          }}
        >
          {/* Dialog Title */}
          <DialogTitle
            sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
            className="dark:bg-gray-700 dark:text-white"
          >
            <Typography variant="h6">{selectedEvent.title}</Typography>
            <IconButton onClick={() => setShowDetailsModal(false)}>
              <IoClose size={24} />
            </IconButton>
          </DialogTitle>

          {/* Dialog Content */}
          <DialogContent dividers className="dark:bg-gray-700 dark:text-white">
            <Typography variant="body1" className="mb-4">
              <strong>Description:</strong> {selectedEvent.extendedProps.description}
            </Typography>
            <Typography variant="body1" className="mb-4">
              <strong>Location:</strong> {selectedEvent.extendedProps.location}
            </Typography>
            <Typography variant="body1" className="mb-4">
              <strong>Start:</strong> {new Date(selectedEvent.start).toLocaleString()}
            </Typography>
            <Typography variant="body1" className="mb-4">
              <strong>End:</strong> {selectedEvent.end ? new Date(selectedEvent.end).toLocaleString() : "N/A"}
            </Typography>
            <Typography variant="body1" className="mb-4">
              <strong>Shared With:</strong> {selectedEvent.extendedProps.share_with}
            </Typography>
          </DialogContent>

          {/* Dialog Actions */}
          <DialogActions className="dark:bg-gray-700 dark:text-white">
            <Button onClick={() => handleEditEvent(selectedEvent)} variant="contained" color="primary">
              Edit
            </Button>
            <Button onClick={() => handleDeleteEvent(selectedEvent)} variant="contained" color="error">
              Delete
            </Button>
            <Button onClick={() => setShowDetailsModal(false)} variant="outlined">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Calendar */}
      <div className="bg-white shadow-lg rounded-b-md p-4 border-t dark:bg-gray-700 dark:text-white">
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
            }}
            events={events}
            editable={true}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            height="80vh"
          />
        )}
      </div>
      
      {/* Manage Labels Modal */}
      <ManageLabels
        isOpen={isManageOpen}
        onClose={() => setIsManageOpen(false)}
        labelsList={labelsList}
        setLabelsList={setLabelsList}
      />
    </div>
  );
};

export default Events;