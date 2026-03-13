# Agent System Flow

This project uses a multi-agent architecture.

All user requests must follow this execution flow:

1. router_agent → classify user intent
2. planner_agent → break task into steps
3. worker execution → perform tasks
4. validator_agent → validate final output

Execution order:

router_agent
↓
planner_agent
↓
appropriate worker
↓
validator_agent

Always start with router_agent.