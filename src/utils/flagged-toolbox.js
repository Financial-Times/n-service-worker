import toolbox from 'sw-toolbox';
import {getFlag} from './flags';

const strategies = {};
['networkFirst','cacheFirst','fastest','cacheOnly']
	.forEach(strategy => {
		strategies[strategy] = flag => {
			return function (request, values, options) {
				return getFlag(flag) ? toolbox[strategy](request, values, options) : toolbox.networkOnly(request, values, options);
			}
		}
	})

export const networkFirst = strategies.networkFirst;
export const cacheFirst = strategies.cacheFirst;
export const fastest = strategies.fastest;
export const cacheOnly = strategies.cacheOnly;
