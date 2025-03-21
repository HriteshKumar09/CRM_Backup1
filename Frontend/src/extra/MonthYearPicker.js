import React, { useState } from "react";
import { Popover, Button, Typography, Grid } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const MonthYearPicker = ({ onDateChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMonthSelect = (monthIndex) => {
    setSelectedMonth(monthIndex);
    onDateChange({ month: monthIndex, year: selectedYear });
    handleClose();
  };

  const handleYearChange = (direction) => {
    setSelectedYear((prevYear) => prevYear + direction);
  };

  const handlePreviousMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11); // December
      handleYearChange(-1); // Go to the previous year
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
    onDateChange({ month: selectedMonth, year: selectedYear });
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0); // January
      handleYearChange(1); // Go to the next year
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
    onDateChange({ month: selectedMonth, year: selectedYear });
  };

  return (
    <>
      {/* Month/Year Display with Next and Previous Buttons */}
     <div className=" border rounded-md">
     <Grid container spacing={1} alignItems="center">
        {/* Previous Month Button */}
        <Grid item>
          <Button onClick={handlePreviousMonth} size="small">
            <ArrowBackIosNewIcon fontSize="small" />
          </Button>
        </Grid>

        {/* Current Month and Year Display */}
        <Grid item>
          <Button variant="outlined" onClick={handleClick} sx={{ textTransform: "none", fontSize: "16px", width: "200px", textAlign: "center" }}>
            {months[selectedMonth]} {selectedYear}
          </Button>
        </Grid>

        {/* Next Month Button */}
        <Grid item>
          <Button onClick={handleNextMonth} size="small">
            <ArrowForwardIosIcon fontSize="small" />
          </Button>
        </Grid>
      </Grid>
     </div>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Grid container sx={{ padding: 2, width: 250, textAlign: "center" }}>

          {/* Year Navigation */}
          <Grid item xs={4}>
            <Button onClick={() => handleYearChange(-1)} size="small">
              <ArrowBackIosNewIcon fontSize="small" />
            </Button>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h6">{selectedYear}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Button onClick={() => handleYearChange(1)} size="small">
              <ArrowForwardIosIcon fontSize="small" />
            </Button>
          </Grid>

          {/* Month Navigation */}
          <Grid item xs={12}>
            <Grid container spacing={1} justifyContent="center" className="dark:bg-gray-700 dark:text-white">
              <Grid item>
                <Button onClick={handlePreviousMonth} size="small">
                  <ArrowBackIosNewIcon fontSize="small" />
                </Button>
              </Grid>
              <Grid item>
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  {months[selectedMonth]}
                </Typography>
              </Grid>
              <Grid item>
                <Button onClick={handleNextMonth} size="small">
                  <ArrowForwardIosIcon fontSize="small" />
                </Button>
              </Grid>
            </Grid>
          </Grid>

          {/* Month Selection Grid */}
          {months.map((month, index) => (
            <Grid
              item
              xs={4}
              key={index}
              onClick={() => handleMonthSelect(index)}
              className="dark:bg-gray-700 dark:text-white"
              sx={{
                padding: 1,
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: selectedMonth === index ? "bold" : "normal",
                backgroundColor: selectedMonth === index ? "#ddd" : "transparent",
                borderRadius: "8px",
                "&:hover": { backgroundColor: "#eee" },
              }}
            >
              {month}
            </Grid>
          ))}
        </Grid>
      </Popover>
    </>
  );
};

export default MonthYearPicker;
