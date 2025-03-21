import { 
  getAllRoles, 
  getRoleById, 
  createRole, 
  updateRolePermissions, 
  deleteRole 
} from "../model/role.model.js";

/**
 * ✅ Fetch all roles (with permissions)
 */
export const getRolesController = async (req, res) => {
  try {
    const roles = await getAllRoles();

    if (!roles || roles.length === 0) {
      return res.status(404).json({ success: false, message: "No roles found" });
    }

    res.status(200).json({ success: true, roles });
  } catch (error) {
    console.error("❌ Error fetching roles:", error);
    res.status(500).json({ success: false, message: "Internal server error while fetching roles", error: error.message });
  }
};

/**
 * ✅ Fetch a single role by ID
 */
export const getRoleByIdController = async (req, res) => {
  try {
    const roleId = req.params.id;

    if (!roleId) {
      return res.status(400).json({ success: false, message: "Role ID is required" });
    }

    const role = await getRoleById(roleId);

    if (!role) {
      return res.status(404).json({ success: false, message: "Role not found" });
    }

    res.status(200).json({ success: true, role });
  } catch (error) {
    console.error(`❌ Error fetching role [ID: ${req.params.id}]:`, error);
    res.status(500).json({ success: false, message: "Internal server error while fetching role", error: error.message });
  }
};
 

/**
 * ✅ Create a new role
 */
export const createRoleController = async (req, res) => {
  try {
    const { title, permissions } = req.body;

    if (!title || !permissions) {
      return res.status(400).json({ success: false, message: "Title and permissions are required" });
    }

    const roleId = await createRole(title, permissions);

    res.status(201).json({ success: true, message: "Role created successfully", roleId });
  } catch (error) {
    console.error("❌ Error creating role:", error);
    res.status(500).json({ success: false, message: "Internal server error while creating role", error: error.message });
  }
};

/**
 * ✅ Update role permissions
 */
export const updateRoleController = async (req, res) => {
  try {
    const roleId = req.params.id;
    const { permissions } = req.body;

    if (!roleId) {
      return res.status(400).json({ success: false, message: "Role ID is required" });
    }

    if (!permissions || typeof permissions !== "object") {
      return res.status(400).json({ success: false, message: "Invalid permissions format" });
    }

    await updateRolePermissions(roleId, permissions);

    res.status(200).json({ success: true, message: "Role updated successfully" });
  } catch (error) {
    console.error(`❌ Error updating role [ID: ${req.params.id}]:`, error);
    res.status(500).json({ success: false, message: "Internal server error while updating role", error: error.message });
  }
};

/**
 * ✅ Soft delete a role
 */
export const deleteRoleController = async (req, res) => {
  try {
    const roleId = req.params.id;

    if (!roleId) {
      return res.status(400).json({ success: false, message: "Role ID is required" });
    }

    await deleteRole(roleId);

    res.status(200).json({ success: true, message: "Role deleted successfully" });
  } catch (error) {
    console.error(`❌ Error deleting role [ID: ${req.params.id}]:`, error);
    res.status(500).json({ success: false, message: "Internal server error while deleting role", error: error.message });
  }
};
