<script lang="ts">
  import type { TreeViewOrganism, TreeViewNode } from '@daui/core';
  import Icon from '../atoms/Icon.svelte';

  let {
    id,
    nodes,
    onNodeClick,
    layout: _layout = 'vertical',
    nodeSize = 'md',
  }: TreeViewOrganism = $props();

  // Node dimensions based on size
  const sizes = {
    sm: { width: 140, height: 60, gap: 40, iconSize: 'sm' as const },
    md: { width: 180, height: 80, gap: 50, iconSize: 'md' as const },
    lg: { width: 220, height: 100, gap: 60, iconSize: 'lg' as const },
  };

  const dim = $derived(sizes[nodeSize]);

  // Build tree structure from flat nodes
  interface TreeNode extends TreeViewNode {
    children: TreeNode[];
    x: number;
    y: number;
    resolvedStatus: 'locked' | 'available' | 'completed';
  }

  // Calculate tree layout
  let treeData = $derived.by(() => {
    // Create lookup map
    const nodeMap = new Map<string, TreeNode>();
    nodes.forEach((n) => {
      const status = typeof n.status === 'function' ? n.status() : n.status;
      nodeMap.set(n.id, { ...n, children: [], x: 0, y: 0, resolvedStatus: status });
    });

    // Build parent-child relationships
    const roots: TreeNode[] = [];
    nodeMap.forEach((node) => {
      if (node.parent && nodeMap.has(node.parent)) {
        nodeMap.get(node.parent)!.children.push(node);
      } else if (!node.parent) {
        roots.push(node);
      }
    });

    // Calculate positions using simple tree layout
    let maxX = 0;
    let maxY = 0;

    function layoutNode(node: TreeNode, depth: number, xOffset: number): number {
      const y = depth * (dim.height + dim.gap);
      node.y = y;
      maxY = Math.max(maxY, y);

      if (node.children.length === 0) {
        node.x = xOffset;
        maxX = Math.max(maxX, xOffset);
        return xOffset + dim.width + dim.gap;
      }

      let childX = xOffset;
      node.children.forEach((child) => {
        childX = layoutNode(child, depth + 1, childX);
      });

      // Center parent above children
      const firstChild = node.children[0];
      const lastChild = node.children[node.children.length - 1];
      node.x = (firstChild.x + lastChild.x) / 2;
      maxX = Math.max(maxX, node.x);

      return childX;
    }

    let currentX = 0;
    roots.forEach((root) => {
      currentX = layoutNode(root, 0, currentX);
    });

    // Collect all nodes for rendering
    const allNodes: TreeNode[] = [];
    function collectNodes(node: TreeNode) {
      allNodes.push(node);
      node.children.forEach(collectNodes);
    }
    roots.forEach(collectNodes);

    // Calculate edges
    const edges: { x1: number; y1: number; x2: number; y2: number; status: string }[] = [];
    allNodes.forEach((node) => {
      node.children.forEach((child) => {
        edges.push({
          x1: node.x + dim.width / 2,
          y1: node.y + dim.height,
          x2: child.x + dim.width / 2,
          y2: child.y,
          status: child.resolvedStatus,
        });
      });
    });

    return {
      nodes: allNodes,
      edges,
      width: maxX + dim.width + 40,
      height: maxY + dim.height + 40,
    };
  });

  function handleClick(node: TreeNode) {
    if (node.resolvedStatus === 'locked') return;
    if (node.href) {
      window.location.href = node.href;
    } else if (onNodeClick) {
      onNodeClick(node);
    }
  }

  function getStatusClass(status: string) {
    return `tree-node--${status}`;
  }
</script>

