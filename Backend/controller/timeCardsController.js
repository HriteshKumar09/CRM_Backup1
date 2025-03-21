// import { approveTimecard,
//    createTimecard, 
//    deleteTimecard,
//     getAllTimecards,
//     getTimecardById, 
//     rejectTimecard, 
//     updateOutTime } from "../model/timeCardsModel.js";

// // 🟢 Create a new timecard (User clocks in)
// export const create = async (req, res) => {
//   const { user_id, in_time } = req.body;

//   // Validate input
//   if (!user_id || !in_time) {
//     return res.status(400).json({ message: 'user_id and in_time are required' });
//   }

//   try {
//     const result = await createTimecard(user_id, in_time);
//     res.status(201).json({ message: 'Timecard created successfully', id: result.insertId });
//   } catch (err) {
//     res.status(500).json({ message: 'Error creating timecard', error: err.message });
//   }
// };

// // 🟢 Get all timecards (excluding deleted ones)
// export const getAll = async (req, res) => {
//   try {
//     const results = await getAllTimecards();
//     res.status(200).json({ data: results });
//   } catch (err) {
//     res.status(500).json({ message: 'Error fetching timecards', error: err.message });
//   }
// };

// // 🟢 Get a single timecard by ID
// export const getById = async (req, res) => {
//   const { id } = req.params;

//   if (!id) {
//     return res.status(400).json({ message: 'Timecard ID is required' });
//   }

//   try {
//     const result = await getTimecardById(id);
//     if (!result) {
//       return res.status(404).json({ message: 'Timecard not found' });
//     }
//     res.status(200).json({ data: result });
//   } catch (err) {
//     res.status(500).json({ message: 'Error fetching timecard', error: err.message });
//   }
// };

// // 🟢 Update out time (User clocks out)
// export const updateOut = async (req, res) => {
//   const { id, out_time } = req.body;

//   if (!id || !out_time) {
//     return res.status(400).json({ message: 'Timecard ID and out_time are required' });
//   }

//   try {
//     const result = await updateOutTime(id, out_time);
//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: 'Timecard not found or already deleted' });
//     }
//     res.status(200).json({ message: 'Out time updated successfully' });
//   } catch (err) {
//     res.status(500).json({ message: 'Error updating out time', error: err.message });
//   }
// };

// // 🟢 Approve timecard (Admin)
// export const approve = async (req, res) => {
//   const { id, checked_by } = req.body;

//   if (!id || !checked_by) {
//     return res.status(400).json({ message: 'Timecard ID and checked_by (Admin ID) are required' });
//   }

//   try {
//     const result = await approveTimecard(id, checked_by);
//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: 'Timecard not found or already deleted' });
//     }
//     res.status(200).json({ message: 'Timecard approved successfully' });
//   } catch (err) {
//     res.status(500).json({ message: 'Error approving timecard', error: err.message });
//   }
// };

// // 🟢 Reject timecard (Admin with reason)
// export const reject = async (req, res) => {
//   const { id, checked_by, reject_reason } = req.body;

//   if (!id || !checked_by || !reject_reason) {
//     return res.status(400).json({ message: 'Timecard ID, checked_by, and reject_reason are required' });
//   }

//   try {
//     const result = await rejectTimecard(id, checked_by, reject_reason);
//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: 'Timecard not found or already deleted' });
//     }
//     res.status(200).json({ message: 'Timecard rejected successfully' });
//   } catch (err) {
//     res.status(500).json({ message: 'Error rejecting timecard', error: err.message });
//   }
// };

// // 🟢 Soft delete timecard (Admin)
// export const remove = async (req, res) => {
//   const { id, checked_by } = req.body;

//   if (!id || !checked_by) {
//     return res.status(400).json({ message: 'Timecard ID and checked_by (Admin ID) are required' });
//   }

//   try {
//     const result = await deleteTimecard(id, checked_by);
//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: 'Timecard not found or already deleted' });
//     }
//     res.status(200).json({ message: 'Timecard deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ message: 'Error deleting timecard', error: err.message });
//   }
// };
