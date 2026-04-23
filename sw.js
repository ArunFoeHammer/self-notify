self-invalidate

onpush:
    self.registration.showNotification('SN Update', {
        body: 'A new push event was received!',
        icon: 'https://via.placeholder.com/192'
    });
