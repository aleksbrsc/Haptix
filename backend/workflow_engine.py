"""
Workflow execution engine for processing automation graphs
"""
from typing import Dict, List, Any, Optional
import uuid
from pydantic import BaseModel

class WorkflowNode(BaseModel):
    id: str
    type: str
    data: Dict[str, Any]
    position: Dict[str, float]

class WorkflowEdge(BaseModel):
    id: str
    source: str
    target: str
    sourceHandle: Optional[str] = None
    targetHandle: Optional[str] = None

class Workflow(BaseModel):
    nodes: List[WorkflowNode]
    edges: List[WorkflowEdge]

class Session:
    def __init__(self, workflow: Workflow):
        self.id = str(uuid.uuid4())
        self.workflow = workflow
        self.active_nodes: List[str] = []
        self.context: Dict[str, Any] = {}
        
        # Find start trigger and set as initially active
        for node in workflow.nodes:
            if node.data.get('isStart'):
                self.active_nodes.append(node.id)
                break
    
    def get_node(self, node_id: str) -> Optional[WorkflowNode]:
        """Get node by ID"""
        for node in self.workflow.nodes:
            if node.id == node_id:
                return node
        return None
    
    def get_children(self, node_id: str, handle: Optional[str] = None) -> List[WorkflowNode]:
        """Get child nodes connected to this node"""
        children = []
        for edge in self.workflow.edges:
            if edge.source == node_id:
                # If handle specified (for conditionals), filter by sourceHandle
                if handle is None or edge.sourceHandle == handle:
                    child = self.get_node(edge.target)
                    if child:
                        children.append(child)
        return children
    
    def matches_trigger(self, node: WorkflowNode, transcript: str) -> bool:
        """Check if transcript matches trigger node"""
        if node.type != 'trigger':
            return False
        
        trigger_type = node.data.get('triggerType')
        
        if trigger_type == 'keyword':
            keyword = node.data.get('keyword', '').lower().strip()
            if not keyword:
                return False
            return keyword in transcript.lower()
        
        elif trigger_type == 'prompt':
            # For now, simple keyword matching
            # TODO: Use LLM for semantic matching
            prompt = node.data.get('prompt', '').lower().strip()
            if not prompt:
                return False
            return any(word in transcript.lower() for word in prompt.split())
        
        return False
    
    def evaluate_conditional(self, node: WorkflowNode) -> bool:
        """Evaluate conditional node"""
        if node.type != 'conditional':
            return False
        
        parameter = node.data.get('parameter')
        operator = node.data.get('operator')
        compare_value = node.data.get('compareValue')
        
        # Get value from context
        actual_value = self.context.get(parameter)
        
        if actual_value is None:
            return False
        
        # Convert compare_value to same type as actual_value
        try:
            if isinstance(actual_value, int):
                compare_value = int(compare_value)
            elif isinstance(actual_value, float):
                compare_value = float(compare_value)
        except (ValueError, TypeError):
            return False
        
        # Evaluate based on operator
        if operator == '>':
            return actual_value > compare_value
        elif operator == '<':
            return actual_value < compare_value
        elif operator == '>=':
            return actual_value >= compare_value
        elif operator == '<=':
            return actual_value <= compare_value
        elif operator == '===':
            return actual_value == compare_value
        elif operator == '!==':
            return actual_value != compare_value
        
        return False
    
    def execute_path(self, node_id: str, actions: List[Dict[str, Any]], executed_node_ids: List[str] = None, executed_edge_ids: List[str] = None, parent_id: str = None) -> bool:
        """Recursively execute path from a node. Returns True if this is a leaf node."""
        node = self.get_node(node_id)
        if not node:
            return False
        
        if executed_node_ids is not None:
            executed_node_ids.append(node_id)
        
        print(f"  → Executing node: {node.type} ({node.id})")
        
        is_leaf = False
        
        if node.type == 'action':
            # Execute action
            action_type = node.data.get('actionType')
            
            if action_type == 'wait':
                # Wait action - store for execution
                seconds = node.data.get('seconds', 15)
                actions.append({
                    'type': 'wait',
                    'seconds': seconds
                })
                print(f"    ⏱️  Wait {seconds}s")
            else:
                # Haptic action (vibe, zap, beep)
                value = node.data.get('value', 50)
                times = node.data.get('times', 1)
                interval = node.data.get('interval', 0)
                actions.append({
                    'type': 'stimulus',
                    'mode': action_type,
                    'value': value,
                    'repeats': times,  # API still uses 'repeats' key
                    'interval': interval
                })
                print(f"    🔔 {action_type.upper()} at {value} (x{times}, {interval}s interval)")
            
            # Continue to next nodes
            children = self.get_children(node.id)
            if not children:
                is_leaf = True  # No children = leaf node
            
            for child in children:
                # Track edge
                edge = next((e for e in self.workflow.edges if e.source == node.id and e.target == child.id), None)
                if edge and executed_edge_ids is not None:
                    executed_edge_ids.append(edge.id)
                child_is_leaf = self.execute_path(child.id, actions, executed_node_ids, executed_edge_ids, node.id)
                if child_is_leaf:
                    is_leaf = True  # Propagate leaf status up
        
        elif node.type == 'conditional':
            # Evaluate condition
            result = self.evaluate_conditional(node)
            branch = 'true' if result else 'false'
            print(f"    🔀 Condition: {result} → taking '{branch}' branch")
            
            # Execute appropriate branch
            children = self.get_children(node.id, handle=branch)
            if not children:
                is_leaf = True
                
            for child in children:
                # Track edge
                edge = next((e for e in self.workflow.edges if e.source == node.id and e.target == child.id and e.sourceHandle == branch), None)
                if edge and executed_edge_ids is not None:
                    executed_edge_ids.append(edge.id)
                child_is_leaf = self.execute_path(child.id, actions, executed_node_ids, executed_edge_ids, node.id)
                if child_is_leaf:
                    is_leaf = True
        
        elif node.type == 'trigger':
            # Add to active triggers for future transcripts (allow re-activation for cycles)
            if node.id not in self.active_nodes:
                self.active_nodes.append(node.id)
                print(f"    ✅ Activated trigger: {node.data.get('triggerType')}")
            # If already active, keep it active (cycle back to listening state)
        
        return is_leaf
    
    def process_transcript(self, transcript: str) -> tuple[List[Dict[str, Any]], List[str], List[str]]:
        """Process transcript against active triggers. Returns (actions, executed_node_ids, executed_edge_ids)"""
        print(f"\n📝 Processing transcript: '{transcript}'")
        print(f"🎯 Active triggers: {len(self.active_nodes)}")
        
        actions = []
        triggered_nodes = []
        executed_node_ids = []  # Track all nodes that were executed
        executed_edge_ids = []  # Track all edges that were traversed
        
        # Check all active triggers
        for node_id in self.active_nodes[:]:  # Copy list to avoid modification during iteration
            node = self.get_node(node_id)
            if not node:
                continue
            
            if self.matches_trigger(node, transcript):
                print(f"✨ Trigger matched: {node.data.get('triggerType')} - {node.data.get('keyword') or node.data.get('prompt')}")
                triggered_nodes.append(node_id)
                executed_node_ids.append(node_id)  # Add trigger node to executed list
                
                # Execute path from this trigger
                for child in self.get_children(node.id):
                    # Find edge connecting trigger to child
                    edge = next((e for e in self.workflow.edges if e.source == node.id and e.target == child.id), None)
                    if edge:
                        executed_edge_ids.append(edge.id)
                    self.execute_path(child.id, actions, executed_node_ids, executed_edge_ids, node.id)
        
        # Remove triggered nodes from active list (they've fired)
        for node_id in triggered_nodes:
            if node_id in self.active_nodes:
                self.active_nodes.remove(node_id)
                print(f"🔕 Deactivated trigger: {node_id}")
        
        print(f"📤 Actions to execute: {len(actions)}")
        print(f"🟢 Executed nodes: {executed_node_ids}")
        print(f"🟢 Executed edges: {executed_edge_ids}")
        return actions, executed_node_ids, executed_edge_ids


# Global session storage
sessions: Dict[str, Session] = {}

def create_session(workflow: Workflow) -> str:
    """Create new execution session"""
    session = Session(workflow)
    sessions[session.id] = session
    print(f"🆕 Created session: {session.id}")
    print(f"📊 Workflow: {len(workflow.nodes)} nodes, {len(workflow.edges)} edges")
    return session.id

def get_session(session_id: str) -> Optional[Session]:
    """Get session by ID"""
    return sessions.get(session_id)

def delete_session(session_id: str) -> bool:
    """Delete session"""
    if session_id in sessions:
        del sessions[session_id]
        print(f"🗑️  Deleted session: {session_id}")
        return True
    return False
