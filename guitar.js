(() => {
  const track = document.getElementById('guitar-track');
  if (!track) return;
  const frames = [...track.querySelectorAll('.guitar-frame')];
  const videos = [...track.querySelectorAll('video')];
  const previous = document.getElementById('guitar-prev');
  const next = document.getElementById('guitar-next');
  const position = document.getElementById('guitar-position');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const step = () => frames[1].offsetLeft - frames[0].offsetLeft;
  function update() {
    const index = Math.max(0, Math.min(frames.length - 1, Math.round(track.scrollLeft / step())));
    position.textContent = `${String(index + 1).padStart(2, '0')} / 04`;
    previous.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
  }
  function move(direction) {
    track.scrollBy({left: direction * step(), behavior: reduced.matches ? 'instant' : 'smooth'});
  }
  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  track.addEventListener('keydown', e => {
    if (e.target !== track) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); move(e.key === 'ArrowRight' ? 1 : -1); }
  });
  track.addEventListener('scroll', update, {passive: true});
  window.addEventListener('resize', update);
  videos.forEach(video => video.addEventListener('play', () => videos.forEach(other => { if (other !== video) other.pause(); })));
  new IntersectionObserver(([entry]) => { if (!entry.isIntersecting) videos.forEach(video => video.pause()); }, {threshold: 0}).observe(document.getElementById('guitar'));
  document.addEventListener('visibilitychange', () => { if (document.hidden) videos.forEach(video => video.pause()); });
  update();
})();
