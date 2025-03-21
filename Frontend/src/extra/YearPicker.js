import React, { useState } from "react";
import { Popover, Button, Typography, Grid } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const YearPicker = ({ onYearChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [startYear, setStartYear] = useState(Math.floor(selectedYear / 10) * 10); // Start of the decade

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleYearSelect = (year) => {
    setSelectedYear(year);
    onYearChange(year);
    handleClose();
  };

  const handleDecadeChange = (direction) => {
    setStartYear((prev) => prev + direction * 10);
  };

  const handlePreviousYear = () => {
    setSelectedYear((prev) => {
      const newYear = prev - 1;
      onYearChange(newYear);
      return newYear;
    });
  };

  const handleNextYear = () => {
    setSelectedYear((prev) => {
      const newYear = prev + 1;
      onYearChange(newYear);
      return newYear;
    });
  };

  return (
    <>
      {/* Year Display with Next and Previous Buttons */}
     <div className=" border rounded-md">
     <Grid container spacing={1} alignItems="center">
        {/* Previous Year Button */}
        <Grid item>
          <Button onClick={handlePreviousYear} >
            <ArrowBackIosNewIcon  />
          </Button>
        </Grid>

        {/* Current Year Display */}
        <Grid item>
          <Button variant="outlined" onClick={handleClick} sx={{ textTransform: "none", fontSize: "16px" }}>
            {selectedYear}
          </Button>
        </Grid>

        {/* Next Year Button */}
        <Grid item>
          <Button onClick={handleNextYear} >
            <ArrowForwardIosIcon  />
          </Button>
        </Grid>
      </Grid>
     </div>

      {/* Popover for Year Selection */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Grid container sx={{ padding: 2, width: 250, textAlign: "center" }}>
          {/* Decade Navigation */}
          <Grid item xs={4}>
            <Button onClick={() => handleDecadeChange(-1)} size="small">
              <ArrowBackIosNewIcon fontSize="small" />
            </Button>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="body1" className="flex font-medium">
              {startYear} - {startYear + 9}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Button onClick={() => handleDecadeChange(1)} size="small">
              <ArrowForwardIosIcon fontSize="small" />
            </Button>
          </Grid>

          {/* Year Selection Grid */}
          {Array.from({ length: 12 }, (_, index) => startYear - 1 + index).map((year) => (
            <Grid
              item
              xs={4}
              key={year}
              onClick={() => handleYearSelect(year)}
              sx={{
                padding: 1,
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: selectedYear === year ? "bold" : "normal",
                backgroundColor: selectedYear === year ? "#ddd" : "transparent",
                borderRadius: "8px",
                color: year < startYear || year > startYear + 9 ? "#bbb" : "black",
                "&:hover": { backgroundColor: "#eee" },
              }}
            >
              {year}
            </Grid>
          ))}
        </Grid>
      </Popover>
    </>
  );
};

export default YearPicker;
