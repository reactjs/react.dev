/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const ID_MAP = {
  'Scheduler \u269B': 'scheduler',
  Scheduler: 'scheduler',
  'Components \u269B': 'components',
  Components: 'components',
  Blocking: 'blocking',
  Transition: 'transition',
  Suspense: 'suspense',
  Idle: 'idle',
};

function toId(name) {
  return (
    ID_MAP[name] ||
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  );
}

// Map entry name → {type, name?} for scheduler track entries
function inferSchedulerType(entryName) {
  if (entryName.startsWith('Event: ')) {
    return {type: 'event', name: entryName.slice(7)};
  }
  const SCHEDULER_TYPES = {
    Render: 'render',
    Commit: 'commit',
    Update: 'update',
    Action: 'action',
    Suspended: 'suspended',
    Prewarm: 'prewarm',
    'Remaining Effects': 'remaining-effects',
    Waiting: 'waiting',
    'Waiting for Paint': 'waiting',
  };
  const type = SCHEDULER_TYPES[entryName];
  if (type) {
    const TYPE_LABELS = {
      render: 'Render',
      commit: 'Commit',
      update: 'Update',
      action: 'Action',
      suspended: 'Suspended',
      prewarm: 'Prewarm',
      'remaining-effects': 'Remaining Effects',
      waiting: 'Waiting',
    };
    const needsName = entryName !== TYPE_LABELS[type];
    return needsName ? {type, name: entryName} : {type};
  }
  return {type: entryName.toLowerCase().replace(/\s+/g, '-'), name: entryName};
}

// Map component track entry → {type, name?, perf?}
function inferComponentType(entryName, color) {
  if (entryName === 'Mount') return {type: 'mount'};
  if (entryName === 'Unmount') return {type: 'unmount'};
  // Component render — perf tier derived from color
  const result = {type: 'render', name: entryName};
  const perf = colorToPerf(color);
  if (perf > 1) result.perf = perf;
  return result;
}

// Reverse-map trace color → perf tier
function colorToPerf(color) {
  if (color === 'primary' || color === 'secondary') return 2;
  if (color === 'primary-dark' || color === 'secondary-dark') return 3;
  return 1; // primary-light, secondary-light, or default
}

// Extract extension track entries from performance.measure() events
// These have cat: "blink.user_timing" with args.detail containing {devtools: {...}}
function extractPerformanceAPIEntries(events) {
  const beginEvents = new Map(); // key -> event
  const entries = [];

  for (const event of events) {
    if (!event.cat || !event.cat.includes('blink.user_timing')) {
      continue;
    }

    // Handle end events before metadata check — they pair by key
    // and use the begin event's metadata (end events have args: {})
    if (event.ph === 'e') {
      const key = `${event.id || event.id2?.local || event.id2?.global}-${
        event.cat
      }-${event.name}`;
      const begin = beginEvents.get(key);
      if (begin) {
        entries.push({
          name: event.name,
          ts: begin.event.ts,
          dur: event.ts - begin.event.ts,
          track: begin.devtools.track,
          trackGroup: begin.devtools.trackGroup,
          color: begin.devtools.color,
          dataType: begin.devtools.dataType || 'track-entry',
        });
        beginEvents.delete(key);
      }
      continue;
    }

    // Try to parse devtools metadata from detail
    let detail = null;
    const detailStr = event.args?.detail || event.args?.data?.detail;
    if (typeof detailStr === 'string') {
      try {
        detail = JSON.parse(detailStr);
      } catch (e) {
        continue;
      }
    } else if (typeof detailStr === 'object' && detailStr !== null) {
      detail = detailStr;
    }

    if (!detail || !detail.devtools) {
      continue;
    }

    const devtools = detail.devtools;

    if (event.ph === 'b') {
      // Begin of async pair
      const key = `${event.id || event.id2?.local || event.id2?.global}-${
        event.cat
      }-${event.name}`;
      beginEvents.set(key, {event, devtools});
    } else if (event.ph === 'I' || event.ph === 'R' || event.ph === 'n') {
      // Instant event (marker)
      entries.push({
        name: event.name,
        ts: event.ts,
        dur: 0,
        track: devtools.track,
        trackGroup: devtools.trackGroup,
        color: devtools.color,
        dataType: devtools.dataType || 'marker',
      });
    }
  }

  return entries;
}

