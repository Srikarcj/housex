const nodemailer = require('nodemailer');
const NotificationPreference = require('../models/notificationPreference.model');
const User = require('../models/user.model');

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Email templates
const emailTemplates = {
  booking_request: {
    subject: 'New Booking Request',
    template: (data) => `
      <h2>New Booking Request</h2>
      <p>You have received a new booking request from ${data.clientName}.</p>
      <p>Service Type: ${data.serviceType}</p>
      <p>Preferred Date: ${data.preferredDate}</p>
      <p>Location: ${data.location}</p>
      <p><a href="${data.bookingUrl}">View Booking Details</a></p>
    `
  },
  booking_accepted: {
    subject: 'Booking Accepted',
    template: (data) => `
      <h2>Booking Accepted</h2>
      <p>Your booking request has been accepted by ${data.professionalName}.</p>
      <p>Service Type: ${data.serviceType}</p>
      <p>Scheduled Date: ${data.scheduledDate}</p>
      <p>Location: ${data.location}</p>
      <p><a href="${data.bookingUrl}">View Booking Details</a></p>
    `
  },
  // Add more email templates for other notification types
};

// Send email notification
const sendEmailNotification = async (userId, type, data) => {
  try {
    // Get user and their notification preferences
    const user = await User.findById(userId);
    const preferences = await NotificationPreference.findOne({ user: userId });

    if (!user || !preferences) {
      throw new Error('User or preferences not found');
    }

    // Check if email notifications are enabled for this type
    if (!preferences.email.enabled || !preferences.email.types[type]) {
      return;
    }

    // Check quiet hours
    if (preferences.quietHours.enabled) {
      const now = new Date();
      const userTime = new Date(now.toLocaleString('en-US', { timeZone: preferences.quietHours.timezone }));
      const [startHour, startMinute] = preferences.quietHours.start.split(':');
      const [endHour, endMinute] = preferences.quietHours.end.split(':');
      
      const startTime = new Date(userTime);
      startTime.setHours(parseInt(startHour), parseInt(startMinute), 0);
      
      const endTime = new Date(userTime);
      endTime.setHours(parseInt(endHour), parseInt(endMinute), 0);

      if (userTime >= startTime && userTime <= endTime) {
        return;
      }
    }

    // Get email template
    const template = emailTemplates[type];
    if (!template) {
      throw new Error(`No email template found for type: ${type}`);
    }

    // Send email
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: user.email,
      subject: template.subject,
      html: template.template(data)
    });

    console.log(`Email notification sent to ${user.email} for ${type}`);
  } catch (error) {
    console.error('Error sending email notification:', error);
    throw error;
  }
};

module.exports = {
  sendEmailNotification
}; 