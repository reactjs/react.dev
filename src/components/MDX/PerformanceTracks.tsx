/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useEffect, useMemo, useRef, useState} from 'react';

type DevToolsColor =
  | 'primary'
  | 'primary-light'
  | 'primary-dark'
  | 'secondary'
  | 'secondary-light'
  | 'secondary-dark'
  | 'tertiary'
  | 'tertiary-light'
  | 'tertiary-dark'
  | 'warning'
  | 'error';

interface TrackEntry {
  type: string;
  name?: string;
  start: number;
  duration: number;
  depth?: number;
  perf?: 1 | 2 | 3;
  annotation?: string;
}

interface InternalEntry {
  name: string;
  start: number;
  duration: number;
  color: DevToolsColor;
  depth?: number;
  annotation?: string;
}

interface InternalTrack {
  name: string;
  trackGroup?: string;
  entries: InternalEntry[];
}

type TrackGroupValue = TrackEntry[] | Record<string, TrackEntry[]>;

interface PerformanceTracksData {
  duration: number;
  tracks: Record<string, TrackGroupValue>;
}

interface NormalizedData {
  duration: number;
  tracks: InternalTrack[];
  annotations: AnnotationTarget[];
}

interface AnnotationTarget {
  text: string;
  /** Time midpoint of the target entry */
  timeMid: number;
  /** Index of the track (within the flat tracks array) this entry belongs to */
  trackIndex: number;
}

const TYPE_LABELS: Record<string, string> = {
  event: 'Event',
  update: 'Update',
  render: 'Render',
  commit: 'Commit',
  waiting: 'Waiting',
  action: 'Action',
  suspended: 'Suspended',
  prewarm: 'Prewarm',
  'remaining-effects': 'Remaining Effects',
  mount: 'Mount',
  unmount: 'Unmount',
  effect: 'Effect',
};

const SCHEDULER_TYPE_COLORS: Record<string, DevToolsColor> = {
  event: 'warning',
  update: 'primary-light',
  render: 'primary-dark',
  commit: 'secondary-dark',
  waiting: 'secondary-light',
  action: 'primary-dark',
  suspended: 'primary-dark',
  prewarm: 'primary-dark',
  'remaining-effects': 'secondary-dark',
};

function resolveComponentColor(entry: TrackEntry): DevToolsColor {
  switch (entry.type) {
    case 'render': {
      const p = entry.perf ?? 1;
      if (p <= 1) return 'primary-light';
      if (p === 2) return 'primary';
      return 'primary-dark';
    }
    case 'mount':
    case 'unmount':
      return 'warning';
    case 'effect': {
      const p = entry.perf ?? 1;
      if (p <= 1) return 'secondary-light';
      if (p === 2) return 'secondary';
      return 'secondary-dark';
    }
    default:
      return 'primary';
  }
}

function resolveDisplayName(entry: TrackEntry): string {
  if (entry.type === 'event' && entry.name) return `Event: ${entry.name}`;
  return entry.name ?? TYPE_LABELS[entry.type] ?? entry.type;
}

function resolveEntry(
  entry: TrackEntry,
  isComponentTrack: boolean
): InternalEntry {
  return {
    name: resolveDisplayName(entry),
    start: entry.start,
    duration: entry.duration,
    color: isComponentTrack
      ? resolveComponentColor(entry)
      : SCHEDULER_TYPE_COLORS[entry.type] ?? 'primary',
    depth: entry.depth,
    annotation: entry.annotation,
  };
}

function normalizeData(input: PerformanceTracksData): NormalizedData {
  const tracks: InternalTrack[] = [];
  const annotations: AnnotationTarget[] = [];
  for (const [groupId, value] of Object.entries(input.tracks)) {
    const isComponentTrack = groupId === 'components';
    if (Array.isArray(value)) {
      if (value.length === 0) continue;
      const resolved = value.map((e) => resolveEntry(e, isComponentTrack));
      const trackIndex = tracks.length;
      tracks.push({name: getLabel(groupId), entries: resolved});
      for (const entry of resolved) {
        if (entry.annotation) {
          annotations.push({
            text: entry.annotation,
            timeMid: entry.start + entry.duration * 0.85,
            trackIndex,
          });
        }
      }
    } else {
      const groupLabel = getLabel(groupId);
      for (const [trackId, entries] of Object.entries(value)) {
        if (entries.length === 0) continue;
        const resolved = entries.map((e) => resolveEntry(e, false));
        const trackIndex = tracks.length;
        tracks.push({
          name: getLabel(trackId),
          trackGroup: groupLabel,
          entries: resolved,
        });
        for (const entry of resolved) {
          if (entry.annotation) {
            annotations.push({
              text: entry.annotation,
              timeMid: entry.start + entry.duration * 0.85,
              trackIndex,
            });
          }
        }
      }
    }
  }
  return {duration: input.duration, tracks, annotations};
}

