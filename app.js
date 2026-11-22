const icons = {
  terminal: '<path d="m4 6 5 6-5 6m9 0h7"/>',
  overview: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
  folder: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/>',
  'check-square': '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="m8 12 3 3 5-6"/>',
  gauge: '<path d="M4 17a9 9 0 1 1 16 0M12 13l4-4M7 14h.01M12 8h.01M17 14h.01"/><circle cx="12" cy="14" r="1.5"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="m9 4 1-2h4l1 2 2 1 2-.2 2 3-1 2v3l1 2-2 3-2-.2-2 1-1 2h-4l-1-2-2-1-2 .2-2-3 1-2v-3l-1-2 2-3 2 .2Z" transform="translate(0 .5)"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  left: '<path d="m15 18-6-6 6-6"/>',
  right: '<path d="m9 18 6-6-6-6"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  play: '<path d="m8 5 12 7-12 7Z"/>',
  pause: '<path d="M9 5v14m6-14v14"/>',
  alert: '<path d="M10.3 4.4a2 2 0 0 1 3.4 0l7.6 13.4a2 2 0 0 1-1.7 3H4.4a2 2 0 0 1-1.7-3Z"/><path d="M12 9v4m0 4h.01"/>',
  edit: '<path d="m14 5 5 5M4 20l4-.8L20 7l-4-4L4 15Z"/>',
  trash: '<path d="M4 7h16m-10 0V4h4v3m4 0-1 13H7L6 7m4 4v5m4-5v5"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  check: '<path d="m5 12 4 4L19 6"/>'
};

const projects = [
  { id: 'orbit', name: 'Orbit API', color: 'purple', description: 'Authentication, rate limits, and API reliability.' },
  { id: 'fieldnotes', name: 'Fieldnotes', color: 'green', description: 'A local-first notebook for capturing research notes.' },
  { id: 'devkit', name: 'Devkit CLI', color: 'blue', description: 'Scaffolding and release tools for internal projects.' }
];

const tones = {
  purple: '#c6b8ff',
  green: '#a5dfca',
  blue: '#adc9ff'
};

const sprints = [
  { id: 1, project: 'orbit', title: 'Auth refactor', day: 0, start: 540, duration: 75 },
  { id: 2, project: 'fieldnotes', title: 'Editor shortcuts', day: 0, start: 735, duration: 60 },
  { id: 3, project: 'devkit', title: 'CLI scaffolding', day: 1, start: 585, duration: 90 },
  { id: 4, project: 'orbit', title: 'Rate limit tests', day: 2, start: 570, duration: 90 },
  { id: 5, project: 'fieldnotes', title: 'Offline drafts', day: 2, start: 750, duration: 75 },
  { id: 6, project: 'devkit', title: 'Release pipeline', day: 3, start: 645, duration: 90 },
  { id: 7, project: 'fieldnotes', title: 'Search indexing', day: 4, start: 555, duration: 90 },
  { id: 8, project: 'orbit', title: 'API docs', day: 4, start: 735, duration: 60 }
];

const tasks = [
  { name: 'Cover burst and sustained traffic', project: 'orbit', priority: 'High', status: 'In progress', minutes: 45, sprint: 4 },
  { name: 'Verify retry headers', project: 'orbit', priority: 'Medium', status: 'To do', minutes: 30, sprint: 4 },
  { name: 'Add request fixtures', project: 'orbit', priority: 'Medium', status: 'Done', minutes: 15, sprint: 4 },
  { name: 'Recover drafts after refresh', project: 'fieldnotes', priority: 'High', status: 'To do', minutes: 45, sprint: 5 },
  { name: 'Add preview release workflow', project: 'devkit', priority: 'Medium', status: 'To do', minutes: 60, sprint: 6 }
];

const usageTools = [{
  name: 'Codex',
  windows: [
    { name: '5-hour window', value: 72, reset: 'Wed, Nov 25 · 2:15 PM', recordedAt: 'Nov 25 · 9:10 AM' },
    { name: 'Weekly window', value: 28, reset: 'Mon, Nov 30 · 9:00 AM', recordedAt: 'Nov 25 · 9:10 AM' }
  ]
}];

const pageNames = {
  overview: 'Overview', calendar: 'Calendar', projects: 'Projects',
  tasks: 'Tasks', usage: 'Usage', settings: 'Settings'
};
const pageHints = {
  overview: 'Your starting point for the next sprint, the sessions coming up soon, and any allowance alerts.',
  calendar: 'Your full schedule of sprints. Each sticky note marks a block of time set aside for focused work.',
  projects: 'A project groups tasks and sprints that serve the same goal, so you can see the related work together.',
  tasks: 'A task is a piece of work within a project. Use its checkbox to mark it done.',
  usage: 'Track the allowance and expected reset times you record for each coding tool.',
  settings: 'Choose how sprint times appear across your workspace.'
};
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const gridStart = 9 * 60;
const gridEnd = 15 * 60;
const { calendarEpoch, calendarZone, dayMs, dayMinutes, taskStatuses, clockAt, elapsedAt, changeTimer } = workspaceData;
const main = document.querySelector('#main');
const dialog = document.querySelector('#dialog');
let week = clockAt().week;
let calendarView = 'week';
let timeFormat = '12';
let selectedUsageTool = usageTools[0];
let toastTimer;
let dialogOpenerAction;
let openingWorkspace = true;
let storageAvailable = false;
let storageRevision = 0;
let storageIssue;
let storageQueue = Promise.resolve();
let editSequence = 0;
let savedEditSequence = 0;
let timerInterval;

function workspaceSnapshot() {
  return structuredClone({
    projects,
    tasks,
    sprints,
    usageTools,
    preferences: { timeFormat }
  });
}

function applyWorkspace(data) {
  for (const [target, saved] of [[projects, data.projects], [tasks, data.tasks], [sprints, data.sprints], [usageTools, data.usageTools]]) {
    target.length = 0;
    for (const item of saved) target.push(item);
  }
  timeFormat = data.preferences.timeFormat;
  selectedUsageTool = usageTools[0];
}

async function openWorkspace() {
  try {
    const record = await workspaceStore.read();
    if (record) {
      const { data, revision, schemaVersion } = record;
      if (schemaVersion !== workspaceStore.schemaVersion || !Number.isSafeInteger(revision) || revision < 1) {
        throw new Error('Unsupported workspace data.');
      }
      applyWorkspace(workspaceData.validateWorkspace(data));
      storageRevision = revision;
    }
    storageAvailable = true;
  } catch {
    storageIssue = 'open';
  }
  openingWorkspace = false;
  main.removeAttribute('aria-busy');
  render();
}

function updateStorageFeedback() {
  const region = main.querySelector('.storage-feedback');
  if (!region) return;
  const message = {
    open: 'Browser storage could not be opened. You can export any changes made in this tab.',
    write: 'Your changes are open in this tab. Check available browser storage and retry saving.',
    conflict: 'Another tab saved a newer workspace. Export this tab’s changes before reloading.'
  }[storageIssue];
  region.innerHTML = message ? `<div class="callout" role="alert">${icon('alert')}<div>
    <strong>Workspace could not be saved locally</strong><p>${message}</p>
    <div class="actions">
      ${storageIssue === 'write' ? button('Retry save', 'retry-storage') : ''}
      ${button('Export JSON', 'export-workspace')}
    </div>
  </div></div>` : '';
}

