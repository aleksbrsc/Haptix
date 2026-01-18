import { useCallback, useEffect, useRef } from 'react';
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
import Sidebar from './Sidebar';
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
  const startNodeId = useRef(null);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Initialize with a start trigger node
  useEffect(() => {
    if (nodes.length === 0) {
      const id = getNodeId();
      startNodeId.current = id;
      const startNode = {
        id,
        type: 'trigger',
        position: { x: 0, y: 0 },
        data: {
          onChange: (nodeId, field, value) => {
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
          },
          triggerType: 'timer',
          seconds: 5,
          isStart: true,
        },
      };
      setNodes([startNode]);
    }
  }, []);

  // Custom nodes change handler to prevent deletion of start trigger
  const handleNodesChange = useCallback((changes) => {
    // Filter out any attempts to delete the start trigger
    const filteredChanges = changes.filter(c => {
      if (c.type === 'remove') {
        const node = nodes.find(n => n.id === c.id);
        // Prevent deletion if it's the start trigger
        return !(node && node.data?.isStart);
      }
      return true;
    });
    onNodesChange(filteredChanges);
  }, [nodes, onNodesChange]);

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

  const handleReset = useCallback(() => {
    // Reset node ID counter
    nodeId = 0;
    // Create fresh start node
    const id = getNodeId();
    startNodeId.current = id;
    const startNode = {
      id,
      type: 'trigger',
      position: { x: 0, y: 0 },
      data: {
        onChange: onNodeDataChange,
        triggerType: 'timer',
        seconds: 5,
        isStart: true,
      },
    };
    // Reset to initial state with just the start node
    setNodes([startNode]);
    setEdges([]);
  }, [setNodes, setEdges, onNodeDataChange]);

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
        ...(type === 'trigger' ? { triggerType: 'timer', seconds: 5, isStart: false } : {}),
        ...(type === 'action' ? { actionType: 'vibe', value: 50 } : {}),
      },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes, onNodeDataChange]);

  return (
    <div className={styles.workflow_editor}>
      <Sidebar onAddNode={addNode} onReset={handleReset} />
      <div className={styles.flow_container}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={handleNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.5, maxZoom: 1.0 }}
          proOptions={{ hideAttribution: true }}
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
    </div>
  );
}
