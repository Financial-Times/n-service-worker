# n-service-worker [![CircleCI](https://circleci.com/gh/Financial-Times/n-service-worker.svg?style=svg)](https://circleci.com/gh/Financial-Times/n-service-worker)

⚠️ This component is deprecated. Please only commit bug and security patches to this repo. Do not integrate it in new implementation without a preliminary discussion with the Code Owner ⚠️

Global service worker component for next.ft.com

## Installation

`npm install --save @financial-times/n-service-worker`

## Setup

Service workers need to be run over HTTPS. To avoid any nasty cert issues,
you'll need to [add the self-signed cert to your keychain]
(https://github.com/Financial-Times/next-router#https)

General workflow is

- Choose an app you want to run the service worker against, e.g. `front-page`,
  configure it to run as https and serve the service worker locally

```
	cd next-front-page
	nht run --https --local-apps service-worker=3010
```

- Also, run the service worker locally

```
	cd n-service-worker
	npm start
```

This will also start webpack's watch

## Releasing n-service-worker

As service workers are potentially disastrous in their impact and difficult to roll back quickly, n-service-worker is one of the few parts of the next stack which has the concept of multiple qa environments. Releases happen in up to 4 stages (any of which can be skipped in a hurry/emergency).

When releasing changes to n-service-worker consider how likely your changes are to go wrong and whether unit tests provide adequate coverage.

### Releasing the component

If you're only changing `main.js`, or the templates, this is just a normal component release. To get it into prod create a semver tag on this repo.

### Releasing the service worker

Builds tagged with special tags and `main` builds push files named `__sw-{prod,canary,qa,main}.js` to s3. Feature flags are then used to toggle which one is installed for which users. The relevant flags are

- `swQAVariant` - multivariant flag used by QA to choose between any of the 4 service worker variants
- `swCanaryRelease` - forces a small percentage of users onto an experimental version of the service worker

#### What triggers each kind of release

- All main builds release `/__sw-main.js`
- All tags of the form `qa-v{release number}` will release `/__sw-qa.js`
- All tags of the form `canary-v{release number}` will release `/__sw-canary.js`
- All tags of the form `prod-v{release number}` will release `/__sw-prod.js`
- All semver tags will result in a new release of the n-service-worker component (the bit that registers the service worker)

#### Should I use semver for the releases?

- For releasing the component (i.e. tags of the form `v1.2.3`)... yes, always use semver
- For the prod/qa/canary releases use an incremental integer
  - if the last prod release was `prod-v7`, but the last qa release was `qa-v3`, and you need to create a qa release, make it `qa-v8` so that when it gets to prod, the prod tage can be `prod-v8`

To move a version of the service worker through one or more stages of the release cycle, care must be taken to tag the same commit with the related `qa`, `canary` and `prod` tags

#### Rolling back

Unfortunately it's still a manual process, but creating a new tag on the same commit as the last good version should do it.
// TODO - set up versioning in s3

## API

For most cases [sw-toolbox](http://googlechrome.github.io/sw-toolbox/docs/releases/v3.2.0/tutorial-api.html) is used to manage caches, but n-service-worker also provides a few other utilities

### flags

On each page load the service worker is passed the current set of feature flags. Depending on what you're using the flag to toggle on\off, it may not take effect until the next page load due to the service worker lifecycle

```javascript
import { getFlag } from "./utils/flags";

if (getFlag("swUseSpecificCache")) {
  // do something
}
```

### precache/cache

sw-toolbox doesn't offer all features on its cache and precache utilities, so we offer enhanced versions

```javascript
import cache from "./utils/cache";
import precache from "./utils/precache";
// then use instead of toolbox.cache or toolbox.precache
```

### flagged caches

To turn on whether a particular request fetches from a cache or network, based on the value of a flag, use the getHandler function from utils/handlers

```javascript
import { getHandler } from "./utils/handlers";

const myHandler = getHandler({ flag: "swAdsCaching", strategy: "cacheFirst" });

toolbox.get("/url", myHandler);
```
test
