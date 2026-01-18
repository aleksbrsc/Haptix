import { Handle, Position } from '@xyflow/react';
import styles from '../../styles/node.module.css';

const triggerTypes = [
  { id: 'timer', label: 'Timer (seconds from now)', params: ['seconds'] },
  { id: 'interval', label: 'Interval (repeat every X seconds)', params: ['seconds'] },
  { id: 'manual', label: 'Manual Trigger', params: [] }
];

export default function TriggerNode({ data, id }) {
  const selectedType = triggerTypes.find(t => t.id === data.triggerType) || triggerTypes[0];

  return (
    <div className={`${styles.node} ${styles.trigger_node}`}>
      <div className={styles.node_header}>
        <span className={styles.node_icon}>⏱️</span>
        <span className={styles.node_title}>Trigger</span>
      </div>
      <div className={styles.node_body}>
        <div className={styles.node_field}>
          <label>Type</label>
          <select 
            value={data.triggerType || 'timer'}
            onChange={(e) => data.onChange?.(id, 'triggerType', e.target.value)}
          >
            {triggerTypes.map(type => (
              <option key={type.id} value={type.id}>{type.label}</option>
            ))}
          </select>
        </div>
        {selectedType.params.includes('seconds') && (
          <div className={styles.node_field}>
            <label>Seconds</label>
            <input 
              type="number" 
              value={data.seconds || 5}
              onChange={(e) => data.onChange?.(id, 'seconds', parseInt(e.target.value))}
              min="1"
            />
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
