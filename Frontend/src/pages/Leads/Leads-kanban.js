import React, { useState, useRef } from 'react';
import PageNavigation from '../../extra/PageNavigation'
import { FiEdit, FiTag, FiPlusCircle, FiPlus, } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { MdOutlineFileUpload } from "react-icons/md";
const Leadskanban = () => {
    const [activeLabel, setActiveLabel] = useState("overview");
    const navigate = useNavigate();
    const [openImport, setOpenImport] = useState(false);

    const handleOpenTab = (label) => {
        setActiveLabel(label);
        switch (label) {
            case "Kanban":
                navigate("/dashboard/Leads/all_kanbab"); // ✅ Corrected
                break;
            default:
                navigate("/dashboard/Leads"); // ✅ Fallback to main leave page
                break;
        }
    };

    return (
        <div>
            <PageNavigation
                title="Tasks"
                labels={[
                    { label: "list", value: "List" },
                    { label: "kanban", value: "Kanban" },
                ]}
                activeLabel={activeLabel}
                handleLabelClick={handleOpenTab} // ✅ Updated function
                buttons={[
                    { label: "Import tasks", icon: MdOutlineFileUpload, onClick: () => setOpenImport(true) },
                    { label: "Add lead", icon: FiPlusCircle, },
                ]}
            />
        </div>
    )
}

export default Leadskanban