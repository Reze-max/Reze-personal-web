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
  const states = videos.map(video => ({ url: video.querySelector('source').dataset.src,
    objectURL: null, time: 0, revision: 0, failed: false }));
  let nearby = false, visible = false, selected = 0, trackIndex = 0, frame = 0;
  let pending = null, notice = '';
  const status = document.createElement('p');
  status.className = 'guitar-buffer-status';
  status.setAttribute('role', 'status');
  const actions = document.createElement('div');
  actions.className = 'guitar-load-actions';
  const full = document.createElement('button');
  full.type = 'button'; full.className = 'guitar-full-buffer';
  const retry = document.createElement('button');
  retry.type = 'button'; retry.className = 'guitar-retry'; retry.textContent = '重新加载'; retry.hidden = true;
  actions.append(full, retry);
  document.querySelector('.guitar-navigation').before(status, actions);
  function report() {
    const video = videos[selected], state = states[selected];
    full.disabled = !!state.objectURL && !pending;
    full.textContent = pending ? '取消完整缓冲' : state.objectURL ? '完整缓冲已就绪' : '完整缓冲后播放';
    retry.hidden = !state.failed;
    let text;
    if (pending) {
      const { received = 0, total = 0 } = pending;
      text = total ? '正在完整缓冲 ' + Math.floor(received / total * 100) + '% · 完成后播放原画质'
        : '正在完整缓冲 ' + (received / 1048576).toFixed(1) + ' MB · 完成后播放原画质';
    } else if (state.failed) text = '视频连接失败，请重试，或选择完整缓冲后播放。';
    else if (video.ended) text = '播放结束 · 可重新播放或切换下一首';
    else if (state.objectURL) text = video.paused ? '原视频已完整缓冲 · 点击播放，保留原声' : '原画质播放中 · 已完整缓冲';
    else if (!video.paused && video.readyState < 3) text = '正在缓冲 · 网速较慢时可选择“完整缓冲后播放”';
    else if (!video.paused) text = '原画质播放中 · 保留现场原声';
    else text = '点击视频播放 · 慢网建议先完整缓冲，播放途中无需继续下载';
    if (text !== notice) { notice = text; status.textContent = text; }
  }
  function suspend(index) {
    const video = videos[index], state = states[index];
    state.revision++;
    if (pending?.video === video) { pending.controller.abort(); pending = null; }
    video.pause();
    if (video.getAttribute('src')) {
      state.time = video.ended ? 0 : video.currentTime;
      video.removeAttribute('src');
      // load() after removing src terminates the old media request and decoder.
      video.load();
    }
    if (state.objectURL) { URL.revokeObjectURL(state.objectURL); state.objectURL = null; }
    video.preload = 'none';
  }
  function attach(index, blob = null) {
    const video = videos[index], state = states[index];
    state.failed = false;
    if (blob) state.objectURL = URL.createObjectURL(blob);
    video.preload = blob || !limited ? 'auto' : 'metadata';
    video.src = state.objectURL || state.url;
    video.load();
  }
  async function prepare() {
    if (!nearby || document.hidden || pending) return;
    const index = selected, state = states[index];
    if (videos[index].getAttribute('src')) return;
    const revision = ++state.revision;
    const blob = await RezeMedia.cached(state.url);
    if (state.revision !== revision || selected !== index || !nearby || document.hidden || pending) return;
    attach(index, blob);
    report();
  }
  function select(index, immediate = false) {
    if (index !== selected) {
      suspend(selected); selected = index;
      if (immediate) attach(index);
      else prepare();
      report();
    }
  }
  full.addEventListener('click', async () => {
    if (pending) {
      suspend(selected); prepare(); report(); return;
    }
    const index = selected, video = videos[index], state = states[index];
    suspend(index);
    state.failed = false;
    const controller = new AbortController();
    const job = { video, controller, received: 0, total: 0 };
    pending = job; report();
    try {
      const blob = await RezeMedia.download(state.url, {
        signal: controller.signal,
        progress: (received, total) => { if (pending === job) { Object.assign(job, {received, total}); report(); } }
      });
      if (controller.signal.aborted || selected !== index || pending !== job) return;
      pending = null; attach(index, blob); report();
      try { await video.play(); } catch { /* Some mobile browsers require another tap after a long download. */ }
    } catch (error) {
      if (error.name !== 'AbortError' && pending === job) {
        pending = null; state.failed = true; report();
      }
    }
  });
  retry.addEventListener('click', () => { suspend(selected); states[selected].failed = false; prepare(); report(); });
  const posters = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const video = entry.target;
    if (video.dataset.poster) { video.poster = video.dataset.poster; delete video.dataset.poster; }
    posters.unobserve(video);
  }), {rootMargin: '400px'});
  videos.forEach((video, index) => {
    posters.observe(video);
    // Two frames are visible on desktop; touching the second makes it active.
    video.addEventListener('pointerdown', () => select(index, true));
    video.addEventListener('focus', () => select(index, true));
    video.addEventListener('play', () => {
      select(index);
      videos.forEach((other, i) => { if (other !== video && other.getAttribute('src')) suspend(i); });
      if (!visible || document.hidden) video.pause();
      report();
    });
    ['waiting', 'playing', 'pause', 'ended', 'canplay'].forEach(event => video.addEventListener(event, report));
    video.addEventListener('error', () => {
      if (!video.getAttribute('src') || pending?.video === video) return;
      states[index].failed = true;
      if (index === selected) report();
    });
    video.addEventListener('loadedmetadata', () => {
      const state = states[index];
      state.failed = false;
      if (state.time > 0 && state.time < video.duration) video.currentTime = state.time;
      if (index === selected) report();
    });
  });
  const step = () => frames[1].offsetLeft - frames[0].offsetLeft;
  function update() {
    frame = 0;
    const index = Math.max(0, Math.min(frames.length - 1, Math.round(track.scrollLeft / step())));
    if (index !== trackIndex) { trackIndex = index; select(index); }
    position.textContent = String(index + 1).padStart(2, '0') + ' / 04';
    previous.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
  }
  const queueUpdate = () => { if (!frame) frame = requestAnimationFrame(update); };
  function move(direction) { track.scrollBy({left: direction * step(), behavior: reduced.matches ? 'instant' : 'smooth'}); }
  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  track.addEventListener('keydown', event => {
    if (event.target !== track) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1); }
  });
  track.addEventListener('scroll', queueUpdate, {passive: true});
  window.addEventListener('resize', queueUpdate);
  new IntersectionObserver(([entry]) => {
    nearby = entry.isIntersecting;
    if (nearby) prepare();
    else { videos.forEach((_, index) => suspend(index)); report(); }
  }, {rootMargin: '250px', threshold: 0}).observe(document.getElementById('guitar'));
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (!visible) videos.forEach(video => video.pause());
  }).observe(document.getElementById('guitar'));
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { videos.forEach((_, index) => suspend(index)); report(); }
    else prepare();
  });
  window.addEventListener('pagehide', () => videos.forEach((_, index) => suspend(index)));
  window.addEventListener('pageshow', () => prepare());
  update(); report();
})();
