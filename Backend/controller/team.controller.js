import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'; // Import bcrypt for password hashing
import { checkEmailExists, createEmployee, createJobInfo, createLeaveApplication, createSocialLinks, 
  createTeamMember, 
 deleteJobInfo, deleteSocialLinks, deleteTeamMemberById, 
  fetchUserPreferences, 
  getAllLeaveApplications, 
  getAllTeamMembers, getJobInfoByUserId, 
  getLeaveApplicationsByEmployee, 
  getLeaveDetailsById, 
  getRoles, 
  getSocialLinksByUserId, getTeamMemberById,updateJobInfo, updateLeaveStatus, updateSocialLinks, updateTeamMemberById, 
  updateUserPreferences} from "../model/team.model.js";
import { createNotification, notifyAdminLeaveApproval, notifyEmployeeLeaveApproval } from './notificationsController.js';


 
{/*Roles Section */}
// Controller function to handle the role fetch request
export const getRolesController = (req, res) => {
  getRoles()
    .then((roles) => {
      res.status(200).json(roles);  // Send the roles as JSON response
    })
    .catch((error) => {
      console.error("Error fetching roles:", error);
      res.status(500).json({ message: 'Failed to fetch roles' });
    });
};


{/*Team Section */}
  // Controller for fetching all team members
export const getTeamMembers = async (req, res) => {
  try {
    const teamMembers = await getAllTeamMembers();
    if (teamMembers.length === 0) {
      return res.status(404).json({ message: "No team members found" });
    }
    res.status(200).json(teamMembers); // Respond with the list of team members
  } catch (error) {
    console.error("Error fetching team members:", error);
    res.status(500).json({ message: "Error fetching team members details" });
  }
};



// Controller for adding a new employee
export const addEmployee = async (req, res) => {
  try {
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
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !roleId || !teamId || !language) 
      {
      return res.status(400).json({ error: 'Missing required fields' });
      }

    // Check if email already exists
    const emailExists = await checkEmailExists(email);
    if (emailExists) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash the password before passing to the model
    const hashedPassword = await bcrypt.hash(password, 10);

    // Prepare the user data to be passed to the model
    const userData = {
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
      password: hashedPassword,
      roleId,
      teamId,
      language
    };

    // Call the model to create the employee and their job info
    const result = await createEmployee(userData);

    // Check if result is valid and successfully inserted
    if (result && result.userId && result.jobId) {
      // Respond with success
      return res.status(201).json({
        message: 'Employee created successfully',
        data: {
          userId: result.userId,
          jobId: result.jobId,
        },
      });
    } else {
      return res.status(500).json({ error: 'Failed to create employee' });
    }

  } catch (error) {
    console.error('Error adding employee:', error);
    res.status(500).json({ error: 'Failed to add employee' });
  }
};




// Controller for updating a team member
export const updateTeamMember = async (req, res) => {
  const { id } = req.params; // Get ID from params
  const { dateOfHire, salary, salaryTerm } = req.body; // Get other data from the request body

  try {
    // Optional: Validate incoming data
    if (!dateOfHire || !salary || !salaryTerm) {
      return res.status(400).json({ error: "Missing required fields for update" });
    }

    const affectedRows = await updateTeamMemberById(id, { dateOfHire, salary, salaryTerm });
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Team member not found" });
    }
    res.status(200).json({ message: "Team member updated successfully" });
  } catch (error) {
    console.error("Error updating team member:", error);
    res.status(500).json({ error: "Failed to update team member" });
  }
};


// Controller for deleting a team member
export const deleteTeamMember = async (req, res) => {
  const { id } = req.params; // Get ID from URL params

  try {
    const affectedRows = await deleteTeamMemberById(id);
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Team member not found" });
    }
    res.status(200).json({ message: "Team member deleted successfully" });
  } catch (error) {
    console.error("Error deleting team member:", error);
    res.status(500).json({ error: "Failed to delete team member" });
  }
};


// Controller for fetching a specific team member by ID
export const getTeamMemberProfile = async (req, res) => {
  const { id } = req.params; // Get ID from params

  try {
    const teamMember = await getTeamMemberById(id);
    if (!teamMember) {
      return res.status(404).json({ message: "Team member not found" });
    }
    res.status(200).json({ profile: teamMember });
  } catch (error) {
    console.error("Error fetching team member profile:", error);
    res.status(500).json({ message: "Error fetching team member profile" });
  }
};



{/*Time-Cards Section*/}

