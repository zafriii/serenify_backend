// const Appointment = require('../models/appointmentModel');
// const moment = require('moment'); // For date manipulation
// const Alert = require('../models/alertModel');

// const bookAppointment = async (req, res) => {
//     const { name, age, gender, email, phone, isStudent, doctorName, specialty, date } = req.body;
  
//     const baseFee = 500; // Base fee for the appointment
//     let discountPercentage = 0; // Initialize discount percentage
//     let finalFee; // To store the final fee after discount
//     let discountMessage = ''; // To store the discount message
//     let sameDayBookingMessage = ''; // Message for same day booking
//     let noSlotMessage = ''; // New variable for no slot message
  
//     try {
//       // Ensure the user is authenticated and has an ID (Assuming user is authenticated and `req.user._id` is available)
//       const userId = req.user._id;
  
//       // Check if the user already has an appointment with the same doctor on the same date
//       const existingUserAppointment = await Appointment.findOne({
//         email,
//         doctorName,
//         date: moment(date).format('YYYY-MM-DD'),
//         user: userId, // Make sure we are checking for the logged-in user
//       });
  
//       if (existingUserAppointment) {
//         sameDayBookingMessage = `You already have an appointment scheduled with ${doctorName} on ${moment(date).format('YYYY-MM-DD')}.`;
//         return res.status(400).json({ message: sameDayBookingMessage });
//       }
  
//       // Check how many appointments the doctor has on the specified date
//       const appointmentCount = await Appointment.countDocuments({
//         doctorName,
//         date: moment(date).format('YYYY-MM-DD'),
//       });
  
//       if (appointmentCount >= 5) {
//         // If there are already 5 appointments for the doctor on that date
//         const nextDay = moment(date).add(1, 'days').format('YYYY-MM-DD');
//         noSlotMessage = `Sorry, no slots available on ${moment(date).format('YYYY-MM-DD')}. Your appointment has been scheduled for ${nextDay}.`;
  
//         // Update date to the next available day
//         req.body.date = nextDay;
//       }
  
//       // Calculate discount and final fee based on user status (new or returning, student or not)
//       const existingAppointment = await Appointment.findOne({ email, user: userId });
  
//       if (!existingAppointment) {
//         if (isStudent === 'Student') {
//           discountPercentage = 100;
//           discountMessage = "Congratulations! Your first visit is free. For future bookings, you'll receive a 50% discount.";
//         } else {
//           discountPercentage = 20;
//           discountMessage = "You will receive a 20% discount on your first visit.";
//         }
//       } else {
//         if (isStudent === 'Student') {
//           discountPercentage = 50;
//           discountMessage = "Welcome back! You'll receive a 50% discount on your next visit.";
//         }
//       }
  
//       // Calculate the final fee after applying the discount
//       finalFee = baseFee - (baseFee * (discountPercentage / 100));
  
//       // Create a new appointment with the logged-in user reference
//       const newAppointment = new Appointment({
//         name,
//         age,
//         gender,
//         email,
//         phone,
//         isStudent,
//         doctorName,
//         specialty,
//         date: req.body.date, // Use the updated date here if rescheduled
//         fee: finalFee,
//         user: userId, // Link appointment to the logged-in user
//       });
  
//       // Save the new appointment to the database
//       await newAppointment.save();
  
//       // **Check if the appointment is today and send a notification**
//       const today = moment().format('YYYY-MM-DD');
//       const appointmentDate = moment(newAppointment.date).format('YYYY-MM-DD');
  
//       // if (appointmentDate === today) {
//       //   // Create a notification for the user to remind them of their appointment
//       //   const alert = new Alert({
//       //     user: userId, // The user who booked the appointment
//       //     message: `You have an appointment scheduled with  ${doctorName} today.`,
//       //     read:false
//       //   });
  
//       //   await alert.save();
        
//       // }


//       if (appointmentDate === today) {
//         // If the appointment is today, send the alert immediately
//         const alert = new Alert({
//             user: userId,
//             message: `You have an appointment scheduled with ${doctorName} today.`,
//             read: false
//         });
//         await alert.save();
//     } else if (moment(appointmentDate).isAfter(today)) {
//         // If the appointment is in the future, schedule the alert for the appointment date
//         const daysDifference = moment(appointmentDate).diff(moment(today), 'days');
        
//         // Schedule the alert to be sent on the appointment day
//         setTimeout(async () => {
//             const alert = new Alert({
//                 user: userId,
//                 message: `You have an appointment scheduled with ${doctorName} today.`,
//                 read: false
//             });
//             await alert.save();
//         }, daysDifference * 24 * 60 * 60 * 1000);  // Convert days to milliseconds
//     }

//       // Return the response with success message and the appointment details
//       res.status(201).json({
//         message: 'Appointment booked successfully!',
//         discountMessage,
//         noSlotMessage, // Send noSlotMessage if rescheduled
//         finalFee,
//         appointment: newAppointment,
//       });
  
//     } catch (error) {
//       console.error('Error booking appointment:', error);
//       res.status(500).json({ message: 'Failed to book appointment. Please try again.' });
//     }
//   };
  


// // Get booking details function
// const getBookingDetails = async (req, res) => {
//     try {
//         const userId = req.user._id;  // Assuming user is authenticated, using their ID from req.user

