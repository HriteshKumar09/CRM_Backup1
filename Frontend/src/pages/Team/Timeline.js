import React, { useState } from "react";
import { Avatar, TextField, Button, Box, IconButton, LinearProgress } from "@mui/material";
import { IoSend } from "react-icons/io5";
import { CiCamera } from "react-icons/ci";
import { SlClose } from "react-icons/sl";


function Timeline() {
  const [postText, setPostText] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Handle File Upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      setUploadProgress(100); // Simulate full upload
    }
  };

  // Remove Uploaded File
  const handleRemoveFile = () => {
    setUploadedFile(null);
    setUploadProgress(0);
  };
  return (
    <Box sx={{ display: "flex", gap: 2,   }}>
    {/* Profile Avatar */}
    <Avatar alt="User" sx={{ width: 48, height: 48, bgcolor: "#ddd" }} />

    {/* Post Input Container */}
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1, flex: 1, bgcolor: "white", borderRadius: 2,width: "100%", p: 2, }}>
      {/* Text Input */}
      <TextField
        variant="outlined"
        placeholder="Share an idea or documents..."
        multiline
        rows={2}
        fullWidth
        value={postText}
        onChange={(e) => setPostText(e.target.value)}
        sx={{
          "& .MuiOutlinedInput-root": { borderRadius: 2 },
          "& textarea": { fontSize: "14px" },
        }}
      />

      {/* File Preview (Only Show if File is Uploaded) */}
      {uploadedFile && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            position: "relative",
            p: 1,
            border: "1px solid #ddd",
            borderRadius: 2,
            width: "100%",
            maxWidth: 400,
            minHeight: 80,
            bgcolor: "#f8f9fa",
            overflow: "hidden",
          }}
        >
          {/* Image Preview */}
          <img
            src={uploadedFile.type.startsWith("image/") ? URL.createObjectURL(uploadedFile) : "https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg"}
            alt="Uploaded File"
            style={{
              width: 60,
              height: 60,
              borderRadius: "4px",
              objectFit: "cover",
              border: "1px solid #ccc",
            }}
          />

          {/* Upload Progress Bar */}
          <LinearProgress variant="determinate" value={uploadProgress} sx={{ width: "100%", ml: 2 }} />

          {/* Remove File Button */}
          <IconButton
            size="small"
            onClick={handleRemoveFile}
            sx={{ position: "absolute", top: 4, right: 4, bgcolor: "rgba(255,255,255,0.8)" }}
          >
            <SlClose />
          </IconButton>
        </Box>
      )}

      {/* Bottom Section (File Upload & Post Button) */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center"  }}>
        <Button variant="outlined" component="label" startIcon={<CiCamera />} sx={{ textTransform: "none" }}>
          Upload File
          <input type="file" hidden onChange={handleFileUpload} />
        </Button>

        <Button variant="contained" color="primary" endIcon={<IoSend />} disabled={!postText && !uploadedFile}>
          Post
        </Button>
      </Box>
    </Box>
  </Box>
  );
}

export default Timeline;