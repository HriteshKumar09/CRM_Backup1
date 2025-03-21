import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Grid, } from "@mui/material";

const DateRangePicker = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date()); // Set today's date as default for endDate

  const handleChangeStartDate = (date) => {
    setStartDate(date);
  };

  const handleChangeEndDate = (date) => {
    setEndDate(date);
  };

  return (
   <div >
     <Grid container spacing={0} justifyContent="center" alignItems="center" >
      {/* Start Date Picker */}
      <Grid item>
        <DatePicker
        
          selected={startDate}
          onChange={handleChangeStartDate}
          dateFormat="d MMMM yyyy"
          placeholderText="Start Date"
          className=" w-32 border rounded-l-md p-1 dark:bg-gray-700 dark:text-white"
        />
      </Grid>

      {/* Separator (Dash) */}
      <Grid item>
       -
      </Grid>

      {/* End Date Picker (default to today's date) */}
      <Grid item>
        <DatePicker
          selected={endDate}
          onChange={handleChangeEndDate}
          dateFormat="d MMMM yyyy"
          placeholderText="End Date"
          className=" w-32 border rounded-r-md p-1 dark:bg-gray-700 dark:text-white"
        />
      </Grid>
    </Grid>
   </div>
  );
};

export default DateRangePicker;