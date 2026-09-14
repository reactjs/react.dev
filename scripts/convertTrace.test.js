/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const {describe, it} = require('node:test');
const assert = require('node:assert/strict');
const {
  extractPerformanceAPIEntries,
  extractConsoleTimestampEntries,
  computeDepths,
  normalizeEntries,
} = require('./convertTrace');

// Helper: create a begin event (ph: "b") with devtools metadata
function beginEvent({name, id, ts, track, trackGroup, color, dataType}) {
  return {
    ph: 'b',
    cat: 'blink.user_timing',
    name,
    id,
    ts,
    args: {
      detail: JSON.stringify({
        devtools: {track, trackGroup, color, dataType},
      }),
    },
  };
}

// Helper: create an end event (ph: "e") — no devtools metadata, just like Chrome
function endEvent({name, id, ts}) {
  return {
    ph: 'e',
    cat: 'blink.user_timing',
    name,
    id,
    ts,
    args: {},
  };
}

// Helper: create an instant event (ph: "I") with devtools metadata
function instantEvent({name, ts, track, trackGroup, color, dataType}) {
  return {
    ph: 'I',
    cat: 'blink.user_timing',
    name,
    ts,
    args: {
      detail: JSON.stringify({
        devtools: {track, trackGroup, color, dataType},
      }),
    },
  };
}

// Helper: create a console.timeStamp event
function timestampEvent({
  ts,
  track,
  trackGroup,
  message,
  color,
  start,
  end,
  name,
}) {
  const data = {track, message};
  if (trackGroup != null) data.trackGroup = trackGroup;
  if (color != null) data.color = color;
  if (start != null) data.start = start;
  if (end != null) data.end = end;
  if (name != null) data.name = name;
  return {
    cat: 'devtools.timeline',
    name: 'TimeStamp',
    ts,
    args: {data},
  };
}

