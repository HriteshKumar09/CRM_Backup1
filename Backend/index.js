import express from "express"; 
import dotenv from "dotenv"; 
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from 'express-fileupload';

dotenv.config(); // ✅ Load environment variables at the very top

import { authenticate } from "./middleware/authenticate.js"; 
import userRoutes from './routes/user.route.js';
import userAuthRoutes from "./routes/userAuth.route.js";
import blacklistRoutes from "./routes/blacklist.routes.js"; // Import the blacklist routes
import teamRoutes from './routes/team.route.js'; 
import timecardRoutes from './routes/timecardRoutes.js'; 
import leaveRoutes from './routes/leave.route.js'; 
import roleRoutes from "./routes/role.routes.js"; // Import role routes
import socialLinkRoutes from './routes/socialLinks.routes.js';
import jobInfoRoutes from './routes/jobInfo.routes.js'; 
import taskRoutes from './routes/tasks.route.js';
import projectRoutes from './routes/project.route.js';
import clientRoutes from './routes/clients.route.js';
import announcementRoutes from './routes/announcements.route.js';
import labelsRoutes from './routes/label.route.js'; // ✅ Import the new route
import pollRoutes from "./routes/polls.route.js"; 
import eventRoutes from "./routes/event.route.js";
import assetsRoutes from './routes/assets.route.js';
import messageRoutes from "./routes/message.route.js";
import leadRoutes from "./routes/leadRoutes.js";
import notesRoutes from './routes/notes.route.js'; 
import categoriesRoutes from './routes/categories.route.js';  
import taxesRoutes from './routes/taxes.route.js'; 
import expenseRoutes from './routes/expenses.route.js';             
import ticketRoutes from "./routes/tickets.route.js"; 
import estimateRoutes from "./routes/estimate.route.js"; // ✅ Import the new route
import notificationsRoutes from './routes/notifications.route.js';
import itemRoutes from './routes/item.route.js'; // ✅ Import the new route
import blockedIPsRoutes from "./routes/blockedIPs.routes.js";
import settingsRoutes from "./routes/settings.routes.js"; // Add settings routes
import companyRoutes from "./routes/company.routes.js"; // Add company routes
import paymentMethodsRoutes from "./routes/paymentMethods.route.js"; // Add payment methods routes
import leaveTypesRoutes from "./routes/leaveTypes.route.js"; // Add leave types routes
import expenseCategoriesRoutes from './routes/expenseCategories.route.js'; // Add expense categories routes

const app = express(); 

// ✅ Middleware to parse JSON request bodies
app.use(express.json());
app.use(cookieParser());

// ✅ Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

// ✅ File upload middleware
app.use(fileUpload({
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max file size
    createParentPath: true, // Create upload directory if it doesn't exist
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

// ✅ Middleware to enable CORS (Cookies support included)
app.use(cors({
    origin: 'http://localhost:3000',  // Ensure this matches your frontend URL
    methods: 'GET, POST, PUT, DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true  // ✅ Allow credentials (cookies, authorization headers)
}));

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// ✅ Define the port
const PORT = process.env.PORT || 4008;

// ✅ Routes for API endpoints (Avoiding duplicate `/api/users`)
app.use('/api/users', userRoutes);   // User-related routes
app.use("/api/auth", userAuthRoutes); // Changed route to avoid duplication
app.use('/api/team-members', teamRoutes);   
app.use('/api/timecards', timecardRoutes);  
app.use('/api/leaves', leaveRoutes);        
app.use('/api/social-links', socialLinkRoutes);
app.use('/api/job-info', jobInfoRoutes);     
app.use('/api/tasks', taskRoutes);           
// 🔹 Labels API Route
app.use("/api/labels", labelsRoutes);

app.use('/api', announcementRoutes);
app.use('/api', projectRoutes);              
app.use('/api', clientRoutes);               
app.use("/api/team-members", pollRoutes);    
app.use("/api/events", eventRoutes);
app.use('/api', assetsRoutes);
app.use("/api", leadRoutes);
app.use("/api/messages", messageRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api', categoriesRoutes);
app.use('/api', taxesRoutes);
app.use('/api', expenseRoutes);
app.use("/api", ticketRoutes);
app.use("/api/estimate", estimateRoutes); // ✅ New route for estimates
app.use('/api/notifications', notificationsRoutes);
app.use("/api/settings/roles", roleRoutes); // Correct path for role management
app.use('/api/items', itemRoutes);  // All item-related and category-related routes
app.use('/api/blacklist', blacklistRoutes);
app.use('/api/blocked-ips', blockedIPsRoutes);
app.use('/api/settings', settingsRoutes); // Add settings routes
// Mount company routes under settings
app.use('/api/settings/company', companyRoutes);
app.use('/api/payment-methods', paymentMethodsRoutes); // Updated path for payment methods routes
app.use('/api/leave-types', leaveTypesRoutes); // Add leave types routes
app.use('/api', expenseCategoriesRoutes); // Add expense categories routes

// ✅ Protected Routes (Example)
app.get('/dashboard', authenticate, (req, res) => {
    res.status(200).json({
        message: "Welcome to the dashboard!",
        user: req.user, 
    });
});

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong!' });
});

// ✅ Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server is listening on port ${PORT}`);
});
