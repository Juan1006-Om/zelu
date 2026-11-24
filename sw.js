// Desativa o service worker e limpa todo o cache antigo
self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const chaves = await caches.keys();
    await Promise.all(chaves.map((k) => caches.delete(k)));
    await self.registration.unregister();
    const abas = await self.clients.matchAll({ type: 'window' });
    abas.forEach((aba) => aba.navigate(aba.url));
  })());
});
