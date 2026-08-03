const STORAGE_KEY = 'voxel-responses-v1';

const QUESTIONS = [
  {
    id: 'interest', type: 'single', title: 'Which project type interests you most?',
    options: ['Web apps', 'Mobile design', 'Data dashboards', 'E-commerce']
  },
  {
    id: 'features', type: 'multi', title: 'Which features matter most to you? (pick any)',
    options: ['Smooth animations', 'Fast load times', 'Accessibility', 'Dark mode']
  },
  {
    id: 'rating', type: 'rating', title: 'How would you rate the ease of use of these demos?'
  },
  {
    id: 'source', type: 'single', title: 'How did you find this project series?',
    options: ['GitHub', 'Portfolio site', 'A friend', 'Other']
  },
  {
    id: 'feedback', type: 'text', title: 'Any feedback or feature requests?'
  }
];

let responses = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
let current = {};
let step = 0;

const introCard = document.getElementById('introCard');
const surveyCard = document.getElementById('surveyCard');
const doneCard = document.getElementById('doneCard');
const resultsCard = document.getElementById('resultsCard');
const questionWrap = document.getElementById('questionWrap');
const progressFill = document.getElementById('progressFill');
const stepNum = document.getElementById('stepNum');
const nextBtn = document.getElementById('nextBtn');
const backBtn = document.getElementById('backBtn');

document.getElementById('stepTotal').textContent = QUESTIONS.length;

function showOnly(card) {
  [introCard, surveyCard, doneCard, resultsCard].forEach(c => c.hidden = c !== card);
}

document.getElementById('startBtn').addEventListener('click', () => {
  current = {};
  step = 0;
  showOnly(surveyCard);
  renderQuestion();
});

document.getElementById('viewResultsBtn').addEventListener('click', renderResults);
document.getElementById('seeResultsBtn').addEventListener('click', renderResults);
document.getElementById('backHomeBtn').addEventListener('click', () => showOnly(introCard));
document.getElementById('restartBtn').addEventListener('click', () => {
  current = {}; step = 0; showOnly(surveyCard); renderQuestion();
});

function renderQuestion() {
  const q = QUESTIONS[step];
  progressFill.style.width = `${((step) / QUESTIONS.length) * 100}%`;
  stepNum.textContent = step + 1;
  backBtn.style.visibility = step === 0 ? 'hidden' : 'visible';

  document.getElementById('stepDots').innerHTML = QUESTIONS.map((_, i) =>
    `<span class="step-dot ${i === step ? 'is-active' : i < step ? 'is-done' : ''}"></span>`
  ).join('');

  let html = `<h2 class="q-title">${q.title}</h2>`;

  if (q.type === 'single') {
    html += `<div class="option-list">` + q.options.map(opt => `
      <button type="button" class="option-btn ${current[q.id] === opt ? 'is-selected' : ''}" data-value="${opt}">
        <span class="option-check">${current[q.id] === opt ? '✓' : ''}</span>${opt}
      </button>`).join('') + `</div>`;
  } else if (q.type === 'multi') {
    const selected = current[q.id] || [];
    html += `<div class="option-list">` + q.options.map(opt => `
      <button type="button" class="option-btn ${selected.includes(opt) ? 'is-selected' : ''}" data-multi data-value="${opt}">
        <span class="option-check">${selected.includes(opt) ? '✓' : ''}</span>${opt}
      </button>`).join('') + `</div>`;
  } else if (q.type === 'rating') {
    html += `<div class="rating-row">` + [1,2,3,4,5].map(n => `
      <button type="button" class="rating-btn ${current[q.id] === n ? 'is-selected' : ''}" data-value="${n}">${n}</button>
    `).join('') + `</div>
    <div style="display:flex; justify-content:space-between; margin-top:8px; font-size:0.75rem; color:var(--text-dim);">
      <span>Needs work</span><span>Excellent</span>
    </div>`;
  } else if (q.type === 'text') {
    html += `<textarea class="text-answer" id="textAnswer" placeholder="Type your thoughts…">${current[q.id] || ''}</textarea>`;
  }

  questionWrap.innerHTML = html;
  attachHandlers(q);
  updateNextState(q);
}

function attachHandlers(q) {
  if (q.type === 'single') {
    questionWrap.querySelectorAll('.option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        current[q.id] = btn.dataset.value;
        renderQuestion();
      });
    });
  } else if (q.type === 'multi') {
    questionWrap.querySelectorAll('.option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const val = btn.dataset.value;
        const list = current[q.id] || [];
        current[q.id] = list.includes(val) ? list.filter(v => v !== val) : [...list, val];
        renderQuestion();
      });
    });
  } else if (q.type === 'rating') {
    questionWrap.querySelectorAll('.rating-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        current[q.id] = Number(btn.dataset.value);
        renderQuestion();
      });
    });
  } else if (q.type === 'text') {
    const ta = document.getElementById('textAnswer');
    ta.addEventListener('input', () => {
      current[q.id] = ta.value;
      updateNextState(q);
    });
  }
}

