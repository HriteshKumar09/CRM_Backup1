import db from "../config/db.js";

{/*Roles-Model */}

// Fetch all roles (using the _roles table)
export const getRoles = () => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        id AS "Role ID",        -- Fetch role ID
        title AS "Role Title",  -- Fetch role title (e.g., Admin, Team Member)
        deleted AS "Deleted"    -- Fetch deleted status (soft delete flag)
      FROM _roles
      WHERE deleted = 0;       -- Only fetch active roles
    `;
    
    db.query(query, (err, results) => {
      if (err) {
        console.error("Query error:", err);
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};


{/*TeamMemberSection*/}
// ✅ Fetch all team members (Joining `_users` with `_team_member_job_info`)
export const getAllTeamMembers = () => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        u.id AS user_id, 
        u.first_name, 
        u.last_name, 
        u.job_title,  
        u.email,        
        u.phone,        
        u.status        
      FROM _users u
      LEFT JOIN _team_member_job_info tm ON u.id = tm.user_id  
      WHERE u.deleted = 0;  -- Fetch only active users
    `;

    db.query(query, (err, results) => {
      if (err) {
        console.error("Query error:", err);
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};



// Add a new team member to _team_member_job_info table
export const createTeamMember = (teamMemberData) => {
  return new Promise((resolve, reject) => {
    const { userId, dateOfHire, salary, salaryTerm, teamId } = teamMemberData;

    // Ensure that all required fields are passed correctly
    if (!userId || !dateOfHire || !salary || !salaryTerm || !teamId) {
      return reject(new Error("Missing required job fields"));
    }

    const query = `
      INSERT INTO _team_member_job_info (user_id, date_of_hire, salary, salary_term, team_id)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(query, [userId, dateOfHire, salary, salaryTerm, teamId], (err, results) => {
      if (err) {
        console.error('Error inserting into _team_member_job_info:', err);
        return reject(new Error('Error inserting into _team_member_job_info'));
      }
      resolve(results.insertId); // Return the inserted team member ID
    });
  });
};

// Check if email exists in the _users table
export const checkEmailExists = (email) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT COUNT(*) AS emailCount FROM _users WHERE email = ?`;

    if (!email) {
      return reject(new Error("Email is required"));
    }

    db.query(query, [email], (err, results) => {
      if (err) {
        console.error('Error checking email in _users:', err);
        return reject(new Error('Error checking email'));
      }
      resolve(results[0].emailCount > 0); // Return true if email exists, false if not
    });
  });
};


// Add a new employee and their job info
export const createEmployee = (employeeData) => {
  return new Promise((resolve, reject) => {
    const {
      firstName,
      lastName,
      email,
      phone,
      gender,
      address,
      jobTitle,
      salary,
      salaryTerm,
      dateOfHire,
      password,
      roleId,
      teamId,
      language
    } = employeeData;

    // Validate required fields before inserting into the _users table
    if (!firstName || !lastName || !email || !password || !roleId || !teamId || !language) {
      console.log("Missing fields:", employeeData);  // Add this log to debug
      return reject(new Error("Missing required fields"));
    }

    // Insert user information into _users table
    const userQuery = `
      INSERT INTO _users (first_name, last_name, email, phone, gender, address, job_title, password, role_id, status, created_at, language)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', NOW(), ?)
    `;

    db.query(userQuery, [firstName, lastName, email, phone, gender, address, jobTitle, password, roleId, language], (err, userResults) => {
      if (err) {
        console.error('Error inserting into _users:', err);
        return reject(new Error('Error inserting into _users'));
      }

      const userId = userResults.insertId; // Get the user ID from the insert

      // Insert job details into _team_member_job_info table
      const jobQuery = `
        INSERT INTO _team_member_job_info (user_id, date_of_hire, salary, salary_term, team_id)
        VALUES (?, ?, ?, ?, ?)
      `;

      db.query(jobQuery, [userId, dateOfHire, salary, salaryTerm, teamId], (err, jobResults) => {
        if (err) {
          console.error('Error inserting into _team_member_job_info:', err);
          return reject(new Error('Error inserting into _team_member_job_info'));
        }

        resolve({
          userId: userId,
          jobId: jobResults.insertId, // Return the job ID from the insert
        });
      });
    });
  });
};



// Update a team member's details by ID
export const updateTeamMemberById = (id, teamMemberData) => {
  return new Promise((resolve, reject) => {
    const { dateOfHire, salary, salaryTerm } = teamMemberData;

    const query = `
      UPDATE _team_member_job_info
      SET date_of_hire = ?, salary = ?, salary_term = ?
      WHERE id = ? AND deleted = 0  -- Only update active team members
    `;
    db.query(query, [dateOfHire, salary, salaryTerm, id], (err, results) => {
      if (err) {
        console.error("Error updating team member:", err);
        reject(err);
      } else {
        resolve(results.affectedRows); // Return affected rows
      }
    });
  });
};


// Soft delete a team member by ID
export const deleteTeamMemberById = (id) => {
  return new Promise((resolve, reject) => {
    const query = "UPDATE _team_member_job_info SET deleted = 1 WHERE user_id = ?";

    db.query(query, [id], (err, results) => {
      if (err) {
        console.error("Database error during delete:", err);
        reject(err);
      } else {
        resolve(results.affectedRows > 0 ? "Team member deleted successfully" : "No team member found");
      }
    });
  });
};
// Get a specific team member's details by ID
export const getTeamMemberById = (id) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        u.id AS user_id, u.first_name, u.last_name, u.email, u.phone, 
        tm.salary, tm.salary_term, tm.date_of_hire
      FROM _users u
      LEFT JOIN _team_member_job_info tm ON u.id = tm.user_id
      WHERE u.id = ? AND u.deleted = 0
    `;
    
    db.query(query, [id], (err, result) => {
      if (err) {
        console.error("Error fetching team member by ID:", err);
        reject(err);
      } else {
        resolve(result[0] || "No team member found");
      }
    });
  });
};






{/* Leaves Section */}
// 1. Create a new leave application
export const createLeaveApplication = (data) => {
    return new Promise((resolve, reject) => {
        const { leave_type_id, start_date, end_date, total_days, total_hours, applicant_id, reason, created_by, files } = data;

        // If no files are provided, use an empty string as the default value
        const leaveFiles = files || '';  // Set files to an empty string if no files are provided

        // Validate the leave type exists
        const validateLeaveTypeQuery = `SELECT id FROM _leave_types WHERE id = ? AND deleted = 0 LIMIT 1`;
        db.query(validateLeaveTypeQuery, [leave_type_id], (err, results) => {
            if (err) {
                console.error("Error validating leave type:", err);
                reject(new Error("Failed to validate leave type"));
            } else if (results.length === 0) {
                reject(new Error("Invalid or deleted leave type"));
            } else {
                // Validate that start_date is before end_date
                if (new Date(start_date) > new Date(end_date)) {
                    return reject(new Error("Start date cannot be later than end date"));
                }

                // Insert leave application
                const query = `
                    INSERT INTO _leave_applications 
                    (leave_type_id, start_date, end_date, total_days, total_hours, applicant_id, reason, status, created_at, created_by, files, deleted)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?, 0)
                `;
                db.query(query, [leave_type_id, start_date, end_date, total_days, total_hours, applicant_id, reason, 'pending', created_by, leaveFiles], (err, result) => {
                    if (err) {
                        console.error("Error creating leave application:", err);
                        reject(new Error("Failed to create leave application"));
                    } else {
                        resolve(result.insertId);  // Return the leave ID
                    }
                });
            }
        });
    });
};

// 2. Update the leave status (approved, rejected, canceled)
export const updateLeaveStatus = (leaveId, status) => {
    return new Promise((resolve, reject) => {
        // Validate status
        const validStatuses = ['pending', 'approved', 'rejected', 'canceled'];
        if (!validStatuses.includes(status)) {
            return reject(new Error("Invalid status value"));
        }

        // Update leave application status
        const query = `
            UPDATE _leave_applications 
            SET status = ?, checked_at = NOW() 
            WHERE id = ? AND deleted = 0
        `;
        db.query(query, [status, leaveId], (err, result) => {
            if (err) {
                console.error("Error updating leave status:", err);
                reject(new Error("Failed to update leave status"));
            } else {
                resolve(result);  // Return the result of the update (affected rows)
            }
        });
    });
};

// 3. Get leave details by ID
export const getLeaveDetailsById = (leaveId) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT * FROM _leave_applications 
            WHERE id = ? AND deleted = 0
        `;
        db.query(query, [leaveId], (err, results) => {
            if (err) {
                console.error("Error fetching leave details:", err);
                reject(new Error("Failed to fetch leave details"));
            } else if (results.length === 0) {
                reject(new Error("Leave application not found"));
            } else {
                resolve(results[0]);  // Return the first result (leave details)
            }
        });
    });
};

