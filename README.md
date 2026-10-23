# 🦥 CP Sloth — Lazy DSA Edge-Case & TLE Analyzer

> Automate the most exhausting part of LeetCode and Codeforces. Generate nasty boundary test cases and calculate algorithmic time/space bottlenecks in one click using local, open-weight AI.

[![Hacktoberfest 2026](https://img.shields.io/badge/Hacktoberfest-2026_Week_3-orange.svg)](https://hacktoberfest.com/)
[![Model](https://img.shields.io/badge/Model-Gemma_3_(4B)-4285F4.svg)](https://ollama.com/library/gemma3)
[![Inference](https://img.shields.io/badge/Inference-Local_Ollama-black.svg)](https://ollama.com/)
[![Platform](https://img.shields.io/badge/Extension-Manifest_V3-success.svg)](https://developer.chrome.com/docs/extensions/mv3/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📖 Overview

When solving Data Structures & Algorithms (DSA) problems, two repetitive chores drain time and momentum:
1. **Manually inventing boundary test cases** (single elements, duplicates, alternating negative integers, empty sets, or $10^9$ limits) when a submission fails on an opaque test case.
2. **Dry-running logic on paper** to detect whether an algorithm will trigger **Time Limit Exceeded (TLE)** or an integer overflow trap (e.g., omitting `long long` in C++).

**CP Sloth** is a lightweight Manifest V3 Chrome Extension designed for peak developer laziness. With a single click while viewing any problem page, it extracts constraints directly from the tab's DOM and sends them to a locally hosted **Google Gemma 3 (4B)** model to evaluate bottlenecks, test limits, and suggest minimal-effort optimizations.

---

## ✨ Features

- **5 Nasty Edge Cases:** Generates copy-pasteable boundary inputs directly matching the problem's mathematical constraints ($N = 1$, max limits, extreme values, duplicates).
- **Complexity & TLE Verdict:** Instantly estimates asymptotic Time & Space complexity and highlights integer overflow hazards.
- **The Lazy Sloth Fix:** Provides a concise 2-line suggestion to bypass the computational bottleneck.
- **100% Offline & Free:** Runs inference directly on local hardware via Ollama. No API keys, no subscription tiers, and no rate limits.
- **Zero Privacy Leaks:** All problem statements and pasted code snippets remain on `localhost`.

---

## 🏗️ Architecture

```text
┌─────────────────────────┐         ┌─────────────────────────┐
│     Active Tab DOM      │         │     User Code (Opt)     │
│  (LeetCode/Codeforces)  │         │  (C++, Python, JS, etc) │
└────────────┬────────────┘         └────────────┬────────────┘
             │                                   │
             └─────────────────┬─────────────────┘
                               ▼
               ┌───────────────────────────────┐
               │    CP Sloth Extension Popup   │
               │  (Manifest V3 / Vanilla JS)   │
               └───────────────┬───────────────┘
                               │  POST :11434/api/generate
                               ▼
               ┌───────────────────────────────┐
               │         Ollama Server         │
               │   (OLLAMA_ORIGINS="*" CORS)   │
               └───────────────┬───────────────┘
                               │  Local Metal/VRAM Inference
                               ▼
               ┌───────────────────────────────┐
               │     Google Gemma 3 (4B)       │
               │    Open-Weight AI Model       │
               └───────────────────────────────┘
