import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    Typography,
    TextField,
    FormControlLabel,
    Checkbox,
    RadioGroup,
    Radio,
    Box,
    IconButton,
    Autocomplete,
    Chip,
} from "@mui/material";
import { IoClose } from "react-icons/io5";
import { FiCheckCircle } from "react-icons/fi";
import { CiCamera } from "react-icons/ci";
import api from "../Services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EventModal = ({ showModal, setShowModal, newEvent, setNewEvent, handleSubmit, eventToEdit, resetForm, clients, teamMembers }) => {
    const [showRepeatOptions, setShowRepeatOptions] = useState(false);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [selectedTeamMembers, setSelectedTeamMembers] = useState([]);
    const [localClients, setLocalClients] = useState([]);
    const [localTeamMembers, setLocalTeamMembers] = useState([]);
    const [labels, setLabels] = useState([]);
    const [selectedLabels, setSelectedLabels] = useState([]);

    // Fetch clients and team members on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch clients
                const clientsResponse = await api.get("/clients");
                if (clientsResponse.data.success) {
                    const formattedClients = clientsResponse.data.data.map(client => ({ 
                        label: client.company_name, 
                        value: client.id 
                    }));
                    setLocalClients(formattedClients);
                }

                // Fetch team members
                const teamMembersResponse = await api.get("/team-members/get-members");
                if (teamMembersResponse.data) {
                    const formattedTeamMembers = teamMembersResponse.data.map(member => ({
                        label: `${member.first_name} ${member.last_name}`,
                        value: member.user_id,
                    }));
                    setLocalTeamMembers(formattedTeamMembers);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error(error.response?.data?.message || "Error fetching data");
            }
        };

        fetchData();
    }, []);

    // Add useEffect to fetch labels when modal opens
    useEffect(() => {
        const fetchLabels = async () => {
            try {
                const response = await api.get("/labels", {
                    params: { context: "event" }
                });
                if (response.data.success) {
                    const formattedLabels = response.data.labels.map(label => ({
                        value: label.id,
                        label: label.title,
                        color: label.color,
                        id: label.id
                    }));
                    setLabels(formattedLabels);
                    
                    // If editing an event, set its existing labels
                    if (eventToEdit && eventToEdit.labels) {
                        const existingLabels = eventToEdit.labels.split(',').map(id => 
                            formattedLabels.find(label => label.id === parseInt(id))
                        ).filter(Boolean);
                        setSelectedLabels(existingLabels);
                    }
                }
            } catch (error) {
                console.error("Error fetching labels:", error);
                toast.error("Failed to fetch labels");
            }
        };

        if (showModal) {
            fetchLabels();
        }
    }, [showModal, eventToEdit]);

    // Handle form submission
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        
        try {
            // Validate required fields
            if (!newEvent.title || !newEvent.start_date || !newEvent.description) {
                toast.error("Title, Description, and Start Date are required!");
                return;
            }

            const eventData = {
                title: newEvent.title,
                description: newEvent.description,
                start_date: newEvent.start_date,
                end_date: newEvent.end_date || null,
                start_time: newEvent.start_time || "00:00:00",
                end_time: newEvent.end_time || "00:00:00",
                created_by: getUserIdFromToken(),
                location: newEvent.location || "",
                client_id: newEvent.client_id || null,
                labels: newEvent.labels || "",
                share_with: newEvent.share_with === "specific" ? selectedTeamMembers.map(m => m.value).join(",") : newEvent.share_with,
                color: newEvent.color || "#3788d8",
                type: "event",
                reminder_status: "new",
                recurring: showRepeatOptions ? 1 : 0,
                repeat_every: showRepeatOptions ? newEvent.repeatEvery : 0,
                repeat_type: showRepeatOptions ? newEvent.repeatUnit : null,
                no_of_cycles: showRepeatOptions ? newEvent.cycles : 0,
                files: uploadedFile ? uploadedFile.name : ""
            };

            // Log the data being sent
            console.log("Submitting event data:", eventData);

            // Call the appropriate handler
            await handleSubmit(eventData);
        } catch (error) {
            console.error("Error in form submission:", error);
            toast.error(error.response?.data?.message || "Error saving event");
        }
    };

    // Get user ID from token
    const getUserIdFromToken = () => {
        const token = localStorage.getItem("token");
        if (!token) return null;

        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            return payload.userId;
        } catch (error) {
            console.error("Error parsing token:", error);
            return null;
        }
    };

    // Handle file upload
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith("image/")) {
            setUploadedFile(file);
        } else {
            alert("Only image files are allowed.");
        }
    };

    // Remove uploaded file
    const handleRemoveFile = () => {
        setUploadedFile(null);
    };

    // Handle change in "Share With" radio buttons
    const handleShareWithChange = (e) => {
        const value = e.target.value;
        setNewEvent({ ...newEvent, share_with: value });

        // Reset selected team members if "Specific members and teams" is not selected
        if (value !== "specific") {
            setSelectedTeamMembers([]);
        }
    };

    // Handle selection of team members in the dropdown
    const handleTeamMembersChange = (e, newValue) => {
        setSelectedTeamMembers(newValue);
        setNewEvent({ ...newEvent, share_with_ids: newValue.map(member => member.value) });
    };

    // Add handler for label selection
    const handleLabelChange = (event, newValue) => {
        setSelectedLabels(newValue);
        setNewEvent({
            ...newEvent,
            labels: newValue.map(label => label.id).join(',')
        });
    };

    return (
        <Dialog
            open={showModal}
            onClose={() => {
                setShowModal(false);
                resetForm();
            }}
            fullWidth
            maxWidth="md"
            sx={{
                "& .MuiDialog-paper": {
                    borderRadius: "12px",
                },
            }}
        >
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                style={{ zIndex: 99999 }}
            />
            {/* Dialog Title */}
            <DialogTitle
                sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                className="dark:bg-gray-700 dark:text-white"
            >
                <Typography variant="h6">
                    {eventToEdit ? "Edit Event" : "Add Event"}
                </Typography>
                <IconButton onClick={() => {
                    setShowModal(false);
                    resetForm();
                }}>
                    <IoClose size={24} />
                </IconButton>
            </DialogTitle>

            {/* Dialog Content */}
            <DialogContent dividers className="dark:bg-gray-700 dark:text-white">
                <form onSubmit={handleFormSubmit}>
                    <Grid container spacing={2} alignItems="center">
                        {/* Title */}
                        <Grid item xs={4}>
                            <Typography variant="subtitle2" className="text-gray-500">Title</Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                value={newEvent?.title || ""}
                                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                placeholder="Enter Title"
                                required
                                error={!newEvent?.title}
                                helperText={!newEvent?.title ? "Title is required" : ""}
                            />
                        </Grid>

                        {/* Description */}
                        <Grid item xs={4}>
                            <Typography variant="subtitle2" className="text-gray-500">Description</Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                variant="outlined"
                                size="small"
                                value={newEvent?.description || ""}
                                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                                placeholder="Enter Description"
                                required
                                error={!newEvent?.description}
                                helperText={!newEvent?.description ? "Description is required" : ""}
                            />
                        </Grid>

                        {/* Start Date */}
                        <Grid item xs={4}>
                            <Typography variant="subtitle2" className="text-gray-500">Start Date</Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                fullWidth
                                type="date"
                                variant="outlined"
                                size="small"
                                value={newEvent?.start_date || ""}
                                onChange={(e) => setNewEvent({ ...newEvent, start_date: e.target.value })}
                                required
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <Typography variant="subtitle2" className="text-gray-500">Start Time</Typography>
                        </Grid>
                        <Grid item xs={2}>
                            <TextField
                                fullWidth
                                type="time"
                                variant="outlined"
                                size="small"
                                value={newEvent?.start_time || ""}
                                onChange={(e) => setNewEvent({ ...newEvent, start_time: e.target.value })}
                            />
                        </Grid>

                        {/* End Date & Time */}
                        <Grid item xs={4}>
                            <Typography variant="subtitle2" className="text-gray-500">End Date</Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                fullWidth
                                type="date"
                                variant="outlined"
                                size="small"
                                value={newEvent?.end_date || ""}
                                onChange={(e) => setNewEvent({ ...newEvent, end_date: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <Typography variant="subtitle2" className="text-gray-500">End Time</Typography>
                        </Grid>
                        <Grid item xs={2}>
                            <TextField
                                fullWidth
                                type="time"
                                variant="outlined"
                                size="small"
                                value={newEvent?.end_time || ""}
                                onChange={(e) => setNewEvent({ ...newEvent, end_time: e.target.value })}
                            />
                        </Grid>

                        {/* Location */}
                        <Grid item xs={4}>
                            <Typography variant="subtitle2" className="text-gray-500">Location</Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                value={newEvent?.location || ""}
                                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                                placeholder="Enter Location"
                            />
                        </Grid>

                        {/* Client */}
                        <Grid item xs={4}>
                            <Typography variant="subtitle2" className="text-gray-500">Client</Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <Autocomplete
                                fullWidth
                                options={localClients}
                                getOptionLabel={(option) => option.label}
                                value={localClients.find((client) => client.value === newEvent?.client_id) || null}
                                onChange={(e, newValue) =>
                                    setNewEvent({ ...newEvent, client_id: newValue ? newValue.value : "" })
                                }
                                renderInput={(params) => <TextField {...params} variant="outlined" size="small" />}
                            />
                        </Grid>

                        {/* Share With */}
                        <Grid item xs={4}>
                            <Typography variant="subtitle2" className="text-gray-500">Share With</Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <RadioGroup
                                value={newEvent?.share_with || "only_me"}
                                onChange={handleShareWithChange}
                            >
                                <FormControlLabel
                                    value="only_me"
                                    control={<Radio color="primary" />}
                                    label="Only me"
                                />
                                <FormControlLabel
                                    value="all_team"
                                    control={<Radio color="primary" />}
                                    label="All team members"
                                />
                                <FormControlLabel
                                    value="specific"
                                    control={<Radio color="primary" />}
                                    label="Specific members and teams"
                                />
                            </RadioGroup>

                            {/* Dropdown for selecting specific team members */}
                            {newEvent?.share_with === "specific" && (
                                <Autocomplete
                                    fullWidth
                                    multiple
                                    options={localTeamMembers}
                                    getOptionLabel={(option) => option.label}
                                    value={selectedTeamMembers}
                                    onChange={handleTeamMembersChange}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="outlined"
                                            size="small"
                                            placeholder="Select team members"
                                        />
                                    )}
                                />
                            )}
                        </Grid>

                        {/* Repeat Checkbox */}
                        <Grid item xs={4}>
                            <Typography variant="subtitle2" className="text-gray-500">Repeat</Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={showRepeatOptions}
                                        onChange={() => setShowRepeatOptions(!showRepeatOptions)}
                                    />
                                }
                            />
                        </Grid>

                        {/* Repeat Settings (Visible only when checkbox is checked) */}
                        {showRepeatOptions && (
                            <>
                                {/* Repeat Every */}
                                <Grid item xs={4}>
                                    <Typography variant="subtitle2" className="text-gray-500">Repeat every</Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        variant="outlined"
                                        size="small"
                                        value={newEvent?.repeatEvery || 1}
                                        onChange={(e) => setNewEvent({ ...newEvent, repeatEvery: e.target.value })}
                                        placeholder="Enter number"
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <Autocomplete
                                        fullWidth
                                        options={[
                                            { label: "Day(s)", value: "day" },
                                            { label: "Week(s)", value: "week" },
                                            { label: "Month(s)", value: "month" },
                                            { label: "Year(s)", value: "year" },
                                        ]}
                                        getOptionLabel={(option) => option.label}
                                        value={newEvent?.repeatUnit || { label: "Month(s)", value: "month" }}
                                        onChange={(e, newValue) =>
                                            setNewEvent({ ...newEvent, repeatUnit: newValue ? newValue.value : "month" })
                                        }
                                        renderInput={(params) => <TextField {...params} variant="outlined" size="small" />}
                                    />
                                </Grid>

                                {/* Cycles */}
                                <Grid item xs={4}>
                                    <Typography variant="subtitle2" className="text-gray-500">Cycles</Typography>
                                </Grid>
                                <Grid item xs={8}>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        variant="outlined"
                                        size="small"
                                        value={newEvent?.cycles || ""}
                                        onChange={(e) => setNewEvent({ ...newEvent, cycles: e.target.value })}
                                        placeholder="Enter number of cycles"
                                    />
                                </Grid>
                            </>
                        )}

                        {/* Color Selection */}
                        <Grid item xs={4}>
                            <Typography variant="subtitle2" className="text-gray-500">Color</Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <Box display="flex" gap={1}>
                                {["#4CAF50", "#2196F3", "#FFC107", "#E91E63", "#9C27B0", "#FF5722"].map((color) => (
                                    <Box
                                        key={color}
                                        width={24}
                                        height={24}
                                        borderRadius="50%"
                                        bgcolor={color}
                                        border="2px solid white"
                                        sx={{ cursor: "pointer", boxShadow: "0px 0px 5px rgba(0,0,0,0.2)" }}
                                        onClick={() => setNewEvent({ ...newEvent, color })}
                                    />
                                ))}
                            </Box>
                        </Grid>

                        {/* Add Labels section after the Color Selection */}
                        <Grid item xs={4}>
                            <Typography variant="subtitle2" className="text-gray-500">Labels</Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <Autocomplete
                                multiple
                                options={labels}
                                getOptionLabel={(option) => option.label}
                                value={selectedLabels}
                                onChange={handleLabelChange}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="outlined"
                                        size="small"
                                        placeholder="Select labels"
                                    />
                                )}
                                renderTags={(value, getTagProps) =>
                                    value.map((option, index) => (
                                        <Chip
                                            {...getTagProps({ index })}
                                            key={option.id}
                                            label={option.label}
                                            style={{ backgroundColor: option.color, color: 'white' }}
                                        />
                                    ))
                                }
                                renderOption={(props, option) => (
                                    <li {...props}>
                                        <Box
                                            component="span"
                                            sx={{
                                                display: 'inline-block',
                                                width: 12,
                                                height: 12,
                                                borderRadius: '50%',
                                                backgroundColor: option.color,
                                                mr: 1
                                            }}
                                        />
                                        {option.label}
                                    </li>
                                )}
                            />
                        </Grid>
                    </Grid>

                    {/* Uploaded File Preview */}
                    {uploadedFile && (
                        <Box
                            mt={3}
                            p={2}
                            sx={{
                                border: "1px solid #ddd",
                                borderRadius: "8px",
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                "&:hover .remove-btn": {
                                    display: "block",
                                },
                            }}
                        >
                            {uploadedFile.type.startsWith("image/") ? (
                                <img
                                    src={URL.createObjectURL(uploadedFile)}
                                    alt="Uploaded"
                                    style={{ maxHeight: "100px", borderRadius: "5px" }}
                                />
                            ) : (
                                <Typography variant="body2">{uploadedFile.name}</Typography>
                            )}
                            <IconButton
                                className="remove-btn"
                                onClick={handleRemoveFile}
                                sx={{
                                    display: "none",
                                    position: "absolute",
                                    top: 4,
                                    right: 4,
                                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                                    "&:hover": {
                                        backgroundColor: "rgba(255, 0, 0, 0.8)",
                                        color: "white",
                                    },
                                }}
                            >
                                <IoClose size={18} />
                            </IconButton>
                        </Box>
                    )}
                

            {/* Dialog Actions */}
            <DialogActions className="dark:bg-gray-700 dark:text-white">
                {/* Left Side - File Upload */}
                <Box display="flex" alignItems="center" gap={2}>
                    <Button
                        variant="outlined"
                        startIcon={<CiCamera />}
                        component="label"
                        sx={{ borderRadius: "6px", fontSize: "0.85rem", padding: "6px 14px" }}
                    >
                        Upload File
                        <input type="file" hidden onChange={handleFileUpload} />
                    </Button>

                    {/* File Preview */}
                    {uploadedFile && (
                        <Box display="flex" alignItems="center" border="1px solid #ddd" padding="6px 10px" borderRadius="6px">
                            <Typography variant="body2">{uploadedFile.name}</Typography>
                            <IconButton onClick={handleRemoveFile} sx={{ marginLeft: "8px" }}>
                                <IoClose size={18} />
                            </IconButton>
                        </Box>
                    )}
                </Box>

                {/* Right Side - Action Buttons */}
                <Box display="flex" gap={2}>
                    <Button onClick={() => setShowModal(false)} variant="outlined">
                        <IoClose size={20} /> Close
                    </Button>
                    <Button type="submit" variant="contained" className="gap-1">
                        <FiCheckCircle size={17} /> {eventToEdit ? "Update" : "Save"}
                    </Button>
                </Box>
                </DialogActions>
            </form>
          </DialogContent>
        </Dialog>
    );
};

export default EventModal;