<div class="tree-view" {id}>
  <svg
    class="tree-view__edges"
    width={treeData.width}
    height={treeData.height}
    viewBox="0 0 {treeData.width} {treeData.height}"
  >
    {#each treeData.edges as edge}
      <path
        class="tree-view__edge {getStatusClass(edge.status)}"
        d="M {edge.x1} {edge.y1}
           C {edge.x1} {edge.y1 + dim.gap / 2},
             {edge.x2} {edge.y2 - dim.gap / 2},
             {edge.x2} {edge.y2}"
        fill="none"
        stroke-width="2"
      />
    {/each}
  </svg>

  <div class="tree-view__nodes" style="width: {treeData.width}px; height: {treeData.height}px;">
    {#each treeData.nodes as node (node.id)}
      <button
        class="tree-node {getStatusClass(node.resolvedStatus)}"
        style="
          left: {node.x}px;
          top: {node.y}px;
          width: {dim.width}px;
          height: {dim.height}px;
        "
        onclick={() => handleClick(node)}
        disabled={node.resolvedStatus === 'locked'}
      >
        {#if node.icon}
          <span class="tree-node__icon">
            <Icon name={node.icon} size={dim.iconSize} />
          </span>
        {/if}
        <span class="tree-node__content">
          <span class="tree-node__title">{node.title}</span>
          {#if node.description && nodeSize !== 'sm'}
            <span class="tree-node__desc">{node.description}</span>
          {/if}
        </span>
        {#if node.resolvedStatus === 'completed'}
          <span class="tree-node__check">
            <Icon name="check" size="sm" />
          </span>
        {:else if node.resolvedStatus === 'locked'}
          <span class="tree-node__lock">
            <Icon name="lock" size="sm" />
          </span>
        {/if}
      </button>
    {/each}
  </div>
</div>

<style>
  .tree-view {
    position: relative;
    overflow: auto;
    padding: 20px;
  }

  .tree-view__edges {
    position: absolute;
    top: 20px;
    left: 20px;
    pointer-events: none;
  }

  .tree-view__edge {
    transition: stroke 0.2s;
  }

  .tree-view__edge.tree-node--locked {
    stroke: hsl(var(--muted-foreground, 240 3.8% 46.1%) / 0.3);
    stroke-dasharray: 4 4;
  }

  .tree-view__edge.tree-node--available {
    stroke: hsl(var(--primary, 220 70% 50%));
  }

  .tree-view__edge.tree-node--completed {
    stroke: hsl(142 76% 36%);
  }

  .tree-view__nodes {
    position: relative;
  }

  .tree-node {
    position: absolute;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    border-radius: var(--radius, 0.5rem);
    border: 2px solid;
    background: hsl(var(--card, 0 0% 100%));
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;
  }

  .tree-node:focus {
    outline: none;
    box-shadow: 0 0 0 2px hsl(var(--ring, 240 5% 64.9%));
  }

  .tree-node__icon {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    background: hsl(var(--muted, 240 4.8% 95.9%));
  }

  .tree-node__content {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }

  .tree-node__title {
    font-weight: 600;
    font-size: 0.875rem;
    color: hsl(var(--foreground, 240 10% 3.9%));
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .tree-node__desc {
    font-size: 0.75rem;
    color: hsl(var(--muted-foreground, 240 3.8% 46.1%));
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .tree-node__check,
  .tree-node__lock {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
  }

  .tree-node__check {
    background: hsl(142 76% 36%);
    color: white;
  }

  .tree-node__lock {
    color: hsl(var(--muted-foreground, 240 3.8% 46.1%));
  }

  /* Locked state */
  .tree-node.tree-node--locked {
    border-color: hsl(var(--border, 240 5.9% 90%));
    background: hsl(var(--muted, 240 4.8% 95.9%));
    opacity: 0.6;
    cursor: not-allowed;
  }

  .tree-node.tree-node--locked .tree-node__icon {
    background: hsl(var(--border, 240 5.9% 90%));
  }

  /* Available state */
  .tree-node.tree-node--available {
    border-color: hsl(var(--primary, 220 70% 50%));
    box-shadow: 0 2px 8px hsl(var(--primary, 220 70% 50%) / 0.2);
  }

  .tree-node.tree-node--available:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px hsl(var(--primary, 220 70% 50%) / 0.3);
  }

  .tree-node.tree-node--available .tree-node__icon {
    background: hsl(var(--primary, 220 70% 50%) / 0.15);
    color: hsl(var(--primary, 220 70% 50%));
  }

  /* Completed state */
  .tree-node.tree-node--completed {
    border-color: hsl(142 76% 36%);
    background: hsl(142 76% 36% / 0.1);
  }

  .tree-node.tree-node--completed:hover {
    background: hsl(142 76% 36% / 0.15);
  }

  .tree-node.tree-node--completed .tree-node__icon {
    background: hsl(142 76% 36% / 0.2);
    color: hsl(142 76% 36%);
  }

  .tree-node.tree-node--completed .tree-node__title {
    color: hsl(142 76% 36%);
  }
</style>
