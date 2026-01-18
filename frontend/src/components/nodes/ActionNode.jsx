import { Handle, Position } from '@xyflow/react';
import styles from '../../styles/node.module.css';

const actionTypes = [
  { 
    id: 'vibrate', 
    label: 'Vibrate', 
    params: ['intensity', 'duration'] 
  },
  { 
    id: 'pulse', 
    label: 'Pulse Pattern', 
    params: ['intensity', 'pulseCount', 'interval'] 
  },
  { 
    id: 'shock', 
    label: 'Shock (Pavlok)', 
    params: ['intensity'] 
  },
  { 
    id: 'beep', 
    label: 'Beep', 
    params: ['frequency', 'duration'] 
  }
];

export default function ActionNode({ data, id }) {
  const selectedType = actionTypes.find(t => t.id === data.actionType) || actionTypes[0];

  return (
    <div className={`${styles.node} ${styles.action_node}`}>
      <Handle type="target" position={Position.Left} />
      <div className={styles.node_header}>
        <span className={styles.node_icon}>⚡</span>
        <span className={styles.node_title}>Action</span>
      </div>
      <div className={styles.node_body}>
        <div className={styles.node_field}>
          <label>Type</label>
          <select 
            value={data.actionType || 'vibrate'}
            onChange={(e) => data.onChange?.(id, 'actionType', e.target.value)}
          >
            {actionTypes.map(type => (
              <option key={type.id} value={type.id}>{type.label}</option>
            ))}
          </select>
        </div>
        {selectedType.params.includes('intensity') && (
          <div className={styles.node_field}>
            <label>Intensity (1-10)</label>
            <input 
              type="number" 
              min="1" 
              max="10" 
              value={data.intensity || 5}
              onChange={(e) => data.onChange?.(id, 'intensity', parseInt(e.target.value))}
            />
          </div>
        )}
        {selectedType.params.includes('duration') && (
          <div className={styles.node_field}>
            <label>Duration (ms)</label>
            <input 
              type="number" 
              value={data.duration || 500}
              onChange={(e) => data.onChange?.(id, 'duration', parseInt(e.target.value))}
              min="100"
              step="100"
            />
          </div>
        )}
        {selectedType.params.includes('pulseCount') && (
          <div className={styles.node_field}>
            <label>Pulse Count</label>
            <input 
              type="number" 
              value={data.pulseCount || 3}
              onChange={(e) => data.onChange?.(id, 'pulseCount', parseInt(e.target.value))}
              min="1"
            />
          </div>
        )}
        {selectedType.params.includes('interval') && (
          <div className={styles.node_field}>
            <label>Interval (ms)</label>
            <input 
              type="number" 
              value={data.interval || 200}
              onChange={(e) => data.onChange?.(id, 'interval', parseInt(e.target.value))}
              min="50"
              step="50"
            />
          </div>
        )}
        {selectedType.params.includes('frequency') && (
          <div className={styles.node_field}>
            <label>Frequency (Hz)</label>
            <input 
              type="number" 
              value={data.frequency || 440}
              onChange={(e) => data.onChange?.(id, 'frequency', parseInt(e.target.value))}
              min="100"
              max="2000"
            />
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