// 4. Get all leave applications (for Admin)
export const getAllLeaveApplications = () => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT * FROM _leave_applications 
            WHERE deleted = 0
            ORDER BY created_at DESC
        `;
        db.query(query, (err, results) => {
            if (err) {
                console.error("Error fetching all leave applications:", err);
                reject(new Error("Failed to fetch all leave applications"));
            } else {
                resolve(results); // Return all leave applications
            }
        });
    });
};

// 5. Get leave applications by employee (for Staff)
export const getLeaveApplicationsByEmployee = (employeeId) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT * FROM _leave_applications 
            WHERE applicant_id = ? AND deleted = 0
            ORDER BY created_at DESC
        `;
        db.query(query, [employeeId], (err, results) => {
            if (err) {
                console.error("Error fetching employee's leave applications:", err);
                reject(new Error("Failed to fetch employee's leave applications"));
            } else {
                resolve(results); // Return leave applications for the specified employee
            }
        });
    });
};

// 6. Soft delete a leave application
export const deleteLeaveApplication = (leaveId) => {
    return new Promise((resolve, reject) => {
        const query = `
            UPDATE _leave_applications 
            SET deleted = 1 
            WHERE id = ? AND deleted = 0
        `;
        db.query(query, [leaveId], (err, result) => {
            if (err) {
                console.error("Error deleting leave application:", err);
                reject(new Error("Failed to delete leave application"));
            } else {
                resolve(result);  // Return the result of the deletion (affected rows)
            }
        });
    });
};



