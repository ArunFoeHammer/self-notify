self-invalidate

onpush:
    self.registration.showNotification('SN Update', {
        body: 'A new push event was enough!',
        icon: '/icon.png'
    });
