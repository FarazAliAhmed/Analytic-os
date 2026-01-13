# Tasks Phase — Atomic Work Units and Checkpoints

You now have:

- ✅ A clear research paper specification (intent, success criteria, scope)
- ✅ A detailed implementation plan (research approach, structure, timeline)
- ✅ Documented architecture decisions (citation style, source strategy, outline format)

**Next:** Break the plan into atomic work units (tasks) that you'll execute. Each task is 15-30 minutes, has one acceptance criterion, and produces a verifiable output.

This lesson teaches the **checkpoint pattern**—the critical workflow practice that keeps YOU in control.

---

## The Checkpoint Pattern (CRITICAL)

This is the most important concept in this lesson. The checkpoint pattern is how you maintain control of the workflow.

### Pattern Definition

```
Loop:
  1. Agent: "I've completed Phase X (description of output)"
  2. Human: "Review the work (output visible and testable)"
  3. Human: "APPROVE" → Commit to git
  4. Human: "Tell me what's next"
```

### The Difference Is Huge

| With Checkpoints (Controlled) | Without Checkpoints (Dangerous) |
|-------------------------------|--------------------------------|
| Agent: "Phase 1 complete, ready for review" | Agent: "Done! All 15 tasks completed, paper written" |
| Human reviews each phase | Human gets everything at once |
| Issues caught early | Hidden issues until final reveal |
| Human directs next steps | No human control |

### Why Checkpoints Matter

**Without Checkpoints (dangerous):**

```
You: "Write my research paper"
Agent: "Done! I've completed 15 tasks, researched all sections,
       synthesized 50 sources, written full paper, formatted
       everything. All automated. You're welcome."
You: "Wait, which sources did you use? Is section 3 accurate?
      How do I verify what you wrote?"
Agent: "Already committed. Sorry! Check it now?"
```

**With Checkpoints (controlled):**

```
You: "Start research paper workflow"
Agent: "Phase 1 (Section 1 Research) complete:
        ✓ 5 credible sources identified
        ✓ Notes summarizing key points
        ✓ Citations formatted
        Ready for review."
You: "Read sources... all high-quality. Commit. What's next?"
Agent: "Phase 2 (Section 1 Outline) - Key points ordered..."
You: "Found issue with point sequence. Fixing..."
Agent: "Phase 3 (Section 2 Research) - Starting literature review..."
You: "Paper structure looks good so far. Paper complete!"
```

### Your Role in Each Checkpoint

| Step | Action | Description |
|------|--------|-------------|
| **1. Review** | Human | See the actual output (written section, bibliography, research notes) |
| **2. Decide** | Human | Approve, Reject, or Request clarification |
| **3. Direct** | Human | "What's the next phase?" — Agent doesn't autonomously continue |

**Review Questions:**
- "Does this match the plan?"
- "Are there accuracy issues I should fix before continuing?"
- "Is this ready for the next phase?"

---

## What Are Tasks?

A task is a unit of work that:

| Property | Description |
|----------|-------------|
| **Size** | Takes 15-30 minutes to complete |
| **Criterion** | Has a single, clear acceptance criterion |
| **Independence** | Can be reviewed individually |
| **Output** | Produces one verifiable output (file, section, validated state) |

### Task Properties

**Size: 15-30 minutes**

| Size | Problem |
|------|---------|
| Under 10 min | Too many micro-tasks, checkpoint overhead |
| Over 45 min | Hard to review, hard to fix if wrong |
| **15-30 min** | ✅ Meaningful progress, reviewable scope |

**Criterion: Single, testable**

| Good | Bad |
|------|-----|
| "Research section 1 sources and verify credibility" ✅ | "Research section 1 AND outline section 1 AND find images" ❌ |
| "Write introduction paragraph with thesis" ✅ | "Work on research stuff" ❌ |

**Independence: Can be reviewed individually**

- Doesn't require other tasks to be done first
- Or clearly depends on specific other tasks

**Clarity: Defines exact acceptance criterion**

| Good | Bad |
|------|-----|
| "Section 1 has 5+ credible sources (peer-reviewed or authoritative), each with full citation" ✅ | "Section 1 is researched" ❌ |

---

## Task Structure for Research Paper

Your research paper project breaks into 4 phases with 10 atomic tasks.

### Phase 1: Research Foundation (3 tasks, 45-60 minutes)

Establish credible sources and research notes BEFORE writing.

| Task | Duration | Depends on | Acceptance Criterion |
|------|----------|------------|---------------------|
| **1.1: Research Section 1 - Find Credible Sources** | 20 min | Nothing | "5+ sources identified; each is peer-reviewed OR from authoritative domain expert; full citations recorded" |
| **1.2: Research Section 1 - Synthesize Key Points** | 15 min | Task 1.1 | "3-5 key points documented; each has source attribution; points relate directly to introduction goal" |
| **1.3: Create Outline Structure** | 15 min | Task 1.2 | "Outline has all 4+ sections; each section has 2-3 main points; structure flows logically" |

