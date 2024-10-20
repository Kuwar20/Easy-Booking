export function register(config?: { onUpdate?: () => void; onSuccess?: () => void }) {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').then((registration) => {
            if (registration && registration.waiting) {
                handleUpdate(registration.waiting);
            }
            registration.onupdatefound = () => {
                const installingWorker = registration.installing;
                if (installingWorker) {
                    installingWorker.onstatechange = () => {
                        if (installingWorker.state === 'installed') {
                            if (navigator.serviceWorker.controller) {
                                console.log('New content is available; please refresh.');
                                if (config && config.onUpdate) {
                                    config.onUpdate();
                                }
                            } else {
                                console.log('Content is cached for offline use.');
                                if (config && config.onSuccess) {
                                    config.onSuccess();
                                }
                            }
                        }
                    };
                }
            };
        }).catch((error) => {
            console.error('Error during service worker registration:', error);
        });
    }
}

function handleUpdate(worker: ServiceWorker) {
    worker.onstatechange = () => {
        if (worker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
                console.log('New content is available; please refresh.');
            }
        }
    };
}
