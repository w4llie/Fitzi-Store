const CACHE_NAME = 'fitzi_store_cache_v2';
const ASSETS = [
  './',
  './index.html',
  './carrinho.html',
  './produto.html',
  './finalizar_compra.html',
  './css/style.css',
  './javascript/app.js',
  './javascript/carrinho.js',
  './javascript/checkout.js',
  './javascript/produto-detalhes.js',
  './confirmacao.html',
  './manifest.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching assets');
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }));
    })
  );
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  if (url.pathname.includes('/wp-json/')) {
    e.respondWith(
      fetch(e.request).catch(() => caches.match(e.request))
    );
  } else {
    e.respondWith(
      caches.match(e.request).then((response) => {
        return response || fetch(e.request);
      })
    );
  }
});
