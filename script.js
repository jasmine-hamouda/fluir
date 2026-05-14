// ============ TASK DETAIL ============
let currentDetailTaskId = null;

function openTaskDetail(taskId, title, urgency, time, cat, color, date, steps, tip) {
  currentDetailTaskId = taskId;
  document.getElementById('detail-title').textContent = title;
  document.getElementById('detail-date').textContent = date;
  document.getElementById('detail-tip').textContent = tip;
  document.getElementById('detail-color-bar').style.background = color;

  // Chips
  document.getElementById('detail-chips').innerHTML = `
    <span class="urgency-chip ${urgency}">${urgency}</span>
    <span class="time-chip small"><img src="icons/clock.svg" class="chip-icon" alt="" /> ${time}</span>
    <span class="cat-tag" style="background:${color};">${cat}</span>
  `;

  // Steps
  document.getElementById('detail-steps').innerHTML = steps.map((step, i) => `
    <div class="detail-step">
      <span class="detail-step-num">${i+1}</span>
      <span>${step}</span>
    </div>
  `).join('');

  // Update complete button
  const card = document.getElementById(taskId);
  const isComplete = card && card.classList.contains('completed');
  const btn = document.getElementById('detail-complete-btn');
  btn.textContent = isComplete ? 'completed ✓' : 'mark complete';
  btn.style.opacity = isComplete ? '0.5' : '1';

  navigateTo('screen-task-detail');
}

function completeFromDetail() {
  if (!currentDetailTaskId) return;
  const card = document.getElementById(currentDetailTaskId);
  if (card) {
    card.classList.add('completed');
    updateProgress();
    checkAllComplete();
  }
  const btn = document.getElementById('detail-complete-btn');
  btn.textContent = 'completed ✓';
  btn.style.opacity = '0.5';
  setTimeout(() => navigateTo('screen-tasks'), 800);
}

// ============ NAVIGATION ============
function navigateTo(screenId) {
  document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
  const target = document.getElementById(screenId);
  if (target) {
    target.classList.add('active');
    const scroll = target.querySelector('.screen-scroll');
    if (scroll) scroll.scrollTop = 0;
  }
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
}

// ============ CHIP SELECTION ============
function selectChip(chip, group) {
  chip.closest('.chip-group').querySelectorAll('.chip').forEach(c => c.classList.remove('selected'));
  chip.classList.add('selected');
}

function selectTopic(chip) {
  document.querySelectorAll('.topic-chip').forEach(c => c.classList.remove('active'));
  chip.classList.add('active');
}

// ============ MOOD SELECTION ============
function selectMood(btn) {
  btn.closest('.mood-row').querySelectorAll('.mood-btn').forEach(m => m.classList.remove('selected'));
  btn.classList.add('selected');
}

function selectCheckinMood(btn) {
  document.querySelectorAll('.checkin-mood-btn').forEach(m => m.classList.remove('selected'));
  btn.classList.add('selected');
}

// ============ TASK COMPLETION ============
function completeTask(taskId) {
  const card = document.getElementById(taskId);
  if (card) {
    card.classList.toggle('completed');
    updateProgress();
    checkAllComplete();
  }
}

function updateProgress() {
  const total = document.querySelectorAll('.task-card').length;
  const completed = document.querySelectorAll('.task-card.completed').length;
  const circumference = 201;
  const offset = circumference - (completed / total) * circumference;
  const ring = document.querySelector('.ring-fill');
  if (ring) ring.style.strokeDashoffset = offset;
  const numEl = document.querySelector('.progress-num');
  if (numEl) numEl.textContent = completed;
}

function checkAllComplete() {
  const total = document.querySelectorAll('.task-card').length;
  const completed = document.querySelectorAll('.task-card.completed').length;
  const completeState = document.getElementById('task-complete-state');
  if (completeState) completeState.classList.toggle('visible', completed === total);
  if (completed === total && total > 0) showConfetti();
}

// ============ CONFETTI ============
function showConfetti() {
  const overlay = document.getElementById('confetti-overlay');
  if (!overlay) return;
  overlay.classList.add('active');
  setTimeout(() => overlay.classList.remove('active'), 4000);
}

// ============ TASK BREAKDOWN ============
function toggleBreakdown(taskId) {
  const steps = document.getElementById('breakdown-' + taskId);
  if (steps) steps.classList.toggle('open');
}

