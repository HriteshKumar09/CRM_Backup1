import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const LeftMenuSettings = () => {
  const [menuItems, setMenuItems] = useState([
    { id: 'dashboard', name: 'Dashboard', visible: true, order: 1 },
    { id: 'projects', name: 'Projects', visible: true, order: 2 },
    { id: 'tasks', name: 'Tasks', visible: true, order: 3 },
    { id: 'team', name: 'Team', visible: true, order: 4 },
    { id: 'clients', name: 'Clients', visible: true, order: 5 },
    { id: 'calendar', name: 'Calendar', visible: true, order: 6 },
    { id: 'messages', name: 'Messages', visible: true, order: 7 },
    { id: 'reports', name: 'Reports', visible: false, order: 8 },
    { id: 'settings', name: 'Settings', visible: true, order: 9 }
  ]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(menuItems);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order numbers
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index + 1
    }));

    setMenuItems(updatedItems);
  };

  const toggleVisibility = (itemId) => {
    setMenuItems(menuItems.map(item =>
      item.id === itemId ? { ...item, visible: !item.visible } : item
    ));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">Left Menu Settings</h2>
        
        <div className="mb-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Drag and drop menu items to reorder them. Toggle visibility using the switch.
          </p>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="menu-items">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-2"
              >
                {menuItems
                  .sort((a, b) => a.order - b.order)
                  .map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                        >
                          <div className="flex items-center">
                            <span className="text-gray-500 dark:text-gray-400 mr-4">
                              {item.order}
                            </span>
                            <span className="text-gray-900 dark:text-white">
                              {item.name}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <button
                              onClick={() => toggleVisibility(item.id)}
                              className={`
                                relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                                transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                                ${item.visible ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'}
                              `}
                            >
                              <span
                                className={`
                                  pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
                                  transition duration-200 ease-in-out
                                  ${item.visible ? 'translate-x-5' : 'translate-x-0'}
                                `}
                              />
                            </button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeftMenuSettings; 