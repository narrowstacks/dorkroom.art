const CACHE_NAME = "dorkroom-cache-v1";
const urlsToCache = [
	"/",
	"/index.html",
	"/shared/colors.css",
	"/shared/common.css",
	"/home.css",
	"/media/github-mark-white.png",
];

self.addEventListener("install", function (event) {
	event.waitUntil(
		caches.open(CACHE_NAME).then(function (cache) {
			return cache.addAll(urlsToCache);
		})
	);
});

self.addEventListener("fetch", function (event) {
	event.respondWith(
		caches.match(event.request).then(function (response) {
			if (response) {
				return response;
			}
			return fetch(event.request);
		})
	);
});
