import React, { useState, useEffect } from 'react';
import { TbCheckbox } from "react-icons/tb";
import { IoMdPeople } from 'react-icons/io'; // Team icon
import { FiBriefcase, FiTag, FiPlusCircle } from "react-icons/fi";
import { MdOutlineFileUpload } from "react-icons/md";
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import ManageLabels from "../../extra/ManageLabels";
import Import from '../../extra/Importfile';
import PageNavigation from '../../extra/PageNavigation';
import FormDialog from '../../extra/FormDialog';
import { Grid, Typography, Card, CardContent, LinearProgress, Box } from "@mui/material";
import { FaClipboardList } from "react-icons/fa";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import api from '../../Services/api.js'; // Adjust the path

const Clients = () => {
  const [ismanageOpen, setIsManageOpen] = useState(false);
  const [labelsList, setLabelsList] = useState([]);
  const [openImport, setOpenImport] = useState(false);
  const [clients, setClients] = useState([]);
  const [activeLabel, setActiveLabel] = useState("");
  const navigate = useNavigate();

  // Fetch Clients Data from API
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await api.get("/clients");
        if (response.data.success) {
          setClients(response.data.data);
        } else {
          console.error("Failed to fetch clients:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

    fetchClients();
  }, []);

  // Calculate Statistics
  const totalClients = clients.length;
  const totalContacts = clients.reduce((acc, client) => acc + (client.contacts || 0), 0);
  const unpaidInvoices = clients.filter((client) => client.invoice_status === "unpaid").length;
  const openProjects = clients.filter((client) => client.project_status === "open").length;
  const completedProjects = clients.filter((client) => client.project_status === "completed").length;
  const holdProjects = clients.filter((client) => client.project_status === "hold").length;
  const canceledProjects = clients.filter((client) => client.project_status === "canceled").length;

  // Stats Data
  const stats = [
    {
      id: 1,
      icon: <FiBriefcase size={24} />,
      count: totalClients,
      label: "Total clients",
      bgColor: "bg-blue-500",
    },
    {
      id: 2,
      icon: <IoMdPeople size={24} />,
      count: totalContacts,
      label: "Total contacts",
      bgColor: "bg-yellow-500",
    },
    {
      id: 3,
      icon: <TbCheckbox size={24} />,
      count: 0, // Replace with dynamic data if available
      label: "Contacts logged in today",
      bgColor: "bg-blue-500",
    },
    {
      id: 4,
      icon: <TbCheckbox size={24} />,
      count: 0, // Replace with dynamic data if available
      label: "Contacts logged in last 7 days",
      bgColor: "bg-blue-400",
    },
  ];

  const Client = [
    { title: 'Clients has unpaid invoices', value: unpaidInvoices, percentage: (unpaidInvoices / totalClients) * 100 },
    { title: 'Clients has partially paid invoices', value: 0, percentage: 0 }, // Replace with dynamic data if available
    { title: 'Clients has overdue invoices', value: 0, percentage: 0 }, // Replace with dynamic data if available
  ];

  const projects = [
    { title: 'Clients has open projects', value: openProjects },
    { title: 'Clients has completed projects', value: completedProjects },
    { title: 'Clients has hold projects', value: holdProjects },
    { title: 'Clients has canceled projects', value: canceledProjects },
  ];

  const estimates = [
    { title: 'Client has open estimates', value: 0 }, // Replace with dynamic data if available
    { title: 'Clients has accepted estimates', value: 0 }, // Replace with dynamic data if available
    { title: 'Clients has new estimate requests', value: 0 }, // Replace with dynamic data if available
    { title: 'Clients has estimate requests in progress', value: 0 }, // Replace with dynamic data if available
  ];

  const ticketsAndOrders = [
    { title: 'Clients has open tickets', value: 0, percentage: 0 }, // Replace with dynamic data if available
    { title: 'Clients has new orders', value: 0, percentage: 0 }, // Replace with dynamic data if available
  ];

  const proposals = [
    { title: 'Clients has open proposals', value: 0, icon: <FaClipboardList /> }, // Replace with dynamic data if available
    { title: 'Clients has accepted proposals', value: 0, icon: <AiOutlineCheckCircle /> }, // Replace with dynamic data if available
    { title: 'Clients has rejected proposals', value: 0, icon: <AiOutlineCloseCircle /> }, // Replace with dynamic data if available
  ];

  const handleOpenTab = (label) => {
    setActiveLabel(label);
    switch (label) {
      case "clients":
        navigate("/dashboard/clients/client");
        break;
      case "contacts":
        navigate("/dashboard/clients/contact");
        break;
      case "overview":
        navigate("/dashboard/clients");
        break;
    }
  };

  const toggleDialog = () => setIsManageOpen(!ismanageOpen);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const [formData, setFormData] = useState({
    type: "Organization",
    companyName: "",
    owner: "Admin P",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    phone: "",
    email: "",
    vatNumber: "",
    gstNumber: "",
    clientGroups: "",
    currency: "",
    currencySymbol: "",
    labels: "",
    disablePayment: false,
  });

  const fields = [
    {
      name: "type",
      label: "Type",
      type: "radio",
      options: [
        { value: "Organization", label: "Organization" },
        { value: "Person", label: "Person" }
      ],
    },
    { name: "companyName", label: "Company Name", type: "text" },
    { name: "owner", label: "Owner", type: "select", options: [{ value: "admin_p", label: "Admin P" }] },
    { name: "address", label: "Address", type: "textarea", multiline: true, rows: 2, className: "border p-2 rounded w-full", },
    { name: "city", label: "City", type: "text" },
    { name: "state", label: "State", type: "text" },
    { name: "zip", label: "Zip", type: "text" },
    { name: "country", label: "Country", type: "text" },
    { name: "phone", label: "Phone", type: "text" },
    { name: "email", label: "Email", type: "email" },
    { name: "vatNumber", label: "VAT Number", type: "text" },
    { name: "gstNumber", label: "GST Number", type: "text" },
    { name: "clientGroups", label: "Client Groups", type: "text" },
    { name: "currency", label: "Currency", type: "text" },
    { name: "currencySymbol", label: "Currency Symbol", type: "text" },
    { name: "labels", label: "Labels", type: "text" },
    { name: "disablePayment", label: "Disable Online Payment", type: "checkbox" },
  ];

  const handleAddClient = () => {
    setIsEditMode(false);
    setFormData({
      type: "Organization",
      companyName: "",
      owner: "Admin P",
      address: "",
      city: "",
      state: "",
      zip: "",
      country: "",
      phone: "",
      email: "",
      vatNumber: "",
      gstNumber: "",
      clientGroups: "",
      currency: "",
      currencySymbol: "",
      labels: "",
      disablePayment: false,
    });
    setIsDialogOpen(true);
  };

  const handleSaveClient = () => {
    if (isEditMode) {
      setClients((prev) => prev.map((c) => (c.id === formData.id ? formData : c)));
    } else {
      setClients((prev) => [...prev, { ...formData, id: clients.length + 1 }]);
    }
    setIsDialogOpen(false);
  };

  const handleStatusClick = () => {
    navigate("/dashboard/clients/contact");
  };

  const handleClientpage = () => {
    navigate("/dashboard/clients/client");
  };

  return (
    <div className=" ">
      <PageNavigation
        labels={[
          { label: "Overview", value: "overview" },
          { label: "Clients", value: "clients" },
          { label: "Contacts", value: "contacts" },
        ]}
        activeLabel={activeLabel}
        handleLabelClick={handleOpenTab}
        buttons={[
          { label: "Manage Labels", icon: FiTag, onClick: () => setIsManageOpen(true) },
          { label: "Import Clients", icon: MdOutlineFileUpload, onClick: () => setOpenImport(true) },
          { label: "Add Client", icon: FiPlusCircle, onClick: handleAddClient },
        ]}
      />
      {/* Status Section */}
      <div className="flex gap-4 p-6 bg-gray-100 dark:bg-gray-700 dark:text-white">
        {stats.map((item) => (
          <div
            key={item.id}
            onClick={handleStatusClick}
            className="flex items-center p-6 bg-white rounded-xl shadow-md w-64 cursor-pointer dark:bg-gray-700 dark:text-white"
          >
            <div className={`p-3 ${item.bgColor} text-white rounded-lg flex items-center justify-center`}>
              {item.icon}
            </div>
            <div className="ml-4">
              <h2 className="text-2xl font-semibold">{item.count}</h2>
              <p>{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "30px" }}>
        {/* Client Section */}
        <Grid container spacing={3} onClick={handleClientpage}>
          {Client.map((stat, index) => (
            <Grid item xs={3} key={index}>
              <Card className='cursor-pointer dark:bg-gray-700 dark:text-white'>
                <CardContent>
                  <Typography variant="h6" color="textSecondary">{stat.title}</Typography>
                  <div className='flex justify-between mt-3'>
                    <Typography variant="body2" color="textSecondary">{stat.percentage.toFixed(2)}% of total clients</Typography>
                    <Typography variant="h5" color="textPrimary">{stat.value}</Typography>
                  </div>
                  {stat.percentage !== undefined && (
                    <div style={{ marginTop: '10px' }}>
                      <LinearProgress variant="determinate" value={stat.percentage} className="rounded-sm" />
                    </div>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <div>
          {/* Projects and Estimates Section in 2 Columns */}
          <Grid container spacing={3}>
            {/* Projects Column */}
            <Grid item xs={12} md={6} onClick={handleClientpage}>
              <div style={{ marginTop: '30px' }} className='bg-white p-3 rounded-lg cursor-pointer dark:bg-gray-700 dark:text-white'>
                <Typography variant="h6" gutterBottom className='text-xs'>Projects</Typography>
                {projects.map((project, index) => (
                  <div key={index} className="flex justify-between mb-2 bg-slate-100 p-2 dark:bg-gray-700 dark:text-white">
                    <Typography variant="body1" className="flex gap-2">
                      {project.title}
                    </Typography>
                    <Typography variant="body1" className="font-bold ml-6">
                      {project.value}
                    </Typography>
                  </div>
                ))}
              </div>
            </Grid>

            {/* Estimates Column */}
            <Grid item xs={12} md={6} onClick={handleClientpage}>
              <div style={{ marginTop: '30px' }} className='p-3 rounded-lg cursor-pointer dark:bg-gray-700 dark:text-white'>
                <Typography variant="h6" gutterBottom className='text-xs'>Estimates</Typography>
                {estimates.map((estimate, index) => (
                  <div key={index} className="flex justify-between mb-2 bg-slate-100 p-2 dark:bg-gray-700 dark:text-white">
                    <Typography variant="body1" className="flex gap-2">
                      {estimate.title}
                    </Typography>
                    <Typography variant="body1" className="font-bold ml-6">
                      {estimate.value}
                    </Typography>
                  </div>
                ))}
              </div>
            </Grid>
          </Grid>
        </div>
      </div>

      <div style={{ marginTop: "20px" }}>
        {/* Tickets and Orders Section and Proposals Section in 2 Columns */}
        <Grid container spacing={3} onClick={handleClientpage}>
          {/* Left Column: Tickets and Orders */}
          <Grid item xs={12} md={6}>
            <div>
              <Grid container spacing={3}>
                {ticketsAndOrders.map((item, index) => (
                  <Grid item xs={12} key={index}>
                    <Card>
                      <CardContent>
                        <label className='text-sm font-bold cursor-pointer'>{item.title}</label>
                        <div className='flex justify-between mt-3 cursor-pointer'>
                          <Typography variant="body2">{item.percentage}% of total clients</Typography>
                          <Typography variant="h5">{item.value}</Typography>
                        </div>
                        <div style={{ marginTop: '10px' }}>
                          <LinearProgress variant="determinate" value={item.percentage} className="rounded-sm" />
                        </div>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </div>
          </Grid>

          {/* Right Column: Proposals */}
          <Grid item xs={12} md={6}>
            <div style={{ marginTop: '30px', width: "100%" }} className='p-3 rounded-lg cursor-pointer dark:bg-gray-700 dark:text-white'>
              <Typography variant="h6" gutterBottom className='text-xs'>Proposals</Typography>
              {proposals.map((proposal, index) => (
                <div key={index} className="flex justify-between mb-4 bg-slate-100 p-2 dark:bg-gray-700 dark:text-white">
                  <Typography variant="body1" className="flex gap-2">
                    {proposal.icon}
                    {proposal.title}
                  </Typography>
                  <Typography variant="body1" className="font-bold ml-6">
                    {proposal.value}
                  </Typography>
                </div>
              ))}
            </div>
          </Grid>
        </Grid>
      </div>

      {/* Material-UI Dialog for Add Client */}
      <FormDialog
        open={isDialogOpen}
        handleClose={() => setIsDialogOpen(false)}
        fields={fields}
        formData={formData}
        handleChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
        handleSave={handleSaveClient}
        showUploadButton={false}
        extraButtons={[
          {
            label: "Save & Show",
            icon: IoMdCheckmarkCircleOutline,
            onClick: handleSaveClient,
            color: "#38a4f8"
          },
          {
            label: "Save",
            icon: IoMdCheckmarkCircleOutline,
            onClick: handleSaveClient,
            color: "#4caf50"
          }
        ]}
        isEditMode={isEditMode}
        type={isEditMode ? "Edit Client" : "Add client"}
      />

      {/* Import Dialog */}
      <Import
        open={openImport}
        onClose={() => setOpenImport(false)}
        onFileUpload={(file) => console.log("Uploaded File:", file)}
        sampleDownload={() => console.log("Downloading Sample File")}
      />

      {/* Manage Labels Dialog */}
      <ManageLabels
        isOpen={ismanageOpen}
        onClose={toggleDialog}
        labelsList={labelsList}
        setLabelsList={setLabelsList}
      />
    </div>
  );
};

export default Clients;