// ============================================================
// extractPerformanceAPIEntries
// ============================================================
describe('extractPerformanceAPIEntries', () => {
  it('pairs begin and end events into a single entry', () => {
    const events = [
      beginEvent({
        name: 'Render',
        id: '0x1',
        ts: 1000,
        track: 'Blocking',
        trackGroup: 'Scheduler',
        color: 'primary-dark',
      }),
      endEvent({name: 'Render', id: '0x1', ts: 5000}),
    ];
    const entries = extractPerformanceAPIEntries(events);
    assert.equal(entries.length, 1);
    assert.equal(entries[0].name, 'Render');
    assert.equal(entries[0].ts, 1000);
    assert.equal(entries[0].dur, 4000);
    assert.equal(entries[0].track, 'Blocking');
    assert.equal(entries[0].trackGroup, 'Scheduler');
    assert.equal(entries[0].color, 'primary-dark');
  });

  it('handles end events with no devtools metadata (the original bug)', () => {
    // This is the exact scenario that was broken: end events have args: {}
    // and were being dropped by the devtools metadata check
    const events = [
      beginEvent({
        name: 'Update',
        id: '0xA',
        ts: 2000,
        track: 'Blocking',
        trackGroup: 'Scheduler',
        color: 'primary-light',
      }),
      // End event — no detail, no devtools in args
      {
        ph: 'e',
        cat: 'blink.user_timing',
        name: 'Update',
        id: '0xA',
        ts: 3000,
        args: {},
      },
    ];
    const entries = extractPerformanceAPIEntries(events);
    assert.equal(entries.length, 1, 'end event should not be dropped');
    assert.equal(entries[0].name, 'Update');
    assert.equal(entries[0].dur, 1000);
  });

  it('matches begin/end by id + cat + name', () => {
    const events = [
      beginEvent({
        name: 'Render',
        id: '0x1',
        ts: 1000,
        track: 'Blocking',
        trackGroup: 'Scheduler',
        color: 'primary-dark',
      }),
      beginEvent({
        name: 'Render',
        id: '0x2',
        ts: 2000,
        track: 'Transition',
        trackGroup: 'Scheduler',
        color: 'primary-dark',
      }),
      endEvent({name: 'Render', id: '0x2', ts: 4000}),
      endEvent({name: 'Render', id: '0x1', ts: 6000}),
    ];
    const entries = extractPerformanceAPIEntries(events);
    assert.equal(entries.length, 2);
    // Sorted by when end events arrive
    assert.equal(entries[0].track, 'Transition');
    assert.equal(entries[0].dur, 2000);
    assert.equal(entries[1].track, 'Blocking');
    assert.equal(entries[1].dur, 5000);
  });

  it('extracts instant events (markers)', () => {
    const events = [
      instantEvent({
        name: 'Promise Resolved',
        ts: 5000,
        track: 'Transition',
        trackGroup: 'Scheduler',
        color: 'primary-light',
        dataType: 'marker',
      }),
    ];
    const entries = extractPerformanceAPIEntries(events);
    assert.equal(entries.length, 1);
    assert.equal(entries[0].name, 'Promise Resolved');
    assert.equal(entries[0].dur, 0);
    assert.equal(entries[0].dataType, 'marker');
  });

  it('ignores events without blink.user_timing category', () => {
    const events = [
      {ph: 'b', cat: 'v8', name: 'Something', id: '0x1', ts: 1000, args: {}},
      {ph: 'e', cat: 'v8', name: 'Something', id: '0x1', ts: 2000, args: {}},
    ];
    const entries = extractPerformanceAPIEntries(events);
    assert.equal(entries.length, 0);
  });

  it('ignores orphan end events (no matching begin)', () => {
    const events = [endEvent({name: 'Orphan', id: '0x99', ts: 5000})];
    const entries = extractPerformanceAPIEntries(events);
    assert.equal(entries.length, 0);
  });

  it('uses id2.local when id is absent', () => {
    const events = [
      {
        ph: 'b',
        cat: 'blink.user_timing',
        name: 'Render',
        id2: {local: '0xABC'},
        ts: 1000,
        args: {
          detail: JSON.stringify({
            devtools: {track: 'Blocking', color: 'primary-dark'},
          }),
        },
      },
      {
        ph: 'e',
        cat: 'blink.user_timing',
        name: 'Render',
        id2: {local: '0xABC'},
        ts: 3000,
        args: {},
      },
    ];
    const entries = extractPerformanceAPIEntries(events);
    assert.equal(entries.length, 1);
    assert.equal(entries[0].dur, 2000);
  });

  it('handles detail as object (not JSON string)', () => {
    const events = [
      {
        ph: 'b',
        cat: 'blink.user_timing',
        name: 'Commit',
        id: '0x1',
        ts: 1000,
        args: {
          detail: {
            devtools: {track: 'Blocking', color: 'secondary-dark'},
          },
        },
      },
      endEvent({name: 'Commit', id: '0x1', ts: 2000}),
    ];
    const entries = extractPerformanceAPIEntries(events);
    assert.equal(entries.length, 1);
    assert.equal(entries[0].color, 'secondary-dark');
  });

  it('handles detail in args.data.detail', () => {
    const events = [
      {
        ph: 'b',
        cat: 'blink.user_timing',
        name: 'Commit',
        id: '0x1',
        ts: 1000,
        args: {
          data: {
            detail: JSON.stringify({
              devtools: {track: 'Blocking', color: 'secondary-dark'},
            }),
          },
        },
      },
      endEvent({name: 'Commit', id: '0x1', ts: 2000}),
    ];
    const entries = extractPerformanceAPIEntries(events);
    assert.equal(entries.length, 1);
    assert.equal(entries[0].color, 'secondary-dark');
  });

  it('defaults dataType to track-entry for duration events', () => {
    const events = [
      beginEvent({
        name: 'Render',
        id: '0x1',
        ts: 1000,
        track: 'Blocking',
        color: 'primary-dark',
        // no dataType
      }),
      endEvent({name: 'Render', id: '0x1', ts: 2000}),
    ];
    const entries = extractPerformanceAPIEntries(events);
    assert.equal(entries[0].dataType, 'track-entry');
  });

  it('produces multiple entries from interleaved begin/end pairs', () => {
    // Simulate: Event:mousedown, Update, Render on Blocking track
    const events = [
      beginEvent({
        name: 'Event: mousedown',
        id: '0x1',
        ts: 0,
        track: 'Blocking',
        trackGroup: 'Scheduler',
        color: 'warning',
      }),
      endEvent({name: 'Event: mousedown', id: '0x1', ts: 12000}),
      beginEvent({
        name: 'Update',
        id: '0x2',
        ts: 12000,
        track: 'Blocking',
        trackGroup: 'Scheduler',
        color: 'primary-light',
      }),
      endEvent({name: 'Update', id: '0x2', ts: 13000}),
      beginEvent({
        name: 'Render',
        id: '0x3',
        ts: 13000,
        track: 'Blocking',
        trackGroup: 'Scheduler',
        color: 'primary-dark',
      }),
      endEvent({name: 'Render', id: '0x3', ts: 17000}),
    ];
    const entries = extractPerformanceAPIEntries(events);
    assert.equal(entries.length, 3);
    assert.deepEqual(
      entries.map((e) => e.name),
      ['Event: mousedown', 'Update', 'Render']
    );
  });
});

