// models/Reminder.js
const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  note: String,
  date: Date,
  time: String,
});

const Reminder = mongoose.model('Reminder', reminderSchema);

module.exports = Reminder;

