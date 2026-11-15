(() => {
  const trigger = document.getElementById('open-ai-chat');
  if (!trigger) return;
  const overlay = document.createElement('div');
  overlay.className = 'ai-chat';
  overlay.hidden = true;
  overlay.innerHTML = `
    <section class="ai-dialog" role="dialog" aria-modal="true" aria-labelledby="ai-title">
      <header class="ai-header">
        <img class="ai-avatar" src="新照片.jpg" alt="">
        <div class="ai-heading"><h2 id="ai-title">马睿哲的 AI 分身</h2><p>关于我的经历、项目和产品思考</p></div>
        <button class="ai-close" type="button" aria-label="关闭对话">×</button>
      </header>
      <div class="ai-log" role="log" aria-live="polite" aria-relevant="additions text"></div>
      <div class="ai-bottom">
        <form class="ai-form">
          <textarea rows="2" maxlength="1000" aria-label="输入你的问题" placeholder="想了解我什么？" required></textarea>
          <button class="ai-send" type="submit" disabled>发送 ↑</button>
        </form>
        <div class="ai-footnote"><span>AI 根据公开资料回答，可能存在误差。消息将发送至 DeepSeek，请勿输入敏感信息。</span><button class="ai-reset" type="button">新对话</button></div>
      </div>
    </section>`;
  document.body.append(overlay);
  const log = overlay.querySelector('.ai-log');
  const form = overlay.querySelector('form');
  const input = overlay.querySelector('textarea');
  const send = overlay.querySelector('.ai-send');
  let history = [], busy = false, controller = null, generation = 0, oldOverflow = '', previousFocus;
  const intro = () => {
    log.innerHTML = `<div class="ai-intro"><span class="ai-label">A LITTLE MORE ABOUT ME</span><h3>你好，先聊聊我吧。</h3><p>我是马睿哲的 AI 分身。你可以问我做过的产品、实习中的具体工作，或是我如何用数据与 AI 解决问题。</p><div class="ai-suggestions"><button type="button">用一分钟介绍一下你</button><button type="button">你在作业帮做了什么？</button><button type="button">你有哪些 AI 产品经验？</button><button type="button">推荐一个最值得看的项目</button></div></div>`;
    log.querySelectorAll('.ai-suggestions button').forEach(button => button.addEventListener('click', () => submit(button.textContent)));
  };
  const scroll = () => { log.scrollTop = log.scrollHeight; };
  function message(role, text) {
    const node = document.createElement('div');
    node.className = `ai-message ai-message-${role}`;
    node.textContent = text;
    log.append(node);
    scroll();
  }
  const update = () => { send.disabled = busy || !input.value.trim(); };
  async function submit(text, retry = false) {
    text = text.trim();
    if (busy || !text || text.length > 1000) return;
    log.querySelector('.ai-error')?.remove();
    if (!retry) message('user', text);
    input.value = ''; busy = true; update();
    const pending = document.createElement('div');
    pending.className = 'ai-pending'; pending.textContent = '正在整理我的经历…';
    log.append(pending); scroll();
    const current = generation;
    controller = new AbortController();
    const timeout = setTimeout(() => controller?.abort(), 55000);
    try {
      const messages = [...history.slice(-14), {role: 'user', content: text}];
      const response = await fetch(location.hostname === 'reze-max.github.io' ? 'https://reze-personal-ai.downyraspberry8.chatgpt.site/api/chat' : '/api/chat', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({messages}), signal: controller.signal });
      let data;
      try { data = await response.json(); } catch { throw new Error('AI 暂时无法连接，请稍后重试。'); }
      if (!response.ok) throw new Error(data.error || 'AI 暂时无法回答，请稍后重试。');
      if (typeof data.reply !== 'string' || !data.reply.trim()) throw new Error('这次没有生成回答，请重试。');
      if (current !== generation) return;
      history = [...messages, {role: 'assistant', content: data.reply}];
      message('assistant', data.reply);
    } catch (error) {
      if (current !== generation) return;
      const box = document.createElement('div'); box.className = 'ai-error'; box.setAttribute('role', 'alert');
      const detail = document.createElement('p'); detail.textContent = error.name === 'AbortError' ? '等待回答超时，请再试一次。' : error.message === 'Failed to fetch' ? '网络连接失败，请稍后重试。' : error.message;
      const button = document.createElement('button'); button.type = 'button'; button.textContent = '重试这条消息';
      button.addEventListener('click', () => submit(text, true)); box.append(detail, button); log.append(box);
    } finally {
      clearTimeout(timeout); pending.remove();
      if (current === generation) { busy = false; update(); scroll(); if (!overlay.hidden) input.focus(); }
    }
  }
  function close() {
    overlay.hidden = true; document.body.style.overflow = oldOverflow;
    previousFocus?.focus();
  }
  trigger.addEventListener('click', () => {
    if (!overlay.hidden) return;
    previousFocus = document.activeElement; oldOverflow = document.body.style.overflow;
    overlay.hidden = false; document.body.style.overflow = 'hidden'; input.focus();
  });
  overlay.querySelector('.ai-close').addEventListener('click', close);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  overlay.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.stopPropagation(); close(); }
    if (e.key === 'Tab') {
      const nodes = [...overlay.querySelectorAll('button:not(:disabled), textarea')].filter(el => el.getClientRects().length);
      if (e.shiftKey && document.activeElement === nodes[0]) { e.preventDefault(); nodes.at(-1).focus(); }
      else if (!e.shiftKey && document.activeElement === nodes.at(-1)) { e.preventDefault(); nodes[0].focus(); }
    }
  });
  overlay.querySelector('.ai-reset').addEventListener('click', () => {
    generation++; controller?.abort(); busy = false; history = []; input.value = ''; intro(); update(); input.focus();
  });
  form.addEventListener('submit', e => { e.preventDefault(); submit(input.value); });
  input.addEventListener('input', update);
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); submit(input.value); }
  });
  intro();
})();
