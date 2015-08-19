'use strict';

module.exports  = {
	init: function(flags) {
		if ('serviceWorker' in navigator) {
			if(flags.get('serviceWorkerExperiments')) {
				navigator.serviceWorker.register('./__sw.js');
			} else {
				navigator.serviceWorker.register('./__sw.js').then(function(registration){
					registration.unregister();
				});
			}
		}
	}
};