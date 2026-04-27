let activeRegistration = null;
const statusEl = document.getElementById('status');
const tokenEl = document.getElementById('token-display');
const permissionBtn = document.getElementById('permission-btn');
const tokenBtn = document.getElementById('token-btn');

// Initialize Firebase using the shared config from firebase-config.js
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

async function init() {
    if ('serviceWorker' in navigator) {
        try {
            const currentScope = window.location.pathname.endsWith('/') 
                ? window.location.pathname 
                : window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);

            // Store the specific registration instance to be used by Firebase
            activeRegistration = await navigator.serviceWorker.register('sw.js', { scope: currentScope });
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

/**
 * Checks current notification permission status and updates the UI visibility/text.
 */
function checkPermission() {
    if (Notification.permission === 'granted') {
        statusEl.textContent = 'Permission Granted';
        permissionBtn.style.display = 'none';
        tokenBtn.style.display = 'inline-block';
    } else if (Notification.permission !== 'default') {
        statusEl.textContent = 'Permission Denied';
        permissionBtn.style.display = 'none';
        tokenBtn.style.display = 'none';
    } else {
        statusEl.textContent = 'Permission Required';
        permissionBtn.style.display = 'inline-block';
        tokenBtn.style.display = 'none';
    }
}

/**
 * Triggers the browser native notification permission prompt.
 */
async function requestPermission() {
    try {
        const permission = await Notification.requestPermission();
        checkPermission();
    } catch (err) {
        console.error('Error requesting permission:', err);
        statusEl.textContent = 'Error during permission request';
    }
}

/**
 * Fetches the FCM registration token using the registered service worker.
 */
async function requestToken() {
    try {
        // Use the specific registration we captured during init to avoid undefined errors
        if (!activeRegistration) {
            throw new Error('Service Worker not registered');
        }

        const token = await messaging.getToken({
            serviceWorkerRegistration: activeRegistration,
            vapidKey: firebaseConfig.vapidKey
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

// UI Orchestration through event listeners
permissionBtn.addEventListener('click', requestPermission);
tokenBtn.addEventListener('click', requestToken);

init();
