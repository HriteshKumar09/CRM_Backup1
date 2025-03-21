import db from "../config/db.js";

// Fetch all team members
export const getAllTeamMembers = () => {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM team_members";
        db.query(query, (err, results) => {
            if (err) {
                console.error("Query error:", err);
                reject(err);
            } else {
                const plainResults = JSON.parse(JSON.stringify(results)); // Convert to plain JSON
                //console.log("Query results:", plainResults); // Debugging log
                resolve(plainResults);
            }
        });
    });
};


// Create a new team member
export const createTeamMember = (teamMemberData) => {
    return new Promise((resolve, reject) => {
        const { name, jobTitle, email, phone, status } = teamMemberData;
        const query = "INSERT INTO team_members (name, jobTitle, email, phone, status) VALUES (?, ?, ?, ?, ?)";
        db.query(query, [name, jobTitle, email, phone, status], (err, results) => {
            if (err) reject(err);
            else resolve(results.insertId);
        });
    });
};

// Update a team member by ID
export const updateTeamMemberById = (id, teamMemberData) => {
    return new Promise((resolve, reject) => {
        const { name, jobTitle, email, phone, status } = teamMemberData;
        const query = "UPDATE team_members SET name = ?, jobTitle = ?, email = ?, phone = ?, status = ? WHERE id = ?";
        db.query(query, [name, jobTitle, email, phone, status, id], (err, results) => {
            if (err) reject(err);
            else resolve(results.affectedRows);
        });
    });
};

// Delete a team member by ID
export const deleteTeamMemberById = (id) => {
    console.log("ID passed to model for deletion:", id); // Log the ID received
    return new Promise((resolve, reject) => {
        const query = "DELETE FROM team_members WHERE id = ?";
        db.query(query, [id], (err, results) => {
            if (err) {
                console.error("Database error during delete:", err); // Log database errors
                return reject(err);
            }
            console.log("Affected rows from DELETE query:", results.affectedRows); // Log query results
            resolve(results.affectedRows); // Resolve with the number of affected rows
        });
    });
};