### Phase 2: Content Research and Organization (4 tasks, 60-90 minutes)

Research remaining sections and organize findings.

| Task | Duration | Depends on | Acceptance Criterion |
|------|----------|------------|---------------------|
| **2.1: Research Section 2 - Find Credible Sources** | 20 min | Task 1.3 | "5+ sources identified; each is peer-reviewed OR from domain expert; full citations recorded" |
| **2.2: Research Section 2 - Synthesize Key Points** | 15 min | Task 2.1 | "4-6 key points documented; source attributed; points advance main argument" |
| **2.3: Research Section 3 and Beyond - Find Sources** | 20 min | Task 2.2 | "All remaining sections have 3+ credible sources each; citations recorded" |
| **2.4: Organize All Research Notes by Section** | 15 min | Task 2.3 | "All sections have research notes; notes are organized by topic; no gaps identified" |

### Phase 3: Writing and Synthesis (2 tasks, 60-90 minutes)

Transform research into written paper.

| Task | Duration | Depends on | Acceptance Criterion |
|------|----------|------------|---------------------|
| **3.1: Write and Synthesize Content** | 45 min | Task 2.4 | "All sections written; each section 300+ words; citations embedded; argument flows" |
| **3.2: Format and Verify Citations** | 20 min | Task 3.1 | "All citations follow APA format; bibliography complete; in-text citations present" |

### Phase 4: Review and Finalization (1 task, 30 minutes)

Validate final paper quality.

| Task | Duration | Depends on | Acceptance Criterion |
|------|----------|------------|---------------------|
| **4.1: Review Paper Quality and Finalize** | 30 min | Task 3.2 | "Paper reads smoothly; argument is clear; sources are credible; no typos; ready to submit" |

---

## Checkpoint Sequence

Here's how the workflow actually progresses with human checkpoints:

### Checkpoint 1: After Phase 1 (Research Foundation)

```
AGENT: "Research foundation complete:
        ✓ Section 1 sources identified (5 peer-reviewed articles)
        ✓ Key points synthesized from sources
        ✓ Outline structure created (4 sections, logical flow)
        Ready for Phase 2: Content Research"

YOU: "Review sources... all high-quality academic journals.
      Read outline... structure makes sense.
      Looks good! Committing Phase 1."

YOU: (git commit)
YOU: "Proceed to Phase 2"
```

### Checkpoint 2: After Phase 2 (Content Research)

```
AGENT: "Content research complete:
        ✓ Sections 2-4 sources identified (15+ total sources)
        ✓ Key points extracted and organized by section
        ✓ Research notes consolidated and verified for gaps
        Ready for Phase 3: Writing"

YOU: "Review research notes... coverage is comprehensive.
      Check bibliography... all sources have full citations.
      Committing Phase 2."

YOU: (git commit)
YOU: "Proceed to Phase 3"
```

### Checkpoint 3: After Phase 3 (Writing)

```
AGENT: "Writing complete:
        ✓ All sections written (2,500+ words total)
        ✓ Research synthesized into narrative
        ✓ Citations formatted in APA style
        ✓ Bibliography complete
        Ready for Phase 4: Finalization"

YOU: "Read draft... argument is clear and well-supported.
      Check citations... all formatted correctly.
      Committing Phase 3."

YOU: (git commit)
YOU: "Proceed to Phase 4"
```

### Checkpoint 4: After Phase 4 (Finalization)

```
AGENT: "Review and finalization complete:
        ✓ Paper reads smoothly, no formatting issues
        ✓ All sources properly cited
        ✓ Argument coherent from introduction to conclusion
        ✓ Quality gates: All pass
        PROJECT COMPLETE: Paper ready for submission"

YOU: "Final read-through... excellent quality.
      All requirements met. Committing final version.
      Project complete!"

YOU: (final git commit)
```

---

## Task Dependency Graph

```
Phase 1 (Research Foundation): Sequential path
┌────────────────────────────────────────────────────────────┐
│  Task 1.1: Research Section 1 Sources                      │
│      ↓                                                      │
│  Task 1.2: Synthesize Section 1 Key Points                 │
│      ↓                                                      │
│  Task 1.3: Create Outline Structure                        │
│      ↓ [CHECKPOINT 1]                                      │
└────────────────────────────────────────────────────────────┘

Phase 2 (Content Research): Sequential path
┌────────────────────────────────────────────────────────────┐
│  Task 2.1: Research Sections 2+ Sources (depends on 1.3)   │
│      ↓                                                      │
│  Task 2.2: Synthesize Sections 2+ Key Points               │
│      ↓                                                      │
│  Task 2.3: Research Final Sections Sources                 │
│      ↓                                                      │
│  Task 2.4: Organize All Research by Section                │
│      ↓ [CHECKPOINT 2]                                      │
└────────────────────────────────────────────────────────────┘

Phase 3 (Writing): Linear path
┌────────────────────────────────────────────────────────────┐
│  Task 3.1: Write and Synthesize Content (depends on 2.4)   │
│      ↓                                                      │
│  Task 3.2: Format and Verify Citations                     │
│      ↓ [CHECKPOINT 3]                                      │
└────────────────────────────────────────────────────────────┘

Phase 4 (Finalization): Final review
┌────────────────────────────────────────────────────────────┐
│  Task 4.1: Review and Finalize (depends on 3.2)            │
│      ↓ [CHECKPOINT 4 - PROJECT COMPLETE]                   │
└────────────────────────────────────────────────────────────┘
```

