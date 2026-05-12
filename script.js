// ============ NAVIGATION ============
function navigateTo(screenId) {
  // Hide all screens
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });

  // Show target screen
  const target = document.getElementById(screenId);
  if (target) {
    target.classList.add('active');
    // Scroll to top
    const scroll = target.querySelector('.screen-scroll');
    if (scroll) scroll.scrollTop = 0;
  }

  // Update nav active states
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.remove('active');
  });
}

// ============ CHIP SELECTION ============
function selectChip(chip, group) {
  // Deselect all chips in the same group
  const allChips = chip.closest('.chip-group').querySelectorAll('.chip');
  allChips.forEach(c => c.classList.remove('selected'));
  // Select clicked chip
  chip.classList.add('selected');
}

// ============ TOPIC CHIP SELECTION ============
function selectTopic(chip) {
  const allChips = document.querySelectorAll('.topic-chip');
  allChips.forEach(c => c.classList.remove('active'));
  chip.classList.add('active');
}

// ============ MOOD SELECTION (DASHBOARD) ============
function selectMood(btn) {
  const allMoods = btn.closest('.mood-row').querySelectorAll('.mood-btn');
  allMoods.forEach(m => m.classList.remove('selected'));
  btn.classList.add('selected');
}

// ============ MOOD SELECTION (CHECK-IN) ============
function selectCheckinMood(btn) {
  const allMoods = document.querySelectorAll('.checkin-mood-btn');
  allMoods.forEach(m => m.classList.remove('selected'));
  btn.classList.add('selected');
}

// ============ TASK COMPLETION ============
function completeTask(taskId) {
  const card = document.getElementById(taskId);
  if (card) {
    card.classList.toggle('completed');
    updateProgress();
  }
}

function updateProgress() {
  const total = document.querySelectorAll('.task-card').length;
  const completed = document.querySelectorAll('.task-card.completed').length;

  // Update progress ring
  const circumference = 201;
  const offset = circumference - (completed / total) * circumference;
  const ring = document.querySelector('.ring-fill');
  if (ring) {
    ring.style.strokeDashoffset = offset;
  }

  // Update progress text
  const numEl = document.querySelector('.progress-num');
  if (numEl) numEl.textContent = completed;
}

// ============ TASK BREAKDOWN ============
function toggleBreakdown(taskId) {
  const steps = document.getElementById('breakdown-' + taskId);
  if (steps) {
    steps.classList.toggle('open');
  }
}

// ============ RESET TASKS ============
function resetTasks() {
  document.querySelectorAll('.task-card').forEach(card => {
    card.classList.remove('completed');
  });
  document.querySelectorAll('.breakdown-steps').forEach(steps => {
    steps.classList.remove('open');
  });
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

  // Auto-hide after 3 seconds
  setTimeout(() => {
    if (confirmation) confirmation.classList.remove('visible');
  }, 3000);
}

// ============ AUDIO TOAST ============
function showAudioToast() {
  const toast = document.getElementById('audio-toast');
  if (!toast) return;
  toast.classList.add('visible');
  setTimeout(() => {
    toast.classList.remove('visible');
  }, 2500);
}

// ============ INIT ============
document.addEventListener('DOMContentLoaded', () => {
  // Make sure onboarding is showing first
  navigateTo('screen-onboarding');
});