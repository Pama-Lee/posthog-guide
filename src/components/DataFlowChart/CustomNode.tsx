import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import styles from './styles.module.css';

interface CustomNodeData {
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

export const CustomNode = memo(({ data }: NodeProps<CustomNodeData>) => {
  return (
    <div className={styles.customNode}>
      <Handle type="target" position={Position.Top} />
      <div className={styles.nodeContent}>
        {data.icon && <div className={styles.nodeIcon}>{data.icon}</div>}
        <div className={styles.nodeText}>
          <div className={styles.nodeLabel}>{data.label}</div>
          {data.description && (
            <div className={styles.nodeDescription}>{data.description}</div>
          )}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}); 