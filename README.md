# OpenCode Harness Executor — demo site

Static guided walkthrough of the Xianix **OpenCode executor**:

rules knobs (image / model / plugin) → Docker → Claude plugin install → convert → `opencode run`.

No live agent API — for [Vercel](https://vercel.com) static hosting.

## Pages

| Page | Topic |
|------|--------|
| [index.html](./index.html) | Animated end-to-end flow |
| [rules.html](./rules.html) | Interactive `executor-image`, `model`, `plugin`, `marketplace` |
| [plugins.html](./plugins.html) | Xianix **and** Anthropic marketplace recipes |
| [models.html](./models.html) | OpenCode `provider/model` options |
| [results.html](./results.html) | OpenCode harness comparison + Claude Mod vs OpenCode multi-model |
| [setup.html](./setup.html) | Local try checklist |

## Run locally

```bash
npx --yes serve .
```

## Docker image

```bash
docker pull 99xio/xianix-executor-opencode:latest
```

## Deploy to Vercel

Import this repo under your team → framework **Other** → no build command.

## Models

See [OpenCode models docs](https://opencode.ai/docs/models/) — use `provider/model` in rules and inject the matching vault secret.
