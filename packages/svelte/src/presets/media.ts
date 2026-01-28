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
import Waveform from '../atoms/Waveform.svelte';
import TimeDisplay from '../atoms/TimeDisplay.svelte';
import Thumbnail from '../atoms/Thumbnail.svelte';

// Molecules
import FrameControls from '../molecules/FrameControls.svelte';
import SpeedControl from '../molecules/SpeedControl.svelte';
import Track from '../molecules/Track.svelte';
import DataPoint from '../molecules/DataPoint.svelte';
import OverlayToggles from '../molecules/OverlayToggles.svelte';

// Organisms
import VideoTimeline from '../organisms/VideoTimeline.svelte';
import VideoPlayer from '../organisms/VideoPlayer.svelte';
import MediaOverlay from '../organisms/MediaOverlay.svelte';

export const media: Preset = {
  atoms: {
    playhead: Playhead,
    'track-segment': TrackSegment,
    'track-marker': TrackMarker,
    'detection-box': DetectionBox,
    'pose-skeleton': PoseSkeleton,
    waveform: Waveform,
    'time-display': TimeDisplay,
    thumbnail: Thumbnail,
  },
  molecules: {
    'frame-controls': FrameControls,
    'speed-control': SpeedControl,
    track: Track,
    'data-point': DataPoint,
    'overlay-toggles': OverlayToggles,
  },
  organisms: {
    'video-timeline': VideoTimeline,
    'video-player': VideoPlayer,
    'media-overlay': MediaOverlay,
  },
};
