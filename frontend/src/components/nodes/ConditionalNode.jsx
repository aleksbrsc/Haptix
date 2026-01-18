import { Handle, Position } from '@xyflow/react';
import styles from '../../styles/node.module.css';

const operators = [
  { id: '>', label: '>' },
  { id: '<', label: '<' },
  { id: '===', label: '===' },
  { id: '!==', label: '!==' },
  { id: '>=', label: '>=' },
  { id: '<=', label: '<=' },
];

export default function ConditionalNode({ data, id }) {
  // Get available parameters from parent node
  const availableParams = data.getParentParameters ? data.getParentParameters() : [
    { id: 'value', label: 'Value' },
    { id: 'seconds', label: 'Seconds' }
  ];

  return (
    <div className={`${styles.node} ${styles.conditional_node}`}>
      <Handle type="target" position={Position.Left} />
      
      <div className={styles.node_header}>
        <span className={styles.node_icon}>
          <img src="/src/assets/images/icons/branch.svg" alt="if/else" />
        </span>
        <span className={styles.node_title}>If / Else</span>
      </div>

      <div className={styles.node_body}>
        <div className={styles.node_field}>
          <label>Parameter</label>
          <select
            value={data.parameter || (availableParams[0]?.id || 'value')}
            onChange={(e) => data.onChange(id, 'parameter', e.target.value)}
          >
            {availableParams.map(param => (
              <option key={param.id} value={param.id}>{param.label}</option>
            ))}
          </select>
        </div>

        <div className={styles.node_field}>
          <label>Operator</label>
          <select
            value={data.operator || '>'}
            onChange={(e) => data.onChange(id, 'operator', e.target.value)}
          >
            {operators.map(op => (
              <option key={op.id} value={op.id}>{op.label}</option>
            ))}
          </select>
        </div>

        <div className={styles.node_field}>
          <label>Compare Value</label>
          <input
            type="text"
            value={data.compareValue || ''}
            onChange={(e) => data.onChange(id, 'compareValue', e.target.value)}
            placeholder="Enter value..."
          />
        </div>
      </div>

      <Handle 
        type="source" 
        position={Position.Right} 
        id="true"
        style={{ top: '35%' }}
      />
      <Handle 
        type="source" 
        position={Position.Right} 
        id="false"
        style={{ top: '65%' }}
      />
    </div>
  );
}
