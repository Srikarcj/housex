import toast from 'react-hot-toast';

class NotificationService {
  constructor() {
    this.subscribers = new Set();
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  notify(data) {
    this.subscribers.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error('Error in notification callback:', error);
      }
    });
  }

  // Booking-specific notifications
  notifyBookingCreated(booking) {
    toast.success(`New booking created for ${booking.serviceType}`);
    this.notify({
      type: 'booking_created',
      booking
    });
  }

  notifyBookingUpdated(booking) {
    toast.success(`Booking for ${booking.serviceType} has been updated`);
    this.notify({
      type: 'booking_updated',
      booking
    });
  }

  notifyBookingCancelled(booking) {
    toast.error(`Booking for ${booking.serviceType} has been cancelled`);
    this.notify({
      type: 'booking_cancelled',
      booking
    });
  }

  notifyBookingRescheduled(booking) {
    toast.success(`Booking for ${booking.serviceType} has been rescheduled`);
    this.notify({
      type: 'booking_rescheduled',
      booking
    });
  }

  notifyBookingStatusChanged(booking, oldStatus, newStatus) {
    const statusMessages = {
      [BOOKING_STATUS.PENDING]: 'is pending',
      [BOOKING_STATUS.ACCEPTED]: 'has been accepted',
      [BOOKING_STATUS.IN_PROGRESS]: 'is in progress',
      [BOOKING_STATUS.COMPLETED]: 'has been completed',
      [BOOKING_STATUS.CANCELLED]: 'has been cancelled'
    };

    toast.success(`Booking for ${booking.serviceType} ${statusMessages[newStatus]}`);
    this.notify({
      type: 'booking_status_changed',
      booking,
      oldStatus,
      newStatus
    });
  }

  notifyBookingConflict(booking) {
    toast.error(`Booking conflict detected for ${booking.serviceType}`);
    this.notify({
      type: 'booking_conflict',
      booking
    });
  }

  notifyBookingReminder(booking) {
    toast.success(`Reminder: You have a booking for ${booking.serviceType} coming up`);
    this.notify({
      type: 'booking_reminder',
      booking
    });
  }

  notifyError(message) {
    toast.error(message);
    this.notify({
      type: 'error',
      message
    });
  }
}

// Create a singleton instance
const notificationService = new NotificationService();

export default notificationService; 