// ============ RESET TASKS ============
function resetTasks() {
  const confirmed = confirm("this will clear all your completed tasks. ready to start fresh?");
  if (!confirmed) return;
  document.querySelectorAll('.task-card').forEach(card => card.classList.remove('completed'));
  document.querySelectorAll('.breakdown-steps').forEach(steps => steps.classList.remove('open'));
  const completeState = document.getElementById('task-complete-state');
  if (completeState) completeState.classList.remove('visible');
  updateProgress();
}

// ============ CATEGORY FILTER ============
function filterCategory(chip, category) {
  document.querySelectorAll('.cat-filter-chip').forEach(c => c.classList.remove('active'));
  chip.classList.add('active');
  document.querySelectorAll('.task-card').forEach(card => {
    card.style.display = (category === 'all' || card.dataset.category === category) ? 'block' : 'none';
  });
}

// ============ ADD TASK MODAL ============
function openAddTask() {
  const modal = document.getElementById('add-task-modal');
  if (modal) modal.classList.add('open');
  const dateInput = document.getElementById('task-date-input');
  if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];
}

function closeAddTask() {
  const modal = document.getElementById('add-task-modal');
  if (modal) modal.classList.remove('open');
  document.getElementById('breakdown-loading').classList.remove('visible');
  document.getElementById('breakdown-preview').classList.remove('visible');
  document.getElementById('custom-cat-form').classList.remove('open');
  const input = document.getElementById('task-title-input');
  if (input) input.value = '';
}

// ============ CATEGORY SELECTION ============
function selectCategory(btn) {
  document.querySelectorAll('.cat-option').forEach(c => c.classList.remove('selected'));
  btn.classList.add('selected');
}

function addCustomCategory() {
  document.getElementById('custom-cat-form').classList.toggle('open');
}

// ============ TIP TEMPLATES ============
const tipTemplates = {
  call: "phone calls take more out of ADHD brains than most people realise. mid-morning is usually when your brain is warmest for this.",
  email: "a little movement before replying can help your brain shift gears. even just standing up and stretching first.",
  groceries: "click and collect exists for exactly this. same-day options at most supermarkets — your future self will thank you.",
  clean: "putting something on to listen to while you clean is a genuine strategy. your brain loves a soundtrack.",
  book: "once it is done it is done. starting is the hardest part — after that it takes care of itself.",
  write: "20 minutes of writing is still writing. short focused sprints work beautifully for ADHD brains.",
  kids: "you show up for your kids every day. this is just one more way you do that.",
  health: "taking care of yourself makes everything else more possible. this one counts.",
  work: "one focused hour does more than three scattered ones. find your window and protect it.",
  default: "you do not have to do this perfectly. you just have to start."
};

function getTip(title) {
  const t = title.toLowerCase();
  if (t.includes('call') || t.includes('phone') || t.includes('ring')) return tipTemplates.call;
  if (t.includes('email') || t.includes('reply') || t.includes('message')) return tipTemplates.email;
  if (t.includes('groceries') || t.includes('shop') || t.includes('buy') || t.includes('pick up')) return tipTemplates.groceries;
  if (t.includes('clean') || t.includes('tidy') || t.includes('wash')) return tipTemplates.clean;
  if (t.includes('book') || t.includes('appointment') || t.includes('schedule')) return tipTemplates.book;
  if (t.includes('write') || t.includes('report') || t.includes('draft') || t.includes('essay')) return tipTemplates.write;
  if (t.includes('kids') || t.includes('school') || t.includes('mia') || t.includes('pickup')) return tipTemplates.kids;
  if (t.includes('gp') || t.includes('doctor') || t.includes('health') || t.includes('medical')) return tipTemplates.health;
  if (t.includes('work') || t.includes('meeting') || t.includes('presentation')) return tipTemplates.work;
  return tipTemplates.default;
}

// ============ AI BREAKDOWN SIMULATION ============
const breakdownTemplates = {
  call: ['find the contact number', 'write down what you need to say', 'make the call'],
  email: ['open your email', 'write a short clear message', 'send it'],
  book: ['check your availability', 'find the contact details', 'make the booking'],
  buy: ['write a list of what you need', 'check if you have time today', 'go when you feel ready'],
  clean: ['pick one area to start with', 'set a 10 minute timer', 'do what you can in that time'],
  default: ['take a breath and start small', 'do the first step only', 'move to the next when ready']
};

