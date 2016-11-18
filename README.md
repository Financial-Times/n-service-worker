# n-service-worker [![CircleCI](https://circleci.com/gh/Financial-Times/n-service-worker.svg?style=svg)](https://circleci.com/gh/Financial-Times/n-service-worker)

Global service worker component for next.ft.com

## Setup

Service workers need to be run over HTTPS. To avoid any nasty cert issues,
you'll need to [add the self-signed cert to your keychain]
(https://github.com/Financial-Times/next-router#https)

General workflow is

 * Choose an app you want to run the service worker against, e.g. `front-page`,
 configure it to run as https and serve the service worker locally

```
    cd next-front-page
    nht run --https --local-apps service-worker=3010
```

 * Also, run the service worker locally

```
    cd n-service-worker
    npm start
```

This will also start webpack's watch


## API

For most cases [sw-toolbox](http://googlechrome.github.io/sw-toolbox/docs/releases/v3.2.0/tutorial-api.html) is used to manage caches, but n-service-worker also provides a few other utilities

### flags

On each page load the service worker is passed the current set of feature flags. Depending on what you're using the flag to toggle on\off, it may not take effect until the next page load due to the service worker lifecycle

```javascript
import { getFlag } from './utils/flags'

if (getFlag('swUseSpecificCache')) {
	// do something
}
```

### precache/cache
sw-toolbox doesn't offer all features on its cache and precache utilities, so we offer enhanced versions

```javascript
import cache from './utils/cache';
import precache from './utils/precache';
// then use instead of toolbox.cache or toolbox.precache

```

### flagged caches
To turn on whether a particular request fetches from a cache or network, based on the value of a flag, use flagged-toolbox

```javascript
import {cacheFirst} from './utils/flagged-toolbox';

toolbox.get('/url', cacheFirst('flagname'));

```
