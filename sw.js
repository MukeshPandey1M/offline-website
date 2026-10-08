const CACHE_NAME =
    "offline-workspace-v1";


const FILES_TO_CACHE = [

    "/",

    "/index.html",

    "/style.css",

    "/app.js",

    "/offline.html",

    "/manifest.json"
];


self.addEventListener(
    "install",
    event => {

        event.waitUntil(

            caches.open(
                CACHE_NAME
            ).then(
                cache => {

                    return cache.addAll(
                        FILES_TO_CACHE
                    );

                }
            )

        );

        self.skipWaiting();
    }
);


self.addEventListener(
    "activate",
    event => {

        event.waitUntil(

            caches.keys()
                .then(
                    cacheNames => {

                        return Promise.all(

                            cacheNames
                                .filter(
                                    name =>
                                        name !==
                                        CACHE_NAME
                                )
                                .map(
                                    name =>
                                        caches.delete(
                                            name
                                        )
                                )

                        );

                    }
                )

        );

        self.clients.claim();
    }
);


self.addEventListener(
    "fetch",
    event => {

        if (
            event.request.method !==
            "GET"
        ) {

            return;
        }


        event.respondWith(

            fetch(event.request)
                .then(
                    response => {

                        const copy =
                            response.clone();

                        caches.open(
                            CACHE_NAME
                        ).then(
                            cache => {

                                cache.put(
                                    event.request,
                                    copy
                                );

                            }
                        );

                        return response;
                    }
                )
                .catch(

                    async () => {

                        const cached =
                            await caches.match(
                                event.request
                            );

                        if (cached) {

                            return cached;
                        }


                        if (
                            event.request.mode ===
                            "navigate"
                        ) {

                            return caches.match(
                                "/offline.html"
                            );
                        }


                        return new Response(
                            "Offline",
                            {
                                status: 503,
                                headers: {
                                    "Content-Type":
                                        "text/plain"
                                }
                            }
                        );
                    }

                )

        );
    }
);