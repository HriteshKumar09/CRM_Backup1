import {
    createAttendance,
    getAttendanceByUserId,
    updateAttendance,
    addNoteToAttendance,
    deleteAttendance,
    updateAttendanceStatus
  } from "../model/timeCardsModel.js"; // Import the model functions
  
  /**
   * Controller to handle clock-in action.
   * - Admin can clock-in just like a regular user.
   */
  export const clockIn = async (req, res) => {
    try {
      const userId = req.user.id; // Get userId from JWT (logged-in user)
      const inTime = new Date(); // Current timestamp for clock-in
      const note = req.body.note || null;
  
      // Create the attendance record in DB
      const attendanceId = await createAttendance(
        userId,
        "incomplete", // Status for clocked-in users
        inTime,
        note
      );
  
      return res.status(201).json({
        success: true,
        message: "Clocked in successfully.",
        attendanceId,
      });
    } catch (error) {
      console.error("Error clocking in:", error);
      return res.status(500).json({
        success: false,
        message: "Error clocking in.",
        error: error.message,
      });
    }
  };
  
  /**
   * Controller to handle clock-out action.
   * Admin can clock-out just like any regular user.
   */
  export const clockOut = async (req, res) => {
    try {
      const userId = req.user.id; // Get userId from JWT (logged-in user)
      const outTime = new Date(); // Current timestamp for clock-out
      const note = req.body.note || null;
  
      // Fetch the most recent attendance record with status 'incomplete'
      const attendanceRecords = await getAttendanceByUserId(userId);
      const latestRecord = attendanceRecords.find(
        (record) => record.status === "incomplete"
      );
  
      if (!latestRecord) {
        return res.status(400).json({
          success: false,
          message: "No 'incomplete' attendance record found to clock out.",
        });
      }
  
      // Calculate duration if necessary (you can customize the format)
      const durationMs = new Date(outTime).getTime() - new Date(latestRecord.in_time).getTime();
      const durationHours = durationMs / (1000 * 60 * 60); // total hours
      const durationFormatted = formatDuration(durationHours);
  
      // Update attendance record with clock-out time
      const updatedFields = {
        out_time: outTime,
        note: note,
        status: "pending",  // Admin review status
        checked_by: userId,
        checked_at: outTime,
        duration: durationFormatted, // Optional if storing duration
      };
  
      await updateAttendance(latestRecord.id, updatedFields);
  
      return res.status(200).json({
        success: true,
        message: "Clocked out successfully.",
      });
    } catch (error) {
      console.error("Error clocking out:", error);
      return res.status(500).json({
        success: false,
        message: "Error clocking out.",
        error: error.message,
      });
    }
  };
  
  /**
   * Controller to view timecard for the logged-in user.
   * Admin can view their own timecard.
   */
  export const getMyAttendance = async (req, res) => {
    try {
      const userId = req.user.id; // Get userId from JWT (logged-in user)
      const records = await getAttendanceByUserId(userId);
  
      return res.status(200).json({
        success: true,
        data: records,
      });
    } catch (error) {
      console.error("Error fetching attendance:", error);
      return res.status(500).json({
        success: false,
        message: "Error fetching attendance records.",
        error: error.message,
      });
    }
  };
  
  /**
   * Admin can add notes to their own or others' attendance.
   * This is useful for correcting clock-in/clock-out mistakes.
   */
  export const addNote = async (req, res) => {
    try {
      const attendanceId = parseInt(req.params.attendanceId, 10);
      const note = req.body.note || null;
  
      if (!note) {
        return res.status(400).json({
          success: false,
          message: "Note is required.",
        });
      }
  
      const affectedRows = await addNoteToAttendance(attendanceId, note);
      if (affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Attendance record not found or already deleted.",
        });
      }
  
      return res.status(200).json({
        success: true,
        message: "Note added successfully.",
      });
    } catch (error) {
      console.error("Error adding note to attendance:", error);
      return res.status(500).json({
        success: false,
        message: "Error adding note.",
        error: error.message,
      });
    }
  };
  
  /**
   * Controller to update attendance status (approved/rejected) by admin.
   * This will be used for reviewing staff timecards.
   */
  export const updateAttendanceStatusByAdmin = async (req, res) => {
    try {
      const { attendanceId, status, rejectReason } = req.body;
  
      // Admin can approve or reject timecards
      const affectedRows = await updateAttendanceStatus(attendanceId, status, rejectReason);
      if (affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Attendance record not found or already deleted.",
        });
      }
  
      return res.status(200).json({
        success: true,
        message: `Attendance record updated to ${status}.`,
      });
    } catch (error) {
      console.error("Error updating attendance status:", error);
      return res.status(500).json({
        success: false,
        message: "Error updating attendance status.",
        error: error.message,
      });
    }
  };
  
  /**
   * Admin can soft delete an attendance record (for corrections, etc.).
   */
  export const deleteAttendanceByAdmin = async (req, res) => {
    try {
      const { attendanceId } = req.body;
      const adminId = req.user.id; // Admin performing the delete
  
      const affectedRows = await deleteAttendance(attendanceId, adminId);
      if (affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Attendance record not found or already deleted.",
        });
      }
  
      return res.status(200).json({
        success: true,
        message: "Attendance record deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting attendance record:", error);
      return res.status(500).json({
        success: false,
        message: "Error deleting attendance record.",
        error: error.message,
      });
    }
  };
  
  /**
   * Helper function to format the duration in hours and minutes
   * Example: 9.5 hours => "9h 30m"
   */
  function formatDuration(hoursFloat) {
    const totalMinutes = Math.floor(hoursFloat * 60);
    const hh = Math.floor(totalMinutes / 60);
    const mm = totalMinutes % 60;
    return `${hh}h ${mm}m`;
  }
  