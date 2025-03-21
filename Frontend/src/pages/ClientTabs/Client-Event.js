import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import axios from "axios";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import { FiTrash2, FiTag, FiPlusCircle } from "react-icons/fi";
import PageHeader from "../../extra/PageHeader";
import ManageLabels from "../../extra/ManageLabels";
import EventForm from "../../extra/EventForm";
import Select from "react-select";

const ClientEvent = () => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventToEdit, setEventToEdit] = useState(null);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [labelsList, setLabelsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [eventOptions, setEventOptions] = useState([]); // Event label options state
  const [eventOption, setEventOption] = useState(null); // Selected event label state

  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    start_date: "",
    start_time: "",
    end_date: "",
    end_time: "",
    created_by: 1,
    location: "",
    client_id: 3,
    labels: "",
    share_with: "Only me",
    color: "#4A90E2",
  });

  // 📌 Fetch events from backend
  useEffect(() => {
    fetchEvents();
    fetchEventLabels(); // Fetch event labels
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:4008/api/events");
      if (response.data && Array.isArray(response.data)) {
        const formattedEvents = response.data.map((event) => ({
          id: event.id,
          title: event.title,
          start: event.start_date ? `${event.start_date}T${event.start_time || "00:00:00"}` : null,
          end: event.end_date ? `${event.end_date}T${event.end_time || "23:59:59"}` : null,
          backgroundColor: event.color || "#4A90E2",
        }));
        setEvents(formattedEvents);
      } else {
        console.error("Invalid response format", response.data);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      Swal.fire("Error", "Failed to fetch events", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchEventLabels = async () => {
    try {
      const response = await axios.get("http://localhost:4008/api/eventLabels");
      if (response.data && Array.isArray(response.data)) {
        const labelsData = response.data.map((label) => ({
          value: label.id,
          label: label.name, // Adjust based on your API response
        }));
        setEventOptions(labelsData);
      } else {
        console.error("Invalid response format", response.data);
      }
    } catch (error) {
      console.error("Error fetching labels:", error);
      Swal.fire("Error", "Failed to fetch event labels", "error");
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:4008/api/events", newEvent);
      if (response.data) {
        setEvents([
          ...events,
          {
            id: response.data.id,
            title: newEvent.title,
            start: `${newEvent.start_date}T${newEvent.start_time || "00:00:00"}`,
            end: newEvent.end_date ? `${newEvent.end_date}T${newEvent.end_time || "00:00:00"}` : null,
            backgroundColor: newEvent.color,
          },
        ]);
        Swal.fire("Success", "Event added successfully!", "success");
        setShowModal(false);
        resetForm();
      } else {
        Swal.fire("Error", "Unexpected response from server", "error");
      }
    } catch (error) {
      console.error("Error creating event:", error);
      Swal.fire("Error", "Failed to add event", "error");
    }
  };

  const handleDateClick = async (info) => {
    setNewEvent({
      ...newEvent,
      start_date: info.dateStr,
      end_date: info.dateStr,
      start_time: "10:00:00",
      end_time: "12:00:00",
    });
    setShowModal(true);
  };

  const handleEventClick = (info) => {
    setEventToDelete(info.event);
    setShowDeleteModal(true);
  };

  const handleDeleteEvent = async () => {
    if (!eventToDelete?.id) return;

    try {
      await axios.delete(`http://localhost:4008/api/events/${eventToDelete.id}`);
      setEvents(events.filter(event => event.id !== eventToDelete.id));
      Swal.fire("Deleted!", "Your event has been deleted.", "success");
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting event:", error);
      Swal.fire("Error", "Failed to delete event", "error");
    }
  };

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
    });
    setShowModal(true);
  };

  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    if (!eventToEdit?.id) return;

    try {
      const response = await axios.put(`http://localhost:4008/api/events/${eventToEdit.id}`, newEvent);
      if (response.data) {
        setEvents(events.map(event => event.id === eventToEdit.id ? response.data : event));
        Swal.fire("Success", "Event updated successfully!", "success");
        setShowModal(false);
      } else {
        Swal.fire("Error", "Unexpected response from server", "error");
      }
    } catch (error) {
      console.error("Error updating event:", error);
      Swal.fire("Error", "Failed to update event", "error");
    }
  };

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
      client_id: 3,
      labels: "",
      share_with: "Only me",
      color: "#4A90E2",
    });
    setEventToEdit(null);
  };

  const renderEventContent = (eventInfo) => (
    <div className="relative flex justify-between items-center w-full group">
      <span className="truncate">{eventInfo.event.title}</span>
      <FiTrash2
        className="text-black cursor-pointer opacity-0 group-hover:opacity-100 ml-2 transition-opacity"
        onClick={() => handleEventClick(eventInfo.event)}
      />
    </div>
  );
  return (
    <div>
      <PageHeader
        title="Event calendar"
        customContent={
          <div className="flex gap-2">
            <Select
              value={eventOption}
              options={eventOptions}
              // onChange={(selectedOption) => setEventOption(selectedOption)}
              className=" dark:bg-gray-800 dark:text-white"
              classNamePrefix="select"
              placeholder="- Event label -"
              styles={{
                control: (base) => ({
                  ...base,
                  backgroundColor: "var(--tw-bg-opacity, #1E293B)", // Dark mode color
                  color: "#fff",
                }),
              }}
            />
            <select className="border h-8 rounded font-bold mb-1.5 dark:bg-gray-800 dark:text-white">
              <option value="" disabled selected hidden>Event Type</option>
              <option value="event">Events</option>
              <option value="leave">Leave</option>
              <option value="tasktaskstart">Task Start Date</option>
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

      <EventForm
        showModal={showModal}
        setShowModal={setShowModal}
        newEvent={newEvent}
        setNewEvent={setNewEvent}
        eventToEdit={eventToEdit}
        resetForm={resetForm}
        onSubmit={eventToEdit ? handleUpdateEvent : handleCreateEvent}
      />

      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-lg shadow-lg w-96"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <h3 className="text-lg font-bold text-gray-800 mb-4">Delete Event</h3>
              <p>Are you sure you want to delete this event?</p>
              <div className="flex justify-between mt-4">
                <button
                  onClick={handleDeleteEvent}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                >
                  Delete
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white shadow-lg rounded-b-md p-4 border-t dark:bg-gray-700 dark:text-white">
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
            }}
            events={events}
            editable={true}
            dateClick={handleDateClick}
            eventContent={renderEventContent}
            eventClick={(info) => handleEditEvent(info.event)}
            height="80vh"
          />
        )}
      </div>

      <ManageLabels
        isOpen={isManageOpen}
        onClose={() => setIsManageOpen(false)}
        labelsList={labelsList}
        setLabelsList={setLabelsList}
      />
    </div>
  )
}

export default ClientEvent