(() => {
  const hero = document.getElementById('home');
  const video = document.getElementById('hero-video');
  const toggle = document.getElementById('hero-motion');
  if (!hero || !video || !toggle) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let requested = !reduced.matches;
  let visible = false;
  let failed = false;
  let loading = null;
  let objectURL = null;
  const source = video.querySelector('source');
  const url = source.dataset.src;
  let progress = '';
  video.muted = true;
  function label() {
    if (loading) {
      toggle.textContent = `背景加载中${progress} · 可暂停`;
      toggle.setAttribute('aria-label', '暂停背景加载');
      return;
    }
    const playing = !video.paused;
    toggle.textContent = playing ? '暂停背景' : '播放背景';
    toggle.setAttribute('aria-label', playing ? '暂停背景动画' : '播放背景动画');
  }
  async function sync() {
    if (requested && visible && !document.hidden && !failed) {
      if (!video.getAttribute('src')) {
        if (loading) return;
        const controller = new AbortController();
        loading = controller;
        label();
        try {
          const blob = await RezeMedia.download(url, {
            signal: controller.signal, priority: 'high',
            progress: (bytes, total) => {
              progress = total ? ` ${Math.floor(bytes / total * 100)}%` : '';
              label();
            }
          });
          if (controller.signal.aborted) return;
          objectURL = URL.createObjectURL(blob);
          video.src = objectURL;
          video.load();
        } catch (error) {
          if (error.name === 'AbortError') return;
          // If full-file loading is unavailable, native progressive playback remains usable.
          video.src = url;
          video.load();
        } finally {
          if (loading === controller) loading = null;
        }
      }
      if (requested && visible && !document.hidden) {
        try { await video.play(); } catch { /* Keep poster if browser requires a gesture. */ }
      }
    } else {
      loading?.abort(); loading = null;
      video.pause();
    }
    label();
  }
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    document.querySelector('header')?.classList.toggle('on-hero', visible);
    sync();
  }, {threshold: 0}).observe(hero);
  toggle.addEventListener('click', () => { requested = loading ? false : video.paused; sync(); });
  video.addEventListener('play', label);
  video.addEventListener('pause', label);
  video.addEventListener('error', () => {
    failed = true; toggle.disabled = true; toggle.textContent = '静态背景';
    toggle.setAttribute('aria-label', '视频暂不可用，已显示静态背景');
  });
  document.addEventListener('visibilitychange', sync);
  reduced.addEventListener('change', () => { requested = !reduced.matches; sync(); });
  window.addEventListener('pagehide', event => {
    loading?.abort();
    if (!event.persisted && objectURL) URL.revokeObjectURL(objectURL);
  });
})();
