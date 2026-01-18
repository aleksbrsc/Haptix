import styles from "../styles/sidebar.module.css";
import flagIcon from "../assets/images/icons/flag.svg";
import lightningIcon from "../assets/images/icons/lightning.svg";
import branchIcon from "../assets/images/icons/branch.svg";
import startIcon from "../assets/images/icons/start.svg";
import stopIcon from "../assets/images/icons/stop.svg";
import resetIcon from "../assets/images/icons/reset.svg";
import shareIcon from "../assets/images/icons/share.svg";

export default function Sidebar({
  onAddNode,
  onReset,
  onStartSession,
  onStopSession,
  isSessionActive,
  onExecute,
  onStop,
  isExecuting,
  canExecute,
}) {
  const nodeTypes = [
    {
      type: "trigger",
      label: "Trigger",
      icon: flagIcon,
    },
    {
      type: "action",
      label: "Action",
      icon: lightningIcon,
    },
    {
      type: "conditional",
      label: "If / Else",
      icon: branchIcon,
    },
  ];

  return (
    <div className={styles.sidebar}>
      <div className={styles.app_header}>
        <h1 className={styles.app_title}>haptix</h1>
        <img src="/logo-white.svg" alt="logo" className={styles.app_logo} />
      </div>
      <h3>automation</h3>
      <div className={styles.sidebar_items}>
        <button
          className={styles.sidebar_item}
          onClick={isSessionActive ? onStopSession : onStartSession}
        >
          <span className={styles.sidebar_icon}>
            <img
              src={isSessionActive ? stopIcon : startIcon}
              alt={isSessionActive ? "stop session" : "start session"}
            />
          </span>
          <span className={styles.sidebar_label}>
            {isSessionActive ? "Stop" : "Start"}
          </span>
        </button>
        <button className={styles.sidebar_item} onClick={onReset}>
          <span className={styles.sidebar_icon}>
            <img src={resetIcon} alt="reset" />
          </span>
          <span className={styles.sidebar_label}>Reset</span>
        </button>
        <button
          className={`${styles.sidebar_item} ${styles.sidebar_item_disabled}`}
        >
          <span className={styles.sidebar_icon}>
            <img src={shareIcon} alt="share" />
          </span>
          <span className={styles.sidebar_label}>Share</span>
        </button>
      </div>
      <h3>nodes</h3>
      <div className={styles.sidebar_items}>
        {nodeTypes.map((node) => (
          <button
            key={node.type}
            className={styles.sidebar_item}
            onClick={() => onAddNode(node.type)}
          >
            <span className={styles.sidebar_icon}>
              <img src={node.icon} alt={node.label} />
            </span>
            <span className={styles.sidebar_label}>{node.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
