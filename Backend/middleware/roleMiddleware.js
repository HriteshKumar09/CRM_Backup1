// // import { getUserPermissions } from "../model/user.model.js";

// // export const checkPermissions = (requiredPermission) => {
// //   return async (req, res, next) => {
// //     const userId = req.user.id; // Get user ID from JWT

// //     try {
// //       const permissions = await getUserPermissions(userId);

// //       if (!permissions.includes(requiredPermission)) {
// //         return res.status(403).json({ message: "Access Denied" });
// //       }

// //       next();
// //     } catch (error) {
// //       res.status(500).json({ message: "Server Error", error: error.message });
// //     }
// //   };
// // };

// import { getUserPermissions } from "../model/user.model.js";

// /**
//  * ✅ Middleware to check user permissions
//  */
// export const checkPermissions = (requiredPermission) => {
//   return async (req, res, next) => {
//     try {
//       const userId = req.user.id; // Get user ID from JWT payload

//       // Fetch user permissions
//       const permissions = await getUserPermissions(userId);

//       // Check if the user has the required permission
//       if (!permissions.includes(requiredPermission)) {
//         return res.status(403).json({ success: false, message: "Access Denied" });
//       }

//       next(); // ✅ User has permission, continue to the next middleware
//     } catch (error) {
//       console.error("❌ Error checking permissions:", error);
//       res.status(500).json({ success: false, message: "Server Error", error: error.message });
//     }
//   };
// };
import { getUserPermissions } from "../model/user.model.js";

/**
 * ✅ Middleware to check user permissions (Admins Bypass)
 */
export const checkPermissions = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.id;  // Get user ID from JWT payload
      const isAdmin = req.user.is_admin; // Get admin status

      // ✅ Allow Admins to Bypass Permission Checks
      if (isAdmin) {
        console.log(`✅ Admin User ${userId} granted full access (Skipping Permission Checks).`);
        return next(); // Proceed without checking permissions
      }

      // Fetch user permissions
      const permissions = await getUserPermissions(userId);

      console.log(`🔍 Checking permission: ${requiredPermission}`);
      console.log(`✅ User permissions:`, permissions);

      // Ensure permissions is a valid array
      if (!Array.isArray(permissions)) {
        console.error("❌ ERROR: Permissions is not an array!", permissions);
        return res.status(500).json({ success: false, message: "Server Error: Invalid permissions format" });
      }

      // Check if the user has the required permission
      if (!permissions.includes(requiredPermission)) {
        console.error(`❌ ERROR: User ${userId} does NOT have permission: ${requiredPermission}`);
        return res.status(403).json({ success: false, message: "Access Denied" });
      }

      console.log(`✅ User ${userId} has permission: ${requiredPermission}. Proceeding...`);
      next(); // ✅ User has permission, continue

    } catch (error) {
      console.error("❌ Error checking permissions:", error);
      res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
  };
};
