/**
 * Charts preset - adds charting and statistics components
 */
import type { Preset } from '@daui/core';

import Chart from '../atoms/Chart.svelte';
import StatCard from '../molecules/StatCard.svelte';
import TagCloud from '../molecules/TagCloud.svelte';

export const charts: Preset = {
  atoms: {
    chart: Chart,
  },
  molecules: {
    'stat-card': StatCard,
    'tag-cloud': TagCloud,
  },
};
