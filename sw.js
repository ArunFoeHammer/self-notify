// Service Worker Version - Update this to trigger updates in the PWA
const SW_VERSION = '0.1.3';

importScripts('https://www.gstatic.com/firebasejs/12.12.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.12.1/firebase-messaging-compat.js');
importScripts('firebase-config.js');

// Initialize Firebase using the shared config from firebase-config.js
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Handle push event explicitly for better compatibility and single-source-of-truth
self.addEventListener('push', (event) => {
  console.log('[sw.js] Push event received. Service Worker version:', SW_VERSION);
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
    badge: 'icons/192/pwa-192x192.png' 
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