// Color mapping from DevTools extension palette to hex values
// Same colors used in both light and dark mode to match Chrome DevTools appearance
const COLORS: Record<DevToolsColor, {bg: string; text: string}> = {
  primary: {bg: '#149ECA', text: '#FFFFFF'},
  'primary-light': {bg: '#ABE2ED', text: '#045975'},
  'primary-dark': {bg: '#087EA4', text: '#FFFFFF'},
  secondary: {bg: '#6B75DB', text: '#FFFFFF'},
  'secondary-light': {bg: '#C3C8F5', text: '#2B3491'},
  'secondary-dark': {bg: '#575FB7', text: '#FFFFFF'},
  tertiary: {bg: '#44AC99', text: '#FFFFFF'},
  'tertiary-light': {bg: '#ABDED5', text: '#2B6E62'},
  'tertiary-dark': {bg: '#388F7F', text: '#FFFFFF'},
  warning: {bg: '#FABD62', text: '#23272F'},
  error: {bg: '#C1554D', text: '#FFFFFF'},
};

const LABELS: Record<string, string> = {
  scheduler: 'Scheduler \u269B',
  components: 'Components \u269B',
  blocking: 'Blocking',
  transition: 'Transition',
  suspense: 'Suspense',
  idle: 'Idle',
};

function getLabel(id: string): string {
  return LABELS[id] ?? id;
}

const ENTRY_HEIGHT = 18;
const ENTRY_GAP = 2;
const ROW_PADDING = 2;
const CHAR_WIDTH = 7;
const LABEL_PAD = 10;
const MAX_LABEL_PX = 130;
const GAP_CAP_PX = 40;
const TRACK_LABEL_WIDTH = 128; // matches w-32
const CONTAINER_ESTIMATE = 500;

const ANNOTATION_FONT_SIZE = 14;
const ANNOTATION_LINE_HEIGHT = 18;
const ANNOTATION_ARROW_GAP = 4;
const ANNOTATION_PADDING = 4;
const ANNOTATION_LABEL_HEIGHT =
  ANNOTATION_LINE_HEIGHT + ANNOTATION_ARROW_GAP + ANNOTATION_PADDING;
const GROUP_HEADER_HEIGHT = 26; // includes 1px border-bottom

interface LayoutResult {
  totalWidth: number;
  mapTime: (t: number) => number;
  needsScroll: boolean;
}

