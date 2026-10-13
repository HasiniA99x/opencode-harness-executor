/**
 * Results page: OpenCode harness comparison + Claude Mod vs OpenCode multi-model.
 */
(function () {
  "use strict";

  var C = window.COMPARISON;
  if (!C) return;

  var state = { family: "all", panel: "harness" };

  function $(id) {
    return document.getElementById(id);
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function filteredModels() {
    if (state.family === "all") return C.MODELS.slice();
    return C.MODELS.filter(function (m) {
      return m.family === state.family;
    });
  }

  function tip(label, text) {
    return (
      '<span class="tip" tabindex="0">' +
      escapeHtml(label) +
      '<span class="tip-body" role="tooltip">' +
      escapeHtml(text) +
      "</span></span>"
    );
  }

  function reviewCell(review) {
    if (!review) return "—";
    return (
      '<div class="rev-cell">' +
      '<span class="lvl ' +
      escapeHtml(review.levelKey) +
      '">' +
      escapeHtml(review.level) +
      "</span>" +
      '<div class="rev-sum">' +
      escapeHtml(review.summary) +
      "</div>" +
      "</div>"
    );
  }

  function card(label, title, value) {
    return (
      '<div class="metric summary-card">' +
      '<div class="l">' +
      escapeHtml(label) +
      "</div>" +
      '<div class="v small">' +
      escapeHtml(value) +
      "</div>" +
      '<div class="sc-title">' +
      escapeHtml(title) +
      "</div>" +
      "</div>"
    );
  }

  function renderHarnessSummary() {
    var el = $("harness-summary");
    if (!el) return;
    var runs = C.OPENCODE_HARNESS_RUNS || [];
    var labels = [
      "OpenCode · Xianix · Sol",
      "OpenCode · Anthropic · Sol",
      "Claude · Xianix · Sonnet 5.5",
    ];
    el.innerHTML = runs
      .map(function (r, i) {
        return (
          '<div class="metric"><div class="l">' +
          escapeHtml(labels[i] || r.title) +
          '</div><div class="v small">' +
          C.moneyFixed(r.costUsd, 4) +
          " · " +
          C.seconds(r.durationSec) +
          "</div></div>"
        );
      })
      .join("");
  }

  function renderHarnessCards() {
    var host = $("harness-cards");
    if (!host) return;
    host.innerHTML = (C.OPENCODE_HARNESS_RUNS || [])
      .map(function (r, idx) {
        var tagClass =
          r.tag === "opencode" ? "tag-oc" : r.tag === "mod" ? "tag-mod" : "tag-cl";
        var costRows =
          r.claudeCostUsd != null
            ? "<tr><th>Claude Cost</th><td>" +
              C.moneyFixed(r.claudeCostUsd, 4) +
              "</td></tr>" +
              "<tr><th>GPT Cost</th><td>" +
              C.moneyFixed(r.gptCostUsd, 4) +
              "</td></tr>" +
              "<tr><th>Total Cost</th><td><b>" +
              C.moneyFixed(r.costUsd, 4) +
              "</b></td></tr>"
            : "<tr><th>Cost</th><td>" +
              C.moneyFixed(r.costUsd, 4) +
              "</td></tr>";
        var duration =
          r.note
            ? "<b>" + C.seconds(r.durationSec) + "</b> (" + escapeHtml(r.note) + ")"
            : C.seconds(r.durationSec);
        return (
          '<article class="result-card">' +
          '<header class="rc"><h3>' +
          (idx + 1) +
          " · " +
          escapeHtml(r.title) +
          '</h3><span class="pill ' +
          tagClass +
          '">' +
          escapeHtml(r.tag === "mod" ? "claude mod option" : r.tag === "claude" ? "claude executor" : "opencode harness") +
          "</span></header><table>" +
          "<tr><th>Exec</th><td><code>" +
          escapeHtml(r.exec) +
          "</code></td></tr>" +
          "<tr><th>Label</th><td><code>block=" +
          escapeHtml(r.label) +
          "</code></td></tr>" +
          (r.plugin
            ? "<tr><th>Plugin</th><td><code>" +
              escapeHtml(r.plugin) +
              "</code></td></tr>"
            : "") +
          "<tr><th>Model</th><td><code>" +
          escapeHtml(r.model) +
          "</code></td></tr>" +
          "<tr><th>Repo / PR</th><td><code>" +
          escapeHtml(r.repo) +
          "</code> · pr-number=" +
          r.pr +
          "</td></tr>" +
          "<tr><th>Duration</th><td>" +
          duration +
          "</td></tr>" +
          costRows +
          "<tr><th>Tokens</th><td>" +
          escapeHtml(r.tokens) +
          "</td></tr>" +
          (r.gptTokens
            ? "<tr><th>GPT Tokens</th><td>" +
              escapeHtml(r.gptTokens) +
              "</td></tr>"
            : "") +
          "<tr><th>Session</th><td><code>" +
          escapeHtml(r.session) +
          "</code></td></tr>" +
          "</table></article>"
        );
      })
      .join("");
  }

  function renderBestCards() {
    var el = $("best-cards");
    if (!el) return;
    var b = C.bestCards();
    el.innerHTML =
      card(
        "Best duration",
        b.bestDuration.approach + " · " + b.bestDuration.model,
        C.seconds(b.bestDuration.duration)
      ) +
      card(
        "Best cost",
        b.bestCost.approach + " · " + b.bestCost.model,
        C.moneyFixed(b.bestCost.cost, 4)
      ) +
      card(
        "Best review comment",
        b.bestReview.approach + " · " + b.bestReview.model + " · " + b.bestReview.level,
        b.bestReview.summary
      );
  }

  function renderTable() {
    var tbody = $("derived-tbody");
    if (!tbody) return;
    tbody.innerHTML = filteredModels()
      .map(function (m) {
        return (
          "<tr>" +
          "<td>" +
          escapeHtml(m.label) +
          "</td>" +
          "<td>" +
          C.seconds(m.opencode.durationSec) +
          "</td>" +
          "<td>" +
          C.seconds(m.delegation.durationSec) +
          "</td>" +
          "<td>" +
          C.moneyFixed(m.opencode.costUsd, 4) +
          "</td>" +
          "<td>" +
          C.moneyFixed(m.delegation.costUsd, 4) +
          "</td>" +
          "<td>" +
          reviewCell(m.opencode.review) +
          "</td>" +
          "<td>" +
          reviewCell(m.delegation.review) +
          "</td>" +
          "</tr>"
        );
      })
      .join("");
  }

  function showPanel(name) {
    state.panel = name;
    document.querySelectorAll(".panel").forEach(function (p) {
      p.classList.toggle("on", p.id === "panel-" + name);
    });
    document.querySelectorAll("#compare-seg [data-panel]").forEach(function (b) {
      b.classList.toggle("on", b.getAttribute("data-panel") === name);
    });
  }

  function paintMod() {
    renderBestCards();
    renderTable();
  }

  function wire() {
    document.querySelectorAll("#compare-seg [data-panel]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        showPanel(btn.getAttribute("data-panel"));
      });
    });
    document.querySelectorAll("[data-family]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.family = btn.getAttribute("data-family");
        document.querySelectorAll("[data-family]").forEach(function (b) {
          b.classList.toggle("on", b === btn);
        });
        paintMod();
      });
    });
  }

  function injectTooltips() {
    var oc = $("tip-opencode");
    var del = $("tip-delegation");
    if (oc) {
      oc.innerHTML = tip(
        "OpenCode Direct",
        "Xianix → OpenCode harness → selected model → PR review plugin adapter → review. Workflow: github-pr-review-with-plugin-adapter."
      );
    }
    if (del) {
      del.innerHTML = tip(
        "Claude / Mod Delegation",
        "For GPT: Claude Code orchestrator → Mod → selected GPT model. For Claude models: existing Claude Code PR review workflow. GPT reports show Source: xianix-gpt (OpenAI) — not Claude pr-reviewer."
      );
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    injectTooltips();
    wire();
    renderHarnessSummary();
    renderHarnessCards();
    paintMod();
    showPanel("harness");
  });
})();
