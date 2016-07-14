const register = flags => {
	('serviceWorker' in navigator && flags.get('serviceWorker')) ?
		navigator.serviceWorker.register('/__sw.js') :
		Promise.resolve()
};

const unregister = () => {
	'serviceWorker' in navigator ?
		navigator.serviceWorker.getRegistration()
			.then(registration => registration ? registration.unregister() : Promise.resolve(false)) :
		Promise.resolve(false)
};

export { register, unregister };
