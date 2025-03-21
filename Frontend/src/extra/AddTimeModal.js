import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';

const AddTimeModal = ({ onClose, onSave }) => {
    const [teamMember, setTeamMember] = useState("-");
    const [inDate, setInDate] = useState("");
    const [inTime, setInTime] = useState("");
    const [outDate, setOutDate] = useState("");
    const [outTime, setOutTime] = useState("");
    const [note, setNote] = useState("");

    const handleSave = () => {
        const timeData = { teamMember, inDate, inTime, outDate, outTime, note };
        onSave(timeData);
        onSave(note); 
    };
    

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg dark:bg-gray-700 dark:text-white">
               <div className=" flex justify-between">
               <h2 className="text-2xl  mb-4 text-gray-500">Add time manually</h2>
               <button onClick={onClose} className=" mb-5"> <IoClose size={24} /></button>
               </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-500">Team member</label>
                        <select
                            className="w-full border p-2 rounded"
                            value={teamMember}
                            onChange={(e) => setTeamMember(e.target.value)}
                        >
                            <option value="-">-</option>
                            <option value="John Doe">John Doe</option>
                            <option value="Jane Smith">Jane Smith</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-500">In Date</label>
                            <input
                                type="date"
                                className="w-full border p-2 rounded"
                                value={inDate}
                                onChange={(e) => setInDate(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-500">In Time</label>
                            <input
                                type="time"
                                className="w-full border p-2 rounded"
                                value={inTime}
                                onChange={(e) => setInTime(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-500">Out Date</label>
                            <input
                                type="date"
                                className="w-full border p-2 rounded"
                                value={outDate}
                                onChange={(e) => setOutDate(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-500">Out Time</label>
                            <input
                                type="time"
                                className="w-full border p-2 rounded"
                                value={outTime}
                                onChange={(e) => setOutTime(e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-500">Note</label>
                        <textarea
                            className="w-full border p-2 rounded"
                            rows="3"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Enter note here..."
                        />
                    </div>
                </div>
                <div className="flex justify-end gap-2 mt-4 ">
                    <button className="bg-blue-500 text-white p-2 rounded flex" onClick={handleSave}><IoMdCheckmarkCircleOutline size={18} className="mt-1" />Save</button>
                    <button className="bg-gray-500 text-white p-2 rounded flex " onClick={onClose}><IoClose size={18} className="mt-1" />Close</button>
                </div>
            </div>
        </div>
    );
};

export default AddTimeModal;
