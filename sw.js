importScripts('https://www.gstatic.com/firebasejs/12.12.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.12.1/firebase-messaging-compat.js');
importScripts('firebase-config.js');

// Initialize Firebase using the shared config from firebase-config.js
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Handle background notifications
messaging.onBackgroundMessage((payload) => {
  console.log('[sw.js] Received background message ', payload);

  const notificationTitle = payload.notification?.title || 'New Notification';
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: 'icons/192/pwa-192x192.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle push event explicitly for better compatibility with some browsers
self.addEventListener('push', (event) => {
  console.log('[sw.js] Push event received');
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: 'New Notification', body: event.data.text() };
    }
  }

  const notificationTitle = data.notification?.title || data.title || 'New Notification';
  const notificationOptions = {
    body: data.notification?.body || data.body || '',
    icon: 'icons/192/pwa-192x192.png'
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
