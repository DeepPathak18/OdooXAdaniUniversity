const nodemailer = require('nodemailer');
let twilio = null;
try {
  // Twilio is optional — guard require so the app can run without the package
  twilio = require('twilio');
} catch (err) {
  console.warn('Twilio module not found; SMS functionality will be disabled. To enable SMS, run `npm install twilio`');
}
const User = require('../models/User');

/* =========================
   EMAIL TRANSPORTER
========================= */
const emailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/* =========================
   TWILIO CLIENT
========================= */
let twilioClient = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
}

/* =========================
   EMAIL NOTIFICATION
========================= */
const sendEmailNotification = async (to, subject, html, text) => {
  try {
    await emailTransporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
      text
    });
    console.log(`✅ Email sent to ${to}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return false;
  }
};

/* =========================
   SMS NOTIFICATION
========================= */
const sendSMSNotification = async (to, message) => {
  if (!twilioClient) {
    console.log('⚠️ Twilio not configured, skipping SMS');
    return false;
  }

  try {
    await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to
    });
    console.log(`✅ SMS sent to ${to}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending SMS:', error);
    return false;
  }
};

/* =========================
   PUSH NOTIFICATION
========================= */
const sendPushNotification = (io, userId, notification) => {
  try {
    if (!io) {
      console.log(`⚠️ Socket.IO instance not provided — skipping push for user ${userId}`);
      return false;
    }
    if (!userId) {
      console.log('⚠️ No userId provided for push notification — skipping');
      return false;
    }
    if (typeof io.to !== 'function') {
      console.log('⚠️ Provided io object does not support `to()` — skipping push');
      return false;
    }

    io.to(`user_${userId}`).emit('notification', notification);
    console.log(`✅ Push notification sent to user ${userId}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending push notification:', error);
    return false;
  }
};

/* =========================
   MAINTENANCE NOTIFICATIONS
========================= */
const sendMaintenanceRequestNotification = async (io, userId, requestData, type = 'assigned') => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    const notification = {
      id: Date.now(),
      type: 'maintenance_request',
      title: getNotificationTitle(type),
      message: getNotificationMessage(type, requestData),
      data: requestData,
      timestamp: new Date(),
      read: false
    };

    await sendEmailNotification(
      user.email,
      notification.title,
      `<h2>${notification.title}</h2><p>${notification.message}</p>`,
      notification.message
    );

    if (user.phoneNumber) {
      await sendSMSNotification(user.phoneNumber, notification.message);
    }

    sendPushNotification(io, userId, notification);

  } catch (error) {
    console.error('❌ Error sending maintenance notification:', error);
  }
};

/* =========================
   OVERDUE NOTIFICATION
========================= */
const sendOverdueNotification = async (io, userId, requestData) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    const notification = {
      id: Date.now(),
      type: 'overdue',
      title: 'Maintenance Request Overdue',
      message: `Maintenance request "${requestData.subject}" is overdue.`,
      data: requestData,
      timestamp: new Date(),
      read: false,
      urgent: true
    };

    await sendEmailNotification(
      user.email,
      notification.title,
      `<h2 style="color:red">${notification.title}</h2><p>${notification.message}</p>`,
      notification.message
    );

    if (user.phoneNumber) {
      await sendSMSNotification(user.phoneNumber, `URGENT: ${notification.message}`);
    }

    sendPushNotification(io, userId, notification);

  } catch (error) {
    console.error('❌ Error sending overdue notification:', error);
  }
};

/* =========================
   COMPLETION NOTIFICATION
========================= */
const sendCompletionNotification = async (io, userId, requestData) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    const notification = {
      id: Date.now(),
      type: 'completed',
      title: 'Maintenance Request Completed',
      message: `Maintenance request "${requestData.subject}" has been completed.`,
      data: requestData,
      timestamp: new Date(),
      read: false
    };

    await sendEmailNotification(
      user.email,
      notification.title,
      `<h2 style="color:green">${notification.title}</h2><p>${notification.message}</p>`,
      notification.message
    );

    sendPushNotification(io, userId, notification);

  } catch (error) {
    console.error('❌ Error sending completion notification:', error);
  }
};

/* =========================
   HELPERS
========================= */
const getNotificationTitle = (type) => {
  switch (type) {
    case 'assigned': return 'New Maintenance Request Assigned';
    case 'created': return 'Maintenance Request Created';
    case 'updated': return 'Maintenance Request Updated';
    default: return 'Maintenance Notification';
  }
};

const getNotificationMessage = (type, requestData) => {
  const subject = requestData.subject || 'Maintenance Request';
  switch (type) {
    case 'assigned': return `You have been assigned: "${subject}"`;
    case 'created': return `New request created: "${subject}"`;
    case 'updated': return `Request updated: "${subject}"`;
    default: return `Maintenance notification: "${subject}"`;
  }
};

module.exports = {
  sendMaintenanceRequestNotification,
  sendOverdueNotification,
  sendCompletionNotification,
  sendEmailNotification,
  sendSMSNotification,
  sendPushNotification
};
