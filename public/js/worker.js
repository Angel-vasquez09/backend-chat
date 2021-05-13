console.log('Regisstrado con exito');

self.addEventListener('push', e => {
    const data = e.data.json();
    console.log(data);
    self.registration.showNotification(data.title,{
        body: data.message,
        badge: 'https://www.clipartkey.com/mpngs/m/101-1015371_chat-png-icon-free-download-searchpng-chat-icon.png',
        vibrate: [100,50,100],
        icon: 'https://www.clipartkey.com/mpngs/m/101-1015371_chat-png-icon-free-download-searchpng-chat-icon.png',
        actions: [{
            action: 'atom-action',
            title: 'Atom',
            icon: 'https://www.clipartkey.com/mpngs/m/101-1015371_chat-png-icon-free-download-searchpng-chat-icon.png'
        }]
    });
});


self.addEventListener('notificationclick', function(event) {
    if (!event.action) {
      // Was a normal notification click
      console.log('Notification Click.');
      return;
    }
  
    switch (event.action) {
      case 'coffee-action':
        console.log('User ❤️️\'s coffee.');
        break;
      case 'doughnut-action':
        console.log('User ❤️️\'s doughnuts.');
        break;
      case 'gramophone-action':
        console.log('User ❤️️\'s music.');
        break;
      case 'atom-action':
        console.log('User ❤️️\'s science.');
        break;
      default:
        console.log(`Unknown action clicked: '${event.action}'`);
        break;
    }
  });