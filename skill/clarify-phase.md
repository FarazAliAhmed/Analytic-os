# Clarify Phase — Refine Your Specification

In Lesson 04, you wrote a specification for your research paper. It looked complete. But there are always gaps you didn't catch—ambiguities that seemed clear in your head but are actually vague on paper. Assumptions about scope, audience, or success that you didn't state explicitly.

This is where the `/sp.clarify` command helps. Clarify is a quick check that your specification is complete before moving to planning.

Think of `/sp.clarify` as your AI companion putting on a "detail detective" hat and asking:

- "Wait, who exactly is your audience?"
- "What counts as a 'well-researched' paper?"
- "How many sources is enough?"
- "What format should this follow?"

It finds gaps you might have missed, then you decide whether to update your spec.

**The goal:** Make your specification so clear that the planning phase can generate a perfect implementation plan.

---

## What Does /sp.clarify Do?

### The Clarify Command

`/sp.clarify` analyzes your specification and reports:

### Ambiguous Terms

Words that could mean multiple things.

| Ambiguous Phrase | Possible Interpretations |
|------------------|--------------------------|
| "well-researched paper" | 5 sources? 50 sources? What counts as credible? |
| "professional format" | APA? MLA? Chicago? Single-spaced? Double-spaced? |
| "clear structure" | How many sections? What should each contain? |

### Missing Assumptions

Things you assumed but didn't state.

| Missing Assumption | Example |
|--------------------|---------|
| Citation style | You assumed academic paper but didn't specify APA/MLA/Chicago |
| Paper length | You assumed 3,000 words but didn't state minimum or maximum |
| Target audience | You assumed academic readers but didn't specify level (undergrad/grad/expert) |
| Language | You assumed English but didn't specify if other languages acceptable |

### Incomplete Requirements

Scenarios or cases you didn't cover.

| Incomplete Requirement | Example |
|------------------------|---------|
| Introduction content | You specified "introduce topic" but didn't define what introduction contains |
| Source conflicts | You specified research but didn't specify how to handle conflicting sources |
| Revision process | You specified content but didn't specify editing or revision process |

### Scope Conflicts

Places where scope is unclear or inconsistent.

| Scope Conflict | Example |
|----------------|---------|
| Breadth vs. depth | "Comprehensive research" on what exactly? All historical context or just recent developments? |
| Organization method | "Clear structure" using what method? Chronological? Thematic? Problem-solution? |
| Audience alignment | "Compelling conclusion" appealing to whom? Academic audience? General readers? |

---

## Why Clarify Matters Before Planning

A vague specification creates a vague plan. When the planning phase can't understand exactly what you want, it generates ambiguous design decisions. Then you spend time during implementation realizing your actual intention wasn't captured.

### Without Clarification (Vague Spec)

```
Intent: Write research paper on climate change
Success Criteria: Paper is well-researched and professionally written

Planning phase has questions:
- What specific aspect of climate change? Global warming trends? Policy solutions? Historical development?
- How many sources? Academic only or include journalistic sources?
- What length? 2 pages? 10 pages? 50 pages?
- What citation style? Who's the audience?
```

### With Clarification (Precise Spec)

```
Intent: Write research paper on climate policy solutions adopted since 2015
Success Criteria:
- Minimum 5 peer-reviewed sources (journals, not news)
- APA format, 3,000-4,000 words
- Three policy solutions compared (effectiveness, adoption barriers, future outlook)
- Audience: undergraduate economics students
- Conclusion: assessment of which policy approach shows most promise

Planning phase now has clear requirements and generates specific implementation tasks.
```

---

## The Clarify Workflow

### Step 1: Run /sp.clarify

In Claude Code, from your research-paper directory:

```bash
/sp.clarify

My research paper specification is at specs/paper/spec.md
Please analyze it for:
1. Ambiguous terms (what does "well-researched" mean? How many sources? What type?)
2. Missing assumptions (citation style? audience? paper length? structure?)
3. Incomplete requirements (what does "introduce topic" contain? how to handle conflicting sources? revision process?)
4. Scope conflicts (is this historical overview or current policy analysis? broad or narrowly focused?)

What gaps should I address before planning the paper structure?
```

Your AI companion will analyze your specification, identify gaps or ambiguities, and ask clarifying questions. Review its findings and consider which gaps are critical versus nice-to-have.

### Step 2: Update Your Specification

For each clarifying question, decide: **Do I need to answer this before planning?**

| Category | Description | Action |
|----------|-------------|--------|
| **Critical gaps** | Planning can't work without this | Update spec immediately |
| **Nice-to-have** | Planning can proceed | Update spec or defer |

**Critical examples:**
- Citation style affects all references → Critical
- Paper length determines research scope → Critical
- Audience determines tone and complexity → Critical

**Nice-to-have examples:**
- Specific revision timeline → Nice-to-have
- Preferred formatting tools → Nice-to-have
- Aesthetic preferences → Nice-to-have

### Step 3: Re-Run /sp.clarify (Optional)

If you made significant changes, run `/sp.clarify` again:

> I've updated my research paper specification based on your feedback.
> Please analyze it again for remaining gaps.
> Is this specification clear enough to proceed to the planning phase?

> **Note:** Most specifications need 1-2 clarification rounds. After that, they're ready for planning.

---

## Clarifying Your Paper Specification

Now let's clarify YOUR research paper specification—the one you wrote in Lesson 04.

### Step 1: Run /sp.clarify on Your Specification

In Claude Code, from your research-paper directory, run:

