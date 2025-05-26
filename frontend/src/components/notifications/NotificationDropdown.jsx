import React from 'react';
import { useNotifications } from './NotificationProvider';
import { formatDistanceToNow } from 'date-fns';
import { CheckIcon, TrashIcon } from '@heroicons/react/24/outline';

const NotificationDropdown = ({ onClose }) => {
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
  } = useNotifications();

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'booking_request':
        return '📅';
      case 'booking_accepted':
        return '✅';
      case 'booking_declined':
        return '❌';
      case 'booking_completed':
        return '🎉';
      case 'new_message':
        return '💬';
      case 'new_review':
        return '⭐';
      case 'review_response':
        return '💭';
      default:
        return '🔔';
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Notifications</h3>
          {notifications.length > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Mark all as read
            </button>
          )}
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No notifications
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification._id}
              className={`p-4 border-b hover:bg-gray-50 ${
                !notification.read ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-start">
                <span className="text-2xl mr-3">
                  {getNotificationIcon(notification.type)}
                </span>
                <div className="flex-1">
                  <p className="font-medium">{notification.title}</p>
                  <p className="text-sm text-gray-600">{notification.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatDistanceToNow(new Date(notification.createdAt), {
                      addSuffix: true
                    })}
                  </p>
                </div>
                <div className="flex space-x-2">
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification._id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <CheckIcon className="h-5 w-5" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notification._id)}
                    className="text-gray-400 hover:text-red-600"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown; 