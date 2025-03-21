import express from "express";
import { fetchAllEvents, fetchEventById, createNewEvent, modifyEvent, removeEvent } from "../controller/event.controller.js";

const router = express.Router();

router.get("/", fetchAllEvents);
router.get("/:id", fetchEventById);
router.post("/", createNewEvent);
router.put("/:id", modifyEvent);
router.delete("/:id", removeEvent);

export default router;
