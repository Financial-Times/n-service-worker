/* global clients:false*/
import eagerFetch from '../utils/eager-fetch';
import track from '../utils/track';
import {getFlag} from '../utils/flags';

let title = 'New article in your myFT page';
const icon = 'https://next-geebee.ft.com/assets/icons/myft-logo-pink-bg.png';

let lastSentIds = [];

setInterval(() => {
	lastSentIds = [];
}, 1000 * 60 * 10);

self.addEventListener('push', ev => {
	if (!getFlag('enablePushNotifications')) {
		return;
	}

	let tag = 'next-myft-article';
	let notificationData = {};
	let body;

	function showDefaultNotification () {
		track({
			category: 'push',
			action: 'shown',
			context: {
				silent: false,
				type: 'default'
			},
			content: { uuid: notificationData.id }
		});

		return self.registration.showNotification(title, {
			requireInteraction: false,
			icon: icon,
			tag: tag,
			data: {
				id: ''
			}
		});
	};

	ev.waitUntil(
		eagerFetch('/myft/following.json?since=-1h', {
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			credentials: 'include'
		})
		.then(res => res.json())
		.then(data => {
			const waitPeriod = 60000;
			setTimeout(() => {
				if (data && data.length) {
					let index = 0;
					while (data[index] && data[index].id && lastSentIds.indexOf(data[index].id) >= 0) {
						index++;
					}
					if (data[index] && data[index].id) {
						lastSentIds.push(data[index].id);
						title = data[index].headline;
						body = data[index].subheading;
						tag = data[index].id;
						notificationData = { id: data[index].id };
					}
				}

				track({
					category: 'push',
					action: 'shown',
					context: {
						delay: waitPeriod
					},
					content: { uuid: notificationData.id }
				});

				return self.registration.showNotification(title, {
					requireInteraction: false,
					body: body,
					tag: tag,
					icon: icon,
					data: notificationData
				});
			}, waitPeriod)

		})
		.catch(showDefaultNotification)
	);

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
