import db from "../config/db.js"; // Import the database connection

// 📌 Fetch all events
export const getAllEvents = () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM _events ORDER BY start_date DESC", (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

// 📌 Fetch event by ID
export const getEventById = (id) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM _events WHERE id = ?", [id], (err, results) => {
      if (err) return reject(err);
      if (results.length === 0) return reject(new Error("Event not found"));
      resolve(results[0]);
    });
  });
};

// 📌 Create a new event
export const createEvent = (eventData) => {
  return new Promise((resolve, reject) => {
    // Validate required fields
    if (!eventData.title || !eventData.description || !eventData.start_date || !eventData.created_by) {
      return reject(new Error("Missing required fields: title, description, start_date, or created_by"));
    }

    // Build the query
    const query = `
      INSERT INTO _events (
        title, description, start_date, end_date, start_time, end_time, created_by, location, 
        client_id, labels, share_with, editable_google_event, google_event_id, deleted, 
        ticket_id, project_id, task_id, proposal_id, contract_id, subscription_id, invoice_id, 
        order_id, next_recurring_time, no_of_cycles_completed, snoozing_time, reminder_status, 
        type, color, recurring, repeat_every, repeat_type, no_of_cycles, last_start_date, 
        recurring_dates, confirmed_by, rejected_by, files
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // Prepare values with defaults
    const values = [
      eventData.title,
      eventData.description,
      eventData.start_date,
      eventData.end_date ?? null,
      eventData.start_time ?? null,
      eventData.end_time ?? null,
      eventData.created_by,
      eventData.location ?? null,
      eventData.client_id ?? 0,
      eventData.labels ?? "",
      eventData.share_with ?? null,
      eventData.editable_google_event ?? 0,
      eventData.google_event_id ?? "",
      eventData.deleted ?? 0,
      eventData.ticket_id ?? 0,
      eventData.project_id ?? 0,
      eventData.task_id ?? 0,
      eventData.proposal_id ?? 0,
      eventData.contract_id ?? 0,
      eventData.subscription_id ?? 0,
      eventData.invoice_id ?? 0,
      eventData.order_id ?? 0,
      eventData.next_recurring_time ?? null,
      eventData.no_of_cycles_completed ?? 0,
      eventData.snoozing_time ?? null,
      eventData.reminder_status ?? "new",
      eventData.type ?? "event",
      eventData.color ?? "#3788d8",
      eventData.recurring ?? 0,
      eventData.repeat_every ?? 0,
      eventData.repeat_type ?? null,
      eventData.no_of_cycles ?? 0,
      eventData.last_start_date ?? null,
      eventData.recurring_dates ?? "",
      eventData.confirmed_by ?? "",
      eventData.rejected_by ?? "",
      eventData.files ?? ""
    ];

    // Execute the query
    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Error creating event:", err);
        return reject(new Error("Failed to create event"));
      }
      resolve({ id: result.insertId, ...eventData });
    });
  });
};


// 📌 Update an event
export const updateEvent = (id, eventData) => {
  return new Promise((resolve, reject) => {
    // Validate the ID
    const eventId = parseInt(id, 10);
    if (isNaN(eventId)) {
      return reject(new Error("Invalid event ID"));
    }

    // Build the query
    const query = `
      UPDATE _events 
      SET 
        title = ?, 
        description = ?, 
        start_date = ?, 
        end_date = ?, 
        start_time = ?, 
        end_time = ?, 
        location = ?, 
        labels = ?, 
        share_with = ?, 
        editable_google_event = ?, 
        google_event_id = ?, 
        deleted = ?, 
        ticket_id = ?, 
        project_id = ?, 
        task_id = ?, 
        proposal_id = ?, 
        contract_id = ?, 
        subscription_id = ?, 
        invoice_id = ?, 
        order_id = ?, 
        next_recurring_time = ?, 
        no_of_cycles_completed = ?, 
        snoozing_time = ?, 
        reminder_status = ?, 
        type = ?, 
        color = ?, 
        recurring = ?, 
        repeat_every = ?, 
        repeat_type = ?, 
        no_of_cycles = ?, 
        last_start_date = ?, 
        recurring_dates = ?, 
        confirmed_by = ?, 
        rejected_by = ?, 
        files = ?
      WHERE id = ?
    `;

    // Prepare values with defaults
    const values = [
      eventData.title,
      eventData.description,
      eventData.start_date,
      eventData.end_date ?? null,
      eventData.start_time ?? null,
      eventData.end_time ?? null,
      eventData.location ?? null,
      eventData.labels ?? "",
      eventData.share_with ?? null,
      eventData.editable_google_event ?? 0,
      eventData.google_event_id ?? "",
      eventData.deleted ?? 0,
      eventData.ticket_id ?? 0,
      eventData.project_id ?? 0,
      eventData.task_id ?? 0,
      eventData.proposal_id ?? 0,
      eventData.contract_id ?? 0,
      eventData.subscription_id ?? 0,
      eventData.invoice_id ?? 0,
      eventData.order_id ?? 0,
      eventData.next_recurring_time ?? null,
      eventData.no_of_cycles_completed ?? 0,
      eventData.snoozing_time ?? null,
      eventData.reminder_status ?? "new",
      eventData.type ?? "event",
      eventData.color ?? "#3788d8",
      eventData.recurring ?? 0,
      eventData.repeat_every ?? 0,
      eventData.repeat_type ?? null,
      eventData.no_of_cycles ?? 0,
      eventData.last_start_date ?? null,
      eventData.recurring_dates ?? "",
      eventData.confirmed_by ?? "",
      eventData.rejected_by ?? "",
      eventData.files ?? "",
      eventId // WHERE clause
    ];

    // Execute the query
    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Error updating event:", err);
        return reject(new Error("Failed to update event"));
      }

      // Check if the event was actually updated
      if (result.affectedRows === 0) {
        return reject(new Error("Event not found"));
      }

      resolve({ id: eventId, ...eventData });
    });
  });
};

// 📌 Delete an event
export const deleteEvent = (id) => {
  return new Promise((resolve, reject) => {
    // Validate the ID
    const eventId = parseInt(id, 10);
    if (isNaN(eventId)) {
      return reject(new Error("Invalid event ID"));
    }

    // Execute the query
    db.query("DELETE FROM _events WHERE id = ?", [eventId], (err, result) => {
      if (err) {
        console.error("Error deleting event:", err);
        return reject(new Error("Failed to delete event"));
      }

      // Check if the event was actually deleted
      if (result.affectedRows === 0) {
        return reject(new Error("Event not found"));
      }

      resolve({ message: "Event deleted successfully" });
    });
  });
};