# AgentKata.dev TypeScript SDK

Official TypeScript SDK for the [agentkata.dev](https://agentkata.dev) solver API.

This repository is the source of the npm package `@agentkata/sdk`.

## Installation

Install from npm:

```bash
npm install @agentkata/sdk
```

## What Is In This Repo

- `src/client.ts`: handwritten public wrapper.
- `src/generated/`: generated low-level client from OpenAPI.
- `openapi/`: spec snapshot and provenance for the current SDK state.
- `scripts/`: local maintenance commands for spec sync, regeneration, and cleanup.

## Usage

```ts
import { Client } from "@agentkata/sdk";

const client = new Client({
  baseUrl: "http://localhost:8081",
  apiToken: "ak_...",
});

const health = await client.health();
console.log(health.status);
```

## Local Development

Regenerate the generated client:

```bash
./scripts/generate.sh
```

Clean local build artifacts:

```bash
./scripts/clean.sh
```
