const test = require('node:test');
const assert = require('node:assert/strict');
const { clockAt, elapsedAt, changeTimer, emptyWorkspace, validateWorkspace, readBackup } = require('../workspace-data.js');

function exampleWorkspace() {
  return {
    projects: [{ id: 'orbit', name: 'Orbit API', description: '', color: 'purple' }],
    sprints: [{ id: 1, project: 'orbit', title: 'Rate limit tests', day: 2, start: 570, duration: 90 }],
    tasks: [{ name: 'Add fixtures', project: 'orbit', sprint: 1, priority: 'Medium', status: 'In progress', minutes: '30' }],
    usageTools: [{ name: 'Codex', windows: [{ name: 'Weekly', value: 0, reset: '', recordedAt: '9:00 AM' }] }],
    preferences: { timeFormat: '24' }
  };
}

test('workspace clock uses the Eastern date across midnight and DST', () => {
  const sunday = clockAt(Date.parse('2026-11-23T04:59:00Z'));
  const monday = clockAt(Date.parse('2026-11-23T05:00:00Z'));
  assert.deepEqual([sunday.week, sunday.day, sunday.minutes], [-1, 6, 1439]);
  assert.deepEqual([monday.week, monday.day, monday.minutes], [0, 0, 0]);
  assert.equal(clockAt(Date.parse('2026-03-08T06:59:00Z')).minutes, 119);
  assert.equal(clockAt(Date.parse('2026-03-08T07:00:00Z')).minutes, 180);
});

test('persisted timer restores elapsed time and excludes paused duration', () => {
  const running = changeTimer(undefined, 'start', 1000);
  assert.equal(elapsedAt(running, 5200), 4200);
  assert.equal(changeTimer(running, 'start', 8000), running);
  const paused = changeTimer(running, 'pause', 6000);
  const reopened = JSON.parse(JSON.stringify(paused));
  assert.equal(elapsedAt(reopened, 60_000), 5000);
  const resumed = changeTimer(reopened, 'resume', 60_000);
  assert.equal(elapsedAt(resumed, 60_250), 5250);
  const finished = changeTimer(resumed, 'finish', 63_000);
  assert.equal(elapsedAt(finished, 90_000), 8000);
  assert.equal(finished.state, 'finished');
  assert.equal(changeTimer(finished, 'resume', 90_000), finished);
});

test('backup round-trip preserves older task estimates and timer state', () => {
  const workspace = exampleWorkspace();
  workspace.sprints[0].timer = changeTimer(undefined, 'start', 1000);
  const result = readBackup(JSON.stringify({ schemaVersion: 1, data: workspace }), 1);
  assert.deepEqual(result, workspace);
  assert.equal(elapsedAt(result.sprints[0].timer, 11_000), 10_000);
  assert.deepEqual(validateWorkspace(emptyWorkspace()), emptyWorkspace());
});

test('backup validation rejects invalid JSON, schema versions, and broken associations', () => {
  assert.throws(() => readBackup('{"broken"', 1), /valid JSON/);
  assert.throws(() => readBackup('{"schemaVersion":2}', 1), /version/);
  const workspace = exampleWorkspace();
  workspace.tasks[0].sprint = 99;
  assert.throws(() => validateWorkspace(workspace), /task attachment/);
});

test('backup validation rejects duplicate IDs and invalid timers and readings', () => {
  const duplicate = exampleWorkspace();
  duplicate.projects.push({ ...duplicate.projects[0] });
  assert.throws(() => validateWorkspace(duplicate), /duplicate project/);
  const badTimer = exampleWorkspace();
  badTimer.sprints[0].timer = { state: 'running', elapsedMs: 0, startedAt: null };
  assert.throws(() => validateWorkspace(badTimer), /timer/);
  const badReading = exampleWorkspace();
  badReading.usageTools[0].windows[0].value = 110;
  assert.throws(() => validateWorkspace(badReading), /allowance window/);
});
