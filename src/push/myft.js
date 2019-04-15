/* global clients:false*/
import track from '../utils/track';

self.addEventListener('push', event => {

	let payload = event.data ? event.data.text() : '';
	let title = 'New article in your myFT page';
	let tag = 'next-myft-article';
	let icon = 'https://www.ft.com/__assets/creatives/icons/myft-logo-grey-pink-bg.png';
	let notificationData = {};
	let body;

	try {
		payload = JSON.parse(payload);
		if (payload.uuid) {
			tag = payload.uuid;
			notificationData.id = payload.uuid;
			title = payload.headline ? payload.headline : title;
			body: payload.subheading ? payload.subheading : body;
			icon = payload.mainImage ? payload.mainImage : icon;
		}
	} catch (e) {}

	event.waitUntil(new Promise(resolve => {
		try {
			track({
				category: 'push',
				action: 'shown',
				context: {
					type: notificationData.id ? 'story' : 'fallback',
					storyUuid: notificationData.id ? notificationData.id : null
				},
				content: { uuid: notificationData.id }
			});
		} catch (e) {}

		resolve(self.registration.showNotification(title, {
			requireInteraction: false,
			body,
			tag,
			icon,
			data: notificationData
		}));
	}));
});

self.addEventListener('notificationclick', ev => {
	// Android doesn't close the notification when you click on it
	// See: http://crbug.com/463146
	ev.notification.close();

	// This looks to see if the current window is already open and
	// focuses if it is
	ev.waitUntil(
		clients.matchAll({
			type: 'window'
		})
			.then(clientList => {
				let url;
				if (Notification.prototype.hasOwnProperty('data') && ev.notification.data.id) {
					url = '/content/' + ev.notification.data.id;
					if( ev.notification.data.segmentId ) {
						url += '?segmentId=' + ev.notification.data.segmentId;
					}
				} else {
					url = '/myft/following';
				}

				url = url + '#myft:notification:push';

				track({
					category: 'push',
					action: 'click',
					context: {
						url: 'https://next.ft.com' + url
					},
					content: { uuid: ev.notification.data ? ev.notification.data.id : 'default' }
				});

				for (let i = 0; i < clientList.length; i++) {
					let client = clientList[i];
					if (client.url.indexOf(url) > 0 && 'focus' in client) {
						return client.focus();
					}
				}
				if (clients.openWindow) {
					return clients.openWindow(url);
				}
			})
	);
});
