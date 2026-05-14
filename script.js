// ============ NAVIGATION ============
function navigateTo(screenId) {
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });
  const target = document.getElementById(screenId);
  if (target) {
    target.classList.add('active');
    const scroll = target.querySelector('.screen-scroll');
    if (scroll) scroll.scrollTop = 0;
  }
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.remove('active');
  });
}

// ============ CHIP SELECTION ============
function selectChip(chip, group) {
  const allChips = chip.closest('.chip-group').querySelectorAll('.chip');
  allChips.forEach(c => c.classList.remove('selected'));
  chip.classList.add('selected');
}

// ============ TOPIC CHIP SELECTION ============
function selectTopic(chip) {
  document.querySelectorAll('.topic-chip').forEach(c => c.classList.remove('active'));
  chip.classList.add('active');
}

// ============ MOOD SELECTION (DASHBOARD) ============
function selectMood(btn) {
  btn.closest('.mood-row').querySelectorAll('.mood-btn').forEach(m => m.classList.remove('selected'));
  btn.classList.add('selected');
}

// ============ MOOD SELECTION (CHECK-IN) ============
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
  if (completeState) {
    completeState.classList.toggle('visible', completed === total);
  }
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
    if (category === 'all' || card.dataset.category === category) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

// ============ ADD TASK MODAL ============
function openAddTask() {
  const modal = document.getElementById('add-task-modal');
  if (modal) modal.classList.add('open');
  // Set default date to today
  const dateInput = document.getElementById('task-date-input');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
  }
}

function closeAddTask() {
  const modal = document.getElementById('add-task-modal');
  if (modal) modal.classList.remove('open');
  // Reset modal state
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
  const form = document.getElementById('custom-cat-form');
  if (form) form.classList.toggle('open');
}

// ============ AI BREAKDOWN SIMULATION ============
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

  if (!title.trim()) {
    alert('add a task title first');
    return;
  }

  // Show loading
  loading.classList.add('visible');
  preview.classList.remove('visible');

  // Simulate AI thinking
  setTimeout(() => {
    loading.classList.remove('visible');

    // Pick template based on keywords
    let steps = breakdownTemplates.default;
    if (title.includes('call') || title.includes('phone') || title.includes('ring')) steps = breakdownTemplates.call;
    else if (title.includes('email') || title.includes('message') || title.includes('reply')) steps = breakdownTemplates.email;
    else if (title.includes('book') || title.includes('appointment') || title.includes('schedule')) steps = breakdownTemplates.book;
    else if (title.includes('buy') || title.includes('shop') || title.includes('groceries') || title.includes('pick up')) steps = breakdownTemplates.buy;
    else if (title.includes('clean') || title.includes('tidy') || title.includes('wash')) steps = breakdownTemplates.clean;

    // Render steps
    stepsContainer.innerHTML = steps.map((step, i) =>
      `<p class="step">${i + 1}. ${step}</p>`
    ).join('');

    preview.classList.add('visible');
  }, 1800);
}

// ============ ADD TASK TO LIST ============
let taskCounter = 5;

function calculateUrgency(dateStr, timeEstimate) {
  if (!dateStr) return 'medium';
  const today = new Date();
  today.setHours(0,0,0,0);
  const due = new Date(dateStr);
  due.setHours(0,0,0,0);
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
  const catColor = selectedCat ? getComputedStyle(selectedCat).getPropertyValue('--cat-color').trim() || '#FFE4D0' : '#FFE4D0';

  const urgency = calculateUrgency(dateVal, timeVal);
  const timeLabel = timeVal >= 60 ? (timeVal >= 120 ? '2+ hrs' : '1 hr') : `${timeVal} min`;
  const taskId = `task-${taskCounter++}`;

  // Get breakdown steps if generated
  const stepsEl = document.getElementById('breakdown-preview-steps');
  const stepsHTML = stepsEl && stepsEl.innerHTML ? stepsEl.innerHTML : '<p class="step">1. take a breath and start</p><p class="step">2. do the first small thing</p><p class="step">3. keep going</p>';

  const tip = getTip(title);

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
            </div>
          </div>
        </div>
        <button class="breakdown-btn" onclick="toggleBreakdown('${taskId}')">
          <img src="icons/scissors.svg" alt="" /> break it down
        </button>
        <div class="breakdown-steps" id="breakdown-${taskId}">
          ${stepsHTML}
        </div>
        <div class="fluir-tip">
          <img src="icons/sun-dim.svg" class="tip-icon" alt="" />
          <p>${tip}</p>
        </div>
      </div>
    </div>
  `;

  const taskList = document.getElementById('task-list');
  if (taskList) {
    // Insert urgent tasks at top
    if (urgency === 'urgent') {
      taskList.insertAdjacentHTML('afterbegin', taskHTML);
    } else {
      taskList.insertAdjacentHTML('beforeend', taskHTML);
    }
  }

  closeAddTask();
  updateProgress();
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