{/*Announcements Model*/}









{/*Social_links */}
// Function to get the social links for a user by user_id
export const getSocialLinksByUserId = async (userId) => {
  return new Promise((resolve, reject) => {
    // SQL query to get the social links for the given user_id where deleted = 0
    const query = 'SELECT * FROM _social_links WHERE user_id = ? AND deleted = 0';
    
    // Execute the query
    db.query(query, [userId], (err, results) => {
      if (err) {
        console.error('Error fetching social links:', err.message);
        return reject(new Error('Failed to fetch social links: ' + err.message));
      }
      
      // If no social links are found, return a message indicating no records
      if (results.length === 0) {
        return reject(new Error(`No active social links found for user ID: ${userId}`));
      }

      // If social links are found, return the first record (assuming there can only be one set of social links per user)
      resolve(results[0]);
    });
  });
};

// Function to create new social links for a user
export const createSocialLinks = async (userId, socialLinks) => {
  return new Promise((resolve, reject) => {
    // Check if the user exists
    const userExistsQuery = 'SELECT * FROM _users WHERE id = ?';
    db.query(userExistsQuery, [userId], (err, userExists) => {
      if (err) {
        console.error('Error checking user existence:', err.message);
        return reject(new Error('Failed to check user existence: ' + err.message));
      }

      if (userExists.length === 0) {
        return reject(new Error(`User with ID ${userId} does not exist.`));
      }

      // Get the highest current ID from the _social_links table
      const maxIdQuery = 'SELECT MAX(id) AS max_id FROM _social_links';
      db.query(maxIdQuery, (err, result) => {
        if (err) {
          console.error('Error getting max id:', err.message);
          return reject(new Error('Failed to get max id: ' + err.message));
        }

        // If no rows exist, start from ID 1, else use the next available ID
        const newId = result[0].max_id ? result[0].max_id + 1 : 1;

        // Prepare the SQL query to insert social links
        const query = `INSERT INTO _social_links 
          (id, user_id, facebook, twitter, linkedin, googleplus, digg, youtube, pinterest, instagram, github, tumblr, vine, whatsapp, deleted) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        // Destructure socialLinks to provide default values for empty fields
        const {
          facebook = null,
          twitter = null,
          linkedin = null,
          googleplus = null,
          digg = null,
          youtube = null,
          pinterest = null,
          instagram = null,
          github = null,
          tumblr = null,
          vine = null,
          whatsapp = null,
        } = socialLinks;

        // Prepare the values array
        const values = [
          newId,
          userId,
          facebook,
          twitter,
          linkedin,
          googleplus,
          digg,
          youtube,
          pinterest,
          instagram,
          github,
          tumblr,
          vine,
          whatsapp,
          0, // Explicitly setting deleted to 0
        ];

        // Log each value being inserted for debugging
        console.log('Values being inserted:', values);

        // Insert the values into the database
        db.query(query, values, (err, result) => {
          if (err) {
            console.error('Error while inserting social links:', err.message);
            return reject(new Error('Failed to insert social links: ' + err.message));
          }
          console.log('Inserted ID:', result.insertId); // Log the insertId
          resolve(newId); // Return the inserted ID
        });
      });
    });
  });
};
// Function to update social links for a specific user
export const updateSocialLinks = async (userId, socialLinks) => {
  return new Promise((resolve, reject) => {
    // Fetch the existing social links for the user
    const fetchQuery = 'SELECT * FROM _social_links WHERE user_id = ? AND deleted = 0';
    db.query(fetchQuery, [userId], (err, results) => {
      if (err) {
        console.error('Error fetching social links for update:', err.message);
        return reject(new Error('Failed to fetch social links for update: ' + err.message));
      }

      // If no social links are found for the user, reject the request
      if (results.length === 0) {
        return reject(new Error(`No active social links found for user ID: ${userId}`));
      }

      const currentLinks = results[0]; // Assume only one set of social links per user

      // Construct the updated social links object by merging existing and new data
      const updatedLinks = {
        facebook: socialLinks.facebook || currentLinks.facebook,
        twitter: socialLinks.twitter || currentLinks.twitter,
        linkedin: socialLinks.linkedin || currentLinks.linkedin,
        googleplus: socialLinks.googleplus || currentLinks.googleplus,
        digg: socialLinks.digg || currentLinks.digg,
        youtube: socialLinks.youtube || currentLinks.youtube,
        pinterest: socialLinks.pinterest || currentLinks.pinterest,
        instagram: socialLinks.instagram || currentLinks.instagram,
        github: socialLinks.github || currentLinks.github,
        tumblr: socialLinks.tumblr || currentLinks.tumblr,
        vine: socialLinks.vine || currentLinks.vine,
        whatsapp: socialLinks.whatsapp || currentLinks.whatsapp,
      };

      // Prepare the SQL query to update the social links
      const updateQuery = `UPDATE _social_links SET 
        facebook = ?, twitter = ?, linkedin = ?, googleplus = ?, digg = ?, youtube = ?, pinterest = ?, instagram = ?, 
        github = ?, tumblr = ?, vine = ?, whatsapp = ? 
        WHERE user_id = ? AND deleted = 0`;

      const updateValues = [
        updatedLinks.facebook,
        updatedLinks.twitter,
        updatedLinks.linkedin,
        updatedLinks.googleplus,
        updatedLinks.digg,
        updatedLinks.youtube,
        updatedLinks.pinterest,
        updatedLinks.instagram,
        updatedLinks.github,
        updatedLinks.tumblr,
        updatedLinks.vine,
        updatedLinks.whatsapp,
        userId
      ];

      // Execute the update query
      db.query(updateQuery, updateValues, (err, result) => {
        if (err) {
          console.error('Error while updating social links:', err.message);
          return reject(new Error('Failed to update social links: ' + err.message));
        }

        if (result.affectedRows === 0) {
          return reject(new Error(`No social links found for user ID: ${userId} to update`));
        }

        resolve(result.affectedRows); // Return the number of affected rows
      });
    });
  });
};


// Function to delete social links for a specific user
export const deleteSocialLinks = async (userId) => {
  return new Promise((resolve, reject) => {
    // Mark social links as deleted for the user
    const query = 'UPDATE _social_links SET deleted = 1 WHERE user_id = ? AND deleted = 0';

    db.query(query, [userId], (err, result) => {
      if (err) {
        console.error('Error deleting social links:', err.message); // Log the error
        return reject(new Error('Failed to delete social links: ' + err.message)); // Return custom error message
      }

      if (result.affectedRows === 0) {
        return reject(new Error(`No active social links found for user ID: ${userId} to delete`)); // Handle case where no record was deleted
      }

      resolve(result.affectedRows);  // Return number of affected rows
    });
  });
};





{/*Job-Info Team members */}
// Function to create a new job info record
export const createJobInfo = ({ userId, dateOfHire, salary, salaryTerm }) => {
  return new Promise((resolve, reject) => {
    // Input validation
    if (!userId || !dateOfHire || !salary || !salaryTerm) {
      return reject(new Error("All fields (userId, dateOfHire, salary, salaryTerm) are required."));
    }

    // Prepare the query to insert job info
    const query = `
      INSERT INTO _team_member_job_info (user_id, date_of_hire, salary, salary_term)
      VALUES (?, ?, ?, ?)
    `;

    // Values to insert
    const values = [userId, dateOfHire, salary, salaryTerm];

    // Execute the query
    db.query(query, values, (err, results) => {
      if (err) {
        console.error('Error inserting into _team_member_job_info:', err);
        reject(new Error('Failed to create job info.')); // Reject with a meaningful error
      } else {
        resolve(results.insertId); // Return the inserted job info ID
      }
    });
  });
};


export const getJobInfoByUserId = (userId) => {
  return new Promise((resolve, reject) => {
    // Input validation
    if (!userId) {
      return reject(new Error("userId is required to fetch job info."));
    }

    // Query to fetch job info along with job_title from _users table
    const query = `
      SELECT 
        t.*, 
        u.job_title 
      FROM 
        _team_member_job_info t
      INNER JOIN 
        _users u 
      ON 
        t.user_id = u.id
      WHERE 
        t.user_id = ? AND t.deleted = 0
    `;

    db.query(query, [userId], (err, result) => {
      if (err) {
        console.error('Error while fetching job info:', err);
        return reject(new Error('Failed to fetch job info from database.'));
      }
      resolve(result); // Return the job info of the user (empty array if no data found)
    });
  });
};

// Function to update job info
export const updateJobInfo = (userId, jobInfo) => {
  return new Promise((resolve, reject) => {
    // Input validation
    if (!userId || !jobInfo || Object.keys(jobInfo).length === 0) {
      return reject(new Error("userId and jobInfo are required to update job info."));
    }

    // Check if the user exists
    const checkUserQuery = `SELECT id FROM _team_member_job_info WHERE user_id = ? AND deleted = 0`;
    db.query(checkUserQuery, [userId], (err, result) => {
      if (err) {
        console.error('Error checking user:', err);
        return reject(new Error('Failed to check user existence.'));
      }

      if (result.length === 0) {
        return reject(new Error("No job info found for this user."));
      }

      // Separate job info and job title updates
      const { date_of_hire, salary, salary_term, job_title } = jobInfo;

      // Dynamically construct the UPDATE query for _team_member_job_info
      const updates = [];
      const values = [];

      if (date_of_hire !== undefined) {
        updates.push("date_of_hire = ?");
        values.push(date_of_hire);
      }
      if (salary !== undefined) {
        updates.push("salary = ?");
        values.push(salary);
      }
      if (salary_term !== undefined) {
        updates.push("salary_term = ?");
        values.push(salary_term);
      }

      // If no valid fields are provided for _team_member_job_info, skip its update
      let updateJobInfoQuery = null;
      if (updates.length > 0) {
        updateJobInfoQuery = `UPDATE _team_member_job_info SET ${updates.join(", ")} WHERE user_id = ? AND deleted = 0`;
        values.push(userId);
      }

      // Update job_title in _users table if provided
      let updateJobTitleQuery = null;
      if (job_title !== undefined) {
        updateJobTitleQuery = `UPDATE _users SET job_title = ? WHERE id = ?`;
      }

      // Execute the queries
      const executeQueries = () => {
        let affectedRows = 0;

        // Update _team_member_job_info
        if (updateJobInfoQuery) {
          db.query(updateJobInfoQuery, values, (err, jobInfoResult) => {
            if (err) {
              console.error('Error updating job info:', err);
              return reject(new Error('Failed to update job info.'));
            }

            affectedRows += jobInfoResult.affectedRows;

            // Update _users if needed
            if (updateJobTitleQuery) {
              db.query(updateJobTitleQuery, [job_title, userId], (err, jobTitleResult) => {
                if (err) {
                  console.error('Error updating job title:', err);
                  return reject(new Error('Failed to update job title.'));
                }

                affectedRows += jobTitleResult.affectedRows;
                resolve(affectedRows); // Return total affected rows
              });
            } else {
              resolve(affectedRows); // Return affected rows from _team_member_job_info update
            }
          });
        } else if (updateJobTitleQuery) {
          // Only update _users if no _team_member_job_info update is needed
          db.query(updateJobTitleQuery, [job_title, userId], (err, jobTitleResult) => {
            if (err) {
              console.error('Error updating job title:', err);
              return reject(new Error('Failed to update job title.'));
            }

            affectedRows += jobTitleResult.affectedRows;
            resolve(affectedRows); // Return affected rows from _users update
          });
        } else {
          // No updates to perform
          resolve(0);
        }
      };

      executeQueries();
    });
  });
};

export const deleteJobInfo = (userId) => {
  return new Promise((resolve, reject) => {
    // Input validation
    if (!userId) {
      return reject(new Error("userId is required to delete job info."));
    }

    // Check if the user exists
    const checkUserQuery = `SELECT id FROM _team_member_job_info WHERE user_id = ? AND deleted = 0`;
    db.query(checkUserQuery, [userId], (err, result) => {
      if (err) {
        console.error('Error checking user:', err);
        return reject(new Error('Failed to check user existence.'));
      }

      if (result.length === 0) {
        return reject(new Error("No job info found for this user."));
      }

      // Soft delete job info
      const query = `UPDATE _team_member_job_info SET deleted = 1 WHERE user_id = ? AND deleted = 0`;
      db.query(query, [userId], (err, result) => {
        if (err) {
          console.error('Error while deleting job info:', err);
          return reject(new Error('Failed to delete job info.'));
        }
        resolve(result.affectedRows); // Return affected rows
      });
    });
  });
};


{/*User_Preferences*/}
// Fetch user preferences
export const fetchUserPreferences = (userId) => {
  return new Promise((resolve, reject) => {
    // Input validation
    if (!userId) {
      return reject(new Error("userId is required to fetch preferences."));
    }

    // Fetch global preferences from `_users` table
    const userQuery = `
      SELECT enable_web_notification, enable_email_notification, language
      FROM _users
      WHERE id = ?;
    `;
    db.query(userQuery, [userId], (err, userResult) => {
      if (err) {
        console.error("Error fetching user preferences:", err);
        return reject(new Error("Failed to fetch user preferences."));
      }

      // Check if user exists
      if (userResult.length === 0) {
        return reject(new Error("User not found."));
      }

      // Fetch event-specific notification preferences from `_notification_settings` table
      const notificationQuery = `
        SELECT event, enable_web, enable_email
        FROM _notification_settings;
      `;
      db.query(notificationQuery, (err, notificationResult) => {
        if (err) {
          console.error("Error fetching notification preferences:", err);
          return reject(new Error("Failed to fetch notification preferences."));
        }

        // Return combined preferences
        resolve({
          success: true,
          data: {
            ...userResult[0], // Global preferences
            notification_settings: notificationResult, // Event-specific preferences
          },
        });
      });
    });
  });
};

export const updateUserPreferences = (userId, preferences) => {
  return new Promise((resolve, reject) => {
    // Input validation
    if (!userId) {
      return reject(new Error("userId is required to update preferences."));
    }
    if (!preferences || typeof preferences !== "object") {
      return reject(new Error("Invalid preferences data."));
    }

    // Update global preferences in `_users` table
    const userQuery = `
      UPDATE _users
      SET enable_web_notification = ?, enable_email_notification = ?, language = ?
      WHERE id = ?;
    `;
    db.query(
      userQuery,
      [
        preferences.enable_web_notification,
        preferences.enable_email_notification,
        preferences.language,
        userId,
      ],
      (err, userResult) => {
        if (err) {
          console.error("Error updating user preferences:", err);
          return reject(new Error("Failed to update user preferences."));
        }

        // Update event-specific notification preferences in `_notification_settings` table
        if (preferences.notification_settings && Array.isArray(preferences.notification_settings)) {
          let updateCount = 0; // Track number of successful updates
          let updateErrors = []; // Track errors during updates

          preferences.notification_settings.forEach((setting) => {
            const notificationQuery = `
              UPDATE _notification_settings
              SET enable_web = ?, enable_email = ?
              WHERE event = ?;
            `;
            db.query(
              notificationQuery,
              [setting.enable_web, setting.enable_email, setting.event],
              (err, notificationResult) => {
                if (err) {
                  console.error("Error updating notification preferences:", err);
                  updateErrors.push(`Failed to update event: ${setting.event}`);
                } else {
                  updateCount++;
                }

                // Resolve after all updates are processed
                if (updateCount + updateErrors.length === preferences.notification_settings.length) {
                  if (updateErrors.length > 0) {
                    return reject(new Error(updateErrors.join(", ")));
                  }
                  resolve({
                    success: true,
                    message: "Preferences updated successfully.",
                  });
                }
              }
            );
          });
        } else {
          // No notification settings to update
          resolve({
            success: true,
            message: "Global preferences updated successfully.",
          });
        }
      }
    );
  });
};