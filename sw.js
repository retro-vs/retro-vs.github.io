// 앱 설치용 서비스 워커: 항상 네트워크 먼저 (새 버전 바로 반영 · 두 사람 버전이 어긋나지 않게), 안 되면 저장해 둔 것
// 같은 사이트의 GET 요청만 다룬다 (방 연결 서버 등 다른 곳은 건드리지 않음)
const CACHE = "retro-vs-v1";

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(
    fetch(req)
      .then((res) => {
        if (res.ok && res.type === "basic") {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req).then((r) => r || Response.error())),
  );
});
