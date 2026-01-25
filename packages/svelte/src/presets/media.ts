/**
 * Media preset - video timeline and player components
 * Opt-in for video editing applications
 * No heavy external dependencies
 */
import type { Preset } from '@daui/core';

// Atoms
import Playhead from '../atoms/Playhead.svelte';
import TrackSegment from '../atoms/TrackSegment.svelte';
import TrackMarker from '../atoms/TrackMarker.svelte';
import DetectionBox from '../atoms/DetectionBox.svelte';
import PoseSkeleton from '../atoms/PoseSkeleton.svelte';

// Molecules
import FrameControls from '../molecules/FrameControls.svelte';
import SpeedControl from '../molecules/SpeedControl.svelte';
import Track from '../molecules/Track.svelte';
import DataPoint from '../molecules/DataPoint.svelte';

// Organisms
import VideoTimeline from '../organisms/VideoTimeline.svelte';
import VideoPlayer from '../organisms/VideoPlayer.svelte';

export const media: Preset = {
  atoms: {
    playhead: Playhead,
    'track-segment': TrackSegment,
    'track-marker': TrackMarker,
    'detection-box': DetectionBox,
    'pose-skeleton': PoseSkeleton,
  },
  molecules: {
    'frame-controls': FrameControls,
    'speed-control': SpeedControl,
    track: Track,
    'data-point': DataPoint,
  },
  organisms: {
    'video-timeline': VideoTimeline,
    'video-player': VideoPlayer,
  },
};