// Extract extension track entries from console.timeStamp() events
// These have cat: "devtools.timeline", name: "TimeStamp", with args.data.track
function extractConsoleTimestampEntries(events) {
  const entries = [];
  const registeredTracks = []; // {track, trackGroup} from registration markers
  const namedTimestamps = new Map(); // name -> ts

  // First pass: collect named timestamps for start/end references
  for (const event of events) {
    if (
      event.cat === 'devtools.timeline' &&
      event.name === 'TimeStamp' &&
      event.args?.data?.name != null
    ) {
      namedTimestamps.set(String(event.args.data.name), event.ts);
    }
  }

  // Second pass: extract entries
  for (const event of events) {
    if (event.cat !== 'devtools.timeline' || event.name !== 'TimeStamp') {
      continue;
    }

    const data = event.args?.data;
    if (!data || data.track == null) {
      continue;
    }

    let startTs = event.ts;
    let endTs = event.ts;

    // Resolve start reference
    if (data.start != null) {
      if (typeof data.start === 'number') {
        startTs = data.start;
      } else {
        const ref = namedTimestamps.get(String(data.start));
        if (ref != null) startTs = ref;
      }
    }

    // Resolve end reference
    if (data.end != null) {
      if (typeof data.end === 'number') {
        endTs = data.end;
      } else {
        const ref = namedTimestamps.get(String(data.end));
        if (ref != null) endTs = ref;
      }
    }

    // Skip track registration markers (zero-duration entries that just register the track)
    // but remember the track so it appears in output with empty entries
    if (startTs === endTs && data.message && data.message.endsWith(' Track')) {
      registeredTracks.push({
        track: String(data.track),
        trackGroup:
          data.trackGroup != null ? String(data.trackGroup) : undefined,
      });
      continue;
    }

    entries.push({
      name: data.message || '',
      ts: startTs,
      dur: Math.max(0, endTs - startTs),
      track: String(data.track),
      trackGroup: data.trackGroup != null ? String(data.trackGroup) : undefined,
      color: data.color != null ? String(data.color) : 'primary',
      dataType: 'track-entry',
    });
  }

  return {entries, registeredTracks};
}

// Compute flamegraph depth for entries within a track
// Entries that overlap in time get increasing depth
function computeDepths(entries) {
  // Sort by start time, then by duration descending (parents before children)
  entries.sort((a, b) => a.start - b.start || b.duration - a.duration);

  const active = []; // stack of {end, depth}
  for (const entry of entries) {
    // Remove entries that have ended
    const stillActive = active.filter((a) => a.end > entry.start + 0.001);
    active.length = 0;
    active.push(...stillActive);

    // Find the next available depth
    const usedDepths = new Set(active.map((a) => a.depth));
    let depth = 0;
    while (usedDepths.has(depth)) {
      depth++;
    }

    entry.depth = depth;
    if (entry.duration > 0) {
      active.push({end: entry.start + entry.duration, depth});
    }
  }
}

