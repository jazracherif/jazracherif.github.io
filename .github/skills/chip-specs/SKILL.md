---
name: chip-specs
description: "Use when: writing about GPU or CPU hardware specs, comparing chips, filling in memory bandwidth, TFLOPS, TDP, memory capacity, memory type, or cost figures for any chip. Also use when: publishing a new post that mentions hardware specs. Queries the chipset-specs MCP server as the source of truth before using any spec numbers."
---

# Chip Specifications

## Source of Truth

All chip specifications are served by the **chipset-specs MCP server** at `https://chipset-specs.vercel.app/api/mcp` (configured in `.claude/chipset_spec_mcp.json`).

**Always query the MCP server first** before citing any spec value (memory bandwidth, TFLOPS, TDP, memory capacity, memory type, interconnect bandwidth, cost, etc.) for any GPU or CPU.

## Available MCP Tools

| Tool | Purpose |
|---|---|
| `list_chips` | List all chips available in the database |
| `get_chip_specs` | Fetch full specs for a specific chip by name |
| `compare_chips` | Compare two or more chips side by side |
| `translate_terminology` | Translate hardware jargon to plain language |

## Workflow: Looking Up Specs

1. Call `list_chips` to see what chips are in the database.
2. Call `get_chip_specs` with the chip name to retrieve its spec values.
3. Use the returned values directly in your response or post content.
4. If the chip is not found in the MCP server, state that clearly and note it should be added to the upstream repo at `https://github.com/jazracherif/chipset-specs`.

## Workflow: Writing a New Post with Hardware Specs

1. Call `list_chips` and `get_chip_specs` before drafting any spec table or comparison.
2. Use the returned values — do not invent or approximate specs that are already in the database.
3. After drafting, check whether any chip mentioned in the post is missing from the MCP server.
4. If new chips are needed, advise the user to add them to the upstream repo at `https://github.com/jazracherif/chipset-specs`.

## Rules

- Never cite a spec from memory if the chip exists in the MCP server — always use the queried value.
- If a spec is an estimate or assumption (e.g. cost, power), note it explicitly in the post.
- After every new post that mentions hardware specs, prompt the user: *"Should I add any new chips or specs to the chipset-specs repo?"*
