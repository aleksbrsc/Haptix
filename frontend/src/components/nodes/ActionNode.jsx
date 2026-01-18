import { Handle, Position } from '@xyflow/react';
import styles from '../../styles/node.module.css';
import lightningIcon from '../../assets/images/icons/lightning.svg';

const actionTypes = [
  { 
    id: 'vibe', 
    label: 'Vibrate', 
    params: ['value', 'times', 'interval'] 
  },
  { 
    id: 'zap', 
    label: 'Zap', 
    params: ['value', 'times', 'interval'] 
  },
  { 
    id: 'beep', 
    label: 'Beep', 
    params: ['value', 'times', 'interval'] 
  },
  { 
    id: 'wait', 
    label: 'Wait', 
    params: ['seconds'] 
  }
];

export default function ActionNode({ data, id }) {
  const selectedType = actionTypes.find(t => t.id === data.actionType) || actionTypes[0];

  return (
    <div className={`${styles.node} ${styles.action_node}`}>
      <Handle type="target" position={Position.Left} />
      <div className={styles.node_header}>
        <span className={styles.node_icon}>
          <img src={lightningIcon} alt="lightning" />
        </span>
        <span className={styles.node_title}>Action</span>
      </div>
      <div className={styles.node_body}>
        <div className={styles.node_field}>
          <label>Type</label>
          <select 
            value={data.actionType || 'vibe'}
            onChange={(e) => data.onChange?.(id, 'actionType', e.target.value)}
          >
            {actionTypes.map(type => (
              <option key={type.id} value={type.id}>{type.label}</option>
            ))}
          </select>
        </div>
        {selectedType.params.includes('value') && (
          <div className={styles.node_field}>
            <label>Value (1-100)</label>
            <input 
              type="number" 
              min="1" 
              max="100" 
              value={data.value || 50}
              onChange={(e) => data.onChange?.(id, 'value', parseInt(e.target.value))}
            />
          </div>
        )}
        {selectedType.params.includes('times') && (
          <div className={styles.node_field}>
            <label>Times (1-10)</label>
            <input 
              type="number" 
              min="1" 
              max="10" 
              value={data.times || 1}
              onChange={(e) => data.onChange?.(id, 'times', parseInt(e.target.value))}
            />
          </div>
        )}
        {selectedType.params.includes('interval') && (
          <div className={styles.node_field}>
            <label>Interval (seconds)</label>
            <input 
              type="number" 
              min="0" 
              step="0.1"
              value={data.interval || 0}
              onChange={(e) => data.onChange?.(id, 'interval', parseFloat(e.target.value))}
            />
          </div>
        )}
        {selectedType.params.includes('seconds') && (
          <div className={styles.node_field}>
            <label>Seconds</label>
            <input 
              type="number" 
              min="1" 
              value={data.seconds || 15}
              onChange={(e) => data.onChange?.(id, 'seconds', parseInt(e.target.value))}
            />
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