function generateBreakdown() {
  const title = document.getElementById('task-title-input').value.toLowerCase();
  const loading = document.getElementById('breakdown-loading');
  const preview = document.getElementById('breakdown-preview');
  const stepsContainer = document.getElementById('breakdown-preview-steps');
  if (!title.trim()) { alert('add a task title first'); return; }
  loading.classList.add('visible');
  preview.classList.remove('visible');
  setTimeout(() => {
    loading.classList.remove('visible');
    let steps = breakdownTemplates.default;
    if (title.includes('call') || title.includes('phone')) steps = breakdownTemplates.call;
    else if (title.includes('email') || title.includes('reply') || title.includes('message')) steps = breakdownTemplates.email;
    else if (title.includes('book') || title.includes('appointment')) steps = breakdownTemplates.book;
    else if (title.includes('buy') || title.includes('shop') || title.includes('groceries')) steps = breakdownTemplates.buy;
    else if (title.includes('clean') || title.includes('tidy')) steps = breakdownTemplates.clean;
    stepsContainer.innerHTML = steps.map((step, i) => `<p class="step">${i + 1}. ${step}</p>`).join('');
    preview.classList.add('visible');
  }, 1800);
}

// ============ ADD TASK ============
let taskCounter = 5;

function calculateUrgency(dateStr, timeEstimate) {
  if (!dateStr) return 'medium';
  const today = new Date(); today.setHours(0,0,0,0);
  const due = new Date(dateStr + 'T00:00:00'); due.setHours(0,0,0,0);
  const daysUntil = Math.round((due - today) / (1000 * 60 * 60 * 24));
  const mins = parseInt(timeEstimate);
  if (daysUntil <= 0 && mins >= 30) return 'urgent';
  if (daysUntil <= 1 && mins >= 15) return 'urgent';
  if (daysUntil <= 2) return 'high';
  if (daysUntil <= 5) return 'medium';
  return 'low';
}

function addTask() {
  const title = document.getElementById('task-title-input').value.trim();
  if (!title) { alert('please add a task title'); return; }
  const dateVal = document.getElementById('task-date-input').value;
  const timeVal = document.getElementById('task-time-input').value;
  const selectedCat = document.querySelector('.cat-option.selected');
  const catName = selectedCat ? selectedCat.dataset.cat : 'personal';
  const catColor = selectedCat ? selectedCat.querySelector('.cat-dot').style.background : '#FFE4D0';
  const urgency = calculateUrgency(dateVal, timeVal);
  const timeLabel = timeVal >= 120 ? '2+ hrs' : timeVal >= 60 ? '1 hr' : `${timeVal} min`;
  const taskId = `task-${taskCounter++}`;
  const stepsEl = document.getElementById('breakdown-preview-steps');
  const stepsHTML = stepsEl && stepsEl.innerHTML ? stepsEl.innerHTML : '<p class="step">1. take a breath and start</p><p class="step">2. do the first small thing</p><p class="step">3. keep going</p>';
  const tip = getTip(title);

  let dateDisplay = '';
  if (dateVal) {
    const d = new Date(dateVal + 'T00:00:00');
    const today = new Date(); today.setHours(0,0,0,0);
    dateDisplay = d.getTime() === today.getTime() ? 'today' : d.toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' });
  }

  const taskHTML = `
    <div class="task-card" id="${taskId}" data-category="${catName}" data-urgency="${urgency}" style="--task-color: ${catColor};">
      <div class="task-color-bar"></div>
      <div class="task-body">
        <div class="task-top">
          <div class="task-left">
            <button class="task-check" onclick="completeTask('${taskId}')" aria-label="complete task">
              <img src="icons/check-circle.svg" alt="" />
            </button>
            <div class="task-info">
              <p class="task-name">${title}</p>
              <div class="task-meta">
                <span class="urgency-chip ${urgency}">${urgency}</span>
                <span class="time-chip small"><img src="icons/clock.svg" class="chip-icon" alt="" /> ${timeLabel}</span>
                <span class="cat-tag" style="background: ${catColor};">${catName}</span>
              </div>
              ${dateDisplay ? `<p class="task-date">${dateDisplay}</p>` : ''}
            </div>
          </div>
        </div>
        <button class="breakdown-btn" onclick="toggleBreakdown('${taskId}')">
          <img src="icons/scissors.svg" alt="" /> break it down
        </button>
        <div class="breakdown-steps" id="breakdown-${taskId}">${stepsHTML}</div>
        <div class="fluir-tip">
          <img src="icons/sun-dim.svg" class="tip-icon" alt="" />
          <p>${tip}</p>
        </div>
      </div>
    </div>`;

  const taskList = document.getElementById('task-list');
  if (taskList) {
    urgency === 'urgent' ? taskList.insertAdjacentHTML('afterbegin', taskHTML) : taskList.insertAdjacentHTML('beforeend', taskHTML);
  }
  closeAddTask();
  updateProgress();
}

