<script lang="ts">
  import type { DAGViewOrganism, DAGNode, DAGEdge } from '@daui/core';
  import dagre from 'dagre';
  import Icon from '../atoms/Icon.svelte';

  let {
    id,
    nodes: nodesProp,
    edges: edgesProp,
    layout = 'horizontal',
    nodeSize = 'md',
    onNodeClick,
  }: Omit<DAGViewOrganism, 'organism'> = $props();

  // Node dimensions based on size
  const sizes = {
    sm: { width: 140, height: 50, gap: 40, iconSize: 'sm' as const },
    md: { width: 180, height: 60, gap: 50, iconSize: 'md' as const },
    lg: { width: 220, height: 70, gap: 60, iconSize: 'lg' as const },
  };

  const dim = $derived(sizes[nodeSize]);

  // Resolve nodes (can be function or static)
  const nodes = $derived(typeof nodesProp === 'function' ? nodesProp() : nodesProp);

  // Build edges from dependsOn or use provided edges
  const computedEdges = $derived.by(() => {
    if (edgesProp) return edgesProp;

    const edges: DAGEdge[] = [];
    for (const node of nodes) {
      if (node.dependsOn) {
        for (const dep of node.dependsOn) {
          edges.push({ from: dep, to: node.id });
        }
      }
    }
    return edges;
  });

  // Layout calculation using dagre
  interface LayoutNode extends DAGNode {
    x: number;
    y: number;
  }

  const layoutData = $derived.by(() => {
    const g = new dagre.graphlib.Graph();
    g.setGraph({
      rankdir: layout === 'horizontal' ? 'LR' : 'TB',
      nodesep: dim.gap,
      ranksep: dim.gap * 1.5,
      marginx: 20,
      marginy: 20,
    });
    g.setDefaultEdgeLabel(() => ({}));

    // Add nodes
    for (const node of nodes) {
      g.setNode(node.id, { width: dim.width, height: dim.height });
    }

    // Add edges
    for (const edge of computedEdges) {
      g.setEdge(edge.from, edge.to);
    }

    // Run layout
    dagre.layout(g);

    // Extract positions
    const layoutNodes: LayoutNode[] = nodes.map((node) => {
      const graphNode = g.node(node.id);
      return {
        ...node,
        x: graphNode.x - dim.width / 2,
        y: graphNode.y - dim.height / 2,
      };
    });

    // Calculate SVG dimensions
    const graph = g.graph();
    const width = (graph.width || 400) + 40;
    const height = (graph.height || 300) + 40;

    // Build edge paths
    const edgePaths = computedEdges.map((edge) => {
      const fromNode = layoutNodes.find((n) => n.id === edge.from);
      const toNode = layoutNodes.find((n) => n.id === edge.to);

      if (!fromNode || !toNode) return null;

      // Calculate connection points based on layout direction
      let x1: number, y1: number, x2: number, y2: number;

      if (layout === 'horizontal') {
        x1 = fromNode.x + dim.width;
        y1 = fromNode.y + dim.height / 2;
        x2 = toNode.x;
        y2 = toNode.y + dim.height / 2;
      } else {
        x1 = fromNode.x + dim.width / 2;
        y1 = fromNode.y + dim.height;
        x2 = toNode.x + dim.width / 2;
        y2 = toNode.y;
      }

      // Bezier curve control points
      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;

      let path: string;
      if (layout === 'horizontal') {
        path = `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`;
      } else {
        path = `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`;
      }

      return {
        ...edge,
        path,
        toStatus: toNode.status || 'pending',
      };
    }).filter(Boolean);

    return {
      nodes: layoutNodes,
      edges: edgePaths,
      width,
      height,
    };
  });

  function handleNodeClick(node: LayoutNode) {
    if (onNodeClick) {
      onNodeClick(node);
    }
  }

  function getStatusClass(status: string | undefined) {
    return `dag-node--${status || 'pending'}`;
  }

  function getEdgeClass(status: string | undefined) {
    return `dag-edge--${status || 'pending'}`;
  }

  function formatDuration(ms: number | undefined): string {
    if (ms === undefined) return '';
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  }

  function getStatusIcon(node: DAGNode): string {
    switch (node.status) {
      case 'completed':
        return 'check';
      case 'failed':
        return 'x';
      case 'running':
        return 'loader-2';
      case 'skipped':
        return 'minus';
      default:
        return 'circle';
    }
  }
</script>