function computeLayout(
  data: NormalizedData,
  containerWidth: number
): LayoutResult {
  const {duration} = data;
  if (duration === 0) {
    return {totalWidth: containerWidth, mapTime: () => 0, needsScroll: false};
  }

  // 1. Collect all unique breakpoints
  const bpSet = new Set<number>();
  bpSet.add(0);
  bpSet.add(duration);
  for (const track of data.tracks) {
    for (const entry of track.entries) {
      bpSet.add(entry.start);
      bpSet.add(entry.start + entry.duration);
    }
  }
  const breakpoints = Array.from(bpSet).sort((a, b) => a - b);

  // 2. Create segments between consecutive breakpoints
  const segments: Array<{
    start: number;
    end: number;
    naturalPx: number;
    allocatedPx: number;
  }> = [];
  for (let i = 0; i < breakpoints.length - 1; i++) {
    const segStart = breakpoints[i];
    const segEnd = breakpoints[i + 1];
    const segDur = segEnd - segStart;
    const naturalPx = (segDur / duration) * containerWidth;
    segments.push({
      start: segStart,
      end: segEnd,
      naturalPx,
      allocatedPx: naturalPx,
    });
  }

  // 3. Collect all non-zero-duration entries with their minimum pixel needs
  const entries: Array<{
    start: number;
    end: number;
    minPx: number;
    duration: number;
  }> = [];
  for (const track of data.tracks) {
    for (const entry of track.entries) {
      if (entry.duration > 0) {
        const minPx = Math.min(
          entry.name.length * CHAR_WIDTH + LABEL_PAD,
          MAX_LABEL_PX
        );
        entries.push({
          start: entry.start,
          end: entry.start + entry.duration,
          minPx,
          duration: entry.duration,
        });
      }
    }
  }

  // 4. Compute minimum widths for each segment based on spanning entries
  for (const entry of entries) {
    // Find segments this entry spans
    for (const seg of segments) {
      if (seg.start >= entry.start && seg.end <= entry.end) {
        // This segment is within the entry
        const segDur = seg.end - seg.start;
        const proportionalMin = entry.minPx * (segDur / entry.duration);
        seg.allocatedPx = Math.max(seg.allocatedPx, proportionalMin);
      }
    }
  }

  // 5. Compress gaps — segments that weren't stretched, respecting label minimums
  for (const seg of segments) {
    const wasStretched = seg.allocatedPx > seg.naturalPx + 0.01;
    if (!wasStretched && seg.allocatedPx > GAP_CAP_PX) {
      // Find minimum required by any spanning entry
      let minRequired = 0;
      for (const entry of entries) {
        if (seg.start >= entry.start && seg.end <= entry.end) {
          const segDur = seg.end - seg.start;
          const proportionalMin = entry.minPx * (segDur / entry.duration);
          minRequired = Math.max(minRequired, proportionalMin);
        }
      }
      const logCompressed =
        GAP_CAP_PX * (1 + Math.log2(seg.naturalPx / GAP_CAP_PX));
      seg.allocatedPx = Math.max(logCompressed, minRequired);
    }
  }

  // 6. Compute total and decide scroll vs scale
  let totalAllocated = 0;
  for (const seg of segments) {
    totalAllocated += seg.allocatedPx;
  }

  let needsScroll = false;
  if (totalAllocated <= containerWidth) {
    // Scale up proportionally to fill container
    const scale = containerWidth / totalAllocated;
    for (const seg of segments) {
      seg.allocatedPx *= scale;
    }
    totalAllocated = containerWidth;
  } else {
    needsScroll = true;
  }

  // 7. Build cumulative position map
  const positions: Array<{time: number; px: number}> = [];
  let cumPx = 0;
  for (let i = 0; i < segments.length; i++) {
    positions.push({time: segments[i].start, px: cumPx});
    cumPx += segments[i].allocatedPx;
  }
  positions.push({
    time: segments[segments.length - 1].end,
    px: cumPx,
  });

  const totalWidth = cumPx;

  // mapTime: interpolate within segments
  function mapTime(t: number): number {
    if (t <= 0) return 0;
    if (t >= duration) return totalWidth;

    // Binary search for the segment containing t
    let lo = 0;
    let hi = positions.length - 2;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (positions[mid].time <= t) {
        lo = mid;
      } else {
        hi = mid - 1;
      }
    }

    const segStart = positions[lo];
    const segEnd = positions[lo + 1];
    const segDur = segEnd.time - segStart.time;
    if (segDur === 0) return segStart.px;

    const frac = (t - segStart.time) / segDur;
    return segStart.px + frac * (segEnd.px - segStart.px);
  }

  return {totalWidth, mapTime, needsScroll};
}

function getTrackContentHeight(track: InternalTrack): number {
  const maxDepth =
    track.entries.length > 0
      ? Math.max(...track.entries.map((e) => e.depth || 0))
      : 0;
  return (maxDepth + 1) * (ENTRY_HEIGHT + ENTRY_GAP) - ENTRY_GAP;
}

function getTrackRowHeight(track: InternalTrack): number {
  return getTrackContentHeight(track) + ROW_PADDING * 2 + 1; // +1 for border-bottom
}

function EntryBar({
  entry,
  layout,
  roundLeft,
  roundRight,
  sameColorRight,
}: {
  entry: InternalEntry;
  layout: LayoutResult;
  roundLeft: boolean;
  roundRight: boolean;
  sameColorRight: boolean;
}) {
  const {mapTime} = layout;
  const leftPx = mapTime(entry.start);
  const rightPx = mapTime(entry.start + entry.duration);
  const widthPx = rightPx - leftPx - (sameColorRight ? 1 : 0);
  const topPx = (entry.depth || 0) * (ENTRY_HEIGHT + ENTRY_GAP);
  const colors = COLORS[entry.color];

  // Zero-duration markers: render as thin vertical line
  if (entry.duration === 0) {
    return (
      <div
        className="absolute"
        style={{
          left: `${leftPx}px`,
          top: `${topPx}px`,
          height: `${ENTRY_HEIGHT}px`,
          width: '2px',
          backgroundColor: colors.bg,
        }}
      />
    );
  }

  const rounding = `${roundLeft ? 'rounded-l-sm' : ''} ${
    roundRight ? 'rounded-r-sm' : ''
  }`;

  return (
    <div
      className={`absolute flex items-center overflow-hidden ${rounding}`}
      style={{
        left: `${leftPx}px`,
        width: `${widthPx}px`,
        top: `${topPx}px`,
        height: `${ENTRY_HEIGHT}px`,
        backgroundColor: colors.bg,
      }}>
      <span
        className="relative truncate px-1 text-[11px] leading-[18px]"
        style={{color: colors.text}}>
        {entry.name}
      </span>
    </div>
  );
}

