// ---------------------------------------------------------
// Footer year
// ---------------------------------------------------------
document.getElementById('year').textContent = new Date().getFullYear();

// ---------------------------------------------------------
// Mobile nav toggle
// ---------------------------------------------------------
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ---------------------------------------------------------
// Signature interaction: Analyst / Designer mode toggle
// Swaps accent color + copy to reflect Ramya's dual skillset
// ---------------------------------------------------------
const root = document.documentElement;
const btnAnalyst = document.getElementById('btnAnalyst');
const btnDesigner = document.getElementById('btnDesigner');
const modeWord = document.getElementById('modeWord');
const heroSub = document.getElementById('heroSub');

const copy = {
  analyst: {
    accent: '#3ECF8E',
    word: 'and finds the pattern.',
    sub: `Data Analyst intern who cleaned, validated and interrogated live datasets in Excel —
          turning raw records into decisions people could act on.`
  },
  designer: {
    accent: '#FF6B5D',
    word: 'and designs what it means.',
    sub: `UI/UX Design intern who translated user requirements into wireframes and prototypes in
          Figma — shaping structure into interfaces people can actually use.`
  }
};

function setMode(mode) {
  const data = copy[mode];
  root.style.setProperty('--accent', data.accent);
  modeWord.textContent = data.word;
  heroSub.textContent = data.sub;

  btnAnalyst.classList.toggle('is-active', mode === 'analyst');
  btnDesigner.classList.toggle('is-active', mode === 'designer');

  document.querySelectorAll('[data-mode-tag]').forEach(el => {
    const match = el.dataset.modeTag === mode;
    el.style.opacity = match ? '1' : '0.45';
  });
}

btnAnalyst.addEventListener('click', () => setMode('analyst'));
btnDesigner.addEventListener('click', () => setMode('designer'));

// ---------------------------------------------------------
// Active nav link on scroll
// ---------------------------------------------------------
const sections = document.querySelectorAll('main section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navAnchors.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${id}` ? 'var(--text)' : '';
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => observer.observe(s));
