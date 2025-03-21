import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
} from "@mui/material";
import { IoClose } from "react-icons/io5";
import { GrDownload } from "react-icons/gr";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const Importfile = ({ open, onClose, onFileUpload, sampleDownload }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  // ✅ Handle File Selection
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      const fileType = selectedFile.name.split(".").pop().toLowerCase();
      if (fileType === "xlsx") {
        setFile(selectedFile);
        setError("");
        onFileUpload(selectedFile);
      } else {
        setFile(null);
        setError("❌ Please upload an Excel file (.xlsx)");
      }
    }
  };

  // ✅ Remove Selected File
  const removeFile = () => {
    setFile(null);
    setError("");
    document.getElementById("fileInput").value = ""; // Clear file input
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      {/* 🔹 Dialog Title */}
      <DialogTitle sx={{ position: "relative" }}>
        <Typography variant="h6" className="text-gray-500">
          Import Excel File
        </Typography>
        <Button onClick={onClose} sx={{ position: "absolute", right: 16, top: 8 }}>
          <IoClose size={26} className="text-gray-600" />
        </Button>
      </DialogTitle>

      {/* 🔹 Dialog Content */}
      <DialogContent className="border-t border-gray-200 mt-2 h-96">
        {/* ✅ Drag & Drop File Upload Box */}
        <Box
          sx={{
            border: "2px dashed #ccc",
            borderRadius: "8px",
            padding: "40px",
            textAlign: "center",
            backgroundColor: "#f9f9f9",
            cursor: "pointer",
            marginTop: "10px",
          }}
          onClick={() => document.getElementById("fileInput").click()}
        >
          <input id="fileInput" type="file" hidden onChange={handleFileChange} />
          <CloudUploadIcon sx={{ fontSize: 50, color: "#007bff" }} />
          <Typography variant="body1" color="textSecondary">
            Drag and drop an Excel file here
          </Typography>
          <Typography
            variant="body2"
            color="primary"
            sx={{ textDecoration: "underline", cursor: "pointer" }}
          >
            (or click to browse...)
          </Typography>
        </Box>

        {/* ✅ Display Selected File */}
        {file && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "10px",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "6px",
              backgroundColor: "#f9f9f9",
            }}
          >
            <div style={{ flex: 1, marginLeft: "10px" }}>
              <Typography variant="body1">{file.name}</Typography>
              <Typography variant="body2" color="textSecondary">
                {(file.size / 1024).toFixed(1)} KB
              </Typography>
            </div>

            {/* Remove File Button */}
            <Button onClick={removeFile}>
              <IoClose size={22} color="gray" />
            </Button>
          </Box>
        )}

        {/* Show Error if Wrong File Type */}
        {error && (
          <Typography variant="body2" color="error" sx={{ marginTop: 2 }}>
            {error}
          </Typography>
        )}
      </DialogContent>

      {/* 🔹 Dialog Actions */}
      <DialogActions sx={{ padding: "16px" }} className="border-t border-gray-200 mt-2">
        <Button
          className="flex gap-1 hover-effect"
          onClick={sampleDownload}
          sx={{
            border: "1px solid #9ca3af",
            padding: "6px",
            borderRadius: "4px",
            backgroundColor: "#ffffff",
            color: "#9ca3af",
          }}
        >
          <GrDownload size={16} /> Download Sample File
        </Button>
        <Button
          onClick={onClose}
          className="hover-effect"
          sx={{
            border: "1px solid #9ca3af",
            padding: "6px",
            borderRadius: "4px",
            backgroundColor: "#ffffff",
            color: "#9ca3af",
          }}
        >
          <IoClose size={22} /> Close
        </Button>
        <Button
          onClick={() => console.log("File uploaded:", file)}
          disabled={!file || error}
          className="flex text-white gap-1"
          sx={{ backgroundColor: "#38a4f8", color: "white" }}
        >
          Upload File
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Importfile;