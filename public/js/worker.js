console.log('Regisstrado con exito');

self.addEventListener('push', e => {
    const data = e.data.json();
    console.log(data);
    self.registration.showNotification(data.title,{
        body: data.message,
        badge: 'https://www.clipartkey.com/mpngs/m/101-1015371_chat-png-icon-free-download-searchpng-chat-icon.png',
        vibrate: [100,50,100],
        icon: 'https://www.clipartkey.com/mpngs/m/101-1015371_chat-png-icon-free-download-searchpng-chat-icon.png',
        data: { 
          url: data.url
        }
    });
});


self.addEventListener('notificationclick', event => {
  event.notification.close();
  // recuperamos la url que pasamos en el options
  const { url } = event.notification.data;
  if (url) {
    event.waitUntil(clients.openWindow(url))
  };
});