// models/Appointment.js
const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    gender: {
        type: String,
        required: true,
        enum: ['Male', 'Female', 'Other'], // Limit gender options
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    isStudent: {
        type: String,
        required: true,
        enum: ['Student', 'Non-Student'],
    },
    doctorName: {
        type: String,
        required: true, // To store doctor's name for easy access
    },
    specialty: {
        type: String,
        required: true, // To store doctor's specialty for easy access
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the user who booked the appointment
        ref: 'User', // Assumes you have a User model
        required: true, // Ensure that the appointment is linked to a user
    },
    date: {
        type: Date,
        required: true,
    },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

const Appointment = mongoose.model('Appointment', appointmentSchema);
module.exports = Appointment;
