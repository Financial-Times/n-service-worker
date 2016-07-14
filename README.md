# n-service-worker

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
