import cron from 'node-cron';  // Import node-cron to schedule tasks
import moment from 'moment';    // For date calculations
import { createExpense } from '../model/expense.model.js';  // Import the model to create recurring expenses
import db from '../config/db.js';  // Import the database connection

// Function to generate a cron expression based on repeat type (daily, weekly, monthly, yearly)
const generateCronExpression = (repeatEvery, repeatType) => {
  switch (repeatType) {
    case 'days':
      return `0 0 */${repeatEvery} * *`;  // Every X days
    case 'weeks':
      return `0 0 * * 0 */${repeatEvery}`;  // Every X weeks (0 means Sunday)
    case 'months':
      return `0 0 1 */${repeatEvery} *`;  // Every X months
    case 'years':
      return `0 0 1 1 */${repeatEvery}`;  // Every X years
    default:
      return '0 0 * * *';  // Default to daily if unknown repeat type
  }
};

// Function to start the recurring expense cron job
const startRecurringExpenseJob = (repeatEvery, repeatType) => {
  const cronExpression = generateCronExpression(repeatEvery, repeatType);  // Generate the cron expression based on user input

  cron.schedule(cronExpression, async () => {  // Schedule the cron job based on the generated cron expression
    console.log('Cron job running... Checking for recurring expenses...');
    
    try {
      // Query to get all recurring expenses where the next_recurring_date is <= today
      const query = 'SELECT * FROM _expenses WHERE next_recurring_date <= CURDATE() AND recurring = 1 AND deleted = 0';
      
      db.query(query, async (err, expenses) => {
        if (err) {
          console.error("Error fetching recurring expenses:", err);
          return;
        }

        // Loop through each recurring expense and create a new one
        for (let expense of expenses) {
          // Calculate the next recurring date based on repeat_every and repeat_type
          const nextDate = moment(expense.next_recurring_date)
            .add(expense.repeat_every, expense.repeat_type)
            .format('YYYY-MM-DD');
          
          const expenseData = {
            ...expense,
            next_recurring_date: nextDate,
            no_of_cycles_completed: expense.no_of_cycles_completed + 1,
          };

          // Create the new recurring expense
          await createExpense(expenseData);
          console.log(`Created recurring expense for expense ID: ${expense.id}`);
        }
      });
    } catch (error) {
      console.error('Error processing recurring expenses:', error);
    }
  });
};

// Exporting the function to start cron jobs with dynamic scheduling
export const startCronJobs = (repeatEvery, repeatType) => {
  console.log('Starting cron jobs...');
  startRecurringExpenseJob(repeatEvery, repeatType);  // Pass the repeat values to schedule the job dynamically
};
