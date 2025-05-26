const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Notification = require('../models/notification.model');
const NotificationPreference = require('../models/notificationPreference.model');
const User = require('../models/user.model');
const { sendEmailNotification } = require('../services/email.service');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Notification.deleteMany({});
  await NotificationPreference.deleteMany({});
  await User.deleteMany({});
});

describe('Notification System', () => {
  let testUser;
  let testPreferences;

  beforeEach(async () => {
    // Create test user
    testUser = await User.create({
      clerkId: 'test-clerk-id',
      email: 'test@example.com',
      role: 'client'
    });

    // Create test preferences
    testPreferences = await NotificationPreference.create({
      user: testUser._id,
      email: {
        enabled: true,
        types: {
          booking_request: true
        }
      }
    });
  });

  describe('Notification Creation', () => {
    it('should create a new notification', async () => {
      const notification = await Notification.create({
        recipient: testUser._id,
        type: 'booking_request',
        title: 'New Booking Request',
        message: 'You have received a new booking request',
        data: {
          bookingId: '123',
          clientName: 'John Doe'
        }
      });

      expect(notification).toBeDefined();
      expect(notification.recipient.toString()).toBe(testUser._id.toString());
      expect(notification.type).toBe('booking_request');
      expect(notification.read).toBe(false);
    });

    it('should create notification with priority', async () => {
      const notification = await Notification.create({
        recipient: testUser._id,
        type: 'security_alert',
        title: 'Security Alert',
        message: 'Unusual login attempt detected',
        priority: 'high'
      });

      expect(notification.priority).toBe('high');
    });
  });

  describe('Notification Preferences', () => {
    it('should respect email notification preferences', async () => {
      // Disable email notifications for booking requests
      await NotificationPreference.findOneAndUpdate(
        { user: testUser._id },
        { 'email.types.booking_request': false }
      );

      // Mock email service
      const mockSendEmail = jest.spyOn(require('../services/email.service'), 'sendEmailNotification');

      // Create notification
      await Notification.create({
        recipient: testUser._id,
        type: 'booking_request',
        title: 'New Booking Request',
        message: 'You have received a new booking request'
      });

      expect(mockSendEmail).not.toHaveBeenCalled();
    });

    it('should respect quiet hours', async () => {
      // Enable quiet hours
      await NotificationPreference.findOneAndUpdate(
        { user: testUser._id },
        {
          'quietHours.enabled': true,
          'quietHours.start': '22:00',
          'quietHours.end': '08:00',
          'quietHours.timezone': 'UTC'
        }
      );

      // Mock email service
      const mockSendEmail = jest.spyOn(require('../services/email.service'), 'sendEmailNotification');

      // Create notification during quiet hours
      const now = new Date();
      now.setHours(23, 0, 0, 0);
      jest.setSystemTime(now);

      await Notification.create({
        recipient: testUser._id,
        type: 'booking_request',
        title: 'New Booking Request',
        message: 'You have received a new booking request'
      });

      expect(mockSendEmail).not.toHaveBeenCalled();
    });
  });

  describe('Notification Management', () => {
    it('should mark notification as read', async () => {
      const notification = await Notification.create({
        recipient: testUser._id,
        type: 'booking_request',
        title: 'New Booking Request',
        message: 'You have received a new booking request'
      });

      notification.read = true;
      notification.readAt = new Date();
      await notification.save();

      const updatedNotification = await Notification.findById(notification._id);
      expect(updatedNotification.read).toBe(true);
      expect(updatedNotification.readAt).toBeDefined();
    });

    it('should delete notification', async () => {
      const notification = await Notification.create({
        recipient: testUser._id,
        type: 'booking_request',
        title: 'New Booking Request',
        message: 'You have received a new booking request'
      });

      await Notification.findByIdAndDelete(notification._id);
      const deletedNotification = await Notification.findById(notification._id);
      expect(deletedNotification).toBeNull();
    });
  });

  describe('Email Notifications', () => {
    it('should send email notification', async () => {
      // Mock nodemailer
      const mockSendMail = jest.fn();
      jest.mock('nodemailer', () => ({
        createTransport: () => ({
          sendMail: mockSendMail
        })
      }));

      await sendEmailNotification(
        testUser._id,
        'booking_request',
        {
          clientName: 'John Doe',
          serviceType: 'Painting',
          preferredDate: '2024-03-20',
          location: '123 Main St',
          bookingUrl: 'http://example.com/booking/123'
        }
      );

      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: testUser.email,
          subject: 'New Booking Request'
        })
      );
    });
  });
}); 