// ============================================================
// extractConsoleTimestampEntries
// ============================================================
describe('extractConsoleTimestampEntries', () => {
  it('extracts basic timestamp entries', () => {
    const events = [
      timestampEvent({
        ts: 1000,
        track: 'MyTrack',
        message: 'Step 1',
        color: 'primary',
        start: 1000,
        end: 5000,
      }),
    ];
    const {entries} = extractConsoleTimestampEntries(events);
    assert.equal(entries.length, 1);
    assert.equal(entries[0].name, 'Step 1');
    assert.equal(entries[0].ts, 1000);
    assert.equal(entries[0].dur, 4000);
  });

  it('collects registered tracks', () => {
    const events = [
      timestampEvent({
        ts: 1000,
        track: 'Suspense',
        trackGroup: 'Scheduler',
        message: 'Suspense Track',
      }),
    ];
    const {entries, registeredTracks} = extractConsoleTimestampEntries(events);
    assert.equal(entries.length, 0);
    assert.equal(registeredTracks.length, 1);
    assert.equal(registeredTracks[0].track, 'Suspense');
    assert.equal(registeredTracks[0].trackGroup, 'Scheduler');
  });

  it('resolves named start/end references', () => {
    const events = [
      // Named timestamp for reference
      timestampEvent({ts: 2000, track: 'T', message: 'msg', name: 'ref-start'}),
      timestampEvent({ts: 8000, track: 'T', message: 'msg', name: 'ref-end'}),
      // Entry referencing them
      timestampEvent({
        ts: 5000,
        track: 'T',
        message: 'Span',
        start: 'ref-start',
        end: 'ref-end',
      }),
    ];
    const {entries} = extractConsoleTimestampEntries(events);
    // The entry referencing start/end by name
    const span = entries.find((e) => e.name === 'Span');
    assert.ok(span);
    assert.equal(span.ts, 2000); // resolved from ref-start
    assert.equal(span.dur, 6000); // 8000 - 2000
  });

  it('ignores events without track', () => {
    const events = [
      {
        cat: 'devtools.timeline',
        name: 'TimeStamp',
        ts: 1000,
        args: {data: {message: 'no track'}},
      },
    ];
    const {entries} = extractConsoleTimestampEntries(events);
    assert.equal(entries.length, 0);
  });

  it('defaults color to primary', () => {
    const events = [
      timestampEvent({
        ts: 1000,
        track: 'T',
        message: 'x',
        start: 1000,
        end: 2000,
      }),
    ];
    const {entries} = extractConsoleTimestampEntries(events);
    assert.equal(entries[0].color, 'primary');
  });
});