> **Legend:** Each task must complete before next starts (strict dependency). Checkpoints occur after each phase group.

---

## Lineage Traceability

Can you trace a task back to specification? Try this one:

```
Specification: "Write 2,500+ word research paper on AI in education
               with academic rigor and clear argument structure"
    ↓
Plan: "Phase 1: Establish research foundation with credible sources;
       Phase 2: Organize research by section;
       Phase 3: Synthesize into written paper;
       Phase 4: Verify quality and finalize"
    ↓
Task 2.1: "Research Section 2 - Find Credible Sources"
    ↓
Acceptance Criterion: "5+ sources identified; each peer-reviewed OR
                       from domain expert; full citations recorded"
```

> **If you can trace this lineage for each task, your task breakdown is well-connected to your specification.**

---

## Common Mistakes

### Mistake 1: Tasks Too Large (45+ Minutes)

**The Error:** "Task: Complete entire section research and writing (2+ hours)"

**Why It's Wrong:** Large tasks hide complexity, delay feedback, and make checkpoints meaningless. You can't validate progress until the entire section completes.

**The Fix:** Break into atomic units (15-30 minutes each):

| ❌ Large | ✅ Atomic |
|----------|-----------|
| "Research and write section 1" | "Find sources" (20 min), "Synthesize points" (15 min), "Outline structure" (15 min), "Write section" (45 min) |

### Mistake 2: Combining Research and Writing

**The Error:** Task includes "research section, synthesize findings, write content, format citations" all as one task

**Why It's Wrong:** If you find issues with source credibility mid-task, you can't easily restart research without redoing writing. Mixing research + writing confuses where quality issues originate.

**The Fix:** Separate research from writing:

```
Task 2.1: "Research Section 2 Sources" (automation/research)
Task 2.2: "Synthesize Section 2 Points" (analysis)
CHECKPOINT: Human reviews research quality before continuing
Task 3.1: "Write and Synthesize Content" (composition)
```

### Mistake 3: Vague Acceptance Criteria

**The Error:** "Task: Section 1 is researched" (what does "researched" mean?)

**Why It's Wrong:** You won't know if the task is done or if there's a hidden gap.

**The Fix:** Make acceptance criteria specific and testable:

```
✅ "Section 1 has 5+ peer-reviewed sources AND each source has full citation AND notes summarize key points"
✅ "Paper has 2,500+ words AND all sources cited AND bibliography complete AND no formatting errors"
```

---

## What Makes /sp.tasks Powerful

The `/sp.tasks` command analyzes your specification and plan, then generates a complete task breakdown that includes:

| Feature | Description |
|---------|-------------|
| **Atomic Unit Definition** | Each task is 15-30 minutes with one acceptance criterion |
| **Dependency Ordering** | Tasks ordered so dependencies are clear |
| **Checkpoint Placement** | Human review points between phases |
| **Lineage Traceability** | You can trace each task back to specification |
| **Acceptance Criteria** | Each task has specific, testable completion condition |

You don't write tasks from scratch. `/sp.tasks` writes them for you based on your specification and plan. Your job is to:

1. Understand the task structure
2. Validate it's atomic
3. Execute it with checkpoints

---

## Summary

The Tasks Phase breaks your plan into atomic work units that are reviewable and controllable. The checkpoint pattern keeps you in the loop, ensuring quality at each phase boundary.

**Key Takeaways:**

1. Tasks are 15-30 minute atomic units with single acceptance criteria
2. Checkpoints are critical for human control and early issue detection
3. Separate research from writing for better quality control
4. Make acceptance criteria specific and testable
5. Trace each task back to your specification

---

## Related Skills

- [Plan Phase](plan-phase.md) — Architecture decisions and ADRs
- [Clarify Phase](clarify-phase.md) — Refine your specification before planning
- [Constitution Phase](constitution-phase.md) — Project-wide quality standards
- [Specification-Driven Development Preview](specification-driven-development-preview.md) — Understanding the SDD workflow
- [Spec-Kit Plus Foundation](spec-kit-plus-foundation.md) — Core Spec-Kit Plus concepts
- `/sp.plan` — Create implementation plan before tasks
- `/sp.implement` — Execute tasks and write paper
- `/sp.git.commit_pr` — Commit work at each checkpoint
