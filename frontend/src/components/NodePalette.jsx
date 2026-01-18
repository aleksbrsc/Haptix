import styles from '../styles/node_palette.module.css';

export default function NodePalette({ onAddNode }) {
  const nodeTypes = [
    { type: 'trigger', label: 'Trigger', icon: '⏱️', color: '#4CAF50' },
    { type: 'action', label: 'Action', icon: '⚡', color: '#2196F3' }
  ];

  return (
    <div className={styles.node_palette}>
      <h1 className={styles.app_title}>haptix</h1>
      <h3>available nodes</h3>
      <div className={styles.palette_items}>
        {nodeTypes.map(node => (
          <button
            key={node.type}
            className={styles.palette_item}
            onClick={() => onAddNode(node.type)}
            style={{ borderColor: node.color }}
          >
            <span className={styles.palette_icon}>{node.icon}</span>
            <span className={styles.palette_label}>{node.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