//         // Fetch all appointments for the logged-in user
//         const appointments = await Appointment.find({ user: userId }).populate('doctorName specialty user', 'name specialty email');

//         if (!appointments || appointments.length === 0) {
//             return res.status(404).json({ message: 'No appointments found.' });
//         }

//         // Return the appointments
//         res.status(200).json({ appointments });
//     } catch (error) {
//         console.error('Error fetching booking details:', error);
//         res.status(500).json({ message: 'Failed to fetch booking details. Please try again.' });
//     }
// };

// module.exports = { bookAppointment, getBookingDetails };




















const Appointment = require('../models/appointmentModel');
const moment = require('moment'); // For date manipulation
const Alert = require('../models/alertModel');
const nodemailer = require("nodemailer");

const bookAppointment = async (req, res) => {
  const { name, age, gender, email, phone, isStudent, doctorName, specialty, date } = req.body;

  const baseFee = 500; // Base fee for the appointment
  let discountPercentage = 0; // Initialize discount percentage
  let finalFee; // To store the final fee after discount
  let discountMessage = ''; // To store the discount message
  let sameDayBookingMessage = ''; // Message for same-day booking
  let noSlotMessage = ''; // New variable for no slot message

  try {
      const userId = req.user._id;

      // Check if the user already has an appointment with the same doctor on the same date
      const existingUserAppointment = await Appointment.findOne({
          email,
          doctorName,
          date: moment(date).format('YYYY-MM-DD'),
          user: userId,
      });

      if (existingUserAppointment) {
          sameDayBookingMessage = `You already have an appointment scheduled with ${doctorName} on ${moment(date).format('YYYY-MM-DD')}.`;
          return res.status(400).json({ message: sameDayBookingMessage });
      }

      // Check how many appointments the doctor has on the specified date
      const appointmentCount = await Appointment.countDocuments({
          doctorName,
          date: moment(date).format('YYYY-MM-DD'),
      });

      if (appointmentCount >= 5) {
          const nextDay = moment(date).add(1, 'days').format('YYYY-MM-DD');
          noSlotMessage = `Sorry, no slots available on ${moment(date).format('YYYY-MM-DD')}. Your appointment has been scheduled for ${nextDay}.`;
          req.body.date = nextDay;
      }

      const existingAppointment = await Appointment.findOne({ email, user: userId });

      if (!existingAppointment) {
          if (isStudent === 'Student') {
              discountPercentage = 100;
              discountMessage = "Congratulations! Your first visit is free. For future bookings, you'll receive a 50% discount.";
          } else {
              discountPercentage = 20;
              discountMessage = "You will receive a 20% discount on your first visit.";
          }
      } else {
          if (isStudent === 'Student') {
              discountPercentage = 50;
              discountMessage = "Welcome back! You'll receive a 50% discount on your next visit.";
          }
      }

      finalFee = baseFee - (baseFee * (discountPercentage / 100));

      const newAppointment = new Appointment({
          name,
          age,
          gender,
          email,
          phone,
          isStudent,
          doctorName,
          specialty,
          date: req.body.date,
          fee: finalFee,
          user: userId,
      });

      await newAppointment.save();

      const today = moment().format('YYYY-MM-DD');
      const appointmentDate = moment(newAppointment.date).format('YYYY-MM-DD');

      if (appointmentDate === today) {
          const alert = new Alert({
              user: userId,
              message: `You have an appointment scheduled with ${doctorName} today.`,
              read: false,
          });
          await alert.save();
      }

      // Generate OTP
      //const otp =  Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP

      // Send confirmation email with OTP
      const transporter = nodemailer.createTransport({
          service: "Gmail",
          secure: true,
          auth: {
              user: process.env.MY_GMAIL,
              pass: process.env.MY_PASSWORD,
          },
      });

      const mailOptions = {
          from: process.env.MY_GMAIL,
          to: email,
          subject: "Appointment Confirmation",
          text: `
              Dear ${name},

              Your appointment has been successfully booked with  ${doctorName} (${specialty}).
              Date: ${moment(newAppointment.date).format('YYYY-MM-DD')}
              Fee: ${finalFee} BDT

              Thank you for booking with us!
              
              If you're unable to attend for any reason, please let us know in advance.

              Regards,
              Serenify Appointment Management Team
          `,
      };

      await transporter.sendMail(mailOptions);

      return res.status(201).json({
          message: 'Appointment booked successfully! Confirmation email sent.',
          discountMessage,
          noSlotMessage,
          finalFee,
          appointment: newAppointment,
      });

  } catch (error) {
      console.error('Error booking appointment:', error);
      res.status(500).json({ message: 'Failed to book appointment. Please try again.' });
  }
};


// Get booking details function
const getBookingDetails = async (req, res) => {
    try {
        const userId = req.user._id;  // Assuming user is authenticated, using their ID from req.user

        // Fetch all appointments for the logged-in user
        const appointments = await Appointment.find({ user: userId }).populate('doctorName specialty user', 'name specialty email');

        if (!appointments || appointments.length === 0) {
            return res.status(404).json({ message: 'No appointments found.' });
        }

        // Return the appointments
        res.status(200).json({ appointments });
    } catch (error) {
        console.error('Error fetching booking details:', error);
        res.status(500).json({ message: 'Failed to fetch booking details. Please try again.' });
    }
};

module.exports = { bookAppointment, getBookingDetails };
