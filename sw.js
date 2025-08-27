const CACHE_NAME='rend-suite3-v1';
const OFFLINE=['./index.html','./manifest.json','./icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(OFFLINE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.map(k=>k!==CACHE_NAME?caches.delete(k):null)))).then(()=>self.clients.claim()));
self.addEventListener('fetch',e=>{
  const url=new URL(e.request.url);
  if(url.origin!==location.origin) return;
  if(url.pathname.endsWith('.html')||url.pathname==='/'){
    e.respondWith(fetch(e.request).then(r=>{caches.open(CACHE_NAME).then(c=>c.put(e.request,r.clone())); return r;}).catch(()=>caches.match(e.request).then(x=>x||caches.match('./index.html'))));
  }else{
    e.respondWith(caches.match(e.request).then(x=>x||fetch(e.request).then(r=>{caches.open(CACHE_NAME).then(c=>c.put(e.request,r.clone())); return r;})));
  }
});