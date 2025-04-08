// projectTime.controller.js

import { createProjectTime, getProjectTimeById, updateProjectTime } from "../model/project.model.js";

// import {
//     createProjectTime,
//     updateProjectTime,
//     getProjectTimeById
//   } from "../models/projectTime.model.js";
  
  // ✅ Start Timer
  export const startTimerController = async (req, res) => {
    try {
      const { project_id, task_id } = req.body;
      const user_id = req.user.id; // ✅ From JWT
  
      const start_time = new Date();
  
      const newLog = await createProjectTime({
        project_id,
        task_id,
        user_id,
        start_time,
        hours: 0,
        status: "open",
        note: "Timer started"
      });
  
      res.status(201).json({ success: true, message: "Timer started", id: newLog.id });
    } catch (err) {
      console.error("❌ Error starting timer:", err);
      res.status(500).json({ success: false, message: "Failed to start timer" });
    }
  };
  
  // ✅ Stop Timer
  export const stopTimerController = async (req, res) => {
    try {
      const { id } = req.params; // Time entry ID
  
      const log = await getProjectTimeById(id);
      if (!log || log.status !== "open") {
        return res.status(404).json({ success: false, message: "Active timer not found" });
      }
  
      const end_time = new Date();
      const start = new Date(log.start_time);
      const hours = Math.abs(end_time - start) / 36e5; // ✅ convert milliseconds to hours
  
      await updateProjectTime(id, {
        end_time,
        hours,
        status: "logged",
        note: "Timer stopped"
      });
  
      res.status(200).json({ success: true, message: "Timer stopped", hours });
    } catch (err) {
      console.error("❌ Error stopping timer:", err);
      res.status(500).json({ success: false, message: "Failed to stop timer" });
    }
  };
  