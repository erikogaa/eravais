/* Логика сайта. Данные берутся из config.js — здесь ничего менять не нужно. */
(function(){
  const CONFIG = window.CONFIG;
  const q = s => document.querySelectorAll(s);
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- контакты и реквизиты из CONFIG ---------- */
  const waUrl    = 'https://wa.me/' + CONFIG.phone + '?text=' + encodeURIComponent(CONFIG.waText);
  const waFamUrl = 'https://wa.me/' + CONFIG.phone + '?text=' + encodeURIComponent(CONFIG.waTextFamily);
  const tgUrl = 'https://t.me/' + CONFIG.telegram;
  const igUrl = 'https://instagram.com/' + CONFIG.instagram;
  const ext = (e, url) => { e.href = url; e.target = '_blank'; e.rel = 'noopener'; };

  q('[data-wa]').forEach(e => ext(e, waUrl));
  q('[data-wa-family]').forEach(e => ext(e, waFamUrl));
  q('[data-tg]').forEach(e => ext(e, tgUrl));
  q('[data-ig]').forEach(e => ext(e, igUrl));

  /* YouTube: появляется, только если ссылка заполнена */
  const yt = (CONFIG.youtube || '').trim();
  if (yt) q('[data-yt]').forEach(e => { ext(e, yt); e.hidden = false; });
  else    q('[data-yt]').forEach(e => e.remove());

  const text = (sel, val) => q(sel).forEach(e => e.textContent = val);
  text('[data-yt-handle]', CONFIG.youtubeLabel || 'Подкасты и видео');
  text('[data-name]', CONFIG.name);
  text('[data-phone-display]', CONFIG.phoneDisplay);
  text('[data-tg-handle]', '@' + CONFIG.telegram);
  text('[data-ig-handle]', '@' + CONFIG.instagram);
  text('[data-kaspi-display]', CONFIG.kaspiPhone);
  text('[data-kaspi-card]', CONFIG.kaspiCard);
  text('[data-kaspi-name]', CONFIG.kaspiName);
  text('#yr', new Date().getFullYear());
  document.title = CONFIG.name + ' — помощь при лудомании';

  /* первая кнопка всегда во всю ширину; последняя — если иначе останется дырка */
  const grid = document.querySelector('.links');
  const items = grid ? [...grid.children].filter(el => !el.hidden) : [];
  if (items.length) {
    items.forEach(el => el.classList.remove('wide'));
    items[0].classList.add('wide');
    if ((items.length - 1) % 2) items[items.length - 1].classList.add('wide');
  }

  /* картинка показывается, только если файл реально лежит рядом */
  function optionalImage(imgId, phId){
    const el = document.getElementById(imgId), ph = document.getElementById(phId);
    if (!el) return;
    const probe = new Image();
    probe.onload  = () => { el.src = probe.src; el.hidden = false; if (ph) ph.remove(); };
    probe.onerror = () => el.remove();
    probe.src = el.getAttribute('data-src');
  }
  const photoEl = document.getElementById('photo');
  if (photoEl) photoEl.alt = CONFIG.photoAlt;
  optionalImage('photo', 'photoPh');
  optionalImage('heroBg', null);

  /* ---------- копирование реквизитов ---------- */
  function copy(btn, value){
    const label = btn.querySelector('span') || btn;
    const done = () => {
      label.textContent = 'Скопировано';
      btn.classList.add('done');
      clearTimeout(btn._t);
      btn._t = setTimeout(() => { label.textContent = 'Копировать'; btn.classList.remove('done'); }, 1800);
    };
    if (navigator.clipboard && window.isSecureContext)
      navigator.clipboard.writeText(value).then(done).catch(() => fallback(value, done));
    else fallback(value, done);
  }
  function fallback(value, done){
    const ta = document.createElement('textarea');
    ta.value = value; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); done(); } catch(e){}
    document.body.removeChild(ta);
  }
  q('[data-copy-kaspi]').forEach(b => b.addEventListener('click', () => copy(b, CONFIG.kaspiPhoneCopy)));
  q('[data-copy-card]').forEach(b => b.addEventListener('click', () => copy(b, CONFIG.kaspiCardCopy)));

  /* ---------- прокрутка: шапка, прогресс, параллакс фона ---------- */
  const navEl = document.querySelector('nav');
  const heroBg = document.querySelector('.hero-bg');
  const hero = document.querySelector('.hero');
  let ticking = false;
  function onScroll(){
    const y = window.scrollY;
    const max = root.scrollHeight - innerHeight;
    navEl.classList.toggle('solid', y > 12);
    root.classList.toggle('scrolled', y > (hero ? hero.offsetHeight * .6 : 400));
    root.style.setProperty('--p', max > 0 ? Math.min(1, y / max).toFixed(4) : 0);
    if (heroBg && !reduced && y < innerHeight * 1.2) heroBg.style.setProperty('--py', (y * .25).toFixed(1) + 'px');
    ticking = false;
  }
  onScroll();
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, {passive:true});

  /* ---------- активный пункт меню и бегунок под ним ---------- */
  const navLinks = [...q('.nav-links a')];
  const ind = document.querySelector('.nav-ind');
  function moveInd(a){
    if (!ind) return;
    if (!a) { ind.style.setProperty('--io', 0); return; }
    ind.style.setProperty('--ix', a.offsetLeft + 'px');
    ind.style.setProperty('--iw', a.offsetWidth + 'px');
    ind.style.setProperty('--io', 1);
  }
  if ('IntersectionObserver' in window && navLinks.length) {
    const byId = new Map(navLinks.map(a => [a.getAttribute('href').slice(1), a]));
    const visible = new Set();
    const pick = () => {
      // активна самая верхняя из видимых секций
      const id = [...byId.keys()].find(k => visible.has(k));
      navLinks.forEach(a => a.classList.toggle('on', a === byId.get(id)));
      moveInd(byId.get(id));
    };
    const so = new IntersectionObserver(es => {
      es.forEach(en => en.isIntersecting ? visible.add(en.target.id) : visible.delete(en.target.id));
      pick();
    }, {rootMargin:'-45% 0px -50% 0px'});
    byId.forEach((a, id) => { const s = document.getElementById(id); if (s) so.observe(s); });
    addEventListener('resize', pick);
  }

  /* ---------- заголовки разбиваются на слова для анимации ---------- */
  function splitWords(el){
    el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
    let k = 0;
    [...el.childNodes].forEach(node => {
      if (node.nodeType !== 3) return;               // <br> и прочее не трогаем
      const frag = document.createDocumentFragment();
      node.textContent.split(/( +|\n\s*)/).forEach(part => {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
        const wd = document.createElement('span'); wd.className = 'wd'; wd.setAttribute('aria-hidden', 'true');
        const inner = document.createElement('span'); inner.textContent = part;
        inner.style.setProperty('--k', k++);
        wd.appendChild(inner); frag.appendChild(wd);
      });
      node.replaceWith(frag);
    });
    el.classList.add('split');
  }
  if (!reduced) q('.hero h1, .sec h2').forEach(splitWords);

  /* ---------- цифры докручиваются при появлении ---------- */
  function countUp(el){
    const target = +el.dataset.count, suffix = el.dataset.suffix || '';
    if (reduced || !target) { el.textContent = target + suffix; return; }
    const dur = 1400, t0 = performance.now();
    const tick = now => {
      const k = Math.min(1, (now - t0) / dur);
      el.textContent = Math.round(target * (1 - Math.pow(1 - k, 4))) + suffix;
      if (k < 1) requestAnimationFrame(tick);
    };
    el.textContent = '0' + suffix;
    requestAnimationFrame(tick);
  }

  /* ---------- появление при прокрутке ---------- */
  // соседние блоки появляются по очереди, а не все разом
  q('.rv').forEach(el => {
    const sibs = [...el.parentElement.children].filter(c => c.classList.contains('rv'));
    el.style.setProperty('--d', sibs.indexOf(el) * 110);
  });
  const watched = [...q('.rv, .sec h2.split, .prose .quote')];
  if ('IntersectionObserver' in window && !reduced) {
    const io = new IntersectionObserver(es => es.forEach(en => {
      if (!en.isIntersecting) return;
      en.target.classList.add('in');
      // после появления блок возвращает себе собственные hover-эффекты
      if (en.target.classList.contains('rv'))
        en.target.addEventListener('transitionend', function done(ev){
          if (ev.target !== en.target || ev.propertyName !== 'opacity') return;
          en.target.classList.remove('rv'); en.target.removeEventListener('transitionend', done);
        });
      en.target.querySelectorAll('[data-count]').forEach(countUp);
      io.unobserve(en.target);
    }), {rootMargin:'0px 0px -10% 0px', threshold:.12});
    watched.forEach(el => io.observe(el));
  } else watched.forEach(el => el.classList.add('in'));

  if (reduced || !finePointer) return;

  /* ---------- дальше — только для мыши ---------- */

  /* фото наклоняется за курсором */
  const tilt = document.querySelector('.tilt');
  if (tilt) {
    const box = tilt.parentElement;
    box.addEventListener('pointermove', e => {
      const r = tilt.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      tilt.classList.add('live');
      tilt.style.setProperty('--ry', ((x - .5) * 10).toFixed(2) + 'deg');
      tilt.style.setProperty('--rx', ((.5 - y) * 10).toFixed(2) + 'deg');
      tilt.style.setProperty('--gx', (x * 100).toFixed(1) + '%');
      tilt.style.setProperty('--gy', (y * 100).toFixed(1) + '%');
      tilt.style.setProperty('--go', 1);
    });
    box.addEventListener('pointerleave', () => {
      tilt.classList.remove('live');
      ['--rx', '--ry'].forEach(p => tilt.style.setProperty(p, '0deg'));
      tilt.style.setProperty('--go', 0);
    });
  }

  /* пятно света на карточках ссылок */
  q('.lk').forEach(el => el.addEventListener('pointermove', e => {
    const r = el.getBoundingClientRect();
    el.style.setProperty('--sx', (e.clientX - r.left) + 'px');
    el.style.setProperty('--sy', (e.clientY - r.top) + 'px');
  }));

  /* кнопки слегка тянутся к курсору */
  q('.pill').forEach(el => {
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', ((e.clientX - r.left - r.width / 2) * .18).toFixed(1) + 'px');
      el.style.setProperty('--my', ((e.clientY - r.top - r.height / 2) * .3).toFixed(1) + 'px');
    });
    el.addEventListener('pointerleave', () => { el.style.setProperty('--mx', '0px'); el.style.setProperty('--my', '0px'); });
  });
})();
