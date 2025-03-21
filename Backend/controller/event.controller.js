import { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent } from "../model/event.model.js";

export const fetchAllEvents = async (req, res) => {
  try {
    const events = await getAllEvents();
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const fetchEventById = async (req, res) => {
  try {
    const eventId = parseInt(req.params.id, 10);
    if (isNaN(eventId)) {
      return res.status(400).json({ success: false, error: "Invalid event ID" });
    }

    const event = await getEventById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, error: "Event not found" });
    }

    res.status(200).json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createNewEvent = async (req, res) => {
  try {
    const { title, description, start_date, created_by } = req.body;

    // Validate required fields
    if (!title || !description || !start_date || !created_by) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }

    const newEvent = await createEvent(req.body);
    res.status(201).json({ success: true, data: newEvent });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const modifyEvent = async (req, res) => {
  try {
    const eventId = parseInt(req.params.id, 10);
    if (isNaN(eventId)) {
      return res.status(400).json({ success: false, error: "Invalid event ID" });
    }

    const updatedEvent = await updateEvent(eventId, req.body);
    if (!updatedEvent) {
      return res.status(404).json({ success: false, error: "Event not found" });
    }

    res.status(200).json({ success: true, data: updatedEvent });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const removeEvent = async (req, res) => {
  try {
    const eventId = parseInt(req.params.id, 10);
    if (isNaN(eventId)) {
      return res.status(400).json({ success: false, error: "Invalid event ID" });
    }

    await deleteEvent(eventId);
    res.status(200).json({ success: true, message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};