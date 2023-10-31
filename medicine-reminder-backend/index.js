// app.js
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cron = require("node-cron");
const Reminder = require("./Models/Reminder");
const cors = require("cors");
const corsOptions = {
  origin: "http://localhost:3000", // Replace with your frontend URL
};
const intervalTime = 10000; // Interval in milliseconds (e.g., every 10 seconds)

const app = express();
app.use(cors(corsOptions));

// Replace with your MongoDB connection string
mongoose.connect("mongodb://localhost/medicine-reminder", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());

// // Define a Mongoose schema for reminders in a separate file (models/Reminder.js)
// // Create a model for Reminder and export it

// // Schedule a job to check for due reminders every minute
// // Schedule a job to check for due reminders every minute
// // Schedule a job to check for due reminders every day at a specific time (e.g., 10:00 AM)
// cron.schedule('* * * * *', async () => {
//   const currentDateTime = new Date();

//   // Find reminders with a due time that matches the current time and that haven't been triggered
//   const dueReminders = await Reminder.find({
//     date: { $lte: currentDateTime.toISOString() },
//     triggered: false, // Add a 'triggered' field in your schema
//   });

//   if (dueReminders.length > 0) {
//     // Trigger alerts for due reminders (e.g., send email, push notification)
//     dueReminders.forEach(async (reminder) => {
//       // Implement your alert logic here
//       // For example, send an email or push notification to the user
//       console.log(`Alert for reminder: ${reminder.note}`);

//       // Update the reminder in the database to mark it as triggered
//       reminder.triggered = true;
//       await reminder.save();
//     });
//   }
// });

// Check for due reminders and send alerts at the specified time
// const checkReminders = async () => {
//   const currentDateTime = new Date();
//   const currentTime = currentDateTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

//   const dueReminders = await Reminder.find({
//     date: { $lte: currentDateTime.toISOString() },
//     time: currentTime, // Compare the time as a string without AM/PM
//     triggered: false,
//   });

//   dueReminders.forEach(async (reminder) => {
//     console.log(`Alert for reminder: ${reminder.note}`);
//     reminder.triggered = true;
//     await reminder.save();
//   });
// };

// // Schedule a timer to check for due reminders every minute
// setInterval(checkReminders, 60000); // 60000 milliseconds = 1 minute;

const checkReminders = async () => {
  const now = new Date();
  
  try {
    const dueReminders = await Reminder.find({
      date: { $lte: now },
      isReminded: false,
    });

    if (dueReminders.length > 0) {
      dueReminders.forEach(async (reminder) => {
        console.log(`Alert for reminder: ${reminder.note}`);
        
        // Mark the reminder as reminded
        reminder.isReminded = true;
        await reminder.save();
      });
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

setInterval(checkReminders, intervalTime);


// API endpoint to add a reminder
app.post("/api/reminders", async (req, res) => {
  try {
    const { note, date, time } = req.body;

    if (!note || !date || !time) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const newReminder = new Reminder({
      note,
      date,
      time,
    });

    const savedReminder = await newReminder.save();
    res.status(201).json(savedReminder);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while saving the reminder." });
  }
});


// Define a GET endpoint to retrieve time details
app.get('/api/time-details', async(req, res) => {
  try {
    const reminders = await Reminder.find({}); // Retrieve reminders from the database
    const timeDetails = reminders.map(reminder => [reminder.time,reminder.note]); // Extract 'time' from reminders
    //console.log('Time Details:', timeDetails);
    res.json(timeDetails); // Send the 'time' values to the frontend
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while retrieving time details.' });
  }
}); 
// code for send alerts on whatsapp,email etc 
// const accountSid = 'your_account_sid';
// const authToken = 'your_auth_token';
// const client = require('twilio')(accountSid, authToken);

// // Define the recipient's phone number and reminder message
// const to = 'whatsapp:+1234567890'; // Replace with the recipient's phone number
// const reminderMessage = 'Don't forget your appointment at 2 PM!';

// // Send a WhatsApp message
// client.messages
//   .create({
//     body: reminderMessage,
//     from: 'whatsapp:+0987654321', // Your WhatsApp number
//     to: to,
//   })
//   .then((message) => console.log('WhatsApp reminder sent:', message.sid))
//   .catch((error) => console.error('Error sending WhatsApp reminder:', error));


const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