// ============ BRAIN DUMP ============
const dumpKeywords = [
  { keywords: ['call', 'phone', 'ring'], cat: 'kids', color: '#F0E0A0' },
  { keywords: ['email', 'reply', 'message', 'text'], cat: 'work', color: '#B8D8C8' },
  { keywords: ['groceries', 'shop', 'buy', 'pick up', 'supermarket'], cat: 'home', color: '#B8D4E8' },
  { keywords: ['gp', 'doctor', 'dentist', 'appointment', 'health', 'medical'], cat: 'health', color: '#D0C0E8' },
  { keywords: ['clean', 'tidy', 'wash', 'laundry', 'dishes'], cat: 'home', color: '#B8D4E8' },
  { keywords: ['school', 'mia', 'kids', 'pickup', 'drop off', 'homework'], cat: 'kids', color: '#F0E0A0' },
  { keywords: ['work', 'meeting', 'report', 'presentation', 'boss', 'email'], cat: 'work', color: '#B8D8C8' },
];

function organiseBrainDump() {
  const text = document.getElementById('brain-dump-input').value.trim();
  if (!text) { alert('write something first — anything on your mind'); return; }
  const loading = document.getElementById('dump-loading');
  const results = document.getElementById('dump-results');
  loading.classList.add('visible');
  results.classList.remove('visible');

  setTimeout(() => {
    loading.classList.remove('visible');
    const sentences = text.split(/[,.\n]+/).map(s => s.trim()).filter(s => s.length > 3);
    const tasks = sentences.slice(0, 6).map((sentence, i) => {
      const lower = sentence.toLowerCase();
      let cat = 'personal', color = '#FFE4D0';
      for (const rule of dumpKeywords) {
        if (rule.keywords.some(k => lower.includes(k))) { cat = rule.cat; color = rule.color; break; }
      }
      return { id: i, title: sentence, cat, color };
    });

    const taskListEl = document.getElementById('dump-task-list');
    taskListEl.innerHTML = tasks.map(t => `
      <div class="dump-task-item" id="dump-item-${t.id}">
        <div class="dump-task-main">
          <div class="dump-task-dot" style="background:${t.color};"></div>
          <p class="dump-task-title">${t.title}</p>
          <span class="cat-tag dump-cat-tag" id="dump-cat-label-${t.id}" style="background:${t.color};">${t.cat}</span>
          <button class="dump-edit-btn" onclick="openDumpEditOverlay(${t.id}, '${t.title.replace(/'/g, "\\'")}', '${t.cat}', '${t.color}')">edit</button>
        </div>
      </div>`).join('');

    taskListEl.dataset.tasks = JSON.stringify(tasks);
    results.classList.add('visible');
  }, 2000);
}

function openDumpEditOverlay(id, title, cat, color) {
  const overlay = document.getElementById('dump-edit-overlay');
  overlay.dataset.taskId = id;
  document.getElementById('dump-overlay-title').value = title;
  overlay.querySelectorAll('.dump-inline-cat').forEach(btn => {
    btn.classList.toggle('selected', btn.dataset.cat === cat);
  });
  overlay.dataset.cat = cat;
  overlay.dataset.color = color;
  overlay.classList.add('active');
}

function closeDumpEditOverlay() {
  document.getElementById('dump-edit-overlay').classList.remove('active');
}

function pickDumpCat(id, btn, cat, color) {
  btn.closest('.dump-inline-cats').querySelectorAll('.dump-inline-cat').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  const overlay = document.getElementById('dump-edit-overlay');
  overlay.dataset.cat = cat;
  overlay.dataset.color = color;
}