// ============================================================
// computeDepths
// ============================================================
describe('computeDepths', () => {
  it('assigns depth 0 to non-overlapping entries', () => {
    const entries = [
      {name: 'A', start: 0, duration: 5},
      {name: 'B', start: 5, duration: 5},
      {name: 'C', start: 10, duration: 5},
    ];
    computeDepths(entries);
    assert.deepEqual(
      entries.map((e) => e.depth),
      [0, 0, 0]
    );
  });

  it('assigns increasing depth to nested entries', () => {
    const entries = [
      {name: 'Parent', start: 0, duration: 10},
      {name: 'Child', start: 1, duration: 5},
      {name: 'Grandchild', start: 2, duration: 2},
    ];
    computeDepths(entries);
    assert.equal(entries[0].depth, 0);
    assert.equal(entries[1].depth, 1);
    assert.equal(entries[2].depth, 2);
  });

  it('assigns different depths to overlapping siblings', () => {
    const entries = [
      {name: 'A', start: 0, duration: 10},
      {name: 'B', start: 0, duration: 10},
    ];
    computeDepths(entries);
    const depths = entries.map((e) => e.depth).sort();
    assert.deepEqual(depths, [0, 1]);
  });

  it('reuses depth after an entry ends', () => {
    const entries = [
      {name: 'A', start: 0, duration: 5},
      {name: 'B', start: 5, duration: 5},
    ];
    computeDepths(entries);
    assert.equal(entries[0].depth, 0);
    assert.equal(entries[1].depth, 0);
  });

  it('handles zero-duration entries', () => {
    const entries = [
      {name: 'Marker', start: 5, duration: 0},
      {name: 'Another', start: 5, duration: 0},
    ];
    computeDepths(entries);
    // Zero-duration entries don't occupy depth, so both get 0
    assert.equal(entries[0].depth, 0);
    assert.equal(entries[1].depth, 0);
  });

  it('sorts entries by start time, then duration descending', () => {
    const entries = [
      {name: 'Short', start: 0, duration: 2},
      {name: 'Long', start: 0, duration: 10},
    ];
    computeDepths(entries);
    // After sorting, Long (duration 10) comes first at depth 0
    assert.equal(entries[0].name, 'Long');
    assert.equal(entries[0].depth, 0);
    assert.equal(entries[1].name, 'Short');
    assert.equal(entries[1].depth, 1);
  });

  it('handles flamegraph-style nesting (parent contains child)', () => {
    // Simulate: Render contains multiple sub-phases
    const entries = [
      {name: 'Render', start: 0, duration: 20},
      {name: 'Reconcile', start: 0, duration: 10},
      {name: 'Layout', start: 10, duration: 5},
      {name: 'Paint', start: 15, duration: 5},
    ];
    computeDepths(entries);
    assert.equal(entries[0].depth, 0); // Render
    assert.equal(entries[1].depth, 1); // Reconcile
    assert.equal(entries[2].depth, 1); // Layout (Reconcile ended, depth 1 is free)
    assert.equal(entries[3].depth, 1); // Paint (Layout ended, depth 1 is free)
  });
});

