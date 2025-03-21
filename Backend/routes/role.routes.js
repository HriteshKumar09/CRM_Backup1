import express from "express";
import {
  getRolesController,
  getRoleByIdController,
  createRoleController,
  updateRoleController,
  deleteRoleController,
} from "../controller/role.controller.js";
import { checkPermissions } from "../middleware/roleMiddleware.js";
import { authenticate } from "../middleware/authenticate.js"; // Authentication Middleware

const router = express.Router();

// ✅ Replace "view_roles" with an actual permission
router.get("/", authenticate, checkPermissions("can_manage_all_projects"), getRolesController);
router.get("/:id", authenticate, checkPermissions("can_manage_all_projects"), getRoleByIdController);

// ✅ If "manage_roles" does NOT exist, replace it with something like "can_manage_all_kinds_of_settings"
router.post("/", authenticate, checkPermissions("can_manage_all_kinds_of_settings"), createRoleController);
router.patch("/:id", authenticate, checkPermissions("can_manage_all_kinds_of_settings"), updateRoleController);
router.delete("/:id", authenticate, checkPermissions("can_manage_all_kinds_of_settings"), deleteRoleController);

export default router;
