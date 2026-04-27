const statusEl = document.getElementById('status');
const tokenEl = document.getElementById('token-display');
const permissionBtn = document.getElementById('permission-btn');

// Initialize Firebase using the shared config from firebase-config.js
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

async function init() {
    if ('serviceWorker' in navigator) {
        try {
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
        permissionBtn.style.display = 'none';
    } else {
        statusEl.textContent = 'Permission Required';
        permissionBtn.style.display = 'inline-block';
    }
}

async function requestPermission() {
    try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            statusEl.textContent = 'Permission Granted';
            permissionBtn.style.display = 'none';
            requestToken();
        } else {
            statusEl.textContent = 'Permission Denied';
            permissionBtn.style.display = 'none';
        }
    } catch (err) {
        console.error('Error requesting permission:', err);
        statusEl.textContent = 'Error during permission request';
    }
}

async function requestToken() {
    try {
        const registration = await navigator.serviceWorker.ready;
        const token = await messaging.getToken({
            serviceWorkerRegistration: registration,
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

permissionBtn.addEventListener('click', requestPermission);

init();