// ============================================================
// normalizeEntries
// ============================================================
describe('normalizeEntries', () => {
  it('fixes sequential entries that overlap after rounding', () => {
    // Two sequential entries on the same track: Commit ends at 17800µs, Waiting starts at 17800µs
    // Both round to start: 17ms, but Waiting should come after Commit
    const entries = [
      {
        name: 'Commit',
        ts: 17200,
        dur: 600,
        track: 'Blocking',
        color: 'secondary-dark',
      },
      {
        name: 'Waiting',
        ts: 17800,
        dur: 500,
        track: 'Blocking',
        color: 'secondary-light',
      },
    ];
    const result = normalizeEntries(entries);
    const blockingEntries = result.tracks.blocking;
    const commit = blockingEntries.find((e) => e.type === 'commit');
    const waiting = blockingEntries.find((e) => e.type === 'waiting');
    // Commit rounds to start: 0, duration: 1 (600µs → 1ms)
    assert.equal(commit.start, 0);
    assert.equal(commit.duration, 1);
    assert.equal(commit.color, undefined);
    assert.equal(commit.name, undefined);
    // Waiting should start after Commit ends, not at the same start
    assert.equal(waiting.start, 1);
    assert.equal(waiting.color, undefined);
    assert.equal(waiting.name, undefined);
    assert.equal(waiting.depth, undefined); // no depth since no overlap
  });

  it('keeps genuinely overlapping entries (parent/child) at different depths', () => {
    // Parent contains child — they overlap in raw data
    const entries = [
      {name: 'Parent', ts: 0, dur: 10000, track: 'T', color: 'primary'},
      {name: 'Child', ts: 2000, dur: 3000, track: 'T', color: 'primary'},
    ];
    const result = normalizeEntries(entries);
    const trackEntries = result.tracks.t;
    const parent = trackEntries.find((e) => e.name === 'Parent');
    const child = trackEntries.find((e) => e.name === 'Child');
    assert.equal(parent.type, 'parent');
    assert.equal(child.type, 'child');
    assert.equal(parent.depth, undefined); // depth 0 is omitted
    assert.equal(child.depth, 1);
  });

  it('does not affect cross-track entries at the same raw time', () => {
    // Two entries at the same timestamp on different tracks should both keep the same start
    const entries = [
      {name: 'A', ts: 5000, dur: 1000, track: 'Track1', color: 'primary'},
      {name: 'B', ts: 5000, dur: 1000, track: 'Track2', color: 'primary'},
    ];
    const result = normalizeEntries(entries);
    assert.equal(result.tracks.track1[0].start, 0);
    assert.equal(result.tracks.track1[0].type, 'a');
    assert.equal(result.tracks.track2[0].start, 0);
    assert.equal(result.tracks.track2[0].type, 'b');
  });

  it('cascades fixup for multiple entries rounding to same start', () => {
    // Pad entry on a different track sets minDur=100 and offsets A so rounding
    // causes A's end to exceed B's rounded start, triggering cascade fixup.
    // A: start=round(60/100)=1, dur=round(160/100)=2, end=3
    // B: start=round(220/100)=2 < 3 → pushed to 3
    // C: start=round(320/100)=3 < 4 → pushed to 4
    const entries = [
      {name: 'Pad', ts: 10000, dur: 100, track: 'Other', color: 'primary'},
      {name: 'A', ts: 10060, dur: 160, track: 'T', color: 'primary'},
      {name: 'B', ts: 10220, dur: 100, track: 'T', color: 'primary'},
      {name: 'C', ts: 10320, dur: 100, track: 'T', color: 'primary'},
    ];
    const result = normalizeEntries(entries);
    const trackEntries = result.tracks.t;
    const a = trackEntries.find((e) => e.name === 'A');
    const b = trackEntries.find((e) => e.name === 'B');
    const c = trackEntries.find((e) => e.name === 'C');
    assert.equal(a.start, 1);
    assert.equal(b.start, 3); // B pushed after A (1 + 2)
    assert.equal(c.start, 4); // C pushed after B (3 + 1)
  });

  it('does not push zero-duration entries', () => {
    // A zero-duration marker at the same start should stay
    const entries = [
      {name: 'Span', ts: 5000, dur: 1000, track: 'T', color: 'primary'},
      {name: 'Marker', ts: 5000, dur: 0, track: 'T', color: 'primary'},
    ];
    const result = normalizeEntries(entries);
    const trackEntries = result.tracks.t;
    const span = trackEntries.find((e) => e.name === 'Span');
    const marker = trackEntries.find((e) => e.name === 'Marker');
    assert.equal(span.start, 0);
    assert.equal(marker.start, 0);
    assert.equal(span.type, 'span');
    assert.equal(marker.type, 'marker');
  });

  it('propagates overlap shifts to entries on other tracks within the shifted time range', () => {
    // Setup sets minDur=100. Render overlaps with Commit after rounding.
    // Button on another track has raw ts within Commit's raw range, so it shifts too.
    const entries = [
      {
        name: 'Setup',
        ts: 0,
        dur: 100,
        track: 'Blocking',
        trackGroup: 'Scheduler',
        color: 'primary',
      },
      {
        name: 'Render',
        ts: 160,
        dur: 160,
        track: 'Blocking',
        trackGroup: 'Scheduler',
        color: 'primary-dark',
      },
      {
        name: 'Commit',
        ts: 320,
        dur: 150,
        track: 'Blocking',
        trackGroup: 'Scheduler',
        color: 'secondary-dark',
      },
      {
        name: 'Button',
        ts: 330,
        dur: 100,
        track: 'Components',
        color: 'primary-light',
      },
    ];
    const result = normalizeEntries(entries);
    const blockingEntries = result.tracks.scheduler.blocking;
    const componentsEntries = result.tracks.components;

    const render = blockingEntries.find((e) => e.type === 'render');
    const commit = blockingEntries.find((e) => e.type === 'commit');
    const button = componentsEntries.find((e) => e.name === 'Button');

    // Render: start=2, dur=2, end=4. Commit: start=3, shifted to 4.
    assert.equal(render.start, 2);
    assert.equal(render.duration, 2);
    assert.equal(commit.start, 4);
    assert.equal(render.color, undefined);
    assert.equal(commit.color, undefined);
    // Button raw ts=330 is within Commit's raw range [320, 470), so it shifts to 4
    assert.equal(button.start, 4);
    assert.equal(button.type, 'render');
    assert.equal(button.color, undefined);
  });

  it('returns empty tracks for registered tracks with no entries', () => {
    const result = normalizeEntries(
      [],
      [{track: 'Suspense', trackGroup: 'Scheduler'}]
    );
    assert.equal(result.duration, 0);
    assert.ok(result.tracks.scheduler);
    assert.deepEqual(result.tracks.scheduler.suspense, []);
  });
});
