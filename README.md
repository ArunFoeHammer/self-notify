# SN

## Design Overview: Android PWA Self-Notification System

## Architecture Summary

A lightweight, serverless Progressive Web App (PWA) designed for Android that allows users to obtain a unique device token and receive push notifications via Firebase Cloud Messaging (FCM).

### Core Components:

1. **Hosting:** Static hosting (GitHub Pages/Firebase Hosting) providing HTTPS.
2. **Frontend:** HTML5/JS interface for token display and permission handling.
3. **Storage:** IndexedDB (via `idb-keyval`) for persistent, secure client-side storage of the FCM token.
4. **Push Engine:** Firebase Cloud Messaging (FCM) for delivery to Android devices.
5. **Background Handler:** Service Worker (`sw.js`) to intercept push events and show system notifications.

### Data Flow:

User opens PWA **→** App checks IndexedDB for existing token **→** If missing/expired, requests FCM token **→** Token is stored in IndexedDB and displayed on screen **→** External system sends POST request to FCM API using this token.
