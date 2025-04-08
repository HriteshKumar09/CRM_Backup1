import React, { useState, useEffect } from 'react';
import PageNavigation from '../../extra/PageNavigation'
import { FiEdit, FiTag, FiPlusCircle, FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { MdOutlineFileUpload } from "react-icons/md";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import api from "../../Services/api";
import { ToastContainer, toast } from "react-toastify";

const Leadskanban = () => {
    const [activeLabel, setActiveLabel] = useState("kanban");
    const navigate = useNavigate();
    const [openImport, setOpenImport] = useState(false);
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [columns, setColumns] = useState({
        'New': { title: 'New', items: [] },
        'Qualified': { title: 'Qualified', items: [] },
        'Discussion': { title: 'Discussion', items: [] },
        'Negotiation': { title: 'Negotiation', items: [] },
        'Won': { title: 'Won', items: [] },
        'Lost': { title: 'Lost', items: [] }
    });
    
    // Column color mapping
    const columnColors = {
        'New': 'bg-blue-100 dark:bg-blue-900',
        'Qualified': 'bg-purple-100 dark:bg-purple-900',
        'Discussion': 'bg-yellow-100 dark:bg-yellow-900',
        'Negotiation': 'bg-orange-100 dark:bg-orange-900',
        'Won': 'bg-green-100 dark:bg-green-900',
        'Lost': 'bg-red-100 dark:bg-red-900'
    };

    // Badge color mapping
    const badgeColors = {
        'New': 'bg-blue-400 text-white',
        'Qualified': 'bg-purple-400 text-white',
        'Discussion': 'bg-yellow-400 text-white',
        'Negotiation': 'bg-orange-400 text-white',
        'Won': 'bg-green-400 text-white',
        'Lost': 'bg-red-400 text-white'
    };

    // Fetch leads data
    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await api.get("/leads");
            console.log("Kanban API Response:", response.data);
            
            // Check if response has leads array or is an array itself
            const leadsData = response.data.leads || response.data;
            
            if (Array.isArray(leadsData)) {
                // Transform leads data
                const transformedLeads = leadsData.map(lead => ({
                    id: lead.id.toString(),
                    company_name: lead.company_name || '',
                    primary_contact: `${lead.first_name || ''} ${lead.last_name || ''}`.trim() || '-',
                    email: lead.email || '',
                    phone: lead.phone || '',
                    status: lead.status || 'New'
                }));

                // Reset columns with empty items arrays
                const newColumns = {
                    'New': { title: 'New', items: [] },
                    'Qualified': { title: 'Qualified', items: [] },
                    'Discussion': { title: 'Discussion', items: [] },
                    'Negotiation': { title: 'Negotiation', items: [] },
                    'Won': { title: 'Won', items: [] },
                    'Lost': { title: 'Lost', items: [] }
                };

                // Organize leads into columns
                transformedLeads.forEach(lead => {
                    const status = lead.status || 'New';
                    if (newColumns[status]) {
                        newColumns[status].items.push(lead);
                    } else {
                        newColumns['New'].items.push(lead);
                    }
                });

                setColumns(newColumns);
                setLeads(transformedLeads);
            } else {
                console.log("Invalid leads data format:", leadsData);
                toast.warning("No leads data found in the response.");
            }
        } catch (error) {
            console.error("Error fetching leads:", error);
            toast.error("Failed to fetch leads data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const { source, destination, draggableId } = result;
        
        // Don't do anything if dropped in the same place
        if (source.droppableId === destination.droppableId && source.index === destination.index) {
            return;
        }
        
        const sourceColumn = columns[source.droppableId];
        const destColumn = columns[destination.droppableId];
        const sourceItems = [...sourceColumn.items];
        const destItems = [...destColumn.items];
        const [removed] = sourceItems.splice(source.index, 1);
        
        // Update the item's status
        const updatedItem = {
            ...removed,
            status: destination.droppableId
        };
        
        // If dropping in the same column
        if (source.droppableId === destination.droppableId) {
            sourceItems.splice(destination.index, 0, updatedItem);
            
            setColumns({
                ...columns,
                [source.droppableId]: {
                    ...sourceColumn,
                    items: sourceItems
                }
            });
        } else {
            // If dropping in a different column
            destItems.splice(destination.index, 0, updatedItem);
            
            setColumns({
                ...columns,
                [source.droppableId]: {
                    ...sourceColumn,
                    items: sourceItems
                },
                [destination.droppableId]: {
                    ...destColumn,
                    items: destItems
                }
            });
        }

        // Update lead status in backend
        api.put(`/leads/${draggableId}`, { status: destination.droppableId })
            .then(() => {
                toast.success(`Lead moved to ${destination.droppableId}`);
            })
            .catch(error => {
                console.error("Error updating lead status:", error);
                toast.error("Failed to update lead status");
                // Revert UI change on error by refreshing data
                fetchData();
            });
    };

    const handleOpenTab = (label) => {
        setActiveLabel(label.toLowerCase());
        switch (label.toLowerCase()) {
            case "list":
                navigate("/dashboard/Leads");
                break;
            case "kanban":
                navigate("/dashboard/Leads/all-kanbab");
                break;
            default:
                navigate("/dashboard/Leads");
                break;
        }
    };

    // Handle clicking "Add Lead" button - navigate to list view to add a lead
    const handleAddLead = () => {
        navigate('/dashboard/Leads', { state: { openAddLeadForm: true } });
    };

    // Handle clicking on a lead card for more details
    const handleLeadClick = (leadId) => {
        navigate(`/dashboard/Leads?leadId=${leadId}`);
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-800">
            <ToastContainer />
            <PageNavigation
                title="Leads"
                labels={[
                    { label: "list", value: "List" },
                    { label: "kanban", value: "Kanban" },
                ]}
                activeLabel={activeLabel}
                handleLabelClick={handleOpenTab}
                buttons={[
                    { label: "Import leads", icon: MdOutlineFileUpload, onClick: () => setOpenImport(true) },
                    { label: "Add lead", icon: FiPlusCircle, onClick: handleAddLead },
                ]}
            />
            
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <div className="p-4">
                    <DragDropContext onDragEnd={handleDragEnd}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                            {Object.entries(columns).map(([columnId, column]) => (
                                <div 
                                    key={columnId} 
                                    className={`rounded-lg p-4 shadow-sm ${columnColors[columnId] || 'bg-white dark:bg-gray-700'}`}
                                >
                                    <h3 className="font-semibold mb-4 text-gray-800 dark:text-white flex justify-between items-center">
                                        <span>{column.title}</span> 
                                        <span className={`px-2 py-1 rounded-full text-xs ${badgeColors[columnId] || 'bg-gray-200 dark:bg-gray-600'}`}>
                                            {column.items.length}
                                        </span>
                                    </h3>
                                    <Droppable droppableId={columnId}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                                className={`min-h-[200px] rounded-md p-2 ${snapshot.isDraggingOver ? 'bg-gray-100 dark:bg-gray-600' : ''}`}
                                            >
                                                {column.items.map((lead, index) => (
                                                    <Draggable
                                                        key={lead.id}
                                                        draggableId={lead.id}
                                                        index={index}
                                                    >
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                className={`bg-white dark:bg-gray-700 p-3 mb-2 rounded shadow-sm hover:shadow-md transition-shadow 
                                                                ${snapshot.isDragging ? 'opacity-70 shadow-lg' : ''}`}
                                                                onClick={() => handleLeadClick(lead.id)}
                                                            >
                                                                <h4 className="font-medium text-gray-800 dark:text-white text-sm">{lead.company_name}</h4>
                                                                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{lead.primary_contact}</p>
                                                                {lead.email && (
                                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">{lead.email}</p>
                                                                )}
                                                                {lead.phone && (
                                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{lead.phone}</p>
                                                                )}
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                                
                                                {column.items.length === 0 && (
                                                    <div className="flex justify-center items-center h-20 text-gray-400 dark:text-gray-500 text-sm italic">
                                                        No leads in this stage
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </Droppable>
                                </div>
                            ))}
                        </div>
                    </DragDropContext>
                </div>
            )}
        </div>
    );
};

export default Leadskanban;