import React from "react";
import { Button, Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const FileUpload = ({ handleFileUpload, fileName }) => {
  return (
    <div style={{ marginTop: "10px" }}>
      {/* Upload Button */}
      <Button
        variant="outlined"
        component="label"
        fullWidth
        startIcon={<CloudUploadIcon />}
        sx={{ textTransform: "none" }}
      >
        Upload File
        <input type="file" hidden onChange={handleFileUpload} />
      </Button>

      {/* Display selected file name */}
      {fileName && (
        <Typography variant="body2" sx={{ marginTop: 1, color: "gray" }}>
          Selected File: {fileName}
        </Typography>
      )}
    </div>
  );
};

export default FileUpload;