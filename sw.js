importScripts('https://www.gstatic.com/firebasejs/12.12.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.12.1/firebase-messaging-compat.js');
importScripts('firebase-config.js');

// Change to force update of installed app in Android devices
const verion = "0.1.0"

// Initialize Firebase using the shared config from firebase-config.js
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Handle background notifications logic (data processing)
// We avoid calling showNotification here because the 'push' event listener 
// is our single source of truth for UI display, preventing duplicates.
messaging.onBackgroundMessage((payload) => {
  console.log('[sw.js] Received FCM background message payload:', payload);
});

// Single source of truth for UI notification display
// This handles both FCM-specific pushes and standard web push events
self.addEventListener('push', (event) => {
  console.log('[sw.js] Push event received');
  let data = {};
  
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      // Fallback for plain text payloads
      data = { title: 'New Notification', body: event.data.text() };
    }
  }

  // Extract title and body from nested FCM structure or top-level structure
  const notificationTitle = data.notification?.title || data.title || 'New Notification';
  const notificationOptions = {
    body: data.notification?.body || data.body || '',
    icon: 'icons/192/pwa-192x192.png',
    badge: 'icons/192/pwa-192x192.png' // Added badge for better Android integration
  };

  event.waitUntil(
    self.registration.showNotification(notificationTitle, notificationOptions)
  );
});

// Handle click on notification to focus the window
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      if (clientList.length > 0) {
        return clientList[0].focus();
      }
      return clients.openWindow('/');
    })
  );
});
