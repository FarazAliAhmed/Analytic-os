---
id: "006"
title: "Replace dummy startup data with real tokens"
stage: "general"
date: "2026-01-15"
surface: "agent"
model: "MiniMax-M2.1"
feature: "none"
branch: "main"
user: "Claude Code User"
command: "Replace dummy data with real"
labels: ["frontend", "dashboard", "data"]
links:
  spec: "null"
  ticket: "null"
  adr: "null"
  pr: "null"
files:
  - "src/components/dashboard/TrendingStartups.tsx"
  - "src/components/dashboard/TopTable.tsx"
tests:
  - "none"
---

## Prompt

also you can see the starutp data also list your startup i want real data on that instread of dummy data make suer you udnetnadns all code flow and how it link with tohere model .

## Response snapshot

Replaced hardcoded dummy data with real data from database:
- TrendingStartups: fetches top 5 tokens by volume from /api/tokens
- TopTable: displays top 10 tokens sorted by volume
- Both components show loading skeletons and handle empty states
- Uses existing Token model with price (kobo), volume, industry, annualYield

## Outcome

- ✅ Impact: Dashboard now shows real tokens from database
- 🧪 Tests: No tests added
- 📁 Files: 2 files modified
- 🔁 Next prompts: None
- 🧠 Reflection: Existing /api/tokens endpoint already provided the data needed

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
