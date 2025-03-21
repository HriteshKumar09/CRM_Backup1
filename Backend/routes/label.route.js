import express from "express";
import { authenticate } from "../middleware/authenticate.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";
import {
  getLabels,
  getAdminLabels,
  createNewLabel,
  modifyLabel,
  removeLabel,
} from "../controller/label.controller.js";

const router = express.Router();

// 🔹 Fetch labels based on context (Users & Admins)
router.get("/", authenticate, getLabels);

// 🔹 Fetch labels created by the admin (Admins Only)
router.get("/admin", authenticate, authorizeRoles("admin"), getAdminLabels);

// 🔹 Create a label (Admin Only)
router.post("/", authenticate, authorizeRoles("admin"), createNewLabel);

// 🔹 Update a label (Admin Only)
router.put("/:id", authenticate, authorizeRoles("admin"), modifyLabel);

// 🔹 Soft delete a label (Admin Only)
router.delete("/:id", authenticate, authorizeRoles("admin"), removeLabel);

export default router;
