import React, { useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode"; // Import jwtDecode directly
import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Dashboard from "../pages/Dashboard";
import Announcement from "../pages/Team/Announcement";
import Event from "../pages/Event";
import Polls from "../pages/Polls";
import Clients from "../pages/Clients/Clients";
import Projects from "../pages/Projects";
import Tasks from "../pages/Task/Tasks";
import Assets from "../pages/Assets";
import Leads from "../pages/Leads/Leads";
import Leadkanban from "../pages/Leads/Leads-kanban";
import BannerManager from "../pages/Banner-Manager";
import Subscriptions from "../pages/Subscriptions";
import AdminHeader from "./AdminHeader";
import Notes from "../pages/Notes";
import Messages from "../pages/Messages";
// import Expenses from "../pages/Expenses";
import Reports from "../pages/Reports";
import Setting from "../pages/Settings/Settings";
import GeneralSettings from "../pages/Settings/components/AppSettings/GeneralSettings";
import LocalizationSettings from "../pages/Settings/components/AppSettings/LocalizationSettings";
import EmailSettings from "../pages/Settings/components/AppSettings/EmailSettings";
import EmailTemplates from "../pages/Settings/components/AppSettings/EmailTemplates";
import ModulesSettings from "../pages/Settings/components/AppSettings/ModulesSettings";
import LeftMenuSettings from "../pages/Settings/components/AppSettings/LeftMenuSettings";
import NotificationSettings from "../pages/Settings/components/AppSettings/NotificationSettings";
import IntegrationSettings from "../pages/Settings/components/AppSettings/IntegrationSettings";
import CronJobSettings from "../pages/Settings/components/AppSettings/CronJobSettings";
import UpdateSettings from "../pages/Settings/components/AppSettings/UpdateSettings";
import RoleSettings from "../pages/Settings/components/AccessPermission/RoleSettings";
import UserRoleSettings from "../pages/Settings/components/AccessPermission/UserRoleSettings";
import TeamSettings from "../pages/Settings/components/AccessPermission/TeamSettings";
import IPRestrictionSettings from "../pages/Settings/components/AccessPermission/IPRestrictionSettings";
import ClientPermissionSettings from "../pages/Settings/components/ClientPortal/ClientPermissionSettings";
import ClientDashboardSettings from "../pages/Settings/components/ClientPortal/DashboardSettings";
import ClientMenuSettings from "../pages/Settings/components/ClientPortal/MenuSettings";
import ProjectSettings from "../pages/Settings/components/ClientPortal/ProjectSettings";
import GeneralInfo from "../pages/Tabs/GeneralInfo";
import SocialLinks from "../pages/Tabs/SocialLinks";
import JobInfo from "../pages/Tabs/JobInfo";
import AccountSettings from "../pages/Tabs/AccountSettings";
import MyPreferences from "../pages/Tabs/MyPreferences";
import Files from "../pages/Tabs/Files";
import ProfilePage from "../pages/Profilepage";
import TeamProfilePage from "../pages/Tabs/TeamMembersProfile";
import ClientPage from "../pages/Clients/ClientPage"; // ✅ Correct import
import ContactPage from "../pages/Clients/ContactPage"; // ✅ Correct import
import Kanbanpage from "../pages/Task/Kanbanpage";
import Ganttpage from "../pages/Task/Ganttpage";

//Riseguard
import RiseguardDashboard from "../pages/Riseguard/Dashboard";
import RiseguardSetting from "../pages/Riseguard/Settings"
//Marketing Automation
import MarketingDashboard from "../pages/Marketing Automation/Dashboard";
import MarketingSegments from "../pages/Marketing Automation/Segments";
import MarketingComponents from "../pages/Marketing Automation/Components";
import MarketingCampaigns from "../pages/Marketing Automation/Campaigns";
import MarketingChannels from "../pages/Marketing Automation/Channels";
import MarketingPoints from "../pages/Marketing Automation/Points";
import MarketingStages from "../pages/Marketing Automation/Stages";
import MarketingReports from "../pages/Marketing Automation/Reports";
import MarketingSettings from "../pages/Marketing Automation/Settings";
//Accounting
import AccountingDashboard from "../pages/Accounting/Dashboard";
import AccountingBanking from "../pages/Accounting/Banking";
import AccountingTransactions from "../pages/Accounting/Transactions";
import AccountingJournalEntry from "../pages/Accounting/Journal-Entry";
import AccountingTransfer from "../pages/Accounting/Transactions";
import AccountingChart from "../pages/Accounting/Chart-of-Accounts";
//Sales Agent
import SalesAgentDashboard from "../pages/Sales Agent/Dashboard";
import SalesAgentManagement from "../pages/Sales Agent/Management";
import SalesAgentPrograms from "../pages/Sales Agent/Programs";
import SalesAgentOrders from "../pages/Sales Agent/Orders";
import SalesAgentSettings from "../pages/Sales Agent/Settings";
//Recruitments
import RecruitmentsCirculars from "../pages/Recruitments/Circulars";
import RecruitmentsCandidates from "../pages/Recruitments/Candidates";
//Flexiblebackup
import FlexiblebackupStoredBackups from "../pages/Flexiblebackup/Stored-Backups";
import FlexiblebackupUpcomingBackup from "../pages/Flexiblebackup/Upcoming-Backup";
import FlexiblebackupSettings from "../pages/Flexiblebackup/Settings";
import FlexiblebackupBackup from "../pages/Flexiblebackup/Backup";
//Hr payroll
import HrpayrollEmployees from "../pages/Hr payroll/Employees";
import HrpayrollAttendance from "../pages/Hr payroll/Attendance";
import HrpayrollCommissions from "../pages/Hr payroll/Commissions";
import HrpayrollDeductions from "../pages/Hr payroll/Deductions";
import HrpayrollBonuskpi from "../pages/Hr payroll/Bonus-kpi";
import HrpayrollInsurance from "../pages/Hr payroll/Insurance";
import HrpayrollPayslips from "../pages/Hr payroll/Payslips";
import HrpayrollPaysliptemplates from "../pages/Hr payroll/Payslip-templates";
import HrpayrollIncometaxes from "../pages/Hr payroll/Income-taxes";
import HrpayrollReports from "../pages/Hr payroll/Reports";
import HrpayrollSettings from "../pages/Hr payroll/Settings";
//Purchase
import PurchaseItems from "../pages/Purchase/Items";
import PurchaseVendors from "../pages/Purchase/Vendors";
import PurchaseVendorItems from "../pages/Purchase/Vendor-Items";
import PurchasePurchaseRequest from "../pages/Purchase/Purchase-Request";
import PurchaseQuotations from "../pages/Purchase/Quotations";
import PurchasePurchaseOrders from "../pages/Purchase/Purchase-Orders";
import PurchaseInvoices from "../pages/Purchase/Invoices";
import PurchaseSettings from "../pages/Purchase/Settings";
//Inventory
import InventoryItems from "../pages/Inventory/Items";
import InventoryInventoryreceivingvoucher from "../pages/Inventory/Inventory-receiving-voucher";
import InventoryInventorydeliveryvoucher from "../pages/Inventory/Inventory-delivery-voucher";
import InventoryPackinglists from "../pages/Inventory/Packing-lists";
import InventoryInternaldeliverynote from "../pages/Inventory/Internal-delivery-note";
import InventoryLossadjustment from "../pages/Inventory/Loss & adjustment";
import ReceivingExportingreturnorder from "../pages/Inventory/Receiving-Exporting-return-order";
import InventoryWarehouses from "../pages/Inventory/Warehouses";
import InventoryInventoryhistory from "../pages/Inventory/Inventory-history";
import InventoryReport from "../pages/Inventory/Report";
import InventorySettings from "../pages/Inventory/Settings";
//Manufacturing
import ManufacturingDashboard from "../pages/Manufacturing/Dashboard";
import ManufacturingProducts from "../pages/Manufacturing//Products";
import ManufacturingProductvariants from "../pages/Manufacturing/Product-variants";
import ManufacturingBillsofmaterials from "../pages/Manufacturing/Bills-ofmaterials";
import ManufacturingRoutings from "../pages/Manufacturing/Routings";
import ManufacturingWorkcenters from "../pages/Manufacturing/Work-centers";
import ManufacturingManufacturingorders from "../pages/Manufacturing/Manufacturing-orders";
import ManufacturingWorkorders from "../pages/Manufacturing/Work-orders";
import ManufacturingSettings from "../pages/Manufacturing/Settings";
//Sales
import SalesInvoices from "../pages/Sales/Invoices";
import SalesOrderlist from "../pages/Sales/Order-list";
import SalesStore from "../pages/Sales/Store";
import SalesPayments from "../pages/Sales/Payments";
import SalesItems from "../pages/Sales/Items";
import SalesContracts from "../pages/Sales/Contracts";
//Prospects
import ProspectsEstimateList from "../pages/Prospects/Estimate-List";
import Estimatelistyear from "../pages/Prospects/Estimate-list-year";
import Estimatelistmonth from "../pages/Prospects/Estimate-list-month";
import Estimateview from "../pages/Prospects/Estimate-view"
import Proposalview from "../pages/Prospects/Proposal-view";
import ProspectsEstimateRequests from "../pages/Prospects/Estimate-Requests";
import ProspectsEstimateForms from "../pages/Prospects/Estimate-Forms";
import EditEstimateForm from "../pages/Prospects/EditEstimateForm";
import ProspectsProposals from "../pages/Prospects/Proposals";
import ProposalsMonth from "../pages/Prospects/ProposalMonth";
import ProposalsYear from "../pages/Prospects/Proposalyear"
import RequestEstimateForm from "../pages/Prospects/RequestEstimateForm";
import ViewEstimateRequest from "../pages/Prospects/ViewEstimateRequest";
//Help & Support
import Help from "../pages/Help/Help";
import HelpArticles from "../pages/Help/Articles";
import HelpCategories from "../pages/Help/Categories";
import HelpKnowledgebase from "../pages/Help/Knowledge-base";
//Team
import TeamMembers from "../pages/Team/TeamMembers";
import TimeCards from "../pages/Team/TimeCards";
import Leave from "../pages/Team/Leave";
import Timeline from "../pages/Team/Timeline";
import TimelinePage from "../pages/Tabs/TimelinePage";
import Custom from "../pages/Team/Custom";
import Clockinout from "../pages/Team/Clock-in-out";
import MembersCliok from "../pages/Team/Members-Cliok";
import Summary from "../pages/Team/Summary";
import SummaryDetails from "../pages/Team/Summary-Details";
import AllApplication from "../pages/Team/All-Application";
import LeaveSummary from "../pages/Team/Leave-Summary";
import Addannouncement from "../pages/Team/Addannouncement";
import MessageModule from "../pages/Messages";
import ProfileTimeCards from "../pages/Team/ProfileTimeCards";
import { Ticket } from "lucide-react";
import Tickets from "../pages/Tickets/Tickets";

//project Tabs
import Overview from "../pages/projectTabs/Overview";
import TaskList from "../pages/projectTabs/TaskList";
import ProjectDetail from "../pages/projectTabs/ProjectDetail";
import Comments from "../pages/projectTabs/Comments";
import ProjectFiles from "../pages/projectTabs/Files";
import FilesFile from "../pages/projectTabs/Files-File";
import FilesCategory from "../pages/projectTabs/Files-category";
import TaskKanban from "../pages/projectTabs/Task_Kanban";
import Timesheets from "../pages/projectTabs/Timesheets";
import TimesheetsDetails from "../pages/projectTabs/Timesheets-Details";
import TimesheetsSummary from "../pages/projectTabs/Timesheets-Summary";
import TimesheetsChart from "../pages/projectTabs/Timesheets-Chart";
import Gantt from "../pages/projectTabs/Gantt";
import ProjectNotes from "../pages/projectTabs/Project-Notes";
import ProjectExpenses from "../pages/projectTabs/Project-Expenses";
import Milestones from "../pages/projectTabs/Milestones";
import Contracts from "../pages/projectTabs/Contracts";
import Invoice from "../pages/projectTabs/Invoice";
import ProjectPayments from "../pages/projectTabs/Payments";
import Feedback from "../pages/projectTabs/Feed-back";
//Clients Tabs
import ClientDetail from "../pages/ClientTabs/ClientDetail";
import ClientContracts from "../pages/ClientTabs/Client-Contracts";
import ClientEvent from "../pages/ClientTabs/Client-Event";
import ClientFiles from "../pages/ClientTabs/Client-Files";
import ClientExpeses from "../pages/ClientTabs/Client-Expeses";
import Clientinfo from "../pages/ClientTabs/Client-info";
import ClientInvoices from "../pages/ClientTabs/Client-Invoices";
import ClientNotes from "../pages/ClientTabs/Client-Notes";
import Clientpayments from "../pages/ClientTabs/Client-payments";
import Contacts from "../pages/ClientTabs/Contacts";
import EstimateRequests from "../pages/ClientTabs/Estimate-Requests";
import Estimates from "../pages/ClientTabs/Estimates";
import ClientOrders from "../pages/ClientTabs/Client-Orders";
import ClientsProjects from "../pages/ClientTabs/Clients-Projects";
import Proposals from "../pages/ClientTabs/Proposals";
import ClientTasks from "../pages/ClientTabs/Client-Tasks";
import ClientTickets from "../pages/ClientTabs/Client-Tickets";

//Expenses
// import Expenses from "../pages/Expenses";
import ExpensesMonth from "../pages/Expenses/ExpensesMonth";
import ExpensesYear from "../pages/Expenses/Expenses-Year";
import ExpensesRecurring from "../pages/Expenses/Expenses-Recurring";
import ExpensesCustom from "../pages/Expenses/Expenses-Custom";
import Expenses from "../pages/Expenses/Expenses";

import { useTheme } from "../contexts/ThemeContext";

const MainLayout = () => {
  const [sidebarColor, setSidebarColor] = useState("");
  const { darkMode } = useTheme();

  // Load sidebar state from localStorage (default: false if not found)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return JSON.parse(localStorage.getItem("isSidebarCollapsed")) ?? false;
  });

  // Decode the JWT token to get the user's role_id
  const token = localStorage.getItem("token");
  const decodeToken = (token) => {
    try {
      const decoded = jwtDecode(token); // Decode the token
      return decoded; // Return the decoded token payload
    } catch (error) {
      console.error("Error decoding token:", error);
      return null; // Return null if decoding fails
    }
  };
  const user = decodeToken(token); // Decode the token
  const roleId = user?.role_id; // Extract role_id from the token

  // Function to check if the user has the required role
  const hasAccess = (allowedRoles) => {
    return allowedRoles.includes(roleId);
  };

  // Save `isSidebarCollapsed` to `localStorage` whenever it changes
  useEffect(() => {
    localStorage.setItem("isSidebarCollapsed", JSON.stringify(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  // Toggle sidebar state and update localStorage
  const toggleSidebar = () => {
    setIsSidebarCollapsed((prevState) => {
      const newState = !prevState;
      localStorage.setItem("isSidebarCollapsed", JSON.stringify(newState));
      return newState;
    });
  };

  const [loading, setLoading] = useState(true);

  // Simulate a delay to show the loading effect
  useEffect(() => {
    setTimeout(() => {
      setLoading(false); // Hide loading after 1.5 seconds
    }, 1500);
  }, []);

  return (
    <div className="flex h-screen pt-6 md:pt-10 lg:pt-12 dark:bg-gray-700 dark:text-white">
      {/* Sidebar */}
      <Sidebar selectedColor={sidebarColor} isCollapsed={isSidebarCollapsed} />

      <div className={`flex-1 transition-all ${isSidebarCollapsed ? "ml-16" : "ml-64"}`}>
        {/* Admin Header */}
        <AdminHeader
          onColorChange={setSidebarColor}
          toggleSidebar={toggleSidebar}
          isCollapsed={isSidebarCollapsed}
        />
        {/* Content Area */}
        {loading ? (
          <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
          </div>
        ) : (
          <div className="p-8 overflow-auto dark:bg-gray-700 dark:text-white h-screen">
            <Routes>
              {/* Default route for /dashboard */}
              <Route path="/" element={<Dashboard />} />

              {/* Settings route */}
              <Route path="settings/*" element={<Setting />} />

              {/* Other routes */}
              <Route path="team-members" element={<TeamMembers />} />
              <Route path="time-cards" element={<TimeCards />} />
              <Route path="time-cards/custom" element={<Custom />} />
              <Route path="time-cards/summary" element={<Summary />} />
              <Route path="time-cards/summary-details" element={<SummaryDetails />} />
              <Route path="time-cards/member-clock" element={<MembersCliok />} />
              <Route path="time-cards/clock-in-out" element={<Clockinout />} />
              <Route path="leave" element={<Leave />} />
              <Route path="leave/leavesummary" element={<LeaveSummary />} />
              <Route path="leave/all-aplication" element={<AllApplication />} />
              <Route path="timeline" element={<Timeline />} />
              <Route path="announcements" element={<Announcement />} />
              <Route path="announcements/form" element={<Addannouncement />} />
              <Route path="Events" element={<Event />} />
              <Route path="riseguard-dashboard" element={<RiseguardDashboard />} />
              <Route path="riseguard-settings" element={<RiseguardSetting />} />
            
              {hasAccess([27]) && (
              <>
              <Route path="Marketing-Dashboard" element={<MarketingDashboard />} />
              <Route path="Marketing-Segments" element={<MarketingSegments />} />
              <Route path="Marketing-Components" element={<MarketingComponents />} />
              <Route path="Marketing-Campaigns" element={<MarketingCampaigns />} />
              <Route path="Marketing-Channels" element={<MarketingChannels />} />
              <Route path="Marketing-Points" element={<MarketingPoints />} />
              <Route path="Marketing-Stages" element={<MarketingStages />} />
              <Route path="Marketing-Reports" element={<MarketingReports />} />
              <Route path="Marketing-Settings" element={<MarketingSettings />} />
              </>
              )}


              {hasAccess([27]) && (
              <>
              <Route path="Accounting-Dashboard" element={<AccountingDashboard />} />
              <Route path="Accounting-Banking" element={<AccountingBanking />} />
              <Route path="Accounting-Transactions" element={<AccountingTransactions />} />
              <Route path="Accounting-Journal Entry" element={<AccountingJournalEntry />} />
              <Route path="Accounting-Transfer" element={<AccountingTransfer />} />
              <Route path="Accounting-Chart" element={<AccountingChart />} />
            

              <Route path="Sales-Dashboard" element={<SalesAgentDashboard />} />
              <Route path="Sales-Management" element={<SalesAgentManagement />} />
              <Route path="Sales-Programs" element={<SalesAgentPrograms />} />
              <Route path="Sales-Orders" element={<SalesAgentOrders />} />
              <Route path="Sales-Settings" element={<SalesAgentSettings />} />
                              
              <Route path="Recruitments-Circulars" element={<RecruitmentsCirculars />} />
              <Route path="Recruitments-Candidates" element={<RecruitmentsCandidates />} />
              </>
            )}
              
              
              
              <Route path="polls" element={<Polls />} />



              <Route path="Flexiblebackup-Stored Backups" element={<FlexiblebackupStoredBackups />} />
              <Route path="Flexiblebackup-Upcoming Backup" element={<FlexiblebackupUpcomingBackup />} />
              <Route path="Flexiblebackup-Settings" element={<FlexiblebackupSettings />} />
              <Route path="Flexiblebackup-Backup" element={<FlexiblebackupBackup />} />
              
              <Route path="projects" element={<Projects />} />

              {hasAccess([27]) && (
              <>
              {/* Clients & Contact Routes */}
              <Route path="clients" element={<Clients />} />
              <Route path="clients/client" element={<ClientPage />} />
              <Route path="clients/contact" element={<ContactPage />} />

              <Route path="projects" element={<Projects />} />

              <Route path="Hr payroll-Employees" element={<HrpayrollEmployees />} />
              <Route path="Hr payroll-Attendance" element={<HrpayrollAttendance />} />
              <Route path="Hr payroll-Commissions" element={<HrpayrollCommissions />} />
              <Route path="Hr payroll-Deductions" element={<HrpayrollDeductions />} />
              <Route path="Hr payroll-Bonus kpi" element={<HrpayrollBonuskpi />} />
              <Route path="Hr payroll-Insurance" element={<HrpayrollInsurance />} />
              <Route path="Hr payroll-Payslips" element={<HrpayrollPayslips />} />
              <Route path="Hr payroll-Payslips templates" element={<HrpayrollPaysliptemplates />} />
              <Route path="Hr payroll-Income taxes" element={<HrpayrollIncometaxes />} />
              <Route path="Hr payroll-Reports" element={<HrpayrollReports />} />
              <Route path="Hr payroll-Settings" element={<HrpayrollSettings />} />


              <Route path="Purchase-Items" element={<PurchaseItems />} />
              <Route path="Purchase-Vendors" element={<PurchaseVendors />} />
              <Route path="Purchase-Vendor-Items" element={<PurchaseVendorItems />} />
              <Route path="Purchase-Purchase Request" element={<PurchasePurchaseRequest />} />
              <Route path="Purchase-Quotations" element={<PurchaseQuotations />} />
              <Route path="Purchase-Purchase Orders" element={<PurchasePurchaseOrders />} />
              <Route path="Purchase-Invoices" element={<PurchaseInvoices />} />
              <Route path="Purchase-Settings" element={<PurchaseSettings />} />


              <Route path="Inventory-Items" element={<InventoryItems />} />
              <Route path="Inventory-Inventory receiving voucher" element={<InventoryInventoryreceivingvoucher />} />
              <Route path="Inventory-Inventory delivery voucher" element={<InventoryInventorydeliveryvoucher />} />
              <Route path="Inventory-Packing lists" element={<InventoryPackinglists />} />
              <Route path="Inventory-Internal delivery note" element={<InventoryInternaldeliverynote />} />
              <Route path="Inventory-Loss & adjustment" element={<InventoryLossadjustment />} />
              <Route path="Inventory-Receiving-Exporting return order" element={<ReceivingExportingreturnorder />} />
              <Route path="Inventory-Warehouses" element={<InventoryWarehouses />} />
              <Route path="Inventory-Inventory history" element={<InventoryInventoryhistory />} />
              <Route path="Inventory-Report" element={<InventoryReport />} />
              <Route path="Inventory-Settings" element={<InventorySettings />} />
              </>
            )}
              

              <Route path="tasks" element={<Tasks />} />
              <Route path="tasks/kanban" element={<Kanbanpage />} />
              <Route path="tasks/gantt" element={<Ganttpage />} />


              <Route path="Assets" element={<Assets />} />
              <Route path="Banner Manager" element={<BannerManager />} />
              <Route path="Leads" element={<Leads />} />
              <Route path="Leads/all_kanbab" element={<Leadkanban />} />

              
              {hasAccess([27]) && (
              <>
              <Route path="Manufacturing-Dashboard" element={<ManufacturingDashboard />} />
              <Route path="Manufacturing-Products" element={<ManufacturingProducts />} />
              <Route path="Manufacturing-Product variants" element={<ManufacturingProductvariants />} />
              <Route path="Manufacturing-Bills of materials" element={<ManufacturingBillsofmaterials />} />
              <Route path="Manufacturing-Routings" element={<ManufacturingRoutings />} />
              <Route path="Manufacturing-Work centers" element={<ManufacturingWorkcenters />} />
              <Route path="Manufacturing-Manufacturing orders" element={<ManufacturingManufacturingorders />} />
              <Route path="Manufacturing-Work orders" element={<ManufacturingWorkorders />} />
              <Route path="Manufacturing-Settings" element={<ManufacturingSettings />} />


              <Route path="Subscriptions" element={<Subscriptions />} />
              <Route path="Sales-Invoices" element={<SalesInvoices />} />
              <Route path="Sales-Order list" element={<SalesOrderlist />} />
              <Route path="Sales-Store" element={<SalesStore />} />
              <Route path="Sales-Payments" element={<SalesPayments />} />
              <Route path="Sales-Items" element={<SalesItems />} />
              <Route path="Sales-Contracts" element={<SalesContracts />} />
              </>
            )}


              {hasAccess([27]) && (
              <>
              <Route path="Prospects-Estimate List" element={<ProspectsEstimateList />} />
              <Route path="Prospects-Estimate Requests" element={<ProspectsEstimateRequests />} />
              <Route path="Prospects-Estimate Forms" element={<ProspectsEstimateForms />} />
              <Route path="Prospects-Proposals" element={<ProspectsProposals />} />


              <Route path="Reports" element={<Reports />} />

              </>
            )}

              <Route path="notes" element={<Notes />} />
              <Route path="messages" element={<MessageModule  />} />
              <Route path="Tickets" element={<Tickets/>} />
              <Route path="Tickets/ticket_Template" element={<Tickets/>} />


              

              <Route path="Help" element={<Help />} />
              <Route path="Articles" element={<HelpArticles />} />
              <Route path="Categories" element={<HelpCategories />} />
              <Route path="Knowledge base" element={<HelpKnowledgebase />} />



              {hasAccess([27]) && (
              <>
              <Route path="Expenses" element={<Expenses />}>
                  <Route index element={<ExpensesMonth />} />
                  <Route path="expensesYear" element={<ExpensesYear />} />
                  <Route path="expensesRecurring" element={<ExpensesRecurring />} />
                  <Route path="expensesCustom" element={<ExpensesCustom />} />
              </Route>

              <Route path="Estimate-List" element={<ProspectsEstimateList />} >
                <Route path="index" element={<Estimatelistyear />} />
                <Route index element={<Estimatelistmonth />} />
                </Route>

                <Route path="Estimate-List/Views/:id" element={<Estimateview />} />
                <Route path="Prospects-Proposals/Views" element={<Proposalview />} />
                <Route path="Prospects-Estimate Requests" element={<ProspectsEstimateRequests />} />
                <Route path="Prospects-Estimate Forms" element={<ProspectsEstimateForms />} />
                <Route path="edit_estimate_form" element={<EditEstimateForm />} />

                <Route path="Prospects-Proposals" element={<ProspectsProposals />} >
                <Route path="index" element={<ProposalsYear />} />
                <Route index element={<ProposalsMonth />} />
                </Route>
              </>
            )}    


              {/* Profile Page with Nested Routes */}
              <Route path="profile" element={<ProfilePage />}>
                <Route path="timeline" element={<TimelinePage />} />
                <Route path="general-info" element={<GeneralInfo />} />
                <Route path="social-links" element={<SocialLinks />} />
                <Route path="job-info" element={<JobInfo />} />
                <Route path="account-settings" element={<AccountSettings />} />
                <Route path="my-preferences" element={<MyPreferences />} />
                <Route path="files" element={<Files />} />
                <Route path="time-cards" element={<ProfileTimeCards/>} />
                <Route path="leave" element={<Leave />} />
                {/* Team Member Profile inside Profile */}
                <Route path=":id" element={<TeamProfilePage />} />

                
              </Route>
              <Route path="/projects/view/:id" element={<ProjectDetail />}>
                  <Route path="overview" element={<Overview />} />
                  <Route path="TaskList" element={<TaskList />} />
                  <Route path="comments" element={<Comments />} />
                  <Route path="Files" element={<ProjectFiles />} />
                  <Route path="file" element={<FilesFile />} />
                  <Route path="filesCategory" element={<FilesCategory />} />
                  <Route path="kanban" element={<TaskKanban />} />
                  <Route path="timesheets" element={<Timesheets />} />
                  <Route path="timesheets_details" element={<TimesheetsDetails />} />
                  <Route path="timesheets_summary" element={<TimesheetsSummary />} />
                  <Route path="timesheets_chart" element={<TimesheetsChart />} />
                  <Route path="gantt" element={<Gantt />} />
                  <Route path="notes" element={<ProjectNotes />} />
                  <Route path="Expenses" element={<ProjectExpenses />} />
                  <Route path="milestones" element={<Milestones />} />
                  <Route path="Contracts" element={<Contracts />} />
                  <Route path="invoice" element={<Invoice />} />
                  <Route path="payments" element={<ProjectPayments />} />
                  <Route path="feedback" element={<Feedback />} />
                </Route>

                {hasAccess([27]) && (
              <>
                <Route path="/clients/view/:id" element={<ClientDetail />} >
                  <Route path="Contracts" element={<ClientContracts />} />
                  <Route path="event" element={<ClientEvent />} />
                  <Route path="files" element={<ClientFiles />} />
                  <Route path="expeses" element={<ClientExpeses />} />
                  <Route path="info" element={<Clientinfo />} />
                  <Route path="invoices" element={<ClientInvoices />} />
                  <Route path="notes" element={<ClientNotes />} />
                  <Route path="payments" element={<Clientpayments />} />
                  <Route path="contacts" element={<Contacts />} />
                  <Route path="estimaterequest" element={<EstimateRequests />} />
                  <Route path="estimates" element={<Estimates />} />
                  <Route path="orders" element={<ClientOrders />} />
                  <Route path="projects" element={<ClientsProjects />} />
                  <Route path="proposals" element={<Proposals />} />
                  <Route path="tasks" element={<ClientTasks />} />
                  <Route path="tickets" element={<ClientTickets />} />
                </Route>
                </>
            )}    
            <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
            <Outlet />
          </div>
        )}
      </div>
    </div>
  );
};

export default MainLayout;