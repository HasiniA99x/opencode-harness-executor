/**
 * Multi-model OpenCode Direct vs Claude/Mod Delegation comparison.
 * Measured POC data for HasiniA99x/nextJS-upskill (commit 6161187…).
 */
window.COMPARISON = (function () {
  "use strict";

  var WORKLOAD = {
    repo: "HasiniA99x/nextJS-upskill",
    commit: "6161187cc468045327ae668db11179ae4ced2b77",
    feature: "Add book categories with search, filter, sort, and URL state",
    opencodeWorkflow: "github-pr-review-with-plugin-adapter",
  };

  var MODELS = [
    {
      id: "gpt-luna",
      label: "GPT-6 Luna",
      family: "gpt",
      opencode: {
        durationSec: 219.7,
        costUsd: 0.0006,
        review: {
          level: "Strong",
          levelKey: "strong",
          summary:
            "Found major category and search issues; broader coverage than delegated Luna in this run.",
        },
      },
      delegation: {
        durationSec: 57.9,
        costUsd: 0.1492,
        orchestrationCostUsd: 0.1392,
        targetCostUsd: 0.01,
        review: {
          level: "Comparable",
          levelKey: "comparable",
          summary:
            "Strong explanation of URL-controlled input behavior; comparable quality, much faster.",
        },
      },
    },
    {
      id: "gpt-sol",
      label: "GPT-6.1 Sol",
      family: "gpt",
      opencode: {
        durationSec: 312.5,
        costUsd: 0.0054,
        review: {
          level: "Strong",
          levelKey: "strong",
          summary:
            "Strong reasoning on controlled state and category handling; slowest OpenCode run.",
        },
      },
      delegation: {
        durationSec: 33.0,
        costUsd: 0.1488,
        orchestrationCostUsd: 0.1388,
        targetCostUsd: 0.01,
        review: {
          level: "Comparable",
          levelKey: "comparable",
          summary:
            "Caught rapid filter overwrite and Clear removing unrelated query params.",
        },
      },
    },
    {
      id: "gpt-astra",
      label: "GPT-6 Astra",
      family: "gpt",
      opencode: {
        durationSec: 254.6,
        costUsd: 0.0693,
        review: {
          level: "Strong",
          levelKey: "strong",
          summary:
            "Deep explanation of async search state and category contract.",
        },
      },
      delegation: {
        durationSec: 51.8,
        costUsd: 0.1413,
        orchestrationCostUsd: 0.0413,
        targetCostUsd: 0.1,
        review: {
          level: "Deeper",
          levelKey: "deeper",
          summary:
            "Preserved core findings and also surfaced migration rollout risk.",
        },
      },
    },
    {
      id: "claude-haiku",
      label: "Claude Haiku 5.5",
      family: "claude",
      opencode: {
        durationSec: 147.5,
        costUsd: 0.001,
        review: {
          level: "Good",
          levelKey: "good",
          summary:
            "Broad coverage at very low cost; some lower-priority / pre-existing noise.",
        },
      },
      delegation: {
        durationSec: 76.3,
        costUsd: 0.0346,
        review: {
          level: "Good",
          levelKey: "good",
          summary:
            "Broad coverage plus additional modal/category behavior; more noise than larger models.",
        },
      },
    },
    {
      id: "claude-sonnet",
      label: "Claude Sonnet 5.5",
      family: "claude",
      opencode: {
        durationSec: 147.0,
        costUsd: 0.0172,
        review: {
          level: "Strong",
          levelKey: "strong",
          summary:
            "Migration deployment risk plus search/category/test issues — strongest quality/speed/cost balance.",
        },
      },
      delegation: {
        durationSec: 191.4,
        costUsd: 0.5953,
        review: {
          level: "Good",
          levelKey: "good",
          summary:
            "Solid core findings; did not surface the migration issue in this run.",
        },
      },
    },
    {
      id: "claude-opus",
      label: "Claude Opus 5.5",
      family: "claude",
      opencode: {
        durationSec: 213.9,
        costUsd: 0.0316,
        review: {
          level: "Strong",
          levelKey: "strong",
          summary:
            "Strong broad review; caught migration rollout risk.",
        },
      },
      delegation: {
        durationSec: 240.2,
        costUsd: 1.254,
        review: {
          level: "Deeper",
          levelKey: "deeper",
          summary:
            "Slightly deeper ops reasoning (migrate deploy / db-push interaction).",
        },
      },
    },
  ];

  /** Original OpenCode harness comparison (OpenCode + Claude executor; no Mod run). */
  var OPENCODE_HARNESS_RUNS = [
    {
      title: "OpenCode + Xianix pr-reviewer",
      tag: "opencode",
      exec: "49ee4ca5",
      label: "github-pr-review-with-plugin-adapter",
      plugin: "pr-reviewer@xianix-plugins-official",
      model: "openai/gpt-5.3-codex",
      repo: "HasiniA99x/nextJS-upskill",
      pr: 4,
      durationSec: 193.9,
      costUsd: 0.0059,
      tokens: "in=805 · out=137 · cacheRead=14848 · cacheCreate=0",
      session: "ses_ed0e776a0ffeFUxjMk7u5hVVzT",
    },
    {
      title: "OpenCode + Anthropic code-review",
      tag: "opencode",
      exec: "1a954075",
      label: "github-pr-review-with-plugin-adapter",
      plugin: "code-review@claude-code-plugins",
      model: "openai/gpt-5.3-codex",
      repo: "HasiniA99x/nextJS-upskill",
      pr: 4,
      durationSec: 320.3,
      costUsd: 0.0129,
      tokens: "in=485 · out=53 · cacheRead=57856 · cacheCreate=0",
      session: "ses_edf2f250cffeo7919NLQC0Kib0",
    },
    {
      title: "Claude harness + Xianix pr-reviewer",
      tag: "claude",
      exec: "3bf030fd",
      label: "github-pr-review-default-executor",
      plugin: "pr-reviewer@xianix-plugins-official",
      model: "claude-sonnet-4-5",
      repo: "HasiniA99x/nextJS-upskill",
      pr: 4,
      durationSec: 298.1,
      costUsd: 1.1396,
      tokens: "in=137 · out=12058 · cacheRead=985027 · cacheCreate=117853",
      session: "67da6b4a-8e68-4394-98d4-abadf0c8b81d",
    },
  ];

  function moneyFixed(n, digits) {
    if (n == null || Number.isNaN(n)) return "—";
    return "$" + Number(n).toFixed(digits == null ? 4 : digits);
  }

  function seconds(n) {
    if (n == null || Number.isNaN(n)) return "—";
    return Number(n).toFixed(1) + "s";
  }

  function bestCards() {
    var lowest = null;
    var fastest = null;
    MODELS.forEach(function (m) {
      var oc = {
        model: m.label,
        approach: "OpenCode",
        duration: m.opencode.durationSec,
        cost: m.opencode.costUsd,
      };
      var del = {
        model: m.label,
        approach: "Delegation",
        duration: m.delegation.durationSec,
        cost: m.delegation.costUsd,
      };
      [oc, del].forEach(function (row) {
        if (!lowest || row.cost < lowest.cost) lowest = row;
        if (!fastest || row.duration < fastest.duration) fastest = row;
      });
    });
    return {
      bestDuration: fastest,
      bestCost: lowest,
      bestReview: {
        model: "Claude Sonnet 5.5",
        approach: "OpenCode",
        level: "Strong",
        summary:
          "Migration risk + search/category/test findings — strongest review balance in this dataset",
      },
    };
  }

  return {
    WORKLOAD: WORKLOAD,
    MODELS: MODELS,
    OPENCODE_HARNESS_RUNS: OPENCODE_HARNESS_RUNS,
    moneyFixed: moneyFixed,
    seconds: seconds,
    bestCards: bestCards,
  };
})();
