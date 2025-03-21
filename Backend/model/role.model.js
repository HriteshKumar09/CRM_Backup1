import db from "../config/db.js";
import { serialize,unserialize } from "php-serialize"; // ✅ Import PHP unserialization package

/**
 * ✅ Fetch all roles (with deserialized permissions)
 */
export const getAllRoles = () => {
  console.log("🔍 Fetching all roles...");

  return new Promise((resolve, reject) => {
    // ✅ Step 1: Fetch all roles from `_roles` table where `deleted = 0`
    const rolesQuery = "SELECT * FROM _roles WHERE deleted = 0";

    db.query(rolesQuery, (err, rolesResult) => {
      if (err) {
        console.error("❌ Error fetching roles:", err.message);
        return reject({ message: "Database error while fetching roles", error: err });
      }

      if (!Array.isArray(rolesResult) || rolesResult.length === 0) {
        console.log("No roles found in the database.");
        return resolve([]); // Return empty array if no roles exist
      }

      console.log("✅ Step 1 Passed: Retrieved roles from database:", rolesResult);

      // ✅ Step 2: Process each role and unserialize permissions
      const processedRoles = rolesResult.map((role) => {
        let permissions = {};

        // ✅ Unserialize PHP serialized permissions safely
        if (role.permissions && role.permissions !== "NULL") {
          try {
            permissions = unserialize(role.permissions);
            console.log(`✅ Step 2 Passed: Unserialized permissions for Role ID ${role.id}:`, permissions);
          } catch (err) {
            console.error(`❌ ERROR: Failed to unserialize permissions for Role ID ${role.id}:`, err);
          }
        }

        return {
          id: role.id,
          title: role.title,
          permissions: permissions, // ✅ Send as JSON object
        };
      });

      console.log("✅ Step 3 Passed: Processed roles array:", processedRoles);
      return resolve(processedRoles);
    });
  });
};

/**
 * ✅ Fetch a single role by ID (with deserialized permissions)
 */
export const getRoleById = (roleId) => {
  console.log("🔍 Fetching role by ID:", roleId);

  return new Promise((resolve, reject) => {
    // ✅ Step 1: Fetch the role by ID from `_roles` table
    const roleQuery = "SELECT * FROM _roles WHERE id = ?";

    db.query(roleQuery, [roleId], (err, roleResult) => {
      if (err) {
        console.error("❌ Error fetching role:", err.message);
        return reject({ message: "Database error while fetching role", error: err });
      }

      if (roleResult.length === 0) {
        console.log("No role found with this ID:", roleId);
        return resolve(null); // Return `null` if no role found
      }

      const role = roleResult[0];
      let permissions = {};

      // ✅ Step 2: Unserialize the role's permissions
      if (role.permissions && role.permissions !== "NULL") {
        try {
          permissions = unserialize(role.permissions);
          console.log(`✅ Step 2 Passed: Unserialized permissions for Role ID ${role.id}:`, permissions);
        } catch (err) {
          console.error(`❌ ERROR: Failed to unserialize permissions for Role ID ${role.id}:`, err);
        }
      }

      return resolve({
        id: role.id,
        title: role.title,
        permissions: permissions, // ✅ Send as JSON
      });
    });
  });
};

/**
 * ✅ Create a new role (stores permissions in PHP serialized format)
 */
export const createRole = (title, permissions) => {
  console.log("🔍 Creating a new role...");

  return new Promise((resolve, reject) => {
    // ✅ Step 1: Serialize the permissions before saving
    const serializedPermissions = serialize(permissions); // ✅ Serialize permissions into PHP format

    const query = "INSERT INTO _roles (title, permissions) VALUES (?, ?)";
    db.query(query, [title, serializedPermissions], (err, result) => {
      if (err) {
        console.error("❌ Database error while creating role:", err);
        return reject({ message: "Database error while creating role", error: err });
      }

      console.log("✅ Step 2 Passed: Created role with ID:", result.insertId);
      return resolve(result.insertId); // Return the new role ID
    });
  });
};

/**
 * ✅ Update role permissions (serializes before storing)
 */
export const updateRolePermissions = (roleId, permissions) => {
  console.log("🔍 Updating role permissions for Role ID:", roleId);

  return new Promise((resolve, reject) => {
    // ✅ Step 1: Serialize the updated permissions before saving
    const serializedPermissions = serialize(permissions);

    const query = "UPDATE _roles SET permissions = ? WHERE id = ?";
    db.query(query, [serializedPermissions, roleId], (err, result) => {
      if (err) {
        console.error("❌ Database error while updating role permissions:", err);
        return reject({ message: "Database error while updating role permissions", error: err });
      }

      console.log("✅ Step 2 Passed: Updated role permissions for Role ID:", roleId);
      return resolve(result); // Return the result of the update operation
    });
  });
};

/**
 * ✅ Soft delete a role (sets `deleted` to 1)
 */
export const deleteRole = (roleId) => {
  console.log("🔍 Deleting role with Role ID:", roleId);

  return new Promise((resolve, reject) => {
    const query = "UPDATE _roles SET deleted = 1 WHERE id = ?";
    db.query(query, [roleId], (err, result) => {
      if (err) {
        console.error("❌ Database error while deleting role:", err);
        return reject({ message: "Database error while deleting role", error: err });
      }

      console.log("✅ Step 2 Passed: Soft deleted role with Role ID:", roleId);
      return resolve(result); // Return the result of the delete operation
    });
  });
};
