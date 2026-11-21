(() => {
  // Store the original bytes, never a transcoded or reduced-quality derivative.
  const name = 'reze-original-media-v1';
  const checkAbort = signal => { if (signal?.aborted) throw new DOMException('Aborted', 'AbortError'); };
  async function cached(url) {
    try {
      if (!globalThis.caches) return null;
      const response = await (await caches.open(name)).match(url);
      return response ? await response.blob() : null;
    } catch { return null; } // Private mode / storage quota must not block playback.
  }
  async function download(url, { signal, progress = () => {}, priority = 'low' } = {}) {
    const existing = await cached(url);
    checkAbort(signal);
    if (existing) { progress(existing.size, existing.size); return existing; }
    const response = await fetch(url, { signal, priority, cache: 'force-cache' });
    if (!response.ok || response.status === 206) throw new Error('Incomplete media response');
    const total = Number(response.headers.get('content-length')) || 0;
    let blob;
    if (response.body?.getReader) {
      const reader = response.body.getReader();
      const chunks = [];
      let received = 0;
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value); received += value.byteLength;
        progress(received, total);
      }
      checkAbort(signal);
      if (total && received !== total) throw new Error('Incomplete media download');
      blob = new Blob(chunks, { type: 'video/mp4' });
    } else blob = await response.blob();
    checkAbort(signal);
    if (!blob.size) throw new Error('Empty media');
    progress(blob.size, blob.size);
    // Persistence is best effort: playback does not wait for a disk write.
    if (globalThis.caches) {
      caches.open(name).then(cache => cache.put(url, new Response(blob, {
        headers: { 'Content-Type': 'video/mp4', 'Content-Length': String(blob.size) }
      }))).catch(() => {});
    }
    return blob;
  }
  window.RezeMedia = { cached, download };
})();
