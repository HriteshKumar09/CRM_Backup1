import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import * as Tabs from "@radix-ui/react-tabs";
import { ChevronDown, Import, Plus } from "lucide-react";
import { motion } from "framer-motion";
import TaskForm from "./TaskForm.js";
import { FiEdit, FiTag, FiPlusCircle, FiPlus } from "react-icons/fi";
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import { SlClose } from "react-icons/sl";
import FormDialog from "../../extra/FormDialog";
import logo from "../../assets/img_file66f3f0d354e75_site_logo.png.png"
import axios from 'axios';
import api from '../../Services/api.js'; // Adjust the path

const BASE_URL = "http://localhost:4008/api"; // API URL

const Estimateview = () => {
    const [estimate, setEstimate] = useState("");
    const [activeTab, setActiveTab] = useState("details");
    const navigate = useNavigate();
    const [clients, setClients] = useState([]);

    // Function to calculate subtotal
    const calculateSubTotal = (items) => {
        if (!Array.isArray(items)) {
            return 0; // ✅ Return 0 if `items` is undefined or not an array
        }

        return items.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const itemFields = [
        { name: "item", label: "Item", type: "select", options: [] },
        { name: "description", label: "Description", type: "textarea", multiline: true, rows: 2 },
        { name: "quantity", label: "Quantity", type: "text" },
        { name: "unit", label: "Unit type", type: "text" },
        { name: "rate", label: "Rate", type: "text" },
    ];

    // ✅ State for items
    const [items, setItems] = useState([]);
    const [itemData, setItemData] = useState({
        item: "",
        description: "",
        quantity: "",
        unit: "",
        rate: "",
    });

    const [isItemModalOpen, setIsItemModalOpen] = useState(false);

    // ✅ Fetch item options from API
    const fetchItemOptions = async () => {
        try {
            const response = await api.get('/items/options'); // Fetch from API
            if (response.data.success) {
                setItemData((prevFields) =>
                    prevFields.map((field) =>
                        field.name === "item"
                            ? { ...field, options: response.data.options }
                            : field
                    )
                );
            } else {
                console.error("Failed to fetch item options:", response.data.message);
            }
        } catch (error) {
            console.error("Error fetching item options:", error);
        }
    };

    // ✅ Open the form and fetch options
    const handleOpenItemForm = () => {
        fetchItemOptions();
        setIsItemModalOpen(true);
    };

    // ✅ Handle input changes
    const handleChanges = (e) => {
        const { name, value } = e.target;
        setItemData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // ✅ Save the new item
    const handleSaveItem = async () => {
        try {
            const response = await api.post('/items', itemData); // Save to backend
            if (response.data.success) {
                setItems((prevItems) => [...prevItems, response.data.item]); // Add to list
                setIsItemModalOpen(false); // Close modal
            } else {
                console.error("Failed to save item:", response.data.message);
            }
        } catch (error) {
            console.error("Error saving item:", error);
        }
    };

    return (
        <div className="min-h-screen ">
            {/* Header */}
            <div className="  shadow-sm">
                <div className="container px-4 max-w-7xl mx-auto">
                    <div className="flex justify-between items-center py-4">
                        <div className="text-xl font-medium">ESTIMATE #{estimate.id}</div>
                        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center">
                            <ChevronDown className="mr-1 h-4 w-4" />
                            Actions
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container px-4 max-w-7xl mx-auto py-6 bg-gray-100 rounded-md">
                <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="w-full rounded-md">
                    <Tabs.List className="bg-sky-100 border border-gray-200 p-1 mb-6 flex">
                        <Tabs.Trigger value="details" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white px-4 py-2 rounded">
                            Details
                        </Tabs.Trigger>
                        <Tabs.Trigger value="tasks" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white px-4 py-2 rounded">
                            Tasks
                        </Tabs.Trigger>
                    </Tabs.List>

                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Left Section */}
                        <div className="lg:w-2/3">
                            <Tabs.Content value="details">
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="bg-white border border-gray-200 rounded-lg p-6 mb-6"
                                >
                                    {/* Header Section */}
                                    <div className="flex flex-col md:flex-row justify-between">
                                        {/* Company Information */}
                                        <div className="mb-6 md:mb-0">
                                            {estimate?.company?.logo ? (
                                                <img
                                                    src={estimate.company.logo}
                                                    alt={estimate?.company?.name || "Company Logo"}
                                                    className="h-16 mb-4"
                                                />
                                            ) : (
                                                <div className="h-16 w-40 bg-gray-100 flex items-center justify-center rounded mb-4">
                                                    Logo Placeholder
                                                </div>
                                            )}

                                            <div>
                                                <h2>{estimate?.company?.name || "Company Name"}</h2>
                                                <p className="text-gray-600">{estimate?.company?.address || "No Address Available"}</p>
                                                <p className="text-gray-600">Phone: {estimate?.company?.phone || "N/A"}</p>
                                                <p className="text-gray-600">Email: {estimate?.company?.email || "N/A"}</p>
                                                <p className="text-gray-600">Website: {estimate?.company?.website || "N/A"}</p>
                                            </div>
                                        </div>

                                        {/* Estimate Details */}
                                        <div>
                                            <h1 className="p-1 items-center rounded-md font-medium bg-blue-900 text-white">
                                                ESTIMATE #{estimate?.id || "N/A"}
                                            </h1>
                                            <p>Estimate date: {estimate?.date || "N/A"}</p>
                                            <p>Valid until: {estimate?.valid_until || "N/A"}</p>

                                            <div className="mt-4">Estimate To</div>
                                            <p className="border-t">{estimate?.client || "N/A"}</p>
                                        </div>
                                    </div>

                                </motion.div>

                                {/* Animated Table */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.1 }}
                                    className="bg-white border border-gray-200 rounded-lg overflow-hidden"
                                >
                                    <table className="w-full">
                                        <thead className="bg-gray-50 border-b border-gray-200">
                                            <tr>
                                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Item</th>
                                                <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase">Quantity</th>
                                                <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase">Rate</th>
                                                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Total</th>
                                                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {items.length > 0 ? (
                                                items.map((item, index) => (
                                                    <tr key={index}>
                                                        <td className="px-6 py-4 text-sm text-gray-900">{item.description}</td>
                                                        <td className="px-6 py-4 text-sm text-center">{item.quantity}</td>
                                                        <td className="px-6 py-4 text-sm text-center">₹{item.rate.toFixed(2)}</td>
                                                        <td className="px-6 py-4 text-sm text-right">₹{(item.quantity * item.rate).toFixed(2)}</td>
                                                        <td className="px-6 py-4 text-sm text-right">
                                                            <button className="p-1 rounded transition-colors duration-200 mr-2">
                                                                <FiEdit className="text-blue-600 hover:bg-blue-200 rounded-lg" size={20} />
                                                            </button>
                                                            <button

                                                                className="p-1 rounded transition-colors duration-200"
                                                            >
                                                                <SlClose className="text-red-500 hover:bg-red-200 rounded-xl" size={20} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={5} className="text-center px-6 py-10 text-gray-500">
                                                        No record found.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>

                                        {/* Footer for Subtotal and Total Calculation */}
                                        <tfoot className="border-t border-gray-200 bg-gray-50">
                                            <tr>
                                                <td colSpan={3} className="px-6 py-4 text-sm font-medium text-right text-gray-700">Sub Total</td>
                                                <td className="px-6 py-4 text-sm text-right font-medium text-gray-900">₹{calculateSubTotal().toFixed(2)}</td>
                                            </tr>
                                            <tr>
                                                <td colSpan={3} className="px-6 py-4 text-sm font-medium text-right text-gray-700">Total</td>
                                                <td className="px-6 py-4 text-sm text-right font-medium text-gray-900">₹{calculateSubTotal().toFixed(2)}</td>
                                            </tr>
                                        </tfoot>
                                    </table>

                                    {/* Add Item Button */}
                                    <div className="p-6 border-t border-gray-200">
                                        <button
                                            onClick={handleOpenItemForm}
                                            className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                                        >
                                            <FiPlus size={16} /> Add item
                                        </button>
                                    </div>
                                </motion.div>
                            </Tabs.Content>


                        </div>
                        <FormDialog
                            open={isItemModalOpen}
                            handleClose={() => setIsItemModalOpen(false)}
                            type="Add Item"
                            fields={itemFields}
                            formData={itemData}
                            handleChange={handleChanges}
                            handleSave={handleSaveItem}
                            extraButtons={[
                                {
                                    label: "Save",
                                    icon: IoMdCheckmarkCircleOutline,
                                    onClick: handleSaveItem,
                                    color: "#4caf50",
                                },
                            ]}
                        />
                        <Tabs.Content value="details">
                            <div className="">
                                <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                                    <div className="mb-4">
                                        <h2 className="text-lg font-medium cursor-pointer" onClick={() => navigate(`/dashboard/clients/view/${clients.id}/contacts`)}>Client: {estimate.client}</h2>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Status:</span>
                                            <span className="px-2 py-1 bg-gray-200 rounded text-xs font-medium">
                                                {estimate.status}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Last email sent:</span>
                                            <span>{estimate.lastEmailSent}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Estimate Request:</span>
                                            <span className="text-blue-500 cursor-pointer" onClick={() => navigate(`/dashboard/view_estimate_request`)}>{estimate.estimateRequest}</span>
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <h3 className="text-md font-medium mb-2">Reminders (Private):</h3>
                                        <button
                                            variant="outline"
                                            className="w-full   text-gray-500"
                                        >
                                            <Plus className="" /> Add reminder
                                        </button>
                                        <div className="mt-4 text-sm text-gray-500 text-center">
                                            No record found.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Tabs.Content>
                    </div>
                    <Tabs.Content value="tasks">
                       <TaskForm/>
                    </Tabs.Content>
                </Tabs.Root>
            </div>
        </div>
    );
};

export default Estimateview;