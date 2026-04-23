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
    icon: '/icons/192/pwa-192x192.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
