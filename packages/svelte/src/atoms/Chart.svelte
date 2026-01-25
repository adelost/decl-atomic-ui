<script lang="ts">
  import type { ChartAtom } from '@daui/core';
  import { Chart, Svg, Area, Spline, Axis, Grid, Bars, Tooltip } from 'layerchart';
  import { scaleBand, scaleTime } from 'd3-scale';
  import { curveLinear, curveMonotoneX, curveNatural } from 'd3-shape';
  import { format } from 'date-fns';

  let {
    id,
    type = 'area',
    data,
    height = 200,
    color = 'hsl(var(--chart-1, 220 70% 50%))',
    showGrid = true,
    showLabels = true,
    animate = true,
    curve = 'monotone',
  }: ChartAtom = $props();

  const instanceId = `chart-${Math.random().toString(36).slice(2)}`;
  let baseId = $derived(id ?? instanceId);
  let gradientId = $derived(`${baseId}-area`);
  const curveMap = {
    linear: curveLinear,
    monotone: curveMonotoneX,
    natural: curveNatural,
  } as const;
  let curveValue = $derived(typeof curve === 'function' ? curve() : curve);
  let chartCurve = $derived(curveMap[curveValue]);
  let motion = $derived(animate ? true : undefined);

  // Resolve data (can be getter function)
  let chartData = $derived(typeof data === 'function' ? data() : data);

  // Transform data for layerchart
  let transformedData = $derived(
    chartData.map((d, i) => ({
      date: new Date(2024, 0, i + 1), // Generate dates for x-axis
      value: d.value,
      value2: d.value2,
      label: d.label,
    }))
  );

  // For bar charts, use label as x-axis key
  let barData = $derived(
    chartData.map((d) => ({
      category: d.label,
      value: d.value,
    }))
  );

  // Track container visibility to avoid LayerCake zero-dimension warnings
  let containerEl: HTMLDivElement;
  let hasValidDimensions = $state(false);

  $effect(() => {
    if (!containerEl) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        hasValidDimensions = width > 0 && height > 0;
      }
    });

    observer.observe(containerEl);
    return () => observer.disconnect();
  });
</script>

<div class="chart-container" bind:this={containerEl} style:height="{height}px">
  {#if hasValidDimensions && type === 'bar'}
    <!-- Bar chart needs scaleBand for x-axis -->
    <Chart
      data={barData}
      x="category"
      xScale={scaleBand().padding(0.4)}
      y="value"
      yDomain={[0, null]}
      yNice
      padding={{ left: showLabels ? 40 : 8, bottom: showLabels ? 24 : 8, top: 8, right: 8 }}
    >
      <Svg>
        {#if showGrid}
          <Grid horizontal class="stroke-muted/30" tweened={motion} />
        {/if}

        {#if showLabels}
          <Axis
            placement="left"
            format={(d) => d.toLocaleString()}
            class="text-xs"
            tweened={motion}
          />
          <Axis placement="bottom" class="text-xs" tweened={motion} />
        {/if}

        <Bars radius={4} style={`fill: ${color}`} tweened={motion} />
      </Svg>
    </Chart>
  {:else if hasValidDimensions}
    <!-- Line/Area charts use scaleTime -->
    <Chart
      data={transformedData}
      x="date"
      xScale={scaleTime()}
      y="value"
      yDomain={[0, null]}
      yNice
      padding={{ left: showLabels ? 40 : 8, bottom: showLabels ? 24 : 8, top: 8, right: 8 }}
    >
      <Svg>
        {#if type === 'area'}
          <defs>
            <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stop-color={color} stop-opacity="0.3" />
              <stop offset="100%" stop-color={color} stop-opacity="0" />
            </linearGradient>
          </defs>
        {/if}

        {#if showGrid}
          <Grid horizontal class="stroke-muted/30" tweened={motion} />
        {/if}

        {#if showLabels}
          <Axis
            placement="left"
            format={(d) => d.toLocaleString()}
            class="text-xs"
            tweened={motion}
          />
          <Axis
            placement="bottom"
            format={(d) => format(d, 'MMM d')}
            class="text-xs"
            tweened={motion}
          />
        {/if}

        {#if type === 'area'}
          <Area
            curve={chartCurve}
            stroke="none"
            strokeWidth={0}
            fill={`url(#${gradientId})`}
            tweened={motion}
          />
          <Spline
            curve={chartCurve}
            fill="none"
            class="stroke-2"
            style={`stroke: ${color}`}
            tweened={motion}
          />
        {:else if type === 'line'}
          <Spline
            curve={chartCurve}
            fill="none"
            class="stroke-2"
            style={`stroke: ${color}`}
            tweened={motion}
          />
        {/if}
      </Svg>

      <Tooltip.Root let:data>
        <div class="bg-popover border rounded-lg shadow-lg px-3 py-2">
          <div class="text-sm font-medium">{data.label}</div>
          <div class="text-xs text-muted-foreground">{data.value.toLocaleString()}</div>
        </div>
      </Tooltip.Root>
    </Chart>
  {/if}
</div>

<style>
  .chart-container {
    width: 100%;
    min-height: 100px;
  }

  .chart-container :global(.stroke-muted\/30) {
    stroke: hsl(var(--muted, 240 4.8% 95.9%));
    opacity: 0.3;
  }

  .chart-container :global(.text-xs) {
    font-size: 0.75rem;
  }

  .chart-container :global(.fill-primary) {
    fill: hsl(var(--primary, 240 5.9% 10%));
  }
</style>
