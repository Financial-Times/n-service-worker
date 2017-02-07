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

## Releasing n-service-worker

As service workers are potentially disastrous in their impact and difficult to roll back quickly, n-service-worker is one of the few parts of the next stack which has the concept of multiple qa environments. Releases happen in up to 4 stages (any of which can be skipped in a hurry/emergency).

When releasing changes to n-service-worker consider how likely your changes are to go wrong and whether unit tests provide adequate coverage. Discuss with QA if necessary and keep them informed about which 'environment' your planned release is at.

### How it works

Builds tagged with special tags and master builds push files named `__sw-{prod,canary,qa,master}.js` to s3. Feature flags are then used to toggle which one is installed for which users. The relevant flags are
- `swQAVariant` - multivariant flag used by QA to choose between any of the 4 service worker variants
- `swCanaryRelease` - forces a small percentage of users onto an experimental version of the service worker

### What triggers each kind of release
- All master builds release `/__sw-master.js`
- All tags of the form `qa-v{release number}` will release `/__sw-qa.js`
- All tags of the form `canary-v{release number}` will release `/__sw-canary.js`
- All tags of the form `prod-v{release number}` will release `/__sw-prod.js`
- All semver tags will result in a new release of the n-service-worker bower component (the bit that registers the service worker)

To move a version of the service worker through one or more stages of the release cycle, care must be taken to tag the same commit with the related `qa`, `canary` and `prod` tags

### Rolling back
Unfortunately it's still a manual process, but creating a new tag on the same commit as the last good version should do it.
// TODO - set up versioning in s3

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
