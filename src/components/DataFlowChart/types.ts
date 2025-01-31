import { Node, Edge } from 'reactflow';

export interface CustomNodeData {
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

export type CustomNode = Node<CustomNodeData>;
export type CustomEdge = Edge; 