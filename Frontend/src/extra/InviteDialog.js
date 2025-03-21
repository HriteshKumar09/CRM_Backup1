import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Typography,
  Autocomplete,
} from "@mui/material";
import { IoClose } from "react-icons/io5";
import { AiOutlinePlus } from "react-icons/ai";
import { MdOutlineMailOutline } from "react-icons/md";

const roles = [
  { label: "Team Member", value: "team_member" },
  { label: "Admin", value: "admin" },
];

const InviteDialog = ({ open, handleClose }) => {
  const [emails, setEmails] = useState([""]); // Stores multiple emails
  const [role, setRole] = useState(roles[0]); // Default role

  // ✅ Handle Email Input Change
  const handleEmailChange = (index, value) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  // ✅ Add More Email Fields
  const addMoreEmails = () => {
    setEmails([...emails, ""]);
  };

  // ✅ Remove Email Field
  const removeEmail = (index) => {
    const newEmails = emails.filter((_, i) => i !== index);
    setEmails(newEmails);
  };

  // ✅ Send Invitation
  const handleSend = () => {
    console.log("Sending Invitations:", { emails, role });
    alert("Invitation sent successfully!");
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      {/* 🔹 Dialog Title */}
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} className="dark:bg-gray-700 dark:text-white">
        <Typography variant="h6">Send Invitation</Typography>
        <IconButton onClick={handleClose}>
          <IoClose size={22} />
        </IconButton>
      </DialogTitle>

      {/* 🔹 Dialog Content */}
      <DialogContent dividers sx={{ padding: "20px" }} className="dark:bg-gray-700 dark:text-white">
        <Typography variant="body2" sx={{ mb: 2 }}>
          Invite someone to join as a team member.
        </Typography>

        {/* 🔹 Email Fields */}
        {emails.map((email, index) => (
          <div key={index} style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Email"
              value={email}
              onChange={(e) => handleEmailChange(index, e.target.value)}
              InputProps={{
                startAdornment: <MdOutlineMailOutline size={18} style={{ marginRight: "10px" }} />,
              }}
            />
            {index > 0 && (
              <IconButton onClick={() => removeEmail(index)} sx={{ marginLeft: "8px" }}>
                <IoClose size={18} color="gray" />
              </IconButton>
            )}
          </div>
        ))}

        {/* 🔹 Add More Emails */}
        <Button
          startIcon={<AiOutlinePlus />}
          onClick={addMoreEmails}
          sx={{ color: "blue", fontSize: "14px", textTransform: "none" }}
        >
          Add more
        </Button>

        {/* 🔹 Role Selection (Searchable Dropdown) */}
        <Typography variant="body2" sx={{ mt: 3, mb: 1 }}>
          Role
        </Typography>
        <Autocomplete
          fullWidth
          options={roles}
          getOptionLabel={(option) => option.label}
          value={role}
          onChange={(event, newValue) => setRole(newValue)}
          renderInput={(params) => (
            <TextField {...params} variant="outlined" placeholder="Select Role" />
          )}
        />
      </DialogContent>

      {/* 🔹 Dialog Actions */}
      <DialogActions sx={{ padding: "16px" }} className="dark:bg-gray-700 dark:text-white">
        <Button onClick={handleClose} variant="outlined">
          Close
        </Button>
        <Button onClick={handleSend} variant="contained" sx={{ backgroundColor: "blue", color: "white" }}>
          <MdOutlineMailOutline size={18} style={{ marginRight: "5px" }} />
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InviteDialog;