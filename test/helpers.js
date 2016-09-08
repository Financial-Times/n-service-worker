import idb from 'idb';

window.SWTestHelper = {
  createNewIframe: function() {
    return new Promise((resolve, reject) => {
      var newIframe = document.createElement('iframe');
      newIframe.classList.add('js-test-iframe');
      newIframe.src = '/test-iframe/' + Math.random();
      newIframe.addEventListener('load', () => {
        resolve(newIframe);
      });
      document.body.appendChild(newIframe);
    });
  },

  resetEnv: function () {
    return Promise.all([
      this.unregisterAllRegistrations(),
      this.clearAllCaches()
    ])
    .then(() => {
      var iframeList = document.querySelectorAll('.js-test-iframe');
      for (var i = 0; i < iframeList.length; i++) {
        iframeList[i].parentElement.removeChild(iframeList[i]);
      }
    }).catch()
  },

  unregisterAllRegistrations: function() {
    return navigator.serviceWorker.getRegistrations()
      .then((registrations) => {
        if (registrations.length === 0) {
          return;
        }

        var unregisterPromises = [];
        for (var i = 0; i < registrations.length; i++) {
          unregisterPromises.push(
            registrations[i].unregister()
              .then((success) => {
                if (!success) {
                  console.warn('Unable to unregister a SW.');
                } else {
                  console.warn('unregister a SW.');
                }
              })
          );
        }
        return Promise.all(unregisterPromises);
      });
  },

  clearAllCaches: function() {
    return window.caches.keys()
      .then((cacheNames) => {
        if (cacheNames.length === 0) {
          return;
        }

        return Promise.all(cacheNames.map(name => {
          return Promise.all([
            window.caches.delete(name)
              .then((success) => {
                if (!success) {
                  throw new Error('Unable to delete cache');
                }
              }),
            idb.open(name).then(db => {
              try {
                const tx = db.transaction('requests', 'readwrite')
                tx.objectStore('requests').clear()
                return tx.complete;
              } catch (e) {}
            })
          ])
        }))
      });
  },

  installSW: function(swFile, waitForState = 'activated') {
    return new Promise((resolve, reject) => {
      var options = {scope: './'};
      var iframe = document.querySelector('.js-test-iframe');
      if (iframe) {
        options = {scope: iframe.contentWindow.location.pathname};
      }
      navigator.serviceWorker.getRegistrations()
        .then(registrations => {
          if (registrations.length) {
            throw new Error('service worker already installed.');
          }
        })
        .then(() => navigator.serviceWorker.register(swFile, options))
        .then(registration => {

          function claim (registration) {
            const messageChannel = new MessageChannel();
            // Handler for recieving message reply from service worker
            messageChannel.port1.onmessage = ev => {
              if (ev.data.error) {
                reject(ev.data.error);
              } else {
                resolve();
              }
            };
            // Send message to service worker along with port for reply
            registration.active.postMessage({type: 'claim'}, [messageChannel.port2]);
          }

          // weirdly, when re-registering a service worker that was previously unregistered
          // the installing steps get skipped
          if (registration.active) {
            claim(registration);
          } else if (registration.installing) {
            registration.installing.onstatechange = function() {
              if (this.state === waitForState) {
                if (waitForState === 'activated') {
                  navigator.serviceWorker.ready
                    .then(claim)
                } else {
                  resolve();
                }
              }
            }
          } else {
            reject('No idea what happened')
          }
        })
        .catch((err) => {
          console.log('Error with ' + swFile, err);
          reject(err);
        })


    });
  },

  getAllCachedAssets: function(cacheName) {
    var cache = null;
    return window.caches.keys()
      .then((cacheKeys) => {
        if (cacheKeys.indexOf(cacheName) < 0) {
          throw new Error('Cache doesn\'t exist.');
        }

        return window.caches.open(cacheName);
      })
      .then((openedCache) => {
        cache = openedCache;
        return cache.keys();
      })
      .then((cacheKeys) => {
        return Promise.all(cacheKeys.map((cacheKey) => {
          return cache.match(cacheKey);
        }));
      })
      .then((cacheResponses) => {
        // This method extracts the response streams and pairs
        // them with a url.
        return Promise.all(cacheResponses.map((response) => {
          return response.text().then((text) => {
            return {
              url: response.url,
              text: text
            };
          });
        }));
      })
      .then((responseTexts) => {
        // This converts url, value pairs in an array to an Object
        // of urls with text values. Makes comparisons a little
        // easier in tests
        var output = {};
        for (var i = 0; i < responseTexts.length; i++) {
          var cachedResponse = responseTexts[i];
          output[cachedResponse.url] = cachedResponse.text;
        }
        return output;
      });
  }
};
