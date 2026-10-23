// Site-wide behaviour. Everything here is progressive: without it the page is complete and static.
import Lenis from 'lenis';

const root = document.documentElement;
root.dataset.live = '';
const motion = root.classList.contains('m');
const clamp = (n: number) => Math.min(Math.max(n, 0), 1);

if (motion) {
  /* ---------- scroll reveals ---------- */
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px' },
  );
  document.querySelectorAll('.rv').forEach((el) => io.observe(el));

  /* ---------- smooth scrolling: in-page links glide too, stopping below the sticky nav ---------- */
  const lenis = new Lenis({ autoRaf: true, lerp: 0.085, anchors: { offset: -72 } });

  /* ---------- scroll-linked motion: the hero recedes, each section's rule fills like a build bar ---------- */
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  const sections = [...document.querySelectorAll<HTMLElement>('main > section:not([data-hero])')];
  const update = () => {
    const vh = innerHeight;
    if (hero) hero.style.setProperty('--p', clamp(scrollY / hero.offsetHeight).toFixed(3));
    for (const s of sections) s.style.setProperty('--sp', clamp((vh * 0.9 - s.getBoundingClientRect().top) / (vh * 0.6)).toFixed(3));
  };
  lenis.on('scroll', update);
  update();
}
