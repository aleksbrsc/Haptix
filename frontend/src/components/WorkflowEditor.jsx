import { useCallback, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import TriggerNode from './nodes/TriggerNode';
import ActionNode from './nodes/ActionNode';
import NodePalette from './NodePalette';
import styles from '../styles/workflow_editor.module.css';

const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
};

let nodeId = 0;
const getNodeId = () => `node_${nodeId++}`;

export default function WorkflowEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeDataChange = useCallback((nodeId, field, value) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              [field]: value,
            },
          };
        }
        return node;
      })
    );
  }, [setNodes]);

  const addNode = useCallback((type) => {
    const id = getNodeId();
    const newNode = {
      id,
      type,
      position: {
        x: Math.random() * 400 + 100,
        y: Math.random() * 300 + 100,
      },
      data: {
        onChange: onNodeDataChange,
        ...(type === 'trigger' ? { triggerType: 'timer', seconds: 5 } : {}),
        ...(type === 'action' ? { actionType: 'vibrate', intensity: 5, duration: 500 } : {}),
      },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes, onNodeDataChange]);

  return (
    <div className={styles.workflow_editor}>
      <NodePalette onAddNode={addNode} />
      <div className={styles.flow_container}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
    </div>
  );
}