// Normalize raw entries into tracks with proportional start/duration and depth
// This encapsulates: µs → proportional unit conversion, track grouping, overlap fixup, and depth computation
function normalizeEntries(rawEntries, registeredTracks = []) {
  if (rawEntries.length === 0) {
    // Still include registered tracks even with no entries
    const tracks = {};
    for (const reg of registeredTracks) {
      const groupId = reg.trackGroup ? toId(reg.trackGroup) : toId(reg.track);
      if (reg.trackGroup) {
        if (!tracks[groupId]) tracks[groupId] = {};
        tracks[groupId][toId(reg.track)] = [];
      } else {
        tracks[groupId] = [];
      }
    }
    return {duration: 0, tracks};
  }

  // Normalize to proportional units (shortest duration = 1)
  const minTs = Math.min(...rawEntries.map((e) => e.ts));
  const nonZeroDurations = rawEntries
    .filter((e) => e.dur > 0)
    .map((e) => e.dur);
  const minDur =
    nonZeroDurations.length > 0 ? Math.min(...nonZeroDurations) : 1000;
  for (const entry of rawEntries) {
    entry.start = Math.round((entry.ts - minTs) / minDur);
    entry.duration =
      entry.dur > 0 ? Math.max(1, Math.round(entry.dur / minDur)) : 0;
  }

  // Group by track
  const trackMap = new Map();

  // Ensure registered tracks exist (even if they have no entries)
  for (const reg of registeredTracks) {
    const trackKey = `${reg.trackGroup || ''}::${reg.track}`;
    if (!trackMap.has(trackKey)) {
      trackMap.set(trackKey, {
        name: reg.track,
        trackGroup: reg.trackGroup,
        entries: [],
      });
    }
  }

  for (const entry of rawEntries) {
    const trackKey = `${entry.trackGroup || ''}::${entry.track}`;
    if (!trackMap.has(trackKey)) {
      trackMap.set(trackKey, {
        name: entry.track,
        trackGroup: entry.trackGroup,
        entries: [],
      });
    }
    trackMap.get(trackKey).entries.push({
      name: entry.name,
      start: entry.start,
      duration: entry.duration,
      color: entry.color || 'primary',
      depth: 0,
      _ts: entry.ts, // preserve for overlap fixup
      _dur: entry.dur, // preserve for overlap fixup
    });
  }

  // Per-track overlap fixup: fix sequential entries that overlap only due to rounding
  for (const track of trackMap.values()) {
    // Sort by raw timestamp, then raw duration desc (parents before children)
    track.entries.sort((a, b) => a._ts - b._ts || b._dur - a._dur);
    for (let i = 1; i < track.entries.length; i++) {
      const prev = track.entries[i - 1];
      const curr = track.entries[i];
      const prevEnd = prev.start + prev.duration;
      const prevRawEnd = prev._ts + prev._dur;
      // Only fix if they were sequential in raw data but overlap after rounding
      if (curr._ts >= prevRawEnd && curr.start < prevEnd) {
        curr.start = prevEnd;
        curr._shifted = true;
      }
    }
  }

  // Cross-track shift propagation: when a shifted entry moves forward,
  // entries on other tracks whose raw timestamp falls within the shifted
  // entry's raw time range should move to at least the same start position
  const shiftedEntries = [];
  for (const track of trackMap.values()) {
    for (const entry of track.entries) {
      if (entry._shifted) {
        shiftedEntries.push(entry);
      }
    }
  }
  if (shiftedEntries.length > 0) {
    for (const track of trackMap.values()) {
      for (const entry of track.entries) {
        if (!entry._shifted) {
          for (const shifted of shiftedEntries) {
            if (
              entry._ts >= shifted._ts &&
              entry._ts < shifted._ts + shifted._dur
            ) {
              entry.start = Math.max(entry.start, shifted.start);
            }
          }
        }
      }
    }
    // Re-run per-track overlap fixup to resolve any new overlaps
    // created by cross-track propagation
    for (const track of trackMap.values()) {
      track.entries.sort((a, b) => a._ts - b._ts || b._dur - a._dur);
      for (let i = 1; i < track.entries.length; i++) {
        const prev = track.entries[i - 1];
        const curr = track.entries[i];
        const prevEnd = prev.start + prev.duration;
        const prevRawEnd = prev._ts + prev._dur;
        if (curr._ts >= prevRawEnd && curr.start < prevEnd) {
          curr.start = prevEnd;
        }
      }
    }
  }

  // Compute depths
  for (const track of trackMap.values()) {
    computeDepths(track.entries);
  }

  // Build output (strip internal fields, compute total duration)
  let maxEnd = 0;
  for (const track of trackMap.values()) {
    for (const entry of track.entries) {
      maxEnd = Math.max(maxEnd, entry.start + entry.duration);
    }
  }
  const tracks = {};
  for (const track of trackMap.values()) {
    const isComponentTrack =
      track.name === 'Components' || track.name === 'Components ⚛';
    const cleanEntries = track.entries.map((e) => {
      const typeInfo = isComponentTrack
        ? inferComponentType(e.name, e.color)
        : inferSchedulerType(e.name);

      const result = {
        type: typeInfo.type,
        start: e.start,
        duration: e.duration,
      };
      if (typeInfo.name) result.name = typeInfo.name;
      if (typeInfo.perf > 1) result.perf = typeInfo.perf;
      if (e.depth > 0) result.depth = e.depth;
      return result;
    });
    const groupId = track.trackGroup
      ? toId(track.trackGroup)
      : toId(track.name);
    if (track.trackGroup) {
      if (!tracks[groupId]) tracks[groupId] = {};
      tracks[groupId][toId(track.name)] = cleanEntries;
    } else {
      tracks[groupId] = cleanEntries;
    }
  }

  return {duration: Math.ceil(maxEnd), tracks};
}

