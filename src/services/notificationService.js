/**
 * Service for handling browser notifications
 */

// Request notification permission
export const requestNotificationPermission = async () => {
  try {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }
    
    if (Notification.permission === 'granted') {
      return true;
    }
    
    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    
    return false;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
};

// Show a notification
export const showNotification = (title, options = {}) => {
  try {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return null;
    }
    
    const notification = new Notification(title, {
      icon: '/logo.png',
      badge: '/logo.png',
      ...options
    });
    
    return notification;
  } catch (error) {
    console.error('Error showing notification:', error);
    return null;
  }
};

// Schedule a water reminder notification
export const scheduleWaterReminder = (intervalMinutes = 60) => {
  try {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return null;
    }
    
    // Clear any existing reminder
    if (window.waterReminderId) {
      clearInterval(window.waterReminderId);
    }
    
    // Convert minutes to milliseconds
    const interval = intervalMinutes * 60 * 1000;
    
    // Schedule the notification
    const reminderId = setInterval(() => {
      showNotification('Hydration Reminder', {
        body: 'Time to drink some water! Stay hydrated for better health.',
        tag: 'water-reminder',
        requireInteraction: true,
        actions: [
          { action: 'log', title: 'Log 250ml' },
          { action: 'dismiss', title: 'Dismiss' }
        ]
      });
    }, interval);
    
    window.waterReminderId = reminderId;
    return reminderId;
  } catch (error) {
    console.error('Error scheduling water reminder:', error);
    return null;
  }
};

// Cancel a reminder
export const cancelReminder = (reminderId) => {
  try {
    if (reminderId) {
      clearInterval(reminderId);
    }
    
    if (window.waterReminderId) {
      clearInterval(window.waterReminderId);
      window.waterReminderId = null;
    }
    
    return true;
  } catch (error) {
    console.error('Error canceling reminder:', error);
    return false;
  }
};

export default {
  requestNotificationPermission,
  showNotification,
  scheduleWaterReminder,
  cancelReminder
}; 