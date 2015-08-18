'use strict';

module.exports  = {
	init: function(flags) {
		if ('serviceWorker' in navigator) {
			if(flags.serviceWorkerExperiments) {
				navigator.serviceWorker.register('./sw.js');
			} else {
				navigator.serviceWorker.register('./sw.js').then(function(registration){
					registration.unregister();
				});
			}
		}
	}
};
