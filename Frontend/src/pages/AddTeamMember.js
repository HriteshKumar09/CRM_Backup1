import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
} from "@mui/material";

const AddMemberForm = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mailingAddress: "",
    phone: "",
    gender: "Male",
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "This field is required.";
    if (!formData.lastName) newErrors.lastName = "This field is required.";
    return newErrors;
  };

  const handleSubmit = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      console.log("Form submitted:", formData);
      onClose();
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Member</DialogTitle>
      <DialogContent>
        <form>
          <TextField
            label="First Name"
            name="firstName"
            fullWidth
            margin="normal"
            value={formData.firstName}
            onChange={handleInputChange}
            error={!!errors.firstName}
            helperText={errors.firstName}
          />
          <TextField
            label="Last Name"
            name="lastName"
            fullWidth
            margin="normal"
            value={formData.lastName}
            onChange={handleInputChange}
            error={!!errors.lastName}
            helperText={errors.lastName}
          />
          <TextField
            label="Mailing Address"
            name="mailingAddress"
            fullWidth
            margin="normal"
            value={formData.mailingAddress}
            onChange={handleInputChange}
          />
          <TextField
            label="Phone"
            name="phone"
            fullWidth
            margin="normal"
            value={formData.phone}
            onChange={handleInputChange}
          />
          <RadioGroup
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            row
          >
            <FormControlLabel value="Male" control={<Radio />} label="Male" />
            <FormControlLabel value="Female" control={<Radio />} label="Female" />
            <FormControlLabel value="Other" control={<Radio />} label="Other" />
          </RadioGroup>
          <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between" }}>
            <Button onClick={onClose}>Close</Button>
            <Button variant="contained" onClick={handleSubmit}>
              Next
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMemberForm;
