/* global clients:false*/
import track from '../utils/track';

const myftIcon = 'https://www.ft.com/__assets/creatives/icons/myFT-logo-grey.png';

self.addEventListener('push', event => {
	let payload = JSON.parse(event.data);
	let title = payload.headline;
	let tag = payload.uuid;
	let notificationData = {
		id: payload.uuid
	};
	event.waitUntil(() => {
		try {
			track({
				category: 'push',
				action: 'shown',
				context: {
					storyUuid: notificationData.id
				},
				content: { uuid: notificationData.id }
			});
		} catch (e) {}

		return self.registration.showNotification(title, {
			requireInteraction: false,
			body: '',
			tag: tag,
			icon: myftIcon,
			data: notificationData
		});
	});
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
