const CACHE_NAME = 'minharua-v2-cache';
const urlsToCache = [
  './',
  './index.html',
  './cnpj.html',
  './dominio.html',
  './cambio.html',
  './isbn.html',
  './pix.html',
  './feriados.html',
  './bancos.html',
  './ddd.html',
  './taxas.html',
  './clima.html',
  './rastreio.html',
  './ncm.html',
  './css/style.css',
  './js/sidebar.js',
  './js/theme.js',
  './js/buscataxas.js',
  './js/buscaclima.js',
  './js/buscarastreio.js',
  './js/buscancm.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  // Never cache external API calls
  if (event.request.url.includes('brasilapi.com.br')) return;
  
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
