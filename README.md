# OpenCode Harness Executor — demo site

Static guided walkthrough of the Xianix **OpenCode executor** path:

GitHub label → rules match → Docker image → Claude plugin install → markdown convert → `opencode run` → JSON envelope.

No live agent or API integration — designed for [Vercel](https://vercel.com) static hosting.

## Pages

| Page | Topic |
|------|--------|
| [index.html](./index.html) | Animated end-to-end flow |
| [trigger.html](./trigger.html) | Label `ai-dlc/pr/pr-review-opencode` |
| [rules.html](./rules.html) | Knowledge block fields |
| [executor.html](./executor.html) | `99xio/xianix-executor-opencode` |
| [plugins.html](./plugins.html) | Install → stage → convert |
| [run.html](./run.html) | `opencode run` + envelope |
| [setup.html](./setup.html) | Local try checklist |

## Run locally

```bash
npx --yes serve .
```

Or open `index.html` directly.

## Docker image

```bash
docker pull 99xio/xianix-executor-opencode:latest
```

## Deploy to Vercel

1. Import this GitHub repo in your Vercel team ([hasini-a](https://vercel.com/hasini-a)).
2. Framework preset: **Other** (static).
3. Root directory: `.` — no build command required.

## Source of truth

Behaviour is implemented in the Xianix `the-agent` repo under `Executor.OpenCode/` and the OpenCode block in agent Knowledge `rules.json`. This site only documents that path.
