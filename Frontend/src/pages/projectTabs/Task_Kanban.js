import { useState } from "react";
import PageHeader from '../../extra/PageHeader'
import DropdownButton from "../../extra/DropdownButton ";
import ExportSearchControls from "../../extra/ExportSearchControls";
import { LuColumns2 } from "react-icons/lu";
import { FiPlusCircle } from "react-icons/fi";


const Task_Kanban = () => {
    const [searchQuery, setSearchQuery] = useState("");

    const [visibleColumns, setVisibleColumns] = useState({});
  
    const columns = [];
  
    const toggleColumn = (key) => {
      setVisibleColumns((prev) => ({
        ...prev,
        [key]: !prev[key],
      }));
    };
  return (
    <div className="p-4  dark:bg-gray-800 min-h-screen">
      <PageHeader
        title="Tasks Kanban"
        buttons={[
          { label: "Add multiple tasks",icon: FiPlusCircle, },
          { label: "Add task",icon: FiPlusCircle, },
        ]}
      />
      <div className="border-t bg-white border-gray-200 w-full flex justify-between p-3 rounded-t-md dark:bg-gray-700 dark:text-white">
        <div className="flex items-center space-x-4">
          {/* Dropdown Button for Column Selection */}
          <DropdownButton
            icon={LuColumns2}
            options={columns}
            visibleItems={visibleColumns}
            toggleItem={toggleColumn}
          />
        </div>
        <div className="flex items-center gap-2">
          <ExportSearchControls
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            fileName="TasksKanban"
          />
        </div>
      </div>
    </div>
  )
}

export default Task_Kanban