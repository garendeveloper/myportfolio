const root = document.documentElement;
const nav = document.getElementById('nav');
const menuBtn = document.getElementById('menu-btn');
const themeBtn = document.getElementById('theme-btn');

// theme: saved choice wins, otherwise follow the OS
const saved = (() => { try { return localStorage.getItem('theme'); } catch { return null; } })();
const prefersDark = matchMedia('(prefers-color-scheme: dark)').matches;
root.dataset.theme = saved || (prefersDark ? 'dark' : 'light');

themeBtn.addEventListener('click', () => {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  root.dataset.theme = next;
  try { localStorage.setItem('theme', next); } catch {}
});

// mobile menu
menuBtn.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open);
});
nav.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    nav.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
  }
});

// fade sections in once
const revealer = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      revealer.unobserve(entry.target);
    }
  }
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((el) => revealer.observe(el));

// highlight the nav link for the section in view
const links = [...nav.querySelectorAll('a')];
const spy = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    links.forEach((a) => a.classList.toggle('active', a.hash === '#' + entry.target.id));
  }
}, { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('main section[id]').forEach((s) => spy.observe(s));

document.getElementById('year').textContent = new Date().getFullYear();
