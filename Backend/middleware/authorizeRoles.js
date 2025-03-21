export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(403).json({ success: false, message: "Not authorized" });
        }

        const userRole = req.user.roleId;

        // ✅ Check if the user has required roles
        if (allowedRoles.includes("admin") && userRole === 27) {
            return next(); // ✅ Admin can proceed
        }

        // ✅ If Staff, allow access ONLY to their own data
        if (allowedRoles.includes("staff") && userRole === 28)  {
            return next();
        }

        return res.status(403).json({ success: false, message: "Access Denied: Insufficient permissions" });
    };
};
