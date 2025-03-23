import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { IoIosArrowDown, IoIosArrowForward } from 'react-icons/io';
import { FiSettings, FiLock, FiUsers, FiDollarSign, FiTool, FiGrid, FiHome } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import GeneralSettings from './components/AppSettings/GeneralSettings';
import LocalizationSettings from './components/AppSettings/LocalizationSettings';
import EmailSettings from './components/AppSettings/EmailSettings';
import EmailTemplates from './components/AppSettings/EmailTemplates';
import ModulesSettings from './components/AppSettings/ModulesSettings';
import LeftMenuSettings from './components/AppSettings/LeftMenuSettings';
import NotificationSettings from './components/AppSettings/NotificationSettings';
import IntegrationSettings from './components/AppSettings/IntegrationSettings';
import CronJobSettings from './components/AppSettings/CronJobSettings';
import UpdateSettings from './components/AppSettings/UpdateSettings';

import RoleSettings from './components/AccessPermission/RoleSettings';
import UserRoleSettings from './components/AccessPermission/UserRoleSettings';
import TeamSettings from './components/AccessPermission/TeamSettings';
import IPRestrictionSettings from './components/AccessPermission/IPRestrictionSettings';

import ClientPermissionSettings from './components/ClientPortal/ClientPermissionSettings';
import ClientDashboardSettings from './components/ClientPortal/DashboardSettings';
import ClientMenuSettings from './components/ClientPortal/MenuSettings';
import ProjectSettings from './components/ClientPortal/ProjectSettings';

// Sales & Prospects
import CompanySettings from './components/SalesProspects/CompanySettings';
import ItemCategoriesSettings from './components/SalesProspects/ItemCategoriesSettings';
import InvoiceSettings from './components/SalesProspects/InvoiceSettings';
import OrderSettings from './components/SalesProspects/OrderSettings';
import StoreSettings from './components/SalesProspects/StoreSettings';
import EstimatesSettings from './components/SalesProspects/EstimatesSettings';
import ProposalsSettings from './components/SalesProspects/ProposalsSettings';
import ContractsSettings from './components/SalesProspects/ContractsSettings';
import TaxesSettings from './components/SalesProspects/TaxesSettings';
import PaymentMethodsSettings from './components/SalesProspects/PaymentMethodsSettings';
import SubscriptionsSettings from './components/SalesProspects/SubscriptionsSettings';
import LeadsSettings from './components/SalesProspects/LeadsSettings';

// Setup
import CustomFieldsSettings from './components/Setup/CustomFieldsSettings';
import ClientGroupsSettings from './components/Setup/ClientGroupsSettings';
import TaskSettings from './components/Setup/TaskSettings';
import ProjectsSettings from './components/Setup/ProjectsSettings';
import TimesheetsSettings from './components/Setup/TimesheetsSettings';
import EventsSettings from './components/Setup/EventsSettings';
import ExpenseCategoriesSettings from './components/Setup/ExpenseCategoriesSettings';
import LeaveTypesSettings from './components/Setup/LeaveTypesSettings';
import TicketsSettings from './components/Setup/TicketsSettings';
import GDPRSettings from './components/Setup/GDPRSettings';
import PagesSettings from './components/Plugins/PagesSettings';

// Plugins
import AllPluginsSettings from './components/Plugins/AllPluginsSettings';
import ReCaptchaSettings from './components/Plugins/ReCaptchaSettings';
import GoogleDriveSettings from './components/Plugins/GoogleDriveSettings';