function isAnswered(q) {
  const v = current[q.id];
  if (q.type === 'multi') return Array.isArray(v) && v.length > 0;
  if (q.type === 'text') return true; // optional
  return v !== undefined && v !== '';
}

function updateNextState(q) {
  nextBtn.disabled = !isAnswered(q);
  nextBtn.textContent = step === QUESTIONS.length - 1 ? 'Submit ✓' : 'Next →';
}

backBtn.addEventListener('click', () => {
  if (step === 0) return;
  step--;
  renderQuestion();
});

nextBtn.addEventListener('click', () => {
  const q = QUESTIONS[step];
  if (!isAnswered(q)) return;

  if (step < QUESTIONS.length - 1) {
    questionWrap.classList.add('leaving');
    setTimeout(() => { step++; questionWrap.classList.remove('leaving'); renderQuestion(); }, 200);
  } else {
    submitSurvey();
  }
});

function submitSurvey() {
  responses.push({ ...current, ts: Date.now() });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(responses));
  progressFill.style.width = '100%';
  setTimeout(() => { showOnly(doneCard); launchConfetti(); }, 200);
}

// Confetti celebration
const confettiCanvas = document.getElementById('confettiCanvas');
const cctx = confettiCanvas.getContext('2d');
function resizeConfetti() { confettiCanvas.width = window.innerWidth; confettiCanvas.height = window.innerHeight; }
window.addEventListener('resize', resizeConfetti);
resizeConfetti();

function launchConfetti() {
  const colors = ['#6C5CE7', '#FF7EB3', '#2FAE60', '#FFD166'];
  const particles = Array.from({ length: 90 }, () => ({
    x: confettiCanvas.width / 2, y: confettiCanvas.height / 2.5,
    vx: (Math.random() - 0.5) * 13, vy: Math.random() * -11 - 4,
    size: Math.random() * 6 + 4, color: colors[Math.floor(Math.random() * colors.length)],
    rotation: Math.random() * 360, life: 0
  }));
  function frame() {
    cctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    let alive = false;
    particles.forEach(p => {
      p.vy += 0.34; p.x += p.vx; p.y += p.vy; p.life++;
      if (p.life < 120) {
        alive = true;
        cctx.save();
        cctx.translate(p.x, p.y);
        cctx.rotate((p.rotation + p.life * 4) * Math.PI / 180);
        cctx.fillStyle = p.color;
        cctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        cctx.restore();
      }
    });
    if (alive) requestAnimationFrame(frame);
    else cctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  }
  requestAnimationFrame(frame);
}

function renderResults() {
  const body = document.getElementById('resultsBody');
  document.getElementById('responseCount').textContent = `${responses.length} response${responses.length !== 1 ? 's' : ''}`;

  if (!responses.length) {
    body.innerHTML = `<p style="color:var(--text-dim)">No responses yet — be the first to take the survey!</p>`;
  } else {
    let html = '';
    QUESTIONS.forEach(q => {
      if (q.type === 'single' || q.type === 'multi') {
        const counts = {};
        q.options.forEach(o => counts[o] = 0);
        responses.forEach(r => {
          const val = r[q.id];
          if (!val) return;
          if (Array.isArray(val)) val.forEach(v => counts[v] = (counts[v] || 0) + 1);
          else counts[val] = (counts[val] || 0) + 1;
        });
        const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
        html += `<div class="result-block"><h3>${q.title}</h3>` +
          Object.entries(counts).map(([label, count]) => {
            const pct = Math.round((count / total) * 100);
            return `<div class="bar-row"><span class="bar-label">${label}</span><div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div><span class="bar-pct">${pct}%</span></div>`;
          }).join('') + `</div>`;
      } else if (q.type === 'rating') {
        const vals = responses.map(r => r[q.id]).filter(Boolean);
        const avg = vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : '—';
        html += `<div class="result-block"><h3>${q.title}</h3><p style="font-family:var(--font-d); font-size:1.6rem; margin:0;">${avg} <span style="font-size:0.9rem; color:var(--text-dim); font-family:var(--font-b);">/ 5 average</span></p></div>`;
      } else if (q.type === 'text') {
        const texts = responses.map(r => r[q.id]).filter(t => t && t.trim());
        html += `<div class="result-block"><h3>${q.title}</h3>` +
          (texts.length ? texts.map(t => `<div class="result-text-item">${t}</div>`).join('') : `<p style="color:var(--text-dim); font-size:0.85rem;">No written feedback yet.</p>`) +
          `</div>`;
      }
    });
    body.innerHTML = html;

    // Animate bar fills in after paint
    requestAnimationFrame(() => {
      body.querySelectorAll('.bar-fill').forEach(bar => {
        const target = bar.style.width;
        bar.style.width = '0%';
        requestAnimationFrame(() => { bar.style.width = target; });
      });
    });
  }
  showOnly(resultsCard);
}

showOnly(introCard);