function saveDumpOverlayEdit() {
  const overlay = document.getElementById('dump-edit-overlay');
  const id = parseInt(overlay.dataset.taskId);
  const newTitle = document.getElementById('dump-overlay-title').value.trim();
  const newCat = overlay.dataset.cat || 'personal';
  const newColor = overlay.dataset.color || '#FFE4D0';
  if (!newTitle) return;
  const item = document.getElementById(`dump-item-${id}`);
  if (item) {
    item.querySelector('.dump-task-title').textContent = newTitle;
    item.querySelector('.dump-task-dot').style.background = newColor;
    const label = document.getElementById(`dump-cat-label-${id}`);
    if (label) { label.textContent = newCat; label.style.background = newColor; }
  }
  const taskListEl = document.getElementById('dump-task-list');
  const tasks = JSON.parse(taskListEl.dataset.tasks || '[]');
  const task = tasks.find(t => t.id === id);
  if (task) { task.title = newTitle; task.cat = newCat; task.color = newColor; }
  taskListEl.dataset.tasks = JSON.stringify(tasks);
  closeDumpEditOverlay();
}

function addDumpTasks() {
  const taskListEl = document.getElementById('dump-task-list');
  const tasks = JSON.parse(taskListEl.dataset.tasks || '[]');
  const taskList = document.getElementById('task-list');
  tasks.forEach(t => {
    const id = `task-${taskCounter++}`;
    const tip = getTip(t.title);
    taskList.insertAdjacentHTML('beforeend', `
      <div class="task-card" id="${id}" data-category="${t.cat}" data-urgency="medium" style="--task-color: ${t.color};">
        <div class="task-color-bar"></div>
        <div class="task-body">
          <div class="task-top">
            <div class="task-left">
              <button class="task-check" onclick="completeTask('${id}')" aria-label="complete task">
                <img src="icons/check-circle.svg" alt="" />
              </button>
              <div class="task-info">
                <p class="task-name">${t.title}</p>
                <div class="task-meta">
                  <span class="urgency-chip medium">medium</span>
                  <span class="cat-tag" style="background: ${t.color};">${t.cat}</span>
                </div>
              </div>
            </div>
          </div>
          <button class="breakdown-btn" onclick="toggleBreakdown('${id}')">
            <img src="icons/scissors.svg" alt="" /> break it down
          </button>
          <div class="breakdown-steps" id="breakdown-${id}">
            <p class="step">1. take a breath and start</p>
            <p class="step">2. do the first small thing</p>
            <p class="step">3. keep going</p>
          </div>
          <div class="fluir-tip">
            <img src="icons/sun-dim.svg" class="tip-icon" alt="" />
            <p>${tip}</p>
          </div>
        </div>
      </div>`);
  });
  navigateTo('screen-tasks');
  updateProgress();
}

function clearDump() {
  document.getElementById('brain-dump-input').value = '';
  document.getElementById('dump-results').classList.remove('visible');
}

// ============ HARD DAY MODE ============
function activateHardDay() {
  document.getElementById('hard-day-overlay').classList.add('active');
}

function deactivateHardDay() {
  document.getElementById('hard-day-overlay').classList.remove('active');
}

// ============ SENSORY TOOLKIT ============
function switchToolkit(tab, panel) {
  document.querySelectorAll('.toolkit-tab').forEach(t => t.classList.remove('active'));
  tab.classList.add('active');
  document.querySelectorAll('.toolkit-panel').forEach(p => p.classList.add('hidden'));
  document.getElementById('toolkit-' + panel).classList.remove('hidden');
  if (panel === 'breathing') stopBreathing();
}

// ============ BOX BREATHING ============
let breathingActive = false;
let breathingInterval = null;
let breathingPhase = 0;
let breathingCount = 4;

const breathingPhases = [
  { label: 'inhale', duration: 4 },
  { label: 'hold', duration: 4 },
  { label: 'exhale', duration: 4 },
  { label: 'hold', duration: 4 },
];

function toggleBreathing() {
  breathingActive ? stopBreathing() : startBreathing();
}

