// import React from "react";
// import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";
// import { IoClose } from "react-icons/io5";

// const EventDetailsModal = ({ event, showModal, setShowModal, onEdit, onDelete }) => {
//   if (!event) return null;

//   return (
//     <Dialog
//       open={showModal}
//       onClose={() => setShowModal(false)}
//       fullWidth
//       maxWidth="sm"
//       sx={{
//         "& .MuiDialog-paper": {
//           borderRadius: "12px",
//         },
//       }}
//     >
//       {/* Dialog Title */}
//       <DialogTitle
//         sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
//         className="dark:bg-gray-700 dark:text-white"
//       >
//         <Typography variant="h6">{event.title}</Typography>
//         <IconButton onClick={() => setShowModal(false)}>
//           <IoClose size={24} />
//         </IconButton>
//       </DialogTitle>

//       {/* Dialog Content */}
//       <DialogContent dividers className="dark:bg-gray-700 dark:text-white">
//         <Typography variant="body1" className="mb-4">
//           <strong>Description:</strong> {event.extendedProps.description}
//         </Typography>
//         <Typography variant="body1" className="mb-4">
//           <strong>Location:</strong> {event.extendedProps.location}
//         </Typography>
//         <Typography variant="body1" className="mb-4">
//           <strong>Start:</strong> {event.start.toLocaleString()}
//         </Typography>
//         <Typography variant="body1" className="mb-4">
//           <strong>End:</strong> {event.end ? event.end.toLocaleString() : "N/A"}
//         </Typography>
//         <Typography variant="body1" className="mb-4">
//           <strong>Shared With:</strong> {event.extendedProps.share_with}
//         </Typography>
//       </DialogContent>

//       {/* Dialog Actions */}
//       <DialogActions className="dark:bg-gray-700 dark:text-white">
//         <Button onClick={() => onEdit(event)} variant="contained" color="primary">
//           Edit
//         </Button>
//         <Button onClick={() => onDelete(event)} variant="contained" color="error">
//           Delete
//         </Button>
//         <Button onClick={() => setShowModal(false)} variant="outlined">
//           Close
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default EventDetailsModal;