function TrackRow({
  track,
  layout,
}: {
  track: InternalTrack;
  layout: LayoutResult;
}) {
  const contentHeight = getTrackContentHeight(track);

  return (
    <div
      className="flex items-center border-b border-border dark:border-border-dark last:border-b-0"
      style={{height: `${getTrackRowHeight(track)}px`}}>
      <div className="sticky left-0 z-40 w-32 shrink-0 px-2 text-[11px] leading-[18px] text-tertiary dark:text-tertiary-dark flex items-center border-r border-border dark:border-border-dark bg-wash dark:bg-wash-dark self-stretch">
        <span className="text-[8px] me-1 opacity-50">&#9656;</span>
        {track.name}
      </div>
      <div
        className="relative"
        style={{
          width: layout.needsScroll ? `${layout.totalWidth}px` : '100%',
          height: `${contentHeight}px`,
        }}>
        {track.entries.map((entry, i) => {
          const depth = entry.depth || 0;
          const end = entry.start + entry.duration;
          const rightNeighbor = track.entries.find(
            (other) => (other.depth || 0) === depth && other.start === end
          );
          const roundLeft = !track.entries.some(
            (other) =>
              (other.depth || 0) === depth &&
              other.start + other.duration === entry.start
          );
          const roundRight = !rightNeighbor;
          const sameColorRight =
            !roundRight && rightNeighbor!.color === entry.color;
          return (
            <EntryBar
              key={i}
              entry={entry}
              layout={layout}
              roundLeft={roundLeft}
              roundRight={roundRight}
              sameColorRight={sameColorRight}
            />
          );
        })}
      </div>
    </div>
  );
}

function TrackGroupSection({
  groupName,
  tracks,
  layout,
}: {
  groupName: string;
  tracks: InternalTrack[];
  layout: LayoutResult;
}) {
  return (
    <div>
      <div
        className="border-b border-border dark:border-border-dark bg-gray-5 dark:bg-gray-80"
        style={{height: `${GROUP_HEADER_HEIGHT}px`}}>
        <div className="sticky left-0 z-40 w-32 shrink-0 px-2 text-[11px] leading-[18px] text-tertiary dark:text-tertiary-dark flex items-center gap-1 h-full bg-gray-5 dark:bg-gray-80">
          <span className="text-[8px] opacity-50">&#9660;</span>
          <span>{groupName}</span>
        </div>
      </div>
      {tracks.map((track, i) => (
        <TrackRow key={i} track={track} layout={layout} />
      ))}
    </div>
  );
}

const ANNOTATION_COLOR = '#E05BD2';
const ANNOTATION_ARCH_PX = 12;

