# Execution Engine

Responsible for coordinating agent execution.

## Pipeline

1. Receive user request
2. Call router_agent
3. Call planner_agent
4. Dispatch tasks to workers
5. Call validator_agent

## Worker selection

code → code_worker  
data → data_worker  
research → research_worker  
file → file_worker