const Settings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedMenu, setExpandedMenu] = useState(() => {
    // Get initial expanded menu from localStorage or default to 'App Settings'
    return localStorage.getItem('settingsExpandedMenu') || 'App Settings';
  });
  const [activeTab, setActiveTab] = useState('General');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle initial navigation
  useEffect(() => {
    if (location.pathname === '/dashboard/settings') {
      navigate('/dashboard/settings/general');
    }
  }, [location, navigate]);

  // Update active tab based on current location
  useEffect(() => {
    const path = location.pathname.split('/').pop();
    if (path && path !== 'settings') {
      const tabName = path.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
      setActiveTab(tabName);
      // Clear loading state when navigation is complete
      setLoading(false);
    }
  }, [location]);

  // Save expanded menu state to localStorage
  useEffect(() => {
    localStorage.setItem('settingsExpandedMenu', expandedMenu);
  }, [expandedMenu]);

  const settingsConfig = {
    'App Settings': {
      icon: FiSettings,
      subMenus: [
        { name: 'General', path: 'general', component: GeneralSettings },
        { name: 'Localization', path: 'localization', component: LocalizationSettings },
        { name: 'Email', path: 'email', component: EmailSettings },
        { name: 'Email templates', path: 'email-templates', component: EmailTemplates },
        { name: 'Modules', path: 'modules', component: ModulesSettings },
        { name: 'Left menu', path: 'left-menu', component: LeftMenuSettings },
        { name: 'Notifications', path: 'notifications', component: NotificationSettings },
        { name: 'Integration', path: 'integration', component: IntegrationSettings },
        { name: 'Cron Job', path: 'cron-job', component: CronJobSettings },
        { name: 'Updates', path: 'updates', component: UpdateSettings }
      ]
    },
    'Access Permission': {
      icon: FiLock,
      subMenus: [
        { name: 'Roles', path: 'roles', component: RoleSettings },
        { name: 'User Roles', path: 'user-roles', component: UserRoleSettings },
        { name: 'Team', path: 'team', component: TeamSettings },
        { name: 'IP Restriction', path: 'ip-restriction', component: IPRestrictionSettings }
      ]
    },
    'Client Portal': {
      icon: FiUsers,
      subMenus: [
        { name: 'Client Permissions', path: 'client-permissions', component: ClientPermissionSettings },
        { name: 'Dashboard', path: 'dashboard', component: ClientDashboardSettings },
        { name: 'Left Menu', path: 'client-menu', component: ClientMenuSettings },
        { name: 'Projects', path: 'projects', component: ProjectSettings }
      ]
    },
    "Sales & Prospects": {
      icon: FiDollarSign,
      subMenus: [
        { name: "Company", path: "company", component: CompanySettings },
        { name: "Item Categories", path: "item-categories", component: ItemCategoriesSettings },
        { name: "Invoices", path: "invoices", component: InvoiceSettings },
        { name: "Orders", path: "orders", component: OrderSettings },
        { name: "Store", path: "store", component: StoreSettings },
        { name: "Estimates", path: "estimates", component: EstimatesSettings },
        { name: "Proposals", path: "proposals", component: ProposalsSettings },
        { name: "Contracts", path: "contracts", component: ContractsSettings },
        { name: "Taxes", path: "taxes", component: TaxesSettings },
        { name: "Payment Methods", path: "payment-methods", component: PaymentMethodsSettings },
        { name: "Subscriptions", path: "subscriptions", component: SubscriptionsSettings },
        { name: "Leads", path: "leads", component: LeadsSettings }
      ]
    },
    "Setup": {
      icon: FiTool,
      subMenus: [
        { name: "Custom Fields", path: "custom-fields", component: CustomFieldsSettings },
        { name: "Client Groups", path: "client-groups", component: ClientGroupsSettings },
        { name: "Tasks", path: "tasks", component: TaskSettings },
        { name: "Projects", path: "projects", component: ProjectsSettings },
        { name: "Timesheets", path: "timesheets", component: TimesheetsSettings },
        { name: "Events", path: "events", component: EventsSettings },
        { name: "Expense Categories", path: "expense-categories", component: ExpenseCategoriesSettings },
        { name: "Leave Types", path: "leave-types", component: LeaveTypesSettings },
        { name: "Tickets", path: "tickets", component: TicketsSettings },
        { name: "GDPR", path: "gdpr", component: GDPRSettings }
      ]
    },
    "Plugins": {
      icon: FiGrid,
      subMenus: [
        { name: "All Plugins", path: "all-plugins", component: AllPluginsSettings },
        { name: "reCAPTCHA", path: "recaptcha", component: ReCaptchaSettings },
        { name: "Google Drive", path: "google-drive", component: GoogleDriveSettings },
        { name: "Pages", path: "pages", component: PagesSettings }
      ]
    }
  };

  const handleMenuClick = (menuName) => {
    setExpandedMenu(expandedMenu === menuName ? '' : menuName);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setLoading(true);
    setError(null);
    const path = tab.toLowerCase().replace(/ /g, '-');
    navigate(`/dashboard/settings/${path}`);
  };

  // Get breadcrumb data
  const getBreadcrumbData = () => {
    const pathParts = location.pathname.split('/').filter(Boolean);
    const currentPath = pathParts[pathParts.length - 1];
    
    // Find the menu and submenu that contains this path
    for (const [menuName, menuData] of Object.entries(settingsConfig)) {
      const subMenu = menuData.subMenus.find(sub => sub.path === currentPath);
      if (subMenu) {
        return {
          menu: menuName,
          subMenu: subMenu.name
        };
      }
    }
    return { menu: '', subMenu: '' };
  };

  const { menu, subMenu } = getBreadcrumbData();

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-900">
      {/* Left Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        {Object.entries(settingsConfig).map(([moduleName, moduleData]) => (
          <div key={moduleName} className="border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => handleMenuClick(moduleName)}
              className="flex items-center justify-between w-full px-4 py-3 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <span className="flex items-center">
                {moduleData.icon && <moduleData.icon className="w-4 h-4 mr-2" />}
                <span className="font-medium">{moduleName}</span>
              </span>
              {expandedMenu === moduleName ? (
                <IoIosArrowDown className="w-4 h-4" />
              ) : (
                <IoIosArrowForward className="w-4 h-4" />
              )}
            </button>
            {expandedMenu === moduleName && (
              <div className="bg-gray-50 dark:bg-gray-700/50">
                {moduleData.subMenus.map((subMenu) => (
                  <button
                    key={subMenu.name}
                    onClick={() => handleTabClick(subMenu.name)}
                    className={`w-full px-6 py-2 text-left text-sm ${
                      activeTab === subMenu.name
                        ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400'
                        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600/50'
                    }`}
                  >
                    {subMenu.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 overflow-auto">
        {/* Breadcrumb Navigation */}
        <div className="mb-6 flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <Link to="/dashboard" className="flex items-center hover:text-blue-600 dark:hover:text-blue-400">
            <FiHome className="w-4 h-4 mr-1" />
            Dashboard
          </Link>
          <span>/</span>
          <Link to="/dashboard/settings" className="hover:text-blue-600 dark:hover:text-blue-400">
            Settings
          </Link>
          {menu && (
            <>
              <span>/</span>
              <span className="text-gray-700 dark:text-gray-300">{menu}</span>
            </>
          )}
          {subMenu && (
            <>
              <span>/</span>
              <span className="text-gray-700 dark:text-gray-300">{subMenu}</span>
            </>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Loading State - Only show during navigation */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          </div>
        )}

        {/* Routes */}
        <Routes>
          {/* Redirect root settings to general */}
          <Route path="/" element={<Navigate to="/dashboard/settings/general" replace />} />
          
          {/* Map all routes from the config */}
          {Object.values(settingsConfig).flatMap(moduleData =>
            moduleData.subMenus.map(subMenu => (
              <Route
                key={subMenu.path}
                path={subMenu.path}
                element={
                  <ErrorBoundary>
                    <subMenu.component />
                  </ErrorBoundary>
                }
              />
            ))
          )}
        </Routes>
      </div>
    </div>
  );
};

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Settings component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
          <h3 className="font-medium">Something went wrong</h3>
          <p className="text-sm mt-1">Please try refreshing the page</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default Settings;