// Clock In - Create attendance record for user
export const clockIn = async (req, res) => {
  const userId = req.user.id; // Get the userId from the authenticated user (JWT)
  const inTime = new Date(); // Current time when the user clocks in
  const status = 'incomplete'; // Default status when the user clocks in
  const note = req.body.note || null; // Optional note field (if any)

  try {
    const attendanceId = await createAttendance(userId, status, inTime, note); // Call model to create attendance
    res.status(201).json({
      success: true,
      message: 'Clocked in successfully.',
      attendanceId, // Return the created attendance ID
    });
  } catch (error) {
    console.error('Error clocking in:', error);
    res.status(500).json({
      success: false,
      message: 'Error clocking in.',
      error: error.message,
    });
  }
};

// Clock Out - Update attendance record with out time and note
export const clockOut = async (req, res) => {
  const userId = req.user.id; // Get the userId from the authenticated user (JWT)
  const outTime = new Date(); // Current time when the user clocks out
  const note = req.body.note || null; // Optional note field (if any)

  try {
    // First, fetch the user's latest attendance with 'incomplete' status
    const attendance = await getAttendanceByUserId(userId);
    const latestAttendance = attendance.find(a => a.status === 'incomplete');

    if (!latestAttendance) {
      return res.status(400).json({ success: false, message: 'No clock-in record found to clock out.' });
    }

    // Calculate duration
    const duration = Math.abs(new Date(outTime) - new Date(latestAttendance.in_time)) / 1000 / 60 / 60; // Duration in hours

    // Update the attendance with out time, duration and note
    const updatedAttendance = await updateAttendance(latestAttendance.id, {
      out_time: outTime,
      note: note,
      status: 'pending', // Status set to 'pending' for review
      checked_by: userId,
      checked_at: outTime,
      duration: duration, // Store duration for the attendance record
    });

    res.status(200).json({
      success: true,
      message: 'Clocked out successfully.',
      updatedAttendance,
    });
  } catch (error) {
    console.error('Error clocking out:', error);
    res.status(500).json({
      success: false,
      message: 'Error clocking out.',
      error: error.message,
    });
  }
};

// Get Attendance Records for the logged-in user
export const getMyAttendance = async (req, res) => {
  const userId = req.user.id; // Get the userId from the authenticated user (JWT)

  try {
    const attendance = await getAttendanceByUserId(userId); // Get the attendance records for this user
    res.status(200).json({
      success: true,
      data: attendance, // Return the list of attendance records
    });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching attendance records.',
      error: error.message,
    });
  }
};

// Admin - View all users' attendance and perform CRUD operations
export const getAllAttendance = async (req, res) => {
  const adminId = req.user.id; // Get adminId from the authenticated user (JWT)

  try {
    // Admin can view all attendance records
    const attendanceRecords = await getAttendanceByUserId(adminId); // Retrieve all attendance records
    res.status(200).json({
      success: true,
      data: attendanceRecords,
    });
  } catch (error) {
    console.error('Error fetching all attendance records:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching all attendance records.',
      error: error.message,
    });
  }
};

// Admin - Update Attendance (Approve or Reject a Timecard)
export const updateAttendanceStatusByAdmin = async (req, res) => {
  const { attendanceId, status, rejectReason } = req.body;
  const adminId = req.user.id; // Get the adminId from the authenticated user (JWT)

  try {
    const updatedAttendance = await updateAttendanceStatus(attendanceId, status, rejectReason);
    res.status(200).json({
      success: true,
      message: `Attendance record updated to ${status}.`,
      updatedAttendance,
    });
  } catch (error) {
    console.error('Error updating attendance status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating attendance status.',
      error: error.message,
    });
  }
};

// Admin - Soft Delete Attendance (when needed)
export const deleteAttendanceByAdmin = async (req, res) => {
  const { attendanceId } = req.body;
  const adminId = req.user.id; // Get the adminId from the authenticated user (JWT)

  try {
    const deletedAttendance = await deleteAttendance(attendanceId, adminId);
    res.status(200).json({
      success: true,
      message: 'Attendance record deleted successfully.',
      deletedAttendance,
    });
  } catch (error) {
    console.error('Error deleting attendance record:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting attendance record.',
      error: error.message,
    });
  }
};







{/*Leaves-Section*/}    
/*Leaves-Section*/
// Controller for Leave Applications

// 1. Apply for Leave (Create Leave Application)
export const applyForLeave = async (req, res) => {
const { leave_type_id, start_date, end_date, total_days, total_hours, reason } = req.body;
const { id } = req.user;  // Use `id` from the decoded JWT token

// Validate the input
if (!leave_type_id || !start_date || !end_date || !reason) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
}