function startBreathing() {
  breathingActive = true;
  document.getElementById('breathing-btn').textContent = 'stop';
  document.getElementById('breathing-line').classList.add('animating');
  document.getElementById('breathing-dot').classList.add('animating');
  breathingPhase = 0;
  breathingCount = breathingPhases[0].duration;
  runBreathingPhase();
}

function runBreathingPhase() {
  if (!breathingActive) return;
  const phase = breathingPhases[breathingPhase % 4];
  document.getElementById('breathing-instruction').textContent = phase.label;
  breathingCount = phase.duration;
  document.getElementById('breathing-count').textContent = breathingCount;
  breathingInterval = setInterval(() => {
    if (!breathingActive) { clearInterval(breathingInterval); return; }
    breathingCount--;
    document.getElementById('breathing-count').textContent = breathingCount;
    if (breathingCount <= 0) {
      clearInterval(breathingInterval);
      breathingPhase++;
      setTimeout(runBreathingPhase, 200);
    }
  }, 1000);
}

function stopBreathing() {
  breathingActive = false;
  clearInterval(breathingInterval);
  document.getElementById('breathing-btn').textContent = 'start';
  document.getElementById('breathing-line').classList.remove('animating');
  document.getElementById('breathing-dot').classList.remove('animating');
  document.getElementById('breathing-instruction').textContent = 'tap start to begin';
  document.getElementById('breathing-count').textContent = '';
}

// ============ 5-4-3-2-1 GROUNDING ============
const groundingSteps = [
  { number: 5, question: 'what can you see?' },
  { number: 4, question: 'what can you touch?' },
  { number: 3, question: 'what can you hear?' },
  { number: 2, question: 'what can you smell?' },
  { number: 1, question: 'what can you taste?' },
];
let groundingStep = 0;

function nextGrounding() {
  groundingStep++;
  if (groundingStep >= groundingSteps.length) {
    document.getElementById('grounding-card').style.display = 'none';
    document.getElementById('grounding-complete').classList.add('visible');
    return;
  }
  const step = groundingSteps[groundingStep];
  document.getElementById('grounding-number').textContent = step.number;
  document.getElementById('grounding-question').textContent = step.question;
  document.getElementById('grounding-input').value = '';
}

function resetGrounding() {
  groundingStep = 0;
  document.getElementById('grounding-card').style.display = 'flex';
  document.getElementById('grounding-complete').classList.remove('visible');
  document.getElementById('grounding-number').textContent = groundingSteps[0].number;
  document.getElementById('grounding-question').textContent = groundingSteps[0].question;
  document.getElementById('grounding-input').value = '';
}

// ============ CHECK-IN SUBMIT ============
function submitCheckin() {
  const confirmation = document.getElementById('checkin-confirmation');
  const form = document.querySelector('.checkin-form');
  const cta = document.querySelector('#screen-checkin .cta-btn');
  if (confirmation) {
    confirmation.classList.add('visible');
    if (form) form.style.display = 'none';
    if (cta) cta.style.display = 'none';
    setTimeout(() => showEndOfDayReward(), 1500);
  }
}

function editCheckin() {
  const confirmation = document.getElementById('checkin-confirmation');
  const form = document.querySelector('.checkin-form');
  const cta = document.querySelector('#screen-checkin .cta-btn');
  if (confirmation) {
    confirmation.classList.remove('visible');
    if (form) form.style.display = 'flex';
    if (cta) cta.style.display = 'block';
  }
}

function showEndOfDayReward() {
  const reward = document.getElementById('end-of-day-reward');
  if (reward) reward.classList.add('visible');
}

function closeReward() {
  const reward = document.getElementById('end-of-day-reward');
  if (reward) reward.classList.remove('visible');
  navigateTo('screen-dashboard');
}

// ============ WAITLIST ============
function joinWaitlist() {
  const confirmation = document.getElementById('waitlist-confirmation');
  const form = document.querySelector('.waitlist-form');
  if (confirmation && form) {
    form.style.display = 'none';
    confirmation.classList.add('visible');
  }
}

// ============ AUDIO TOAST ============
function showAudioToast() {
  const toast = document.getElementById('audio-toast');
  if (!toast) return;
  toast.classList.add('visible');
  setTimeout(() => toast.classList.remove('visible'), 2500);
}

// ============ INIT ============
document.addEventListener('DOMContentLoaded', () => {
  navigateTo('screen-onboarding');
});