<div class="dag-view" {id}>
  <svg
    class="dag-view__canvas"
    width={layoutData.width}
    height={layoutData.height}
    viewBox="0 0 {layoutData.width} {layoutData.height}"
  >
    <!-- Arrow marker definition -->
    <defs>
      <marker
        id="arrowhead-{id}"
        markerWidth="10"
        markerHeight="7"
        refX="9"
        refY="3.5"
        orient="auto"
      >
        <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
      </marker>
    </defs>

    <!-- Edges -->
    {#each layoutData.edges as edge}
      {#if edge}
        <path
          class="dag-edge {getEdgeClass(edge.toStatus)}"
          d={edge.path}
          fill="none"
          stroke-width="2"
          marker-end="url(#arrowhead-{id})"
        />
      {/if}
    {/each}
  </svg>

  <!-- Nodes -->
  <div class="dag-view__nodes" style="width: {layoutData.width}px; height: {layoutData.height}px;">
    {#each layoutData.nodes as node (node.id)}
      <button
        class="dag-node {getStatusClass(node.status)}"
        class:dag-node--optional={node.optional}
        style="
          left: {node.x}px;
          top: {node.y}px;
          width: {dim.width}px;
          height: {dim.height}px;
        "
        onclick={() => handleNodeClick(node)}
        title={node.error || ''}
      >
        <span class="dag-node__status-icon" class:dag-node__status-icon--spinning={node.status === 'running'}>
          <Icon name={getStatusIcon(node)} size={dim.iconSize} />
        </span>

        <span class="dag-node__content">
          <span class="dag-node__label">{node.label}</span>
          <span class="dag-node__meta">
            {#if node.status === 'running' && node.progress !== undefined}
              <span class="dag-node__progress">{node.progress}%</span>
            {:else if node.status === 'completed' && node.duration !== undefined}
              <span class="dag-node__duration">{formatDuration(node.duration)}</span>
            {:else if node.status === 'failed' && node.error}
              <span class="dag-node__error" title={node.error}>error</span>
            {/if}
            {#if node.retryAttempt && node.retryMax}
              <span class="dag-node__retry" title="Retry {node.retryAttempt} of {node.retryMax}">
                <Icon name="refresh-cw" size="sm" /> {node.retryAttempt}/{node.retryMax}
              </span>
            {/if}
          </span>
        </span>
      </button>
    {/each}
  </div>
</div>

<style>
  .dag-view {
    position: relative;
    overflow: auto;
    padding: 0;
  }

  .dag-view__canvas {
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
  }

  .dag-view__nodes {
    position: relative;
  }

  /* Edges */
  .dag-edge {
    transition: stroke 0.2s, opacity 0.2s;
  }

  .dag-edge--pending {
    stroke: hsl(var(--muted-foreground, 240 3.8% 46.1%) / 0.4);
    stroke-dasharray: 4 4;
  }

  .dag-edge--running {
    stroke: hsl(var(--primary, 220 70% 50%));
    stroke-dasharray: 4 4;
    animation: dash 0.5s linear infinite;
  }

  .dag-edge--completed {
    stroke: hsl(142 76% 36%);
  }

  .dag-edge--failed {
    stroke: hsl(0 84% 60%);
  }

  .dag-edge--skipped {
    stroke: hsl(var(--muted-foreground, 240 3.8% 46.1%) / 0.3);
    stroke-dasharray: 4 4;
  }

  @keyframes dash {
    to {
      stroke-dashoffset: -8;
    }
  }

  /* Nodes */
  .dag-node {
    position: absolute;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    border-radius: var(--radius, 0.5rem);
    border: 2px solid;
    background: hsl(var(--card, 0 0% 100%));
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;
    font-family: inherit;
  }

  .dag-node:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px hsl(0 0% 0% / 0.1);
  }

  .dag-node:focus {
    outline: none;
    box-shadow: 0 0 0 2px hsl(var(--ring, 240 5% 64.9%));
  }

  .dag-node--optional {
    border-style: dashed;
  }

  /* Status icon */
  .dag-node__status-icon {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
  }

  .dag-node__status-icon--spinning {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .dag-node__content {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }

  .dag-node__label {
    font-weight: 600;
    font-size: 0.8125rem;
    color: hsl(var(--foreground, 240 10% 3.9%));
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .dag-node__meta {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.6875rem;
    color: hsl(var(--muted-foreground, 240 3.8% 46.1%));
  }

  .dag-node__progress {
    color: hsl(var(--primary, 220 70% 50%));
    font-weight: 500;
  }

  .dag-node__duration {
    color: hsl(142 76% 36%);
  }

  .dag-node__error {
    color: hsl(0 84% 60%);
    cursor: help;
  }

  .dag-node__retry {
    display: flex;
    align-items: center;
    gap: 0.125rem;
    color: hsl(38 92% 50%);
  }

  /* Pending state */
  .dag-node--pending {
    border-color: hsl(var(--border, 240 5.9% 90%));
    background: hsl(var(--muted, 240 4.8% 95.9%));
  }

  .dag-node--pending .dag-node__status-icon {
    color: hsl(var(--muted-foreground, 240 3.8% 46.1%));
  }

  /* Running state */
  .dag-node--running {
    border-color: hsl(var(--primary, 220 70% 50%));
    box-shadow: 0 0 0 3px hsl(var(--primary, 220 70% 50%) / 0.2);
    animation: pulse 2s ease-in-out infinite;
  }

  .dag-node--running .dag-node__status-icon {
    color: hsl(var(--primary, 220 70% 50%));
  }

  @keyframes pulse {
    0%, 100% {
      box-shadow: 0 0 0 3px hsl(var(--primary, 220 70% 50%) / 0.2);
    }
    50% {
      box-shadow: 0 0 0 6px hsl(var(--primary, 220 70% 50%) / 0.1);
    }
  }

  /* Completed state */
  .dag-node--completed {
    border-color: hsl(142 76% 36%);
    background: hsl(142 76% 36% / 0.1);
  }

  .dag-node--completed .dag-node__status-icon {
    background: hsl(142 76% 36%);
    color: white;
  }

  .dag-node--completed .dag-node__label {
    color: hsl(142 76% 30%);
  }

  /* Failed state */
  .dag-node--failed {
    border-color: hsl(0 84% 60%);
    background: hsl(0 84% 60% / 0.1);
  }

  .dag-node--failed .dag-node__status-icon {
    background: hsl(0 84% 60%);
    color: white;
  }

  .dag-node--failed .dag-node__label {
    color: hsl(0 84% 45%);
  }

  /* Skipped state */
  .dag-node--skipped {
    border-color: hsl(var(--border, 240 5.9% 90%));
    background: hsl(var(--muted, 240 4.8% 95.9%));
    opacity: 0.6;
  }

  .dag-node--skipped .dag-node__status-icon {
    color: hsl(var(--muted-foreground, 240 3.8% 46.1%));
  }
</style>
