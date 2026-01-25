/**
 * Table preset - adds table and filtering components
 */
import type { Preset } from '@daui/core';

import Table from '../organisms/Table.svelte';
import FilterBar from '../molecules/FilterBar.svelte';
import SearchSelect from '../molecules/SearchSelect.svelte';

export const table: Preset = {
  molecules: {
    'filter-bar': FilterBar,
    'search-select': SearchSelect,
  },
  organisms: {
    table: Table,
  },
};