function AnnotationOverlay({
  annotations,
  layout,
  trackYOffsets,
  tracks,
  totalHeight,
}: {
  annotations: AnnotationTarget[];
  layout: LayoutResult;
  trackYOffsets: number[];
  tracks: InternalTrack[];
  totalHeight: number;
}) {
  return (
    <svg
      className="absolute top-0 pointer-events-none text-tertiary dark:text-tertiary-dark z-10"
      style={{
        left: `${TRACK_LABEL_WIDTH}px`,
        width: layout.needsScroll
          ? `${layout.totalWidth}px`
          : `calc(100% - ${TRACK_LABEL_WIDTH}px)`,
        height: `${totalHeight}px`,
      }}>
      {annotations.map((ann, i) => {
        const xPx = layout.mapTime(ann.timeMid);
        const labelY = ANNOTATION_PADDING;
        const trackRow = tracks[ann.trackIndex];
        const trackRowMidY =
          ANNOTATION_LABEL_HEIGHT +
          trackYOffsets[ann.trackIndex] +
          getTrackRowHeight(trackRow) / 2;
        const stemStartY =
          labelY + ANNOTATION_LINE_HEIGHT + ANNOTATION_ARROW_GAP;
        const arrowTipY = trackRowMidY;

        // Label is offset to the right; curve starts near left edge of text
        const startX = xPx + ANNOTATION_ARCH_PX;
        const labelXPx = startX - CHAR_WIDTH;
        const endX = xPx;

        // Cubic bezier: start straight down, sweep in the middle, arrive at 45°
        const midY = (stemStartY + arrowTipY) / 2;
        const cp1X = startX;
        const cp1Y = midY;
        const cp2X = endX + ANNOTATION_ARCH_PX;
        const cp2Y = midY;

        // Tangent at t=1 of cubic bezier = end - cp2 (arrives at 45°)
        const tx = endX - cp2X;
        const ty = arrowTipY - cp2Y;
        const angleDeg = (Math.atan2(ty, tx) * 180) / Math.PI - 90;

        return (
          <g key={i}>
            <text
              x={labelXPx}
              y={labelY + ANNOTATION_LINE_HEIGHT * 0.85}
              textAnchor="start"
              fill={ANNOTATION_COLOR}
              style={{
                fontSize: `${ANNOTATION_FONT_SIZE}px`,
                fontWeight: 600,
              }}>
              {ann.text}
            </text>
            <path
              d={`M ${startX} ${stemStartY} C ${cp1X} ${cp1Y} ${cp2X} ${cp2Y} ${endX} ${arrowTipY}`}
              stroke={ANNOTATION_COLOR}
              strokeWidth={2}
              fill="none"
            />
            <polygon
              points="-5,-8 5,-8 0,0"
              fill={ANNOTATION_COLOR}
              transform={`translate(${endX},${arrowTipY}) rotate(${angleDeg})`}
            />
          </g>
        );
      })}
    </svg>
  );
}

export function PerformanceTracks({data}: {data: PerformanceTracksData}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(CONTAINER_ESTIMATE);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.clientWidth - TRACK_LABEL_WIDTH;
      if (w > 0) setContainerWidth(w);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const normalizedData = useMemo(() => normalizeData(data), [data]);
  const hasAnnotations = normalizedData.annotations.length > 0;

  const layout = useMemo(
    () => computeLayout(normalizedData, containerWidth),
    [normalizedData, containerWidth]
  );

  // Group tracks by trackGroup
  const groups: Array<{groupName: string; tracks: InternalTrack[]}> = [];
  const seen = new Map<string, number>();

  for (const track of normalizedData.tracks) {
    const groupName = track.trackGroup || track.name;
    const idx = seen.get(groupName);
    if (idx !== undefined) {
      groups[idx].tracks.push(track);
    } else {
      seen.set(groupName, groups.length);
      groups.push({groupName, tracks: [track]});
    }
  }

  // Compute Y offset of each track row (relative to the start of the tracks area)
  const trackYOffsets: number[] = [];
  let yOffset = 0;
  const seenGroupsForY = new Set<string>();
  for (const track of normalizedData.tracks) {
    const groupName = track.trackGroup || track.name;
    if (!seenGroupsForY.has(groupName)) {
      seenGroupsForY.add(groupName);
      yOffset += GROUP_HEADER_HEIGHT;
    }
    trackYOffsets.push(yOffset);
    yOffset += getTrackRowHeight(track);
  }

  return (
    <div
      ref={containerRef}
      className="my-8 rounded-lg border border-border dark:border-border-dark bg-wash dark:bg-wash-dark overflow-x-auto overflow-y-hidden text-sm pb-3"
      translate="no"
      dir="ltr">
      <div
        className="relative"
        style={{
          minWidth: layout.needsScroll
            ? `${layout.totalWidth + TRACK_LABEL_WIDTH}px`
            : undefined,
          paddingTop: hasAnnotations
            ? `${ANNOTATION_LABEL_HEIGHT}px`
            : undefined,
        }}>
        {hasAnnotations && (
          <>
            <div
              className="sticky left-0 z-40 w-32 bg-wash dark:bg-wash-dark border-r border-b border-border dark:border-border-dark"
              style={{
                height: `${ANNOTATION_LABEL_HEIGHT}px`,
                marginTop: `-${ANNOTATION_LABEL_HEIGHT}px`,
              }}
            />
            <AnnotationOverlay
              annotations={normalizedData.annotations}
              layout={layout}
              trackYOffsets={trackYOffsets}
              tracks={normalizedData.tracks}
              totalHeight={ANNOTATION_LABEL_HEIGHT + yOffset}
            />
          </>
        )}
        {groups.map((group, i) => (
          <TrackGroupSection
            key={i}
            groupName={group.groupName}
            tracks={group.tracks}
            layout={layout}
          />
        ))}
      </div>
    </div>
  );
}
