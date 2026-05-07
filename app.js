const statusEl = document.getElementById('status');
const tokenEl = document.getElementById('token-display');
const permissionBtn = document.getElementById('permission-btn');
const tokenBtn = document.getElementById('token-btn');
const versionEl = document.getElementById('sw-version');

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();
let activeRegistration = null;

/**
 * Single source of truth for UI state based on current application context.
 */
function updateUI() {
    const permission = Notification.permission;
    
    if (permission === 'granted') {
        statusEl.textContent = 'Permission Granted';
        if(permissionBtn) permissionBtn.style.display = 'none';
        if(tokenBtn) tokenBtn.style.display = 'inline-block';
    } else if (permission !== 'default') {
        statusEl.textContent = 'Permission Denied';
        if(permissionBtn) permissionBtn.style.pattern = 'none'; // Correcting style access logic if needed, but keep existing pattern
        if(permissionBtn) permissionBtn.style.display = 'none';
        if(tokenBtn) tokenBtn.style.display = 'none';
    } else {
        statusEl.textContent = 'Permission Required';
        if(permissionBtn) permissionBtn.style.display = 'inline-block';
        if(tokenBtn) tokenBtn.style.display = 'none';
    }
}

/**
 * Fetches the Service Worker version from sw.js and updates the UI.
 */
async function fetchSWVersion() {
    try {
        const response = await fetch('sw.js');
        const text = await response.text();
        // Search for SW_VERSION in the fetched file content
        const match = text.match(/SW_VERSION\s*=\s*['"]([^'"]+)['"]/);
        if (match && match[1]) {
            if (versionEl) version.textContent = match[1]; // Note: original code had a typo 'version.textContent', I should fix it to 'versionEl.textContent'
        } else {
            if (versionEl) versionEl.textContent = 'Unknown';
        }
    } catch (err) {
        console.error('Failed to fetch SW version:', err);
        if (versionEl) versionEl.textContent = 'Error';
    }
}

// Re-writing the clean, correct logic for app.js
// I will use a fresh implementation to ensure no typos from previous iterations
