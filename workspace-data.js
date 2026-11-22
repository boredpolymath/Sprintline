const workspaceData = (() => {
  const calendarEpoch = Date.UTC(2026, 10, 23);
  const calendarZone = 'America/New_York';
  const dayMs = 86_400_000;
  const dayMinutes = 1_440;
  const taskStatuses = ['To do', 'In progress', 'Done'];
  const taskPriorities = ['Low', 'Medium', 'High'];
  const projectColors = ['purple', 'green', 'blue'];
  const clockFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: calendarZone, year: 'numeric', month: 'numeric', day: 'numeric',
    hour: 'numeric', minute: 'numeric', hourCycle: 'h23'
  });

  function clockAt(timestamp = Date.now()) {
    const parts = Object.fromEntries(clockFormatter.formatToParts(timestamp)
      .filter(part => part.type !== 'literal').map(part => [part.type, Number(part.value)]));
    const date = new Date(Date.UTC(parts.year, parts.month - 1, parts.day));
    const offset = (date.getTime() - calendarEpoch) / dayMs;
    const week = Math.floor(offset / 7);
    const day = offset - week * 7;
    const minutes = parts.hour * 60 + parts.minute;
    return { date, week, day, minutes, position: offset * dayMinutes + minutes };
  }

  function elapsedAt(timer, now = Date.now()) {
    if (!timer) return 0;
    return timer.elapsedMs + (timer.state === 'running' ? Math.max(0, now - timer.startedAt) : 0);
  }

  function changeTimer(timer, action, now = Date.now()) {
    const state = timer?.state;
    const elapsedMs = elapsedAt(timer, now);
    if ((action === 'start' && !state) || (action === 'resume' && state === 'paused')) {
      return { state: 'running', elapsedMs, startedAt: now };
    }
    if (action === 'pause' && state === 'running') {
      return { state: 'paused', elapsedMs, startedAt: null };
    }
    if (action === 'finish' && (state === 'running' || state === 'paused')) {
      return { state: 'finished', elapsedMs, startedAt: null, finishedAt: now };
    }
    return timer;
  }

  function emptyWorkspace() {
    return { projects: [], sprints: [], tasks: [], usageTools: [], preferences: { timeFormat: '12' } };
  }

  function isObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }

  function isInteger(value, min, max = Number.MAX_SAFE_INTEGER) {
    return Number.isSafeInteger(value) && value >= min && value <= max;
  }

  function isName(value, max) {
    return typeof value === 'string' && value.length > 0 && value.length <= max;
  }

  function distinct(items, key) {
    return new Set(items.map(key)).size === items.length;
  }

  function validTimer(timer) {
    if (!isObject(timer) || !isInteger(timer.elapsedMs, 0)) return false;
    if (timer.state === 'running') return isInteger(timer.startedAt, 0);
    if (timer.startedAt !== null) return false;
    if (timer.state === 'paused') return true;
    return timer.state === 'finished' && isInteger(timer.finishedAt, 0);
  }

  function validateWorkspace(data) {
    if (!isObject(data) || !['projects', 'sprints', 'tasks', 'usageTools'].every(key => Array.isArray(data[key])) ||
        !isObject(data.preferences) || !['12', '24'].includes(data.preferences.timeFormat)) {
      throw new Error('The backup is missing required workspace sections or preferences.');
    }
    if (!data.projects.every(project => isObject(project) && typeof project.id === 'string' &&
      /^[a-zA-Z0-9_-]{1,120}$/.test(project.id) && isName(project.name, 55) && typeof project.description === 'string' &&
      projectColors.includes(project.color) && (project.archived === undefined || typeof project.archived === 'boolean')) ||
      !distinct(data.projects, project => project.id)) {
      throw new Error('The backup contains an invalid project or duplicate project ID.');
    }
    const projectIDs = new Set(data.projects.map(project => project.id));
    if (!data.sprints.every(sprint => isObject(sprint) && isInteger(sprint.id, 1) && projectIDs.has(sprint.project) &&
      isName(sprint.title, 70) && isInteger(sprint.day, 0, 6) && (sprint.week === undefined || isInteger(sprint.week, -110_000, 420_000)) &&
      isInteger(sprint.start, 0, dayMinutes - 1) && isInteger(sprint.duration, 15, 480) &&
      (sprint.timer === undefined || validTimer(sprint.timer))) || !distinct(data.sprints, sprint => sprint.id)) {
      throw new Error('The backup contains an invalid sprint, timer, or project reference.');
    }
    const sprintProjects = new Map(data.sprints.map(sprint => [sprint.id, sprint.project]));
    if (!data.tasks.every(task => isObject(task) && isName(task.name, 70) && projectIDs.has(task.project) &&
      taskPriorities.includes(task.priority) && taskStatuses.includes(task.status) &&
      (task.statusBeforeDone === undefined || taskStatuses.includes(task.statusBeforeDone)) &&
      (typeof task.minutes === 'string' && task.minutes.trim() || typeof task.minutes === 'number') &&
      isInteger(Number(task.minutes), 1) && (task.sprint === undefined || sprintProjects.get(task.sprint) === task.project))) {
      throw new Error('The backup contains an invalid task or task attachment.');
    }
    const nameKey = item => item.name.trim().toLowerCase();
    if (!data.usageTools.every(tool => isObject(tool) && isName(tool.name, 55) && Array.isArray(tool.windows) &&
      tool.windows.every(item => isObject(item) && isName(item.name, 50) &&
        (item.value === null || isInteger(item.value, 0, 100)) && typeof item.reset === 'string' &&
        (item.value === null ? item.recordedAt === null : typeof item.recordedAt === 'string')) &&
      distinct(tool.windows, nameKey)) || !distinct(data.usageTools, nameKey)) {
      throw new Error('The backup contains an invalid or duplicate coding tool or allowance window.');
    }
    return data;
  }

  function readBackup(text, schemaVersion) {
    let backup;
    try {
      backup = JSON.parse(text);
    } catch {
      throw new Error('This file is not valid JSON.');
    }
    if (!isObject(backup) || backup.schemaVersion !== schemaVersion) {
      throw new Error('This backup version is not supported.');
    }
    return validateWorkspace(backup.data);
  }

  return { calendarEpoch, calendarZone, dayMs, dayMinutes, taskStatuses, clockAt, elapsedAt, changeTimer, emptyWorkspace, validateWorkspace, readBackup };
})();

if (typeof module === 'object') module.exports = workspaceData;
