import React, { useCallback, useEffect, useMemo, useState } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Edge,
  Connection,
  Node,
  NodeTypes,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import styles from './styles.module.css';
import { useThemeConfig } from '@docusaurus/theme-common';
import type { ColorMode } from '@docusaurus/theme-common';
import dagre from 'dagre';
import { CustomNodeData } from './types';
import { CustomNode } from './CustomNode';

interface DataFlowChartProps {
  nodes: Node<CustomNodeData>[];
  edges: Edge[];
  direction?: 'LR' | 'TB';
  minimap?: boolean;
  controls?: boolean;
  className?: string;
  style?: React.CSSProperties;
  fitView?: boolean;
  nodeTypes?: NodeTypes;
  animated?: boolean;
}

const nodeTypes = {
  custom: CustomNode,
};

const getLayoutedElements = (nodes: Node<CustomNodeData>[], edges: Edge[], direction = 'TB') => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 250, height: 80 });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - 125,
        y: nodeWithPosition.y - 40,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

export default function DataFlowChart({
  nodes: initialNodes,
  edges: initialEdges,
  direction = 'TB',
  minimap = true,
  controls = true,
  className,
  style,
  fitView = true,
  nodeTypes: customNodeTypes,
  animated = true,
}: DataFlowChartProps) {
  const { colorMode } = useThemeConfig();
  const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(
    () => getLayoutedElements(initialNodes, initialEdges, direction),
    [initialNodes, initialEdges, direction]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    layoutedEdges.map(edge => ({
      ...edge,
      animated,
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
    }))
  );

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const mergedNodeTypes = useMemo(
    () => ({ ...nodeTypes, ...customNodeTypes }),
    [customNodeTypes]
  );

  const isDarkMode = colorMode === 'dark';

  return (
    <div className={`${styles.flowContainer} ${className || ''}`} style={style}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={mergedNodeTypes}
        fitView={fitView}
        proOptions={{ hideAttribution: true }}
      >
        {minimap && <MiniMap />}
        {controls && <Controls />}
        <Background color={isDarkMode ? '#444' : '#ddd'} />
      </ReactFlow>
    </div>
  );
} 