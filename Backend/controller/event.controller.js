import { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent } from "../model/event.model.js";

export const fetchAllEvents = async (req, res) => {
  try {
    const events = await getAllEvents();
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ success: false, message: "Error fetching events" });
  }
};

export const fetchEventById = async (req, res) => {
  try {
    const eventId = parseInt(req.params.id, 10);
    if (isNaN(eventId)) {
      return res.status(400).json({ success: false, message: "Invalid event ID" });
    }

    const event = await getEventById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    res.status(200).json({ success: true, data: event });
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({ success: false, message: "Error fetching event" });
  }
};

export const createNewEvent = async (req, res) => {
  try {
    const { title, description, start_date, created_by } = req.body;

    // Validate required fields
    if (!title || !description || !start_date || !created_by) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing required fields",
        required: {
          title: !title,
          description: !description,
          start_date: !start_date,
          created_by: !created_by
        }
      });
    }

    // Log the incoming data
    console.log("Creating event with data:", req.body);

    const newEvent = await createEvent(req.body);
    
    if (!newEvent) {
      return res.status(500).json({ success: false, message: "Failed to create event" });
    }

    res.status(201).json({ 
      success: true, 
      message: "Event created successfully",
      data: newEvent 
    });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error creating event",
      error: error.message 
    });
  }
};

export const modifyEvent = async (req, res) => {
  try {
    const eventId = parseInt(req.params.id, 10);
    if (isNaN(eventId)) {
      return res.status(400).json({ success: false, message: "Invalid event ID" });
    }

    const updatedEvent = await updateEvent(eventId, req.body);
    if (!updatedEvent) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    res.status(200).json({ 
      success: true, 
      message: "Event updated successfully",
      data: updatedEvent 
    });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error updating event",
      error: error.message 
    });
  }
};

export const removeEvent = async (req, res) => {
  try {
    const eventId = parseInt(req.params.id, 10);
    if (isNaN(eventId)) {
      return res.status(400).json({ success: false, message: "Invalid event ID" });
    }

    await deleteEvent(eventId);
    res.status(200).json({ success: true, message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error deleting event",
      error: error.message 
    });
  }
};