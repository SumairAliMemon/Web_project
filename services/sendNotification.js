require('dotenv').config();
const nodemailer = require('nodemailer');

// Configure your email transport using environment variables
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,  // Fetch email from .env
    pass: process.env.EMAIL_PASS,  // Fetch password from .env
  },
});

// Function to send an email notification to the user
async function sendEmailNotification(user, movie, reminderType) {
  const mailOptions = {
    from: process.env.EMAIL_USER,  // Sender's email
    to: user.email,                // Recipient's email (user's email)
    subject: `Reminder: ${movie.title} - ${reminderType}`,
    text: `Hi ${user.username},\n\nThis is a reminder for the upcoming movie release: ${movie.title}.\n\nRelease Date: ${movie.releaseDate.toDateString()}\n\nDon't forget to watch the trailer or set your reminder for the release!`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Reminder email sent to ${user.email}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

module.exports = sendEmailNotification;
