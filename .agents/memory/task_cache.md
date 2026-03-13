# Task Cache

Purpose: store previously solved tasks to avoid recomputation.

## Cache structure

request_hash:
result:
timestamp:

## Rules

- check cache before executing agents
- reuse results if request is identical