// Export functions for testing
module.exports = {
  extractPerformanceAPIEntries,
  extractConsoleTimestampEntries,
  computeDepths,
  normalizeEntries,
};

// CLI entry point — only runs when executed directly
if (require.main === module) {
  const fs = require('fs');
  const path = require('path');

  // Parse CLI args
  const args = process.argv.slice(2);
  const flags = {};
  const positional = [];

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--start' && i + 1 < args.length) {
      flags.start = parseFloat(args[++i]);
    } else if (args[i] === '--end' && i + 1 < args.length) {
      flags.end = parseFloat(args[++i]);
    } else if (args[i] === '--pretty') {
      flags.pretty = true;
    } else if (args[i] === '--copy') {
      flags.copy = true;
    } else if (args[i] === '--help' || args[i] === '-h') {
      console.log(
        'Usage: node scripts/convertTrace.js <trace.json> [--start <ms>] [--end <ms>] [--pretty] [--copy]'
      );
      console.log('');
      console.log(
        'Extracts React DevTools extension track data from a Chrome Performance trace.'
      );
      console.log(
        'Outputs a <PerformanceTracks data={{...}} /> JSX snippet for the MDX component.'
      );
      console.log('');
      console.log('Options:');
      console.log(
        '  --start <ms>  Only include entries starting at or after this time'
      );
      console.log(
        '  --end <ms>    Only include entries starting at or before this time'
      );
      console.log('  --pretty      Pretty-print the JSON data');
      console.log('  --copy        Copy output to clipboard (macOS pbcopy)');
      process.exit(0);
    } else {
      positional.push(args[i]);
    }
  }

  const traceFile = positional[0];
  if (!traceFile) {
    console.error(
      'Usage: node scripts/convertTrace.js <trace.json> [--start <ms>] [--end <ms>] [--pretty] [--copy]'
    );
    process.exit(1);
  }

  // Read and parse trace
  const raw = fs.readFileSync(path.resolve(traceFile), 'utf8');
  const parsed = JSON.parse(raw);
  const traceEvents = Array.isArray(parsed) ? parsed : parsed.traceEvents || [];

  // Main
  const perfEntries = extractPerformanceAPIEntries(traceEvents);
  const {entries: timestampEntries, registeredTracks} =
    extractConsoleTimestampEntries(traceEvents);
  const allEntries = [...perfEntries, ...timestampEntries];

  if (allEntries.length === 0) {
    console.error('No extension track entries found in trace.');
    process.exit(1);
  }

  // Apply optional time range filter (on raw µs timestamps, converted to ms offsets)
  if (flags.start != null || flags.end != null) {
    const minTs = Math.min(...allEntries.map((e) => e.ts));
    const startFilter = flags.start || 0;
    const endFilter = flags.end || Infinity;
    const filtered = allEntries.filter((e) => {
      const startMs = Math.round((e.ts - minTs) / 1000);
      const durMs = e.dur > 0 ? Math.max(1, Math.round(e.dur / 1000)) : 0;
      return startMs + durMs >= startFilter && startMs <= endFilter;
    });
    allEntries.length = 0;
    allEntries.push(...filtered);
  }

  const result = normalizeEntries(allEntries, registeredTracks);

  const json = flags.pretty
    ? JSON.stringify(result, null, 2)
    : JSON.stringify(result);

  const cliOutput = `<PerformanceTracks data={${json}} />`;

  if (flags.copy) {
    require('child_process').execSync('pbcopy', {input: cliOutput});
  }

  console.log(cliOutput);
}
