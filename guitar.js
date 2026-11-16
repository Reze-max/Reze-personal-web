(() => {
  const track = document.getElementById('guitar-track');
  if (!track) return;
  const frames = [...track.querySelectorAll('.guitar-frame')];
  const videos = [...track.querySelectorAll('video')];
  const previous = document.getElementById('guitar-prev');
  const next = document.getElementById('guitar-next');
  const position = document.getElementById('guitar-position');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const connection = navigator.connection;
  const limited = connection?.saveData || ['slow-2g', '2g'].includes(connection?.effectiveType);
  let nearby = false;
  let selected = 0;
  const failed = new WeakSet();
  const status = document.createElement('p');
  status.className = 'guitar-buffer-status';
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  document.querySelector('.guitar-navigation').before(status);
  let notice = '';
  function secondsAhead(video) {
    for (let i = 0; i < video.buffered.length; i++) {
      if (video.buffered.start(i) <= video.currentTime + .1 && video.buffered.end(i) > video.currentTime) {
        return Math.max(0, video.buffered.end(i) - video.currentTime);
      }
    }
    return 0;
  }
  function report() {
    const video = videos[selected];
    const seconds = Math.floor(secondsAhead(video));
    let text;
    if (video.error || failed.has(video)) text = '视频连接失败，请点击“重新加载”。';
    else if (video.ended) text = '播放结束 · 可重新播放或切换下一首';
    else if (!video.paused && video.readyState < 3) text = `正在缓冲原画质视频…已准备 ${seconds} 秒`;
    else if (!video.paused) text = seconds ? `原画质播放中 · 已缓冲 ${seconds} 秒` : '原画质播放中';
    else if (seconds) text = `当前视频已准备 ${seconds} 秒 · 点击播放，保留原声`;
    else text = limited ? '点击播放后加载原画质视频' : '正在提前准备当前视频 · 不降低画质';
    if (text !== notice) { notice = text; status.textContent = text; }
  }
  function prepare() {
    if (!nearby || document.hidden || videos.some(v => !v.paused && v !== videos[selected])) return;
    videos.forEach((video, index) => {
      video.preload = index === selected ? (limited ? 'metadata' : 'auto') : 'none';
    });
    // preload is a browser hint; do not fetch all four files or force autoplay.
    report();
  }
  const retry = document.createElement('button');
  retry.type = 'button'; retry.className = 'guitar-retry'; retry.textContent = '重新加载'; retry.hidden = true;
  status.after(retry);
  retry.addEventListener('click', () => { failed.delete(videos[selected]); videos[selected].load(); retry.hidden = true; prepare(); });
  const posters = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const video = entry.target;
    if (video.dataset.poster) { video.poster = video.dataset.poster; delete video.dataset.poster; }
    posters.unobserve(video);
  }), {rootMargin: '400px'});
  videos.forEach(video => posters.observe(video));
  const step = () => frames[1].offsetLeft - frames[0].offsetLeft;
  function update() {
    const index = Math.max(0, Math.min(frames.length - 1, Math.round(track.scrollLeft / step())));
    if (index !== selected) {
      videos[selected].pause();
      selected = index;
      retry.hidden = !videos[selected].error && !failed.has(videos[selected]);
      prepare();
    }
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
  videos.forEach(video => {
    video.addEventListener('play', () => {
      selected = videos.indexOf(video);
      retry.hidden = true;
      videos.forEach(other => { if (other !== video) { other.pause(); other.preload = 'none'; } });
      video.preload = 'auto';
      report();
    });
    ['progress', 'waiting', 'playing', 'canplay', 'pause', 'ended', 'loadedmetadata'].forEach(event => video.addEventListener(event, report));
    const showError = () => {
      failed.add(video);
      if (video === videos[selected]) { retry.hidden = false; report(); }
    };
    video.addEventListener('error', showError);
    video.querySelectorAll('source').forEach(source => source.addEventListener('error', showError));
    video.addEventListener('loadedmetadata', () => {
      failed.delete(video);
      if (video === videos[selected]) { retry.hidden = true; report(); }
    });
  });
  new IntersectionObserver(([entry]) => {
    nearby = entry.isIntersecting;
    if (nearby) prepare();
    else videos.forEach(video => { video.pause(); video.preload = 'none'; });
  }, {rootMargin: '250px', threshold: 0}).observe(document.getElementById('guitar'));
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) videos.forEach(video => { video.pause(); video.preload = 'none'; });
    else prepare();
  });
  update();
})();
