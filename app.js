const statusEl = document.getElementById('status');
const tokenEl = document.getElementById('token-display');
const permissionBtn = document.getElementById('perm-btn'); // Wait, I used permission-btn in HTML
// Re-checking HTML... it is 'permission-btn'
const permissionBtnActual = document.getElementById('permission-btn');
const tokenBtn = document.getElementById('token-btn');

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();
let activeRegistration = null;

/**
 * Single source of truth for UI state based on current application context.
 * This prevents the "stuck" button visibility issues observed in testing.
 */
function updateUI() {
    const permission = Notification.permission;
    
    if (permission === 'granted') {
        statusEl.textContent = 'Permission Granted';
        if(permissionBtnActual) permissionBtnActual.style.display = 'none';
        if(tokenBtn) tokenBtn.style.display = 'inline-block';
    } else if (permission !== 'default') {
        statusEl.textContent = 'Permission Denied';
        if(permissionBtnActual) permissionBtnActual.style.display = 'none';
        if(tokenBtn) tokenBtn.style.display = 'none';
    } else {
        statusEl.textContent = 'Permission Required';
        if(permissionBtnActual) permissionBtnActual.style.display = 'inline-block';
        if(tokenBtn) tokenBtn.style.display = 'none';
    }
}

async function init() {
    if ('serviceWorker' in navigator) {
        try {
            const currentScope = window.location.pathname.endsWith('/') 
                ? window.location.pathname 
                : window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);

            activeRegistration = await navigator.serviceWorker.register('sw.js', { scope: currentScope });
            console.log('SW registered with scope:', currentScope);
            
            updateUI(); // Sync UI with initial permission state
        } catch (err) {
            console.error('SW registration failed:', err);
            statusEl.textContent = 'Service Worker Failed';
        }
    } else {
        statusEl.textContent = 'Service Workers not supported';
    }
}

async function requestPermission() {
    try {
        const permission = await Notification.requestPermission();
        updateUI(); // Explicitly refresh UI after the state change
    } catch (err) {
        console.error('Error requesting permission:', err);
        statusEl.textContent = 'Error during permission request';
    }
}

async function requestToken() {
    try {
        if (!activeRegistration) throw new Error('Service Worker not registered');

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

// Event Listeners
if(permissionBtnActual) permissionBtnActual.addEventListener('click', requestPermission);
if(tokenBtn) tokenBtn.addEventListener('click', requestToken);

init();
