import React, { useState, useEffect } from 'react';
import Select from "react-select";

const Gantt = () => {
  // ✅ State for Select Options
  const [milestoneOptions, setMilestoneOptions] = useState([]);
  const [milestonesOptions, setmilestonesOptions] = useState([]);
  const [assignedOptions, setAssignedOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [daysViewOptions, setDaysViewOptions] = useState([]);

  // ✅ State for Selected Values
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [selectedmilestones, setSelectedmilestones] = useState(null);
  const [selectedAssigned, setSelectedAssigned] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedDaysView, setSelectedDaysView] = useState(null);

  return (
      <div className=' p-4  dark:bg-gray-800 min-h-screen flex justify-between'>
        <label className='text-lg font-bold'>Gantt</label>
        <span className="font-serif text-sm mt-2">Group by :</span>
        <Select
          options={milestoneOptions}
          value={selectedMilestone}
          onChange={setSelectedMilestone}
          placeholder="Milestones"
          isSearchable
          className="w-40 "
        />
        <Select
          options={assignedOptions}
          value={selectedAssigned}
          onChange={setSelectedAssigned}
          placeholder="- Assigned to -"
          isSearchable
          className="w-44"
        />
        <Select
          options={milestonesOptions}
          value={selectedmilestones}
          onChange={setSelectedmilestones}
          placeholder="- Milestones -"
          isSearchable
          className="w-40"
        />
        <Select
          options={statusOptions} // ✅ Status dropdown
          value={selectedStatus}
          onChange={setSelectedStatus}
          placeholder="Status"
          isSearchable
          className="w-40"
        />
        <Select
          options={daysViewOptions}
          value={selectedDaysView}
          onChange={setSelectedDaysView}
          placeholder="Days view"
          isSearchable
          className="w-40"
        />
      </div>
  )
}

export default Gantt