import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  RadioGroup,
  Radio,
  FormControlLabel,
  Box,
  Typography,
  Autocomplete,
  Grid,
} from "@mui/material";
import { IoClose } from "react-icons/io5";
import { CiCamera } from "react-icons/ci";

const LeaveDialog = ({ open, onClose, onApplyLeave, options = [], selectedLeaveType, type, extraButtons = [], isAssigning = false, teamMembers = [] }) => {
  const [leaveType, setLeaveType] = useState(selectedLeaveType ? selectedLeaveType.value : "");
  const [durationType, setDurationType] = useState("single");
  const [date, setDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [hours, setHours] = useState("");
  const [reason, setReason] = useState("");
  const [file, setFile] = useState(null);
  const [selectedTeamMember, setSelectedTeamMember] = useState(null); // ✅ Added missing state

  useEffect(() => {
    setLeaveType(selectedLeaveType ? selectedLeaveType.value : "");
  }, [selectedLeaveType]);

  useEffect(() => {
    if (isAssigning) {
      setSelectedTeamMember(null); // ✅ Reset team member when switching modes
    }
  }, [isAssigning]); // ✅ Fixed missing dependency

  const handleApplyLeave = () => {
    const leaveData = {
      leaveType,
      durationType,
      date,
      startDate,
      endDate,
      hours,
      reason,
      file,
      assignedTo: isAssigning ? selectedTeamMember : null, // ✅ Include team member when assigning
    };
    onApplyLeave(leaveData);
    onClose();
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFile(file);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: "bold" }}>
        <Typography variant="h6">{type}</Typography>
        <Button onClick={onClose} sx={{ minWidth: "auto", padding: 0 }}>
          <IoClose size={24} />
        </Button>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={2}>
          {/* Show Team Member Selection ONLY when Assigning Leave */}
          {isAssigning && (
            <>
              <Grid item xs={3}>
                <Typography sx={{ fontWeight: "bold", mt: 2 }}>Assign To</Typography>
              </Grid>
              <Grid item xs={9}>
                <Autocomplete
                  fullWidth
                  options={teamMembers}
                  getOptionLabel={(option) => option.label}
                  value={teamMembers.find((tm) => tm.label === selectedTeamMember) || null}
                  onChange={(e, newValue) => setSelectedTeamMember(newValue ? newValue.label : null)}
                  renderInput={(params) => <TextField {...params} variant="outlined" placeholder="Select Team Member" />}
                />
              </Grid>
            </>
          )}

          {/* Leave Type Selection */}
          <Grid item xs={3}>
            <Typography sx={{ fontWeight: "bold", mt: 2 }}>Leave type</Typography>
          </Grid>
          <Grid item xs={9}>
            <Autocomplete
              fullWidth
              options={options || []}
              getOptionLabel={(option) => option.label || ""}
              value={options.find((option) => option.value === leaveType) || null}
              onChange={(e, newValue) => setLeaveType(newValue ? newValue.value : "")}
              renderInput={(params) => <TextField {...params} variant="outlined" placeholder="Select Leave Type" />}
            />
          </Grid>

          {/* Duration Selection */}
          <Grid item xs={3}>
            <Typography sx={{ fontWeight: "bold", mt: 2 }}>Duration</Typography>
          </Grid>
          <Grid item xs={9}>
            <RadioGroup row value={durationType} onChange={(e) => setDurationType(e.target.value)}>
              <FormControlLabel value="single" control={<Radio />} label="Single day" />
              <FormControlLabel value="multiple" control={<Radio />} label="Multiple days" />
              <FormControlLabel value="hours" control={<Radio />} label="Hours" />
            </RadioGroup>
          </Grid>

          {/* Single Day Selection */}
          {durationType === "single" && (
            <>
              <Grid item xs={3}>
                <Typography sx={{ fontWeight: "bold", mt: 2 }}>Date</Typography>
              </Grid>
              <Grid item xs={9}>
                <TextField type="date" value={date} onChange={(e) => setDate(e.target.value)} fullWidth />
              </Grid>
            </>
          )}

          {/* Multiple Days Selection */}
          {durationType === "multiple" && (
            <>
              <Grid item xs={3}>
                <Typography sx={{ fontWeight: "bold", mt: 2 }}>Start Date</Typography>
              </Grid>
              <Grid item xs={9}>
                <TextField type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} fullWidth />
              </Grid>
              <Grid item xs={3}>
                <Typography sx={{ fontWeight: "bold", mt: 2 }}>End Date</Typography>
              </Grid>
              <Grid item xs={9}>
                <TextField type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} fullWidth />
              </Grid>
            </>
          )}

          {/* Hours Selection */}
          {durationType === "hours" && (
            <>
              <Grid item xs={3}>
                <Typography sx={{ fontWeight: "bold", mt: 2 }}>Hours</Typography>
              </Grid>
              <Grid item xs={9}>
                <TextField type="number" value={hours} onChange={(e) => setHours(e.target.value)} fullWidth />
              </Grid>
            </>
          )}

          {/* Reason Textarea */}
          <Grid item xs={3}>
            <Typography sx={{ fontWeight: "bold", mt: 2 }}>Reason</Typography>
          </Grid>
          <Grid item xs={9}>
            <TextField value={reason} onChange={(e) => setReason(e.target.value)} fullWidth multiline rows={4} />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ padding: 2, justifyContent: "space-between" }}>
        {/* Upload File Button */}
        <Button variant="outlined" startIcon={<CiCamera />} component="label">
          Upload File
          <input type="file" hidden onChange={handleFileUpload} />
        </Button>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button onClick={onClose} variant="outlined" color="secondary">
            <IoClose size={18} className="mr-1" /> Close
          </Button>
          {extraButtons?.map((btn, index) => (
            <Button key={index} onClick={btn.onClick} variant="contained" sx={{ backgroundColor: btn.color || "#38a4f8", color: "white" }}>
              {btn.icon && <btn.icon size={18} />} {btn.label}
            </Button>
          ))}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default LeaveDialog;