// Validate start_date and end_date (start_date should be before end_date)
if (new Date(start_date) > new Date(end_date)) {
    return res.status(400).json({ success: false, message: 'Start date cannot be later than end date' });
}

try {
    // Step 1: Create leave application
    const leaveData = {
        leave_type_id,
        start_date,
        end_date,
        total_days,
        total_hours,
        applicant_id: id,  // Use `id` from the JWT token
        reason,
        created_by: id,  // The employee creating the leave application
    };

    const leaveId = await createLeaveApplication(leaveData);
    return res.status(201).json({ success: true, message: 'Leave applied successfully', leaveId });
} catch (err) {
    console.error("Error applying for leave:", err);
    return res.status(500).json({ success: false, message: 'Failed to apply for leave', error: err.message });
}
};

// 2. Approve Leave (Admin Action)
// 2. Approve Leave (Admin Action)
export const approveLeaveApplication = async (req, res) => {
  const { leaveId } = req.params;
  const { id, roleId } = req.user;  // Access roleId (camelCase) from the decoded JWT token

  console.log("✅ User Info in Handler:", req.user);  // Log req.user here
  console.log("🔍 Approve Handler Triggered: RoleID:", roleId, "Expected: 27");

  // Check if the user is an admin
  if (roleId !== 27) {  // Role ID 27 represents an admin
      return res.status(403).json({ success: false, message: 'Only admins can approve leave' });
  }

  const status = 'approved';

  try {
      // Step 1: Update leave status to 'approved'
      const updateResult = await updateLeaveStatus(leaveId, status);

      if (updateResult.affectedRows > 0) {
          // Step 2: Get leave details for notifications
          const leaveDetails = await getLeaveDetailsById(leaveId);

          // Log the leave details to ensure it's being fetched correctly
          console.log("🔍 Leave Details:", leaveDetails);

          // Ensure leaveDetails is not undefined and contains necessary properties
          if (!leaveDetails || !leaveDetails.applicant_id || !leaveDetails.start_date || !leaveDetails.end_date) {
              console.error("Missing required leave details");
              return res.status(400).json({ success: false, message: 'Missing required leave details' });
          }

          // Step 3: Notify the employee about the leave approval
          const employeeNotificationData = {
              user_id: leaveDetails.applicant_id,
              description: `Your leave request from ${leaveDetails.start_date} to ${leaveDetails.end_date} has been approved.`,
              notify_to: leaveDetails.applicant_id,  // Ensure notify_to is set correctly
              event: 'Leave Approval',
              leave_id: leaveDetails.id,
          };

          // Log the notification data to check for correctness
          console.log("🔍 Employee Notification Data:", employeeNotificationData);

          await createNotification(employeeNotificationData);  // Send notification to employee

          // Step 4: Notify the admin who approved the leave
          const adminNotificationData = {
              user_id: id,
              description: `You have approved the leave request for employee ${leaveDetails.applicant_id}.`,
              notify_to: id,  // Set notify_to as admin id
              event: 'Admin Leave Approval',
              leave_id: leaveDetails.id,
          };

          // Log the notification data to check for correctness
          console.log("🔍 Admin Notification Data:", adminNotificationData);

          await createNotification(adminNotificationData);  // Send notification to admin

          return res.status(200).json({ success: true, message: 'Leave approved and notifications sent.' });
      } else {
          return res.status(404).json({ success: false, message: 'Leave application not found' });
      }
  } catch (err) {
      console.error("Error approving leave:", err);
      return res.status(500).json({ success: false, message: 'Failed to approve leave', error: err.message });
  }
};


// 3. Reject Leave (Admin Action)
export const rejectLeaveApplication = async (req, res) => {
const { leaveId } = req.params;
const { id, roleId } = req.user;  // Use `id` and `roleId` from the decoded JWT token

console.log("✅ User Info in Handler:", req.user);  // Log req.user here

const status = 'rejected';

// Check if the user is an admin
if (roleId !== 27) {  // Role ID 27 represents an admin
    return res.status(403).json({ success: false, message: 'Only admins can reject leave' });
}

try {
    // Step 1: Update leave status to 'rejected'
    const updateResult = await updateLeaveStatus(leaveId, status);

    if (updateResult.affectedRows > 0) {
        // Step 2: Get leave details for notifications
        const leaveDetails = await getLeaveDetailsById(leaveId);

        // Step 3: Notify the employee that their leave was rejected
        const message = `Your leave request from ${leaveDetails.start_date} to ${leaveDetails.end_date} has been rejected.`;
        await createNotification({
            user_id: leaveDetails.applicant_id, 
            description: message,
            notify_to: leaveDetails.applicant_id, 
            event: 'Leave Rejection',
            leave_id: leaveDetails.id, 
        });

        // Step 4: Notify the admin who rejected the leave
        await createNotification({
            user_id: id,
            description: `You have rejected the leave request for employee ${leaveDetails.applicant_id}.`,
            notify_to: id,
            event: 'Admin Leave Rejection',
            leave_id: leaveDetails.id,
        });

        return res.status(200).json({ success: true, message: 'Leave rejected and notifications sent.' });
    } else {
        return res.status(404).json({ success: false, message: 'Leave application not found' });
    }
} catch (err) {
    console.error("Error rejecting leave:", err);
    return res.status(500).json({ success: false, message: 'Failed to reject leave', error: err.message });
}
};

// 4. Fetch Leave Applications (Admin or Employee)
export const getLeaveApplications = async (req, res) => {
const { id, roleId } = req.user;  // Use `id` and `roleId` from the decoded JWT token

try {
    let leaves;
    if (roleId === 27) { // Admin role
        leaves = await getAllLeaveApplications(); // Admin can fetch all leaves
    } else if (roleId === 28) { // Staff role
        leaves = await getLeaveApplicationsByEmployee(id); // Staff can fetch their own leaves
    }

    return res.status(200).json({ success: true, data: leaves });

} catch (err) {
    console.error("Error fetching leave applications:", err);
    return res.status(500).json({ success: false, message: 'Failed to fetch leave applications', error: err.message });
}
};







  
{/*Social-Media Controller */}

// Controller to fetch social links by user ID
export const getSocialLinks = async (req, res) => {
  const userId = req.user.id; // Assuming `userId` is populated by authentication middleware

  if (!userId) {
    return res.status(400).json({ success: false, message: 'User ID is required' });
  }

  try {
    const socialLinks = await getSocialLinksByUserId(userId);

    res.status(200).json({
      success: true,
      message: 'Social links fetched successfully',
      data: socialLinks, // Send the social links data
    });
  } catch (error) {
    console.error('Error fetching social links:', error.message);

    if (error.message === `No active social links found for user ID: ${userId}`) {
      return res.status(404).json({ success: false, message: 'No social links found for this user' });
    }

    res.status(500).json({
      success: false,
      message: 'Error fetching social links',
      error: error.message,
    });
  }
};


// Controller to create new social links
export const createSocialLinksController = async (req, res) => {
  // Check if the request body is valid JSON
  if (!req.body || typeof req.body !== 'object') {
    return res.status(400).json({ success: false, message: 'Invalid JSON in request body' });
  }

  const userId = req.user.id; // Get userId from req.user set by authenticate middleware
  const socialLinks = req.body;

  // Check if userId and socialLinks data are present
  if (!userId || !socialLinks || Object.keys(socialLinks).length === 0) {
    return res.status(400).json({ success: false, message: 'User ID and social links data are required' });
  }

  try {
    // Call to function that handles inserting the social links
    const socialLinkId = await createSocialLinks(userId, socialLinks);

    // Ensure the correct socialLinkId is returned (check if insertId is correctly passed)
    console.log('Inserted social link ID:', socialLinkId);

    res.status(201).json({
      success: true,
      message: 'Social links created successfully',
      id: socialLinkId, // Make sure this value is coming from the DB insertId
    });
  } catch (error) {
    console.error('Error creating social links:', error);
    res.status(500).json({ success: false, message: 'Error creating social links', error: error.message });
  }
};


// Controller to update social links
export const updateSocialLinksController = async (req, res) => {
  const userId = req.user.id;  // Get userId from the authenticated user (from the token)
  const socialLinks = req.body;  // Get social links from the request body

  if (!userId || !socialLinks || Object.keys(socialLinks).length === 0) {
    return res.status(400).json({ success: false, message: 'User ID and social links data are required' });
  }

  const fields = [
    'facebook', 'twitter', 'linkedin', 'googleplus', 'digg', 'youtube',
    'pinterest', 'instagram', 'github', 'tumblr', 'vine', 'whatsapp'
  ];

  fields.forEach((field) => {
    if (!socialLinks[field]) {
      socialLinks[field] = null; // Set missing fields to null instead of empty string
    }
  });

  try {
    const updatedRows = await updateSocialLinks(userId, socialLinks);
    if (updatedRows === 0) {
      return res.status(404).json({ success: false, message: 'No social links found to update for this user' });
    }
    res.status(200).json({ success: true, message: 'Social links updated successfully' });
  } catch (error) {
    console.error('Error updating social links:', error);
    res.status(500).json({ success: false, message: 'Error updating social links', error: error.message });
  }
};

