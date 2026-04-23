self-invalidate

onpush:
    self.registration.showNotification('SN Update', {
        body: 'A new push event was enough!',
        icon: '/icons/192/pwa-192x192.png'
    });