```bash
/sp.clarify

My research paper specification is at specs/paper/spec.md

Please analyze it for:

1. AMBIGUOUS TERMS
   - What does "well-researched" mean in my spec? (how many sources? which types?)
   - What does "professional format" mean? (which citation style? spacing? margins?)
   - What does "clear structure" mean? (how many sections? what should each contain?)

2. MISSING ASSUMPTIONS
   - What citation style should I use? (APA, MLA, Chicago, Harvard?)
   - What's the target audience? (academic, general readers, specific field?)
   - What's the paper length? (minimum and maximum word count?)
   - How recent should sources be? (published in last 5 years? 10 years?)

3. INCOMPLETE REQUIREMENTS
   - What should the introduction contain? (background? thesis statement? scope?)
   - How do I handle conflicting sources? (which viewpoints to include?)
   - What constitutes a "credible" source? (peer-reviewed only? news acceptable?)
   - How should I structure the paper? (chronological? thematic? by source?)

4. SCOPE CONFLICTS
   - Is this narrowly focused on one aspect or broadly covering the topic?
   - Is this historical overview or current-state analysis?
   - Are there sub-questions I should address or exclude?

List any gaps or questions. Which ones are CRITICAL (planning won't work without them) vs NICE-TO-HAVE (improve quality but not blocking)?
```

### Step 2: Evaluate Feedback

Review the clarifying questions your AI companion identified. For each one, ask:

- Is this critical to planning the paper structure?
- Can planning proceed without this answer, or does it affect section design?
- Should I resolve this now or defer it?

### Step 3: Update Your Specification

Update your `spec.md` with the clarifications you decide are critical. You might add:

```markdown
## Target Audience
Undergraduate economics students (not specialized researchers)

## Citation Style
APA format, 7th edition

## Length Requirements
3,000-3,500 words

## Source Requirements
- Peer-reviewed journals: 80%
- Reputable news sources: 20%

## Paper Structure
1. Introduction → Problem Analysis → Three Solutions → Comparison → Conclusion
```

### Step 4: Verify Readiness

Ask your AI companion:

> Based on the clarifications I've made, is my research paper specification now ready for the planning phase?
> Can you explain the paper structure and success criteria back to me to confirm we're aligned?

---

## Why Clarification Prevents Implementation Problems

Skipping clarification creates cascading problems during implementation:

```
Missing specification clarity
    ↓
Vague planning decisions
    ↓
Confused implementation tasks
    ↓
Rework and frustration
```

Here's how clarification breaks this chain:

1. You run `/sp.clarify` and discover ambiguity: "What's the minimum number of sources?"
2. You update spec: "Minimum 6 peer-reviewed sources"
3. Planning phase generates clear implementation task: "Research and select 6+ peer-reviewed sources on [topic]"
4. Implementation proceeds smoothly because the requirement is explicit

---

## Common Mistakes

### Mistake 1: Skipping /sp.clarify Because "Spec Looks Good to Me"

**The Error:** "I wrote a detailed spec. I don't need clarification."

**Why It's Wrong:** Every specification has ambiguities you didn't notice. Clarify surfaces them now (5 minutes) instead of during implementation (5 hours).

**The Fix:** Always run `/sp.clarify`. You'll be surprised what gaps emerge. Most specs need 1-2 clarification rounds.

### Mistake 2: Ignoring Critical Clarifications

**The Error:** "AI asked about citation style but I'll just figure that out later."

**Why It's Wrong:** Citation style affects every source reference. Deferring this decision means planning the paper structure without knowing how citations work, then discovering mid-implementation you chose wrong.

**The Fix:** Address critical gaps upfront. Test: "If planning didn't know this, would they make a different choice?" If yes, it's critical.

### Mistake 3: Accepting All AI Suggestions Without Thinking

**The Error:** AI suggests adding source diversity requirements → immediately adding without evaluating necessity

**Why It's Wrong:** Not all suggestions improve your spec. Some add unnecessary complexity.

**The Fix:** Evaluate each suggestion:

| Question | Decision |
|----------|----------|
| Is this critical to paper quality or nice-to-have? | Accept/Reject/Modify |
| Does this affect planning or just implementation? | Plan-affecting = critical |
| Can I defer this to revision? | Defer if not blocking |

Then decide: Accept, Reject, or Modify.

---

## Clarification Checklist

Before moving to planning, your specification should answer:

### Basics
- [ ] What is the exact topic or research question?
- [ ] What is the target audience?
- [ ] What is the word count range?
- [ ] What citation style is required?

### Sources
- [ ] How many sources are required?
- [ ] What types of sources are acceptable?
- [ ] How recent should sources be?
- [ ] How will you handle conflicting sources?

### Structure
- [ ] What sections are required?
- [ ] What should each section contain?
- [ ] Is there a preferred organization method?

### Success
- [ ] How will you know the paper is complete?
- [ ] What are the quality gates?
- [ ] What is the revision process?

---

## Summary

The Clarify Phase ensures your specification is complete before the planning phase begins. By identifying and resolving ambiguities upfront, you prevent cascading problems during implementation.

**Key Takeaways:**

1. Every specification has gaps—clarify surfaces them
2. Distinguish critical gaps (blocking) from nice-to-have (deferrable)
3. Most specs need 1-2 clarification rounds
4. Address critical gaps before planning
5. Verify readiness by having AI explain back your spec

---

## Related Skills

- [Constitution Phase](constitution-phase.md) — Project-wide quality standards
- [Specification-Driven Development Preview](specification-driven-development-preview.md) — Understanding the SDD workflow
- [Spec-Kit Plus Foundation](spec-kit-plus-foundation.md) — Core Spec-Kit Plus concepts
- `/sp.specify` — Create new specification for a paper
- `/sp.plan` — Create implementation plan after specification is clear
- `/sp.tasks` — Generate testable tasks
- `/sp.implement` — Execute tasks and write paper