// Controller to delete social links
export const deleteSocialLinksController = async (req, res) => {
  const userId = req.user.id;  // Get userId from the authenticated user (from the token)

  if (!userId) {
    return res.status(400).json({ success: false, message: 'User ID is required' });
  }

  try {
    const deletedRows = await deleteSocialLinks(userId);
    if (deletedRows === 0) {
      return res.status(404).json({ success: false, message: 'No social links found to delete for this user' });
    }
    res.status(200).json({ success: true, message: 'Social links deleted successfully' });
  } catch (error) {
    console.error('Error deleting social links:', error);
    res.status(500).json({ success: false, message: 'Error deleting social links', error: error.message });
  }
};




{/*Job Info team Members Section */}
// Controller to create job info
export const createJobInfoController = async (req, res) => {
  const { userId, dateOfHire, salary, salaryTerm } = req.body;

  

  // Validate the input
  if (!userId || !dateOfHire || !salary || !salaryTerm) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  try {
    const jobInfoId = await createJobInfo({ userId, dateOfHire, salary, salaryTerm });
    res.status(201).json({ success: true, message: 'Job info created successfully', jobInfoId });
  } catch (err) {
    console.error('Error creating job info:', err);
    res.status(500).json({ success: false, message: 'Error creating job info', error: err.message });
  }
};


export const getJobInfoController = async (req, res) => {
  const { userId } = req.params;

  // Validate the input
  if (!userId) {
    return res.status(400).json({ success: false, message: 'userId is required' });
  }

  try {
    const jobInfo = await getJobInfoByUserId(userId);
    res.status(200).json({ success: true, data: jobInfo });
  } catch (err) {
    console.error('Error fetching job info:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};



// Controller to update job info
export const updateJobInfoController = async (req, res) => {
  const { userId } = req.params;
  const { dateOfHire, salary, salaryTerm, jobTitle } = req.body;

  // Validate the input
  if (!userId || (!dateOfHire && !salary && !salaryTerm && !jobTitle)) {
    return res.status(400).json({ success: false, message: 'userId and at least one field to update are required' });
  }

  try {
    const updatedRows = await updateJobInfo(userId, {
      date_of_hire: dateOfHire,
      salary,
      salary_term: salaryTerm,
      job_title: jobTitle,
    });

    if (updatedRows === 0) {
      return res.status(404).json({ success: false, message: 'No job info found for this user' });
    }

    res.status(200).json({ success: true, message: 'Job info updated successfully' });
  } catch (err) {
    console.error('Error updating job info:', err);
    res.status(500).json({ success: false, message: 'Error updating job info', error: err.message });
  }
};


// Controller to delete job info by user ID
export const deleteJobInfoController = async (req, res) => {
  const { userId } = req.params;

  // Validate the input
  if (!userId) {
    return res.status(400).json({ success: false, message: 'userId is required' });
  }

  try {
    const deletedRows = await deleteJobInfo(userId);
    if (deletedRows === 0) {
      return res.status(404).json({ success: false, message: 'No job info found for this user' });
    }

    res.status(200).json({ success: true, message: 'Job info deleted successfully' });
  } catch (err) {
    console.error('Error deleting job info:', err);
    res.status(500).json({ success: false, message: 'Error deleting job info', error: err.message });
  }
};

{/*Preferences--Controller*/}
// Fetch user preferences
export const getPreferences = async (req, res) => {
  const userId = req.user.id; // Assuming userId is extracted from the token

  try {
    const result = await fetchUserPreferences(userId);
    if (result.success) {
      res.status(200).json({ success: true, data: result.data });
    } else {
      res.status(400).json({ success: false, message: result.message });
    }
  } catch (err) {
    console.error("Error in getPreferences:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Update user preferences
export const updatePreferences = async (req, res) => {
  const userId = req.user.id; // Assuming userId is extracted from the token
  const preferences = req.body;

  try {
    const result = await updateUserPreferences(userId, preferences);
    if (result.success) {
      res.status(200).json({ success: true, message: result.message });
    } else {
      res.status(400).json({ success: false, message: result.message });
    }
  } catch (err) {
    console.error("Error in updatePreferences:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};