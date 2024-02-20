/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-3b6963d6'], (function (workbox) { 'use strict';

  self.skipWaiting();
  workbox.clientsClaim();

  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */
  workbox.precacheAndRoute([{
    "url": "assets/app-f6b039fa.js",
    "revision": null
  }, {
    "url": "assets/banner-logo-28fb64d0.js",
    "revision": null
  }, {
    "url": "assets/Community-238e4faf.js",
    "revision": null
  }, {
    "url": "assets/community-39f2fd5d.js",
    "revision": null
  }, {
    "url": "assets/Community-9fc6eafb.css",
    "revision": null
  }, {
    "url": "assets/Guide-5d38c1cd.css",
    "revision": null
  }, {
    "url": "assets/Guide-aec8c6be.js",
    "revision": null
  }, {
    "url": "assets/Home-0c088d45.js",
    "revision": null
  }, {
    "url": "assets/Home-c0528c35.css",
    "revision": null
  }, {
    "url": "assets/index-55e10f2a.css",
    "revision": null
  }, {
    "url": "assets/Landing-030903f8.js",
    "revision": null
  }, {
    "url": "assets/Landing-5def14b2.css",
    "revision": null
  }, {
    "url": "assets/Map-885324d8.js",
    "revision": null
  }, {
    "url": "assets/Map-bedb3288.css",
    "revision": null
  }, {
    "url": "assets/Room-38a45b10.js",
    "revision": null
  }, {
    "url": "assets/Room-49d52900.css",
    "revision": null
  }, {
    "url": "assets/Session-53992172.js",
    "revision": null
  }, {
    "url": "assets/session-bffb1d77.js",
    "revision": null
  }, {
    "url": "assets/Session-d0a666d9.css",
    "revision": null
  }, {
    "url": "assets/Sponsor-a8b1b3ff.css",
    "revision": null
  }, {
    "url": "assets/Sponsor-c5870be1.js",
    "revision": null
  }, {
    "url": "assets/Sponsorship-c5f1f27e.js",
    "revision": null
  }, {
    "url": "assets/Sponsorship-da23f0b7.css",
    "revision": null
  }, {
    "url": "assets/Staff-6697bdfd.css",
    "revision": null
  }, {
    "url": "assets/Staff-c9c94998.js",
    "revision": null
  }, {
    "url": "assets/Topics-34ac06ed.css",
    "revision": null
  }, {
    "url": "assets/Topics-ed8fadcd.js",
    "revision": null
  }, {
    "url": "assets/Venue-79813d5d.js",
    "revision": null
  }, {
    "url": "assets/Venue-90f90259.css",
    "revision": null
  }, {
    "url": "assets/virtual_pwa-register-e54f4ba9.js",
    "revision": null
  }, {
    "url": "assets/workbox-window.prod.es5-dc90f814.js",
    "revision": null
  }, {
    "url": "en/community.html",
    "revision": "5c915d84303c9effe77d20c00d9a892b"
  }, {
    "url": "en/community/index.html",
    "revision": "77617957586949e763f9d7db472aad31"
  }, {
    "url": "en/index.html",
    "revision": "e005800723bf21d86bbf564765a73ba7"
  }, {
    "url": "en/landing.html",
    "revision": "4158e7bbf79283321b7589135ee6fa35"
  }, {
    "url": "en/landing/index.html",
    "revision": "e3ad3b6816268f9cfa4753337a9d4c9e"
  }, {
    "url": "en/map.html",
    "revision": "627939a34ecfbe7131639875ba3d56b1"
  }, {
    "url": "en/map/index.html",
    "revision": "627939a34ecfbe7131639875ba3d56b1"
  }, {
    "url": "en/room.html",
    "revision": "0d842fc0b7f1b7499816556a47b1f5a1"
  }, {
    "url": "en/room/index.html",
    "revision": "0d842fc0b7f1b7499816556a47b1f5a1"
  }, {
    "url": "en/session.html",
    "revision": "592eee33ed1a8eea068f8f104c8e0fed"
  }, {
    "url": "en/sponsor.html",
    "revision": "d61968df4f9b8a899a011264d9ba7cf2"
  }, {
    "url": "en/sponsor/index.html",
    "revision": "d61968df4f9b8a899a011264d9ba7cf2"
  }, {
    "url": "en/sponsorship.html",
    "revision": "42105199a3d493ed273e32bd7d0f2530"
  }, {
    "url": "en/sponsorship/index.html",
    "revision": "42105199a3d493ed273e32bd7d0f2530"
  }, {
    "url": "en/staff.html",
    "revision": "ba273cba8b49062828546b4e7c123b38"
  }, {
    "url": "en/staff/index.html",
    "revision": "ba273cba8b49062828546b4e7c123b38"
  }, {
    "url": "en/venue.html",
    "revision": "e8add6ba0218bc1b3aff259cd4078577"
  }, {
    "url": "en/venue/index.html",
    "revision": "e8add6ba0218bc1b3aff259cd4078577"
  }, {
    "url": "index.html",
    "revision": "bd1f9486a936f5bb75ee563fee017a19"
  }, {
    "url": "zh-TW/community.html",
    "revision": "17128c88160b6e917d8e6a78de950d62"
  }, {
    "url": "zh-TW/community/index.html",
    "revision": "596f3c24f6d4f3f52d710696c94e5b80"
  }, {
    "url": "zh-TW/index.html",
    "revision": "38a5c159b742e183c940aaf4a87e1095"
  }, {
    "url": "zh-TW/landing.html",
    "revision": "80aeb9c5ed1874c0c844517d7f466342"
  }, {
    "url": "zh-TW/landing/index.html",
    "revision": "ebc54905425ffafe2cc224b7e918aa4a"
  }, {
    "url": "zh-TW/map.html",
    "revision": "544ec19c03f622b235a985dce801e5f3"
  }, {
    "url": "zh-TW/map/index.html",
    "revision": "544ec19c03f622b235a985dce801e5f3"
  }, {
    "url": "zh-TW/room.html",
    "revision": "b8580b170a415e47147bd10548e386e5"
  }, {
    "url": "zh-TW/room/index.html",
    "revision": "b8580b170a415e47147bd10548e386e5"
  }, {
    "url": "zh-TW/session.html",
    "revision": "9ff6c8149a8bfb7a4cc7f1c122b3bfd3"
  }, {
    "url": "zh-TW/sponsor.html",
    "revision": "539bc1fd9e4e3750236630a8b5b8b996"
  }, {
    "url": "zh-TW/sponsor/index.html",
    "revision": "539bc1fd9e4e3750236630a8b5b8b996"
  }, {
    "url": "zh-TW/sponsorship.html",
    "revision": "fb7ccedfd94c769287c734b920d54087"
  }, {
    "url": "zh-TW/sponsorship/index.html",
    "revision": "fb7ccedfd94c769287c734b920d54087"
  }, {
    "url": "zh-TW/staff.html",
    "revision": "e12a186eaf81c12b55234f2b89e4e14a"
  }, {
    "url": "zh-TW/staff/index.html",
    "revision": "e12a186eaf81c12b55234f2b89e4e14a"
  }, {
    "url": "zh-TW/venue.html",
    "revision": "3e475b67aec5656f23210b0a74073569"
  }, {
    "url": "zh-TW/venue/index.html",
    "revision": "3e475b67aec5656f23210b0a74073569"
  }, {
    "url": "favicon.svg",
    "revision": "481a70df0b95472a1f4b2223c1a6b8f5"
  }, {
    "url": "manifest.webmanifest",
    "revision": "8c75f3e785ec63f5510e3a7d0c61771b"
  }], {});
  workbox.cleanupOutdatedCaches();
  workbox.registerRoute(new workbox.NavigationRoute(workbox.createHandlerBoundToURL("index.html"), {
    denylist: [/.*\.(jpg|png|svg|json|js|xml|pdf)$/]
  }));
  workbox.registerRoute(/^https:\/\/script\.google\.com\/.*/i, new workbox.NetworkFirst({
    "cacheName": "room-status-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 2,
      maxAgeSeconds: 2592000
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200, 301]
    })]
  }), 'GET');
  workbox.registerRoute(/^https:\/\/coscup\.org\/2023\/json\/.*/i, new workbox.NetworkFirst({
    "cacheName": "json-data-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 10,
      maxAgeSeconds: 432000
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200, 301]
    })]
  }), 'GET');
  workbox.initialize({});

}));
