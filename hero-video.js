(() => {
  const hero = document.getElementById('home');
  const video = document.getElementById('hero-video');
  const toggle = document.getElementById('hero-motion');
  if (!hero || !video || !toggle) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let requested = !reduced.matches;
  let visible = false;
  let failed = false;
  video.muted = true;
  function label() {
    const playing = !video.paused;
    toggle.textContent = playing ? '暂停背景' : '播放背景';
    toggle.setAttribute('aria-label', playing ? '暂停背景动画' : '播放背景动画');
  }
  async function sync() {
    if (requested && visible && !document.hidden && !failed) {
      try { await video.play(); } catch { /* Autoplay policy: retain poster and allow explicit play. */ }
    } else video.pause();
    label();
  }
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    document.querySelector('header')?.classList.toggle('on-hero', visible);
    sync();
  }, {threshold: 0}).observe(hero);
  toggle.addEventListener('click', () => { requested = video.paused; sync(); });
  video.addEventListener('play', label);
  video.addEventListener('pause', label);
  video.addEventListener('error', () => {
    failed = true; toggle.disabled = true; toggle.textContent = '静态背景';
    toggle.setAttribute('aria-label', '视频暂不可用，已显示静态背景');
  });
  document.addEventListener('visibilitychange', sync);
  reduced.addEventListener('change', () => { requested = !reduced.matches; sync(); });
})();