function saveWorkspace(message) {
  const edit = ++editSequence;
  if (!storageAvailable) {
    updateStorageFeedback();
    return;
  }
  const snapshot = workspaceSnapshot();
  storageQueue = storageQueue.then(async () => {
    try {
      storageRevision = await workspaceStore.write(snapshot, storageRevision);
      savedEditSequence = edit;
      storageIssue = undefined;
      if (message) toast(message);
    } catch (error) {
      storageIssue = error?.name === 'VersionError' ? 'conflict' : 'write';
    }
    updateStorageFeedback();
  });
}

function exportWorkspace() {
  const backup = { schemaVersion: workspaceStore.schemaVersion, exportedAt: new Date().toISOString(), data: workspaceSnapshot() };
  const file = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'sprintline-backup.json';
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function importWorkspace() {
  modal('Import backup',
    '<p class="muted">Choose a JSON backup exported by Sprintline.</p>' +
    field('Backup file', '<input name="backup" type="file" accept=".json,application/json">') +
    '<p class="form-error" role="alert"></p>',
    '', null, button('Cancel', 'close') + button('Review backup', 'review-import', null, true));
}

async function reviewBackup(control) {
  const form = control.closest('form');
  const input = form.querySelector('[name="backup"]');
  const error = form.querySelector('.form-error');
  if (!input.files.length) {
    error.textContent = 'Choose a JSON backup file to continue.';
    input.focus();
    return;
  }
  control.disabled = true;
  try {
    const data = workspaceData.readBackup(await input.files[0].text(), workspaceStore.schemaVersion);
    if (!dialog.open || !form.isConnected) return;
    const count = (items, name) => `${items.length} ${name}${items.length === 1 ? '' : 's'}`;
    const summary = [count(data.projects, 'project'), count(data.sprints, 'sprint'), count(data.tasks, 'task'), count(data.usageTools, 'tool')].join(' · ');
    replaceWorkspaceDialog('Replace workspace', 'Import and replace', summary,
      'Importing this backup replaces the workspace currently open in this browser. Export your current workspace first if you want to keep it.',
      data, 'Backup imported.');
  } catch (failure) {
    if (form.isConnected) error.textContent = failure.message || 'The file could not be read. Choose a valid backup and try again.';
  } finally {
    control.disabled = false;
  }
}

function replaceWorkspaceDialog(title, confirmLabel, summary, message, data, successMessage) {
  modal(title, `${summary ? `<p><strong>${escapeText(summary)}</strong></p>` : ''}
    <p class="muted">${escapeText(message)}</p><p class="form-error" role="alert"></p>`, '', null,
    button('Cancel', 'close') + `<button class="button danger" type="button" data-replace-workspace>${confirmLabel}</button>`);
  const control = dialog.querySelector('[data-replace-workspace]');
  control.addEventListener('click', async () => {
    const error = dialog.querySelector('.form-error');
    if (!storageAvailable) {
      error.textContent = 'Browser storage is unavailable. Restore storage access and reopen the app before trying again.';
      return;
    }
    control.disabled = true;
    dialog.dataset.committing = 'true';
    const commit = storageQueue.then(async () => {
      storageRevision = await workspaceStore.write(data, storageRevision);
    });
    storageQueue = commit.catch(() => {});
    try {
      await commit;
      applyWorkspace(data);
      week = clockAt().week;
      storageIssue = undefined;
      savedEditSequence = ++editSequence;
      dialog.close();
      render();
      focusAfterSave(null, dialogOpenerAction);
      toast(successMessage);
    } catch (failure) {
      const conflict = failure?.name === 'VersionError';
      error.textContent = conflict
        ? 'Another tab saved a newer workspace. Reload the latest version before trying again.'
        : 'The change could not be saved. Check available browser storage and try again.';
    } finally {
      delete dialog.dataset.committing;
      control.disabled = false;
    }
  });
}

function clearWorkspace() {
  replaceWorkspaceDialog('Clear all data', 'Clear all data', '',
    'This removes all projects, tasks, sprints, timers, and usage readings for this workspace. Display settings return to their defaults.',
    workspaceData.emptyWorkspace(), 'Workspace data cleared.');
}

function icon(name) {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]}</svg>`;
}

function escapeText(value) {
  return String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
}

function projectFor(id) {
  return projects.find(project => project.id === id);
}

function activeProjects() {
  return projects.filter(project => !project.archived);
}

function isActiveSprint(sprint) {
  return !projectFor(sprint.project).archived;
}

function sprintStart(sprint) {
  return ((sprint.week || 0) * 7 + sprint.day) * dayMinutes + sprint.start;
}

function sprintConflicts(sprint) {
  const start = sprintStart(sprint);
  return sprints.filter(other => other.id !== sprint.id && isActiveSprint(other) &&
    start < sprintStart(other) + other.duration && sprintStart(other) < start + sprint.duration);
}

function tasksForSprint(sprintId) {
  return tasks.filter(task => task.sprint === sprintId);
}

function projectDot(project) {
  return `<span class="project-dot" style="--tone:${tones[project.color]}" aria-hidden="true"></span>`;
}

function dateAt(day, offset = week) {
  return new Date(calendarEpoch + (day + offset * 7) * dayMs);
}

function dateLabel(date, options) {
  return new Intl.DateTimeFormat('en-US', { ...options, timeZone: 'UTC' }).format(date);
}

function weekLabel() {
  const first = dateAt(0);
  const last = dateAt(6);
  const start = dateLabel(first, { month: 'short', day: 'numeric' });
  const end = first.getUTCMonth() === last.getUTCMonth() ? last.getUTCDate() : dateLabel(last, { month: 'short', day: 'numeric' });
  return `${start}–${end}, ${last.getUTCFullYear()}`;
}

function timeLabel(minutes, meridiem = true) {
  const hour = Math.floor(minutes / 60) % 24;
  const minute = String(minutes % 60).padStart(2, '0');
  if (timeFormat === '24') return `${String(hour).padStart(2, '0')}:${minute}`;
  return `${hour % 12 || 12}:${minute}${meridiem ? (hour < 12 ? ' AM' : ' PM') : ''}`;
}

function timeRange(sprint) {
  const end = sprint.start + sprint.duration;
  return `${timeLabel(sprint.start, Math.floor(sprint.start / 720) !== Math.floor(end / 720))}–${timeLabel(end)}`;
}

function button(label, action, glyph, primary = false) {
  return `<button class="button${primary ? ' primary' : ''}" type="button" data-action="${action}">${glyph ? icon(glyph) : ''}${label}</button>`;
}

function iconButton(label, action, glyph) {
  return `<button class="icon-button" type="button" data-action="${action}" aria-label="${label}" title="${label}">${icon(glyph)}</button>`;
}

function pageHeader({ title, description, action }, hint) {
  return `<header class="page-intro">
    <div class="page-heading">
      <div><h1>${escapeText(title)}</h1>${description ? `<p>${escapeText(description)}</p>` : ''}</div>
      ${action ? `<div class="actions heading-actions">${action}</div>` : ''}
    </div>
    ${hint ? `<p class="page-hint"><span>${escapeText(hint)}</span></p>` : ''}
  </header>`;
}

function panelHeader(title, right = '', subtitle = '') {
  return `<div class="panel-header"><div><h2>${title}</h2>${subtitle ? `<p class="muted small">${subtitle}</p>` : ''}</div>${right}</div>`;
}

function empty(message) {
  return `<p class="empty">${message}</p>`;
}

function sprintList(entries) {
  if (!entries.length) return empty('No sprints scheduled.');
  return `<ul class="queue">${entries.map(sprint => {
    const project = projectFor(sprint.project);
    const date = dateAt(sprint.day, sprint.week || 0);
    return `<li class="queue-row">
      <div><div class="queue-title">${escapeText(sprint.title)}</div><div class="queue-date">${dateLabel(date, { weekday: 'short', month: 'short', day: 'numeric' })} · ${timeLabel(sprint.start)}</div></div>
      <div class="queue-project">${projectDot(project)}${escapeText(project.name)}</div>
      <span class="pill">${sprint.duration} min</span>
      ${iconButton(`Open ${escapeText(sprint.title)}`, `sprint:${sprint.id}`, 'right')}
    </li>`;
  }).join('')}</ul>`;
}

function calendarNote(sprint, gridPosition = '', compact = false) {
  const project = projectFor(sprint.project);
  const title = escapeText(sprint.title);
  const projectName = escapeText(project.name);
  const time = timeRange(sprint);
  const taskCount = tasksForSprint(sprint.id).length;
  const taskLabel = `${taskCount} ${taskCount === 1 ? 'task' : 'tasks'}`;
  return `<button class="calendar-note${gridPosition ? ' calendar-note-grid' : ''}${compact ? ' calendar-note-compact' : ''}" type="button"
    data-action="sprint:${sprint.id}" style="--note-paper:${tones[project.color]};${gridPosition}"
    aria-label="Open ${title}, ${projectName}, ${time}, ${taskLabel}" title="${title} · ${projectName} · ${time} · ${taskLabel}">
    <strong>${title}</strong>
    <span class="calendar-note-meta">${gridPosition ? '' : `<span>${projectName}</span>`}
      <span class="calendar-note-time">${time}</span><span class="calendar-note-count">${taskLabel}</span>
    </span>
  </button>`;
}

function calendarAgenda(entries) {
  if (!entries.length) return `<div class="calendar-agenda">${empty('No sprints scheduled.')}</div>`;
  const byDay = new Map();
  for (const sprint of entries) {
    if (!byDay.has(sprint.day)) byDay.set(sprint.day, []);
    byDay.get(sprint.day).push(sprint);
  }
  return `<div class="calendar-agenda">${Array.from(byDay, ([day, daySprints]) => `<section class="agenda-day">
    <h3>${dateLabel(dateAt(day), { weekday: 'long', month: 'short', day: 'numeric' })}</h3>
    <ul class="agenda-notes">${daySprints.map(sprint => `<li>${calendarNote(sprint)}</li>`).join('')}</ul>
  </section>`).join('')}</div>`;
}

function weekDayNotes(entries) {
  const groups = [];
  let group;
  for (const sprint of entries) {
    const start = Math.max(gridStart, sprint.start);
    const end = Math.min(gridEnd, sprint.start + sprint.duration);
    if (!group || start >= group.end) {
      group = { end, laneEnds: [], notes: [] };
      groups.push(group);
    }
    let lane = group.laneEnds.findIndex(laneEnd => laneEnd <= start);
    if (lane === -1) lane = group.laneEnds.length;
    group.laneEnds[lane] = end;
    group.end = Math.max(group.end, end);
    group.notes.push({ sprint, start, end, lane });
  }
  const span = gridEnd - gridStart;
  return groups.map(({ notes, laneEnds }) => notes.map(({ sprint, start, end, lane }) => {
    const width = 100 / laneEnds.length;
    const position = `--top:${(start - gridStart) / span * 100}%;--length:${(end - start) / span * 100}%;--lane-start:${lane * width}%;--lane-end:${(laneEnds.length - lane - 1) * width}%;`;
    return calendarNote(sprint, position, end - start < 55);
  }).join('')).join('');
}

function calendar() {
  const current = clockAt();
  const entries = sprints.filter(sprint => isActiveSprint(sprint) && (sprint.week || 0) === week)
    .sort((a, b) => a.day - b.day || a.start - b.start);
  const controls = `<div class="calendar-controls">
    <div class="segmented" aria-label="Calendar view">
      <button type="button" data-action="view-week" aria-pressed="${calendarView === 'week'}">Week</button>
      <button type="button" data-action="view-agenda" aria-pressed="${calendarView === 'agenda'}">Agenda</button>
    </div>
    ${week === current.week ? '' : button('Today', 'view-today')}
    <div class="stepper">${iconButton('Previous week', 'previous', 'left')}${iconButton('Next week', 'next', 'right')}</div>
  </div>`;
  const currentDay = index => week === current.week && index === current.day;
  const dayHeaders = days.map((day, index) => `<div class="day-label${currentDay(index) ? ' featured' : ''}">${day} <strong>${dateAt(index).getUTCDate()}</strong></div>`).join('');
  const hours = Array.from({ length: (gridEnd - gridStart) / 60 }, (_, index) => {
    const time = timeLabel(gridStart + index * 60);
    return `<span class="hour">${timeFormat === '12' ? time.replace(':00', '') : time}</span>`;
  }).join('');
  const columns = days.map((day, index) => `<div class="day-column${currentDay(index) ? ' featured' : ''}">
    ${weekDayNotes(entries.filter(sprint => sprint.day === index && sprint.start < gridEnd && sprint.start + sprint.duration > gridStart))}</div>`).join('');
  const outside = entries.filter(sprint => sprint.day >= days.length || sprint.start < gridStart || sprint.start + sprint.duration > gridEnd).length;
  const gridNotice = outside ? `<div class="calendar-grid-notice">
    <span>${outside} ${outside === 1 ? 'sprint extends' : 'sprints extend'} outside the week grid.</span>
    <button class="text-button" type="button" data-action="view-agenda">View in agenda</button>
  </div>` : '';
  const legend = activeProjects().map(project => `<span>${projectDot(project)}${escapeText(project.name)}</span>`).join('');
  return `<section class="panel calendar-panel">
    ${panelHeader('Sprint calendar', controls, weekLabel())}
    ${calendarView === 'week' && entries.length ? `<div class="calendar-week"><div class="calendar-grid"><div class="calendar-corner"></div>${dayHeaders}<div class="time-gutter">${hours}</div>${columns}</div>${gridNotice}</div>` : ''}
    ${calendarAgenda(entries)}
    <div class="calendar-footer small muted"><div class="legend">${legend}</div><span>Eastern Time</span></div>
  </section>`;
}

function isLowAllowance(item) {
  return item.value !== null && item.value <= 30;
}

function usagePageActions() {
  const windows = selectedUsageTool?.windows || [];
  const addTool = button('Add tool', 'new-usage-tool', 'plus', !selectedUsageTool);
  if (!windows.length) return addTool;
  const editLabel = windows.some(item => item.value !== null) ? 'Update allowance' : 'Record allowance';
  return addTool + button(editLabel, 'usage-edit', 'edit', true);
}

function usagePanel() {
  const tool = selectedUsageTool;
  if (!tool) return `<section class="panel">${empty('Add a coding tool to start tracking its allowance.')}</section>`;
  const toolOptions = usageTools.map((item, index) => [String(index), item.name]);
  const selector = field('Coding tool', `<select id="usage-tool">${options(toolOptions, String(usageTools.indexOf(tool)))}</select>`);
  const meters = tool.windows.map((item, index) => {
    const tone = isLowAllowance(item) ? 'var(--amber)' : 'var(--accent)';
    const recorded = item.value !== null;
    const name = escapeText(item.name);
    return `<div class="meter">
      <div class="meter-heading"><h3>${name}</h3><div>
        ${recorded ? `<strong style="color:${tone}">${item.value}%</strong>` : ''}
        ${iconButton(`Remove ${name} window`, `remove-window:${index}`, 'trash')}
      </div></div>
      ${recorded ? `
      <div class="meter-track" role="meter" aria-label="${name} remaining" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${item.value}"><span style="--value:${item.value}%;--tone:${tone}"></span></div>
      <div class="muted small">${item.reset ? `Expected reset ${escapeText(item.reset)}` : 'No expected reset entered'}</div>
      <div class="meter-footer"><span class="muted small">Recorded ${escapeText(item.recordedAt)}</span>
        <button class="text-button" type="button" data-action="clear-reading:${index}" aria-label="Clear ${name} reading">Clear reading</button>
      </div>` : `
      <p class="muted small">No reading recorded.</p>
      <div class="meter-footer">${button('Record reading', `usage-edit:${index}`, 'plus')}</div>`}
    </div>`;
  }).join('');
  const toolActions = `<div class="actions">
    ${button('Add window', 'new-window', 'plus')}
    ${iconButton(`Remove ${escapeText(tool.name)}`, 'remove-tool', 'trash')}
  </div>`;
  return `<div class="stack">
    <div class="panel usage-toolbar">${selector}${toolActions}</div>
    <section class="panel usage-allowance">
      ${panelHeader(`${escapeText(tool.name)} allowance`, '<span class="pill">Manual entry</span>')}
      ${meters ? `<div class="panel-body allowance-windows">${meters}</div>` : empty('Add a window to record an allowance reading.')}
    </section>
    ${allowanceCallout([tool])}
  </div>`;
}

function nextPanel(sprint) {
  if (!sprint) {
    return `<section class="panel next-sprint">${panelHeader('Next sprint')}
      <div class="panel-body"><p class="muted">${activeProjects().length ? 'No upcoming sprints.' : 'Create a project to plan your first sprint.'}</p>
      ${activeProjects().length ? '' : `<div class="empty-action">${button('New project', 'new-project', 'plus', true)}</div>`}</div></section>`;
  }
  const project = projectFor(sprint.project);
  const relatedTasks = tasksForSprint(sprint.id);
  const completed = relatedTasks.filter(task => task.status === 'Done').length;
  const date = dateLabel(dateAt(sprint.day, sprint.week || 0), { weekday: 'short', month: 'short', day: 'numeric' });
  return `<section class="panel next-sprint">
    ${panelHeader(sprint.timer?.state === 'running' ? 'Active sprint' : sprint.timer?.state === 'paused' ? 'Paused sprint' : 'Next sprint', `<span class="pill purple">${date}</span>`)}
    <div class="panel-body">
      <div class="next-project small">${projectDot(project)}${escapeText(project.name)}</div>
      <h3 class="next-title">${escapeText(sprint.title)}</h3>
      <div class="next-details">
        <span>${icon('clock')}${timeRange(sprint)} · ${sprint.duration} min</span>
        ${relatedTasks.length ? `<span>${icon('check-square')}${completed} of ${relatedTasks.length} tasks done</span>` : ''}
      </div>
      ${button('Open sprint', `sprint:${sprint.id}`, 'play', true)}
    </div>
  </section>`;
}

function allowanceCallout(tools, showLink = false) {
  const [lowest, ...other] = tools.flatMap(tool => tool.windows.filter(isLowAllowance).map(item => ({ tool, item })))
    .sort((a, b) => a.item.value - b.item.value);
  if (!lowest) return '';
  const { tool, item } = lowest;
  return `<div class="callout">${icon('alert')}<div><strong>Low allowance</strong>
    <p>${escapeText(tool.name)} · ${escapeText(item.name)} · ${item.value}% remaining</p>
    ${other.length ? `<p>${other.length} other ${other.length === 1 ? 'window is' : 'windows are'} low.</p>` : ''}
    ${showLink ? `<a href="#usage" data-action="open-usage:${usageTools.indexOf(tool)}">Review usage</a>` : ''}</div></div>`;
}

function overview() {
  const { position } = clockAt();
  const timerPriority = sprint => sprint.timer?.state === 'running' ? 0 : sprint.timer?.state === 'paused' ? 1 : 2;
  const [next, ...upcoming] = sprints.filter(sprint => isActiveSprint(sprint) && sprint.timer?.state !== 'finished' &&
      (timerPriority(sprint) < 2 || sprintStart(sprint) + sprint.duration > position))
    .sort((a, b) => timerPriority(a) - timerPriority(b) || sprintStart(a) - sprintStart(b)).slice(0, 3);
  return `<div class="overview-grid">
      <div class="stack">
        ${nextPanel(next)}
        ${allowanceCallout(usageTools, true)}
      </div>
      <section class="panel">
        ${panelHeader('Coming up', '<a class="text-button" href="#calendar">View calendar</a>')}
        <div class="panel-body overview-upcoming">
          ${upcoming.length ? upcoming.map(sprint => `<div>
            <p class="small muted">${dateLabel(dateAt(sprint.day, sprint.week || 0), { weekday: 'short', month: 'short', day: 'numeric' })}</p>
            ${calendarNote(sprint)}
          </div>`).join('') : '<p class="muted">No later sprints scheduled.</p>'}
        </div>
      </section>
    </div>`;
}

function taskCheckbox(task, readOnly = false) {
  return `<input type="checkbox" data-task-index="${tasks.indexOf(task)}" aria-label="${escapeText(task.name)}"${task.status === 'Done' ? ' checked' : ''}${readOnly ? ' disabled' : ''}>`;
}

function taskTable(projectId) {
  const entries = tasks.filter(task => projectId ? task.project === projectId : !projectFor(task.project).archived);
  const archived = projectId && projectFor(projectId).archived;
  return `<section class="panel">${panelHeader('Task list')}
    ${entries.length ? entries.map(task => `<div class="task-row">
      <label class="task-info">
        ${taskCheckbox(task, archived)}
        <span><span class="queue-title">${escapeText(task.name)}</span><span class="queue-date">${escapeText(projectFor(task.project).name)} · ${task.minutes} min</span></span>
      </label>
      <div class="task-tags">
        <span class="pill${task.priority === 'High' ? ' amber' : ''}">${task.priority}</span>
        ${archived ? `<span class="pill">${task.status}</span>` :
          `<select class="task-status" aria-label="Status for ${escapeText(task.name)}" data-state="${task.status}" data-task-status="${tasks.indexOf(task)}">${options(taskStatuses.map(status => [status, status]), task.status)}</select>`}
      </div>
      ${archived ? '' : iconButton(`Delete ${escapeText(task.name)}`, `delete-task:${tasks.indexOf(task)}`, 'trash')}
    </div>`).join('') : empty(projectId ? 'No tasks for this project yet.' : 'No tasks in active projects yet.')}
    </section>`;
}

function projectDirectory() {
  const active = activeProjects();
  const archived = projects.filter(project => project.archived);
  const cards = entries => `<div class="cards">${entries.map(project => `<a class="panel project-card" href="#project:${project.id}">
      <div>${projectDot(project)}<h2>${escapeText(project.name)}</h2></div><p class="muted">${escapeText(project.description)}</p>
      <span class="muted small">${tasks.filter(task => task.project === project.id).length} tasks · ${sprints.filter(sprint => sprint.project === project.id).length} sprints</span>
    </a>`).join('')}</div>`;
  return `<div class="stack">
    ${active.length ? cards(active) : `<div class="panel">${empty('No active projects. Create a project or restore an archived one.')}</div>`}
    ${archived.length ? `<section class="stack"><h2>Archived projects</h2>${cards(archived)}</section>` : ''}
  </div>`;
}

function projectDetail(project) {
  return `<div class="stack">${taskTable(project.id)}
    <section class="panel">${panelHeader('Project sprints')}${sprintList(sprints.filter(sprint => sprint.project === project.id))}</section></div>`;
}

function settings() {
  return `<div class="stack">
      <section class="panel">
        ${panelHeader('Display', button('Edit display', 'edit-display', 'edit'))}
        <div class="panel-body stack">
          <div class="setting-row"><span class="muted">Calendar time zone</span><span>Eastern Time (New York)</span></div>
          <div class="setting-row"><span class="muted">Time format</span><span>${timeFormat}-hour</span></div>
          ${timeFormat === '12' ? '' : `<div>${button('Reset to default', 'reset-display')}</div>`}
        </div>
      </section>
      <section class="panel">
        ${panelHeader('Data and backups')}
        <div class="panel-body stack">
          <p class="muted">Workspace changes are stored in this browser. Export a copy to keep a backup or import a saved workspace.</p>
          <div class="actions">${button('Export JSON', 'export-workspace')}${button('Import JSON', 'import-workspace')}</div>
          <div>${button('Clear all data', 'clear-workspace', 'trash')}</div>
        </div>
      </section>
    </div>`;
}

function currentPage() {
  return location.hash.slice(1) || 'overview';
}

function render() {
  let page = currentPage();
  const project = page.startsWith('project:') ? projectFor(page.slice(8)) : null;
  if (!project && !Object.hasOwn(pageNames, page)) page = 'overview';
  const name = project ? project.name : pageNames[page];
  document.title = `${name} · Sprintline`;
  document.querySelector('#project-navigation').innerHTML = activeProjects().map(item => `<a class="nav-link project-link" href="#project:${item.id}" data-page="project:${item.id}">${projectDot(item)}${escapeText(item.name)}</a>`).join('');
  document.querySelectorAll('[data-page]').forEach(link => {
    if (link.dataset.page === page) link.setAttribute('aria-current', 'page');
    else if (project && link.matches('.bottom-nav [data-page="projects"]')) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  const pages = {
    overview: {
      title: 'Sprint overview',
      description: dateLabel(clockAt().date, { weekday: 'long', month: 'long', day: 'numeric' }),
      action: button('New sprint', 'new-sprint', 'plus'),
      content: overview
    },
    calendar: { action: button('New sprint', 'new-sprint', 'plus', true), content: calendar },
    projects: { action: button('New project', 'new-project', 'plus', true), content: projectDirectory },
    tasks: { action: button('New task', 'new-task', 'plus', true), content: taskTable, compact: true },
    usage: { action: usagePageActions(), content: usagePanel, compact: true },
    settings: { content: settings, compact: true }
  };
  const screen = project ? {
    description: project.archived ? ['Archived project', project.description].filter(Boolean).join(' · ') : project.description,
    action: project.archived ? button('Restore project', `restore-project:${project.id}`, null, true)
      : button('Edit project', `edit-project:${project.id}`, 'edit') + button('Archive project', `archive-project:${project.id}`) + button('New task', 'new-task', 'plus', true),
    content: () => projectDetail(project),
    compact: true
  } : pages[page];
  main.classList.toggle('main-compact', Boolean(screen.compact));
  main.innerHTML = pageHeader({ title: name, ...screen }, project ? '' : pageHints[page]) +
    '<div class="storage-feedback"></div>' + screen.content();
  updateStorageFeedback();
}

function field(label, control) {
  return `<label class="field"><span>${label}</span>${control}</label>`;
}

function options(items, selected) {
  return items.map(([value, label]) => `<option value="${escapeText(value)}"${value === selected ? ' selected' : ''}>${escapeText(label)}</option>`).join('');
}

function focusAfterSave(selector, openerAction) {
  const preferred = selector && [...main.querySelectorAll(selector)].find(control => control.getClientRects().length);
  const opener = openerAction && [...document.querySelectorAll('[data-action]')]
    .find(control => control.dataset.action === openerAction && control.getClientRects().length);
  const target = preferred || opener || main.querySelector('h1');
  if (target.matches('h1')) target.tabIndex = -1;
  target.focus();
}

function modal(title, content, submitLabel, onSubmit, extra = '', submitStyle = 'primary') {
  clearInterval(timerInterval);
  const wasOpen = dialog.open;
  if (!wasOpen) dialogOpenerAction = document.activeElement?.dataset.action;
  dialog.innerHTML = `<form><div class="dialog-header"><h2 id="dialog-title">${title}</h2>${iconButton('Close dialog', 'close', 'close')}</div>
    <div class="dialog-body">${content}</div>
    ${submitLabel || extra ? `<div class="dialog-actions">${extra}${submitLabel ? `<button class="button ${submitStyle}" type="submit">${submitLabel}</button>` : ''}</div>` : ''}</form>`;
  dialog.querySelector('form').addEventListener('submit', event => {
    event.preventDefault();
    if (onSubmit) {
      const focusSelector = onSubmit(new FormData(event.currentTarget));
      dialog.close();
      render();
      focusAfterSave(focusSelector, dialogOpenerAction);
    }
  });
  if (!wasOpen) dialog.showModal();
  const focusTarget = dialog.querySelector('.dialog-body input:not([type=checkbox]), .dialog-body select, .dialog-body textarea')
    || dialog.querySelector('.dialog-actions [data-action="close"]')
    || dialog.querySelector('.dialog-header button');
  focusTarget?.focus();
}

function confirmChange(title, message, apply, submitStyle = 'danger') {
  modal(title, `<p class="muted">${escapeText(message)}</p>`, title, apply, button('Cancel', 'close'), submitStyle);
}

function toast(message) {
  const status = document.querySelector('#toast');
  clearTimeout(toastTimer);
  status.textContent = message;
  status.hidden = false;
  toastTimer = setTimeout(() => { status.hidden = true; }, 3200);
}

function sprintDraft(data, projectId) {
  const [hour, minute] = data.get('start').split(':').map(Number);
  const dateOffset = Math.round((new Date(data.get('date')) - calendarEpoch) / dayMs);
  const targetWeek = Math.floor(dateOffset / 7);
  return {
    title: data.get('title').trim(), project: data.get('project') || projectId, day: dateOffset - targetWeek * 7,
    week: targetWeek, start: hour * 60 + minute, duration: Number(data.get('duration'))
  };
}

function suggestedSprintSlot(current = clockAt()) {
  const firstDay = Math.max(week * 7, current.week * 7 + current.day);
  const firstStart = firstDay === current.week * 7 + current.day ? Math.ceil(current.minutes / 15) * 15 : gridStart;
  for (let offset = 0; offset < 28; offset++) {
    const dateIndex = firstDay + offset;
    const targetWeek = Math.floor(dateIndex / 7);
    const day = dateIndex - targetWeek * 7;
    if (day >= days.length) continue;
    const draft = { day, week: targetWeek, start: offset === 0 ? Math.max(gridStart, firstStart) : gridStart, duration: 90 };
    while (draft.start + draft.duration <= gridEnd) {
      const conflicts = sprintConflicts(draft);
      if (!conflicts.length) return draft;
      draft.start = Math.max(...conflicts.map(sprint => sprintStart(sprint) + sprint.duration - dateIndex * dayMinutes));
    }
  }
  return { day: current.day, week: current.week, start: current.minutes };
}

function sprintEditor(sprint) {
  const active = activeProjects();
  if (!active.length) return needsProject('Schedule a sprint');
  const planned = sprint || suggestedSprintSlot();
  const date = dateAt(planned.day, planned.week || 0);
  const start = planned.start;
  const projectId = sprint?.project || active[0].id;
  const projectLocked = sprint && tasksForSprint(sprint.id).length > 0;
  const projectField = projectLocked
    ? `<div class="field"><span>Project</span><strong>${escapeText(projectFor(projectId).name)}</strong><span class="muted small">Detach the sprint’s tasks to change its project.</span></div>`
    : field('Project', `<select name="project">${options(active.map(item => [item.id, item.name]), projectId)}</select>`);
  const formattedTime = `${String(Math.floor(start / 60)).padStart(2, '0')}:${String(start % 60).padStart(2, '0')}`;
  modal(sprint ? 'Edit sprint' : 'New sprint',
    field('Sprint title', `<input name="title" required maxlength="70" value="${escapeText(sprint?.title ?? '')}" placeholder="e.g. Rate limit tests">`) +
    projectField +
    `<div class="fields">${field('Date', `<input name="date" type="date" min="0001-01-01" max="9999-12-31" value="${date.toISOString().slice(0, 10)}" required>`)}
    ${field('Start time (ET)', `<input name="start" type="time" value="${formattedTime}" required>`)}</div>` +
    field('Duration (minutes)', `<input name="duration" type="number" min="15" max="480" value="${sprint?.duration ?? 90}" required>`) +
    `<div class="sprint-conflict" aria-live="polite"></div>
    <div class="small muted">Week view shows Monday–Friday, ${timeRange({ start: gridStart, duration: gridEnd - gridStart })}. The agenda lists all sprints for the selected week.</div>`,
    'Save sprint', data => {
      const values = sprintDraft(data, projectId);
      const id = sprint?.id ?? Math.max(Date.now(), ...sprints.map(entry => entry.id + 1));
      if (sprint) Object.assign(sprint, values);
      else sprints.push({ id, ...values });
      week = values.week;
      if (values.day >= days.length || values.start < gridStart || values.start >= gridEnd) calendarView = 'agenda';
      saveWorkspace('Sprint saved.');
      return `[data-action="sprint:${id}"]`;
    }, button('Cancel', 'close'));
  const form = dialog.querySelector('form');
  validateName(form.querySelector('[name="title"]'));
  const notice = form.querySelector('.sprint-conflict');
  let previousMessage;
  const updateConflicts = () => {
    const draft = sprintDraft(new FormData(form), projectId);
    const conflicts = draft.duration >= 15 && draft.duration <= 480 ? sprintConflicts({ ...draft, id: sprint?.id }) : [];
    const message = conflicts.map(other => `“${other.title}” (${timeRange(other)})`).join(', ');
    if (previousMessage === message) return;
    previousMessage = message;
    notice.innerHTML = message ? `<div class="callout">${icon('alert')}<div><strong>Schedule conflict</strong><p>Overlaps ${escapeText(message)}. Change the timing or save with the overlap.</p></div></div>` : '';
  };
  form.addEventListener('input', updateConflicts);
  updateConflicts();
}

function sprintDetail(sprint) {
  const archived = !isActiveSprint(sprint);
  const relatedTasks = tasksForSprint(sprint.id);
  const summary = `<p class="muted">${escapeText(projectFor(sprint.project).name)} · ${dateLabel(dateAt(sprint.day, sprint.week || 0), { weekday: 'long', month: 'short', day: 'numeric' })} · ${timeRange(sprint)}</p>`;
  const checklist = relatedTasks.length ? `<fieldset class="checklist"><legend>Sprint tasks</legend>${relatedTasks.map(task => `<label>${taskCheckbox(task, archived)} ${escapeText(task.name)}</label>`).join('')}</fieldset>` : '<p class="muted">No tasks attached to this sprint.</p>';
  if (archived) {
    modal(escapeText(sprint.title), summary + checklist);
    return;
  }
  const timer = '<section class="sprint-timer" aria-label="Sprint timer"><div><p class="small muted timer-label"></p><p class="timer-value" role="timer"></p></div><div class="actions timer-controls"></div><p class="small muted timer-summary" aria-live="polite"></p></section>';
  const taskAction = button(relatedTasks.length ? 'Manage tasks' : 'Attach tasks', `attach-tasks:${sprint.id}`, relatedTasks.length ? 'edit' : 'plus');
  modal(escapeText(sprint.title), summary + timer + `<div class="stack">${checklist}<div>${taskAction}</div></div>`, '', null,
    button('Delete sprint', `delete-sprint:${sprint.id}`, 'trash') + button('Edit sprint', `edit-sprint:${sprint.id}`, 'edit'));
  renderSprintTimer(sprint);
}

function timerTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
}

function renderSprintTimer(sprint, focusControls = false) {
  clearInterval(timerInterval);
  const timer = dialog.querySelector('.sprint-timer');
  if (!timer) return;
  const label = timer.querySelector('.timer-label');
  const value = timer.querySelector('.timer-value');
  const controls = timer.querySelector('.timer-controls');
  const summary = timer.querySelector('.timer-summary');
  const state = sprint.timer?.state;
  const updateTime = () => {
    const elapsed = elapsedAt(sprint.timer);
    const remaining = sprint.duration * 60_000 - elapsed;
    const overtime = remaining < 0 && state !== 'finished';
    const description = state === 'finished' ? 'Elapsed time' : overtime ? 'Overtime' : 'Time remaining';
    const readout = overtime ? `+${timerTime(Math.floor(-remaining / 1000))}`
      : timerTime(state === 'finished' ? Math.floor(elapsed / 1000) : Math.ceil(remaining / 1000));
    if (label.textContent !== description) label.textContent = description;
    if (value.textContent !== readout) value.textContent = readout;
  };
  updateTime();
  if (state === 'running') timerInterval = setInterval(updateTime, 250);
  const finish = button('Finish sprint', `timer-finish:${sprint.id}`);
  controls.innerHTML = state === 'finished' ? '' : state === 'running'
    ? button('Pause', `timer-pause:${sprint.id}`, 'pause', true) + finish
    : state === 'paused'
      ? button('Resume', `timer-resume:${sprint.id}`, 'play', true) + finish
      : button('Start sprint', `timer-start:${sprint.id}`, 'play', true);
  if (state === 'finished') {
    const related = tasksForSprint(sprint.id);
    summary.textContent = related.length ? `Sprint finished · ${related.filter(task => task.status === 'Done').length} of ${related.length} tasks done` : 'Sprint finished';
  } else {
    summary.textContent = state === 'running' ? 'Sprint running' : state === 'paused' ? 'Sprint paused' : '';
  }
  if (focusControls) {
    const target = controls.querySelector('button') || summary;
    if (target === summary) target.tabIndex = -1;
    target.focus({ preventScroll: true });
  }
}

function updateSprintTimer(sprint, action) {
  const timer = changeTimer(sprint.timer, action);
  if (timer === sprint.timer) return;
  sprint.timer = timer;
  saveWorkspace();
  render();
  renderSprintTimer(sprint, true);
}

function manageSprintTasks(sprint) {
  const eligible = tasks.filter(task => task.project === sprint.project && (task.sprint === undefined || task.sprint === sprint.id));
  const back = button('Back to sprint', `sprint:${sprint.id}`);
  if (!eligible.length) {
    modal('Attach tasks', '<p class="muted">Add an unscheduled task to this project to attach it here.</p>', '', null, back);
    return;
  }
  modal('Manage sprint tasks',
    '<p class="muted">Select tasks from this sprint’s project. Clearing a selection keeps the task in the project.</p>' +
    `<fieldset class="checklist"><legend>Attached tasks</legend>${eligible.map((task, index) =>
      `<label><input type="checkbox" name="attached-task" value="${index}"${task.sprint === sprint.id ? ' checked' : ''}> ${escapeText(task.name)}</label>`).join('')}</fieldset>`,
    'Save tasks', data => {
      const selected = new Set(data.getAll('attached-task').map(Number));
      eligible.forEach((task, index) => {
        if (selected.has(index)) task.sprint = sprint.id;
        else if (task.sprint === sprint.id) delete task.sprint;
      });
      saveWorkspace('Sprint tasks updated.');
    }, back);
}

function needsProject(title) {
  modal(title, '<p class="muted">Create a project or restore an archived one to continue.</p>', '', null,
    button('New project', 'new-project', 'plus', true));
}

function projectEditor(project) {
  modal(project ? 'Edit project' : 'New project',
    field('Name', `<input name="name" maxlength="55" value="${escapeText(project?.name ?? '')}" required>`) +
    field('Description', `<textarea name="description" rows="3">${escapeText(project?.description ?? '')}</textarea>`),
    project ? 'Save project' : 'Add project', data => {
    const id = project?.id ?? `project-${Date.now()}`;
    const values = { name: data.get('name').trim(), description: data.get('description').trim() };
    if (project) Object.assign(project, values);
    else projects.push({ id, ...values, color: Object.keys(tones)[projects.length % 3] });
    saveWorkspace(project ? 'Project updated.' : 'Project added.');
    return `.project-card[href="#project:${id}"]`;
  }, button('Cancel', 'close'));
  validateName(dialog.querySelector('[name="name"]'));
}

function archiveProject(project) {
  confirmChange('Archive project', `Move ${project.name} and its tasks and sprints out of active views? You can restore it from Projects.`, () => {
    project.archived = true;
    for (const sprint of sprints) {
      if (sprint.project === project.id && sprint.timer?.state === 'running') sprint.timer = changeTimer(sprint.timer, 'pause');
    }
    saveWorkspace('Project archived.');
  }, 'primary');
}

function deleteTask(task) {
  const detail = task.sprint === undefined ? '' : ' It will also be removed from its sprint.';
  confirmChange('Delete task', `Delete “${task.name}”?${detail}`, () => {
    tasks.splice(tasks.indexOf(task), 1);
    saveWorkspace('Task deleted.');
  });
}

function deleteSprint(sprint) {
  confirmChange('Delete sprint', `Delete “${sprint.title}”? Attached tasks will stay in their project.`, () => {
    tasksForSprint(sprint.id).forEach(task => { delete task.sprint; });
    sprints.splice(sprints.indexOf(sprint), 1);
    saveWorkspace('Sprint deleted.');
  });
}

function taskEditor() {
  const active = activeProjects();
  if (!active.length) return needsProject('Add a task');
  const projectId = active.find(project => currentPage() === `project:${project.id}`)?.id || active[0].id;
  modal('New task',
    field('Task name', '<input name="name" maxlength="70" required>') +
    field('Project', `<select name="project">${options(active.map(item => [item.id, item.name]), projectId)}</select>`) +
    `<div class="fields">${field('Priority', `<select name="priority">${options(['Low', 'Medium', 'High'].map(value => [value, value]), 'Medium')}</select>`)}
    ${field('Estimate (minutes)', '<input name="minutes" type="number" min="1" value="30" required>')}</div>`,
    'Add task', data => {
      tasks.push({ ...Object.fromEntries(data), name: data.get('name').trim(), status: 'To do' });
      saveWorkspace('Task added.');
      return `[data-task-index="${tasks.length - 1}"]`;
    }, button('Cancel', 'close'));
  validateName(dialog.querySelector('[name="name"]'));
}

function emptyAllowanceWindow(name) {
  return { name, value: null, reset: '', recordedAt: null };
}

function validateName(input, names = []) {
  const validate = () => {
    const name = input.value.trim();
    const duplicate = names.some(existing => existing.toLowerCase() === name.toLowerCase());
    input.setCustomValidity(input.value && !name ? 'Enter a name.' : duplicate ? 'That name is already in use.' : '');
  };
  input.addEventListener('input', validate);
  validate();
}

function usageToolEditor() {
  modal('Add coding tool',
    field('Tool name', '<input name="tool-name" maxlength="55" required>') +
    field('First allowance window', '<input name="window-name" maxlength="50" placeholder="e.g. Monthly" required>'),
    'Add tool', data => {
      selectedUsageTool = {
        name: data.get('tool-name').trim(),
        windows: [emptyAllowanceWindow(data.get('window-name').trim())]
      };
      usageTools.push(selectedUsageTool);
      saveWorkspace('Coding tool added.');
    }, button('Cancel', 'close'));
  validateName(dialog.querySelector('[name="tool-name"]'), usageTools.map(tool => tool.name));
  validateName(dialog.querySelector('[name="window-name"]'));
}

function usageWindowEditor(tool) {
  modal('Add allowance window',
    field('Window name', '<input name="window-name" maxlength="50" placeholder="e.g. Weekly" required>'),
    'Add window', data => {
      tool.windows.push(emptyAllowanceWindow(data.get('window-name').trim()));
      saveWorkspace('Allowance window added.');
    }, button('Cancel', 'close'));
  validateName(dialog.querySelector('[name="window-name"]'), tool.windows.map(item => item.name));
}

function removeUsageTool(tool) {
  confirmChange('Remove tool', `Remove ${tool.name} and its allowance windows and readings?`, () => {
    usageTools.splice(usageTools.indexOf(tool), 1);
    selectedUsageTool = usageTools[0];
    saveWorkspace('Coding tool removed.');
  });
}

function removeUsageWindow(tool, item) {
  confirmChange('Remove window', `Remove the ${item.name} window and its reading from ${tool.name}?`, () => {
    tool.windows.splice(tool.windows.indexOf(item), 1);
    saveWorkspace('Allowance window removed.');
  });
}

function usageEditor(index) {
  const tool = selectedUsageTool;
  const windows = index === undefined ? tool.windows : [tool.windows[Number(index)]];
  const title = windows.some(item => item.value !== null) ? 'Update allowance' : 'Record allowance';
  modal(title, `<p class="muted">${escapeText(tool.name)} · Enter the remaining percentage and, if known, the expected reset time.</p>` +
    windows.map((item, fieldIndex) => `<div class="fields">
      ${field(`${escapeText(item.name)} remaining (%)`, `<input type="number" min="0" max="100" name="value-${fieldIndex}" value="${item.value ?? ''}"${item.value !== null || windows.length === 1 ? ' required' : ''}>`)}
      ${field('Expected reset', `<input name="reset-${fieldIndex}" value="${escapeText(item.reset)}" maxlength="80">`)}
    </div>`).join(''), 'Save allowance', data => {
    let changed = false;
    windows.forEach((item, fieldIndex) => {
      const rawValue = data.get(`value-${fieldIndex}`);
      if (rawValue === '') return;
      const value = Number(rawValue);
      const reset = data.get(`reset-${fieldIndex}`).trim();
      if (value === item.value && reset === item.reset) return;
      item.value = value;
      item.reset = reset;
      item.recordedAt = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short', timeZone: calendarZone }).format(new Date());
      changed = true;
    });
    if (changed) saveWorkspace('Allowance updated.');
  }, button('Cancel', 'close'));
}

function clearReading(item) {
  confirmChange('Clear reading', `Clear the manual reading and expected reset for the ${item.name}?`, () => {
    Object.assign(item, { value: null, reset: '', recordedAt: null });
    saveWorkspace('Allowance reading cleared.');
  });
}

function displayEditor() {
  modal('Edit display', field('Time format', `<select name="time-format">${options([['12', '12-hour'], ['24', '24-hour']], timeFormat)}</select>`),
    'Save display', data => {
      timeFormat = data.get('time-format');
      saveWorkspace('Display preferences saved.');
    }, button('Cancel', 'close'));
}

document.addEventListener('click', event => {
  const control = event.target.closest('[data-action]');
  if (!control || openingWorkspace) return;
  const [action, id] = control.dataset.action.split(':');
  if (dialog.dataset.committing) return;
  switch (action) {
    case 'close': dialog.close(); break;
    case 'export-workspace': exportWorkspace(); break;
    case 'import-workspace': importWorkspace(); break;
    case 'review-import': reviewBackup(control); break;
    case 'clear-workspace': clearWorkspace(); break;
    case 'retry-storage': saveWorkspace('Workspace saved.'); break;
    case 'new-sprint': sprintEditor(); break;
    case 'new-project': projectEditor(); break;
    case 'edit-project': projectEditor(projectFor(id)); break;
    case 'new-task': taskEditor(); break;
    case 'new-usage-tool': usageToolEditor(); break;
    case 'new-window': usageWindowEditor(selectedUsageTool); break;
    case 'remove-tool': removeUsageTool(selectedUsageTool); break;
    case 'remove-window': removeUsageWindow(selectedUsageTool, selectedUsageTool.windows[Number(id)]); break;
    case 'open-usage': selectedUsageTool = usageTools[Number(id)]; break;
    case 'usage-edit': usageEditor(id); break;
    case 'clear-reading': clearReading(selectedUsageTool.windows[Number(id)]); break;
    case 'archive-project': archiveProject(projectFor(id)); break;
    case 'restore-project': {
      projectFor(id).archived = false;
      render();
      saveWorkspace('Project restored.');
      break;
    }
    case 'delete-task': deleteTask(tasks[Number(id)]); break;
    case 'sprint': sprintDetail(sprints.find(item => item.id === Number(id))); break;
    case 'timer-start':
    case 'timer-pause':
    case 'timer-resume':
    case 'timer-finish': updateSprintTimer(sprints.find(item => item.id === Number(id)), action.slice(6)); break;
    case 'edit-sprint': sprintEditor(sprints.find(item => item.id === Number(id))); break;
    case 'attach-tasks': manageSprintTasks(sprints.find(item => item.id === Number(id))); break;
    case 'delete-sprint': deleteSprint(sprints.find(item => item.id === Number(id))); break;
    case 'edit-display': displayEditor(); break;
    case 'reset-display': confirmChange('Reset to default', 'Restore the 12-hour time format?', () => {
      timeFormat = '12';
      saveWorkspace('Display preferences reset.');
    }, 'primary'); break;
    case 'previous':
    case 'next':
    case 'view-today':
    case 'view-week':
    case 'view-agenda': {
      if (action === 'previous') week--;
      else if (action === 'next') week++;
      else if (action === 'view-today') week = clockAt().week;
      else calendarView = action.slice(5);
      render();
      focusAfterSave(`[data-action="${action}"]`);
      break;
    }
  }
});

document.addEventListener('change', event => {
  const control = event.target;
  if (control.id === 'usage-tool') {
    selectedUsageTool = usageTools[Number(control.value)];
    render();
    main.querySelector('#usage-tool')?.focus({ preventScroll: true });
    return;
  }
  if (!control.matches('input[data-task-index], select[data-task-status]')) return;
  const isStatus = control.matches('select[data-task-status]');
  const taskIndex = Number(isStatus ? control.dataset.taskStatus : control.dataset.taskIndex);
  const task = tasks[taskIndex];
  const status = isStatus ? control.value : control.checked ? 'Done' : task.statusBeforeDone || 'To do';
  if (status === 'Done' && task.status !== 'Done') task.statusBeforeDone = task.status;
  if (status !== 'Done') delete task.statusBeforeDone;
  task.status = status;
  const restoreFocus = main.contains(control) && document.activeElement === control;
  saveWorkspace();
  render();
  const attribute = isStatus ? 'data-task-status' : 'data-task-index';
  if (restoreFocus) main.querySelector(`[${attribute}="${taskIndex}"]`)?.focus({ preventScroll: true });
});

dialog.addEventListener('cancel', event => {
  if (dialog.dataset.committing) event.preventDefault();
});

dialog.addEventListener('close', () => {
  if (!dialog.open) clearInterval(timerInterval);
});

window.addEventListener('hashchange', () => {
  if (!openingWorkspace) render();
  window.scrollTo(0, 0);
});

window.addEventListener('beforeunload', event => {
  if (savedEditSequence !== editSequence) event.preventDefault();
});

document.querySelectorAll('[data-icon]').forEach(element => { element.innerHTML = icon(element.dataset.icon); });
openWorkspace();
