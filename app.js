const statusEl = document.getElementById('status');
const tokenEl = document.getElementById('token-display');
const permissionBtn = document.getElementById('permission-btn');

// Initialize Firebase using the shared config from firebase-config.js
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

async function init() {
    if ('serviceWorker' in navigator) {
        try {
            // 1. Extract scope from current URI (same level as index.html)
            const swPath = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1) + 'sw.js';
            const scope = window.location.pathname.substring(0, window.location/pathname.lastIndexOf('/') + 1);
            
            // Actually, the requirement says "extracted from the URI, given we know it's on the same level as the index.html"
            // If it's at the root, scope is '/'. If it's in a subfolder, scope should be that folder.
            const currentScope = window.location.pathname.endsWith('/') 
                ? window.location.pathname 
                : window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);

            await navigator.serviceWorker.register('sw.js', { scope: currentScope });
            console.log('SW registered with scope:', currentScope);
            
            checkPermission();
        } catch (err) {
            console.error('SW registration failed:', err);
            statusEl.textContent = 'Service Worker Failed';
        }
    } else {
        statusEl.textContent = 'Service Workers not supported';
    }
}

async function checkPermission() {
    if (Notification.permission === 'granted') {
        statusEl.textContent = 'Permission Granted';
        requestToken();
    } else if (Notification.permission !== 'default') {
        statusEl.textContent = 'Permission Denied';
    } else {
        statusEl.textContent = 'Permission Required';
        permissionBtn.style.display = 'inline-block';
    }
}

async function requestToken() {
    try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            statusEl.textContent = 'Permission Granted';
            permissionBtn.style.display = 'none';
            await getTokenFromFirebase();
        } else {
            statusEl.textContent = 'Permission Denied';
            permissionBtn.style.display = 'none';
        }
    } catch (err) {
        console.error('Error requesting permission:', err);
        statusEl.textContent = 'Error during permission request';
    }
}

async function getTokenFromFirebase() {
    try {
        // 4. Ensure the correct service worker is passed as an argument
        const registration = await navigator.serviceWorker.ready;
        
        // 3. Use VAPID key from config (if available)
        const vapidKey = firebaseConfigWithVapid?.vapidKey || 'YOUR_VAPID_KEY';

        const token = await messaging.getToken({
            serviceWorkerRegistration: registration,
            vapidKey: vapidKey
        });

        if (token) {
            tokenEl.textContent = token;
            statusEl.textContent = 'Token Retrieved';
        } else {
            tokenEl.textContent = 'No token received.';
        }
    } catch (err) {
        console.error('Error retrieving token:', err);
        tokenEl.textContent = 'Error retrieving token: ' + err.message;
    }
}

permissionBtn.addEventListener('click', requestToken);

init();
