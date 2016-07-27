function catchNetworkErrors (err) {
	if (err.message.indexOf('network timeout at') > -1) {
		console.warn('Fetch network error occurred', { message: err.message });
		return { ok: false };
	} else {
		throw err;
	}
}

export default function (url, opts) {
	let retriesLeft = opts.retry === undefined ? 3 : opts.retry;
	opts.retry = undefined;

	function fetchAttempt () {
		return fetch(url, opts)
			.catch(catchNetworkErrors)
			.then(res => {
				if (!res.ok && retriesLeft > 0) {
					retriesLeft--;
					return fetchAttempt();
				}
				return res;
			});
	}

	return fetchAttempt();
};
