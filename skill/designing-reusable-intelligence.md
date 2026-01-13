# Designing Reusable Intelligence

You've completed the SDD workflow (Lessons 01-08): Constitution → Specify → Clarify → Plan → Tasks → Implement. You wrote specifications, refined requirements, planned architecture, and executed implementation with AI collaboration.

But here's what separates AI-native developers from AI-assisted developers: **The ability to transform good sessions into reusable skills.**

With Skills, you teach your AI specific workflows, tools, and processes. By creating a skill, you're giving your AI a playbook it can reference whenever you need that particular type of help—whether that's writing research sections, validating sources, or refining outlines.

---

## When to Create a Skill

Not every workflow deserves a skill. Create one when you notice:

After a good session, ask yourself:

| Question | Yes/No |
|----------|--------|
| Will I do this again? (Frequency: 3+ times across projects) | |
| Did it involve multiple decisions? (Complexity: 5+ decision points) | |
| Would I want the same quality next time? (Value: consistent results matter) | |

If 2+ answers are YES → Create a skill.

### Examples from Your Research Paper Project

| Pattern | Frequency | Complexity | Value | Create Skill? |
|---------|-----------|------------|-------|---------------|
| Writing quality sections | ✅ Every paper | ✅ 6+ decisions | ✅ Consistency | YES |
| Validating research sources | ✅ Every source | ✅ 5+ decisions | ✅ Accuracy | YES |
| Refining outlines | ✅ Every draft | ✅ 5+ decisions | ✅ Structure | YES |
| Formatting citations | ✅ Every source | ❌ 2-3 decisions | ❌ Tool handles | NO |
| Spell checking | ✅ Every draft | ❌ 1 decision | ❌ Standard | NO |

---

## Part A: Creating a Skill Through Conversation

Creating a skill with AI means having a conversation where you explain your approach and share any materials you want included. AI translates this into a properly formatted skill.

### Step 1: Start the Conversation

After a good session (like writing a great section), start a new conversation:

```
I want to create a skill for writing research paper sections.

During our last session, I noticed my best sections had:
- Clear opening that establishes what the section explains
- Evidence integrated naturally, not tacked on
- Logical flow from one paragraph to the next
- Conclusions that connect back to thesis

Can you help me turn this into a reusable skill?
```

**What happens:**
- AI asks clarifying questions about your process
- You explain what makes your approach work
- AI structures this into a skill file

### Step 2: Answer AI's Questions

AI will ask about your process. Provide enough detail that someone capable but unfamiliar could follow your approach.

**Example conversation:**

```
AI: "What makes a section 'good' in your view? How do you know when
     a section is ready vs needs more work?"

You: "A good section has three things:
     1. Every claim is supported by evidence or citation
     2. The opening hooks interest and the ending connects to thesis
     3. Someone unfamiliar with the topic could follow the logic

     It needs more work if I have to re-read sentences to understand them,
     or if claims feel unsupported."

AI: "What's your process for writing a section? Do you outline first,
     write linearly, or iterate?"

You: "I start with a rough outline of key points. Then I write the opening
     paragraph to establish context. Then I fill in evidence for each point.
     Finally I write transitions and the closing. I always read it aloud
     to check flow."

AI: "What quality checks do you apply before considering a section done?"

You: "I check:
     - Does every paragraph have a clear topic sentence?
     - Is every factual claim cited?
     - Does it read smoothly without stopping?
     - Does it connect to the thesis?"
```

### Step 3: AI Builds the Skill File

Based on your conversation, AI creates a complete SKILL.md file. Ask:

```
Create the skill file with:
- YAML frontmatter (name, description, version)
- When to use this skill
- Process steps from our conversation
- Output format
- Example with input and output

Format it as a SKILL.md file I can save.
```

**AI generates:**

```yaml
---
name: "section-writer"
description: "Write clear, evidence-supported research paper sections with proper citations and logical flow. Use when user asks to write a section, needs help with academic writing, or wants to structure research content."
version: "1.0.0"
---

# Section Writing Skill

## When to Use This Skill

- User asks to "write a section" or "draft content" for a research paper
- User mentions thesis, evidence integration, or academic writing
- User needs help structuring research content with citations

## How This Skill Works

1. **Outline key points**: Identify 3-5 main points the section must make
2. **Write opening paragraph**: Establish context, hook interest, connect to thesis
3. **Develop each point**: Topic sentence → evidence/citation → significance → transition
4. **Write closing**: Summarize insights, connect to thesis, set up next section
5. **Quality check**: Verify claims cited, flow smooth, thesis connected

## Output Format

Provide:
- **Opening Paragraph**: Hook + context + thesis connection
- **Body Segments**: For each key point: topic sentence, evidence, significance
- **Transitions**: Smooth connections between paragraphs
- **Closing Paragraph**: Summary + thesis connection + setup for next section

## Quality Criteria

A section is ready when:
- Someone unfamiliar with topic can follow the logic
- All claims supported by evidence
- No sentences require re-reading to understand
- Opening hooks interest, closing connects to thesis

## Example

**Input**: "Write the Literature Review section on AI in K-12 education.
Key points: (1) Current state of AI in K-12, (2) Teacher workload research,
(3) Student outcome studies. Thesis: AI tools can measurably improve K-12
classroom efficiency."

**Output**:
- **Opening**: "The integration of artificial intelligence into K-12
  classrooms represents one of the most significant shifts in educational
  technology since the introduction of personal computers. As schools face
  mounting pressure to improve outcomes while managing limited resources,
  AI tools offer promising solutions—but what does the research actually show?"
- **Body**: [3 segments with topic sentences, evidence from studies, significance explained]
- **Closing**: "The evidence suggests AI tools can meaningfully reduce teacher
  workload while improving student engagement. However, implementation challenges
  and equity concerns require careful attention as districts consider adoption."
```

### Step 4: Save the Skill File

Skills use a specific directory structure. Create the skill directory and save:

```bash
# Create skill directory (skill-name/SKILL.md structure)
mkdir -p .claude/skills/section-writer
```

Then tell AI:

```
Save this skill to .claude/skills/section-writer/SKILL.md
```

**Your directory structure now includes:**

```
my-research-paper/
├── .claude/
│   ├── commands/              # Slash commands from specifyplus init
│   └── skills/                # YOUR reusable intelligence
│       └── section-writer/    # Skill directory
│           └── SKILL.md       # Main skill file
├── .specify/
│   └── memory/
│       └── constitution.md
├── specs/
│   └── [your-paper]/
│       ├── spec.md
│       ├── plan.md
│       └── tasks.md
└── ...
```

> **Note:** Skills can also include supporting files (scripts, reference docs) in the skill directory. For now, SKILL.md is all you need.

### Step 5: Test the Skill

Test on a real task:

```
I need to write the Discussion section for my paper.
Use the section-writer skill to guide me.

Key points:
1. How AI applications address teacher workload
2. Evidence of student outcome improvements
3. Limitations and areas needing more research

Thesis: AI tools can measurably improve K-12 classroom efficiency.
```

**Evaluate the result:**

| Check | Question |
|-------|----------|
| Process followed | Did AI follow the skill's process (outline → opening → evidence → closing)? |
| Quality met | Did output meet the quality criteria (claims cited, flows smoothly)? |
| Completeness | What's missing or needs adjustment? |

### Step 6: Iterate Until It Works

If something's off, ask AI to update the skill:

```
The section-writer skill worked well, but I noticed:
- It didn't emphasize checking source credibility
- The quality checklist could be more specific

Update the skill to:
1. Add source credibility check in Step 3
2. Add "minimum 3 sources per major point" to quality criteria

Then save the updated version to .claude/skills/section-writer.md
```

Repeat testing until your skill produces consistent, high-quality results.

---

## Part B: Skill vs Subagent — When to Create Which

As you identify more patterns, you'll wonder: Should I create a skill or a subagent?

### Decision Framework

| Create a SKILL (2-6 decision points) | Create a SUBAGENT (7+ decision points) |
|--------------------------------------|----------------------------------------|
| Human guides the process, AI assists | AI should work autonomously with minimal guidance |
| You apply the framework, AI helps execute | AI makes judgments and returns verdicts |
| Examples: section-writer, outline-refiner, citation-formatter | Examples: research-validator, fact-checker |

### From Your Research Paper Project

| Component | Decision Points | Human Involvement | Create |
|-----------|-----------------|-------------------|--------|
| Section writing | 6 | Human guides, AI assists | SKILL |
| Outline refinement | 5 | Collaborative iteration | SKILL |
| Research validation | 8+ | AI judges credibility | SUBAGENT |
| Fact checking | 7+ | AI verifies autonomously | SUBAGENT |

### What Makes Subagents Different

A subagent adds three things beyond a skill:

| Feature | Description |
|---------|-------------|
| **1. Role Definition** | Autonomous identity with defined autonomy level |
| **2. Decision Authority** | What it can decide vs. must escalate |
| **3. Reporting Format** | Structured output format |

**Example Subagent Definition:**

```yaml
---
name: "source-validator"
description: "Autonomously evaluate research source credibility"
autonomy_level: "high"
---

# Source Validator Subagent

## Role Definition
**Name**: source-validator
**Autonomy Level**: High (makes accept/reject decisions)
**Invocation**: Automatic (after adding source) or manual

## Decision Authority

**Can ACCEPT**: Peer-reviewed sources from past 10 years
**Can REJECT**: Non-peer-reviewed sources, outdated sources
**Must ESCALATE**: Borderline cases, conflicting information

## Reporting Format

=== SOURCE VALIDATION ===
Source: [title]
Verdict: [ACCEPT | REJECT | ESCALATE]
Reasoning: [specific criteria applied]
Required Actions: [if any]
```

### Creating a Subagent (Preview)

Subagents follow a similar conversation-based creation process:

```
I want to create a subagent for validating research sources.

The subagent should autonomously:
1. Check if sources are peer-reviewed
2. Evaluate publication date (prefer recent)
3. Assess author credibility
4. Flag potential bias
5. Verify source actually supports the claim being made

It should return a verdict (accept/reject/escalate) with reasoning.

Help me design this subagent with:
- Role definition
- Decision authority (what it can decide vs escalate)
- Reporting format
```

> You'll learn more about subagents in later chapters. For now, focus on skills.

---

## Part C: Validating Your Skill Works

Good skills trigger reasoning mode (context-specific analysis). Bad skills trigger prediction mode (generic responses).

### Test Your Skill's Effectiveness

Ask your AI to apply your skill to a challenging case:

```
Apply the section-writer skill to this vague request:

"Write about AI in education"

Walk me through how you're applying each step of the skill.
Show your reasoning for each quality check.
```

### Good Response (Reasoning Mode)

```
Applying section-writer skill:

STEP 1 - OUTLINE KEY POINTS:
The request is too vague. Before outlining, I need:
- What specific aspect of AI in education?
- What thesis should this connect to?
- What audience level?

[Skill triggers clarification before proceeding]

STEP 2-4 - [Would proceed after clarification]

QUALITY CHECK:
- Cannot verify "connects to thesis" without knowing thesis
- Cannot ensure "someone unfamiliar can follow" without knowing audience

SKILL VERDICT: Request needs refinement before skill can be applied effectively.
```

### Bad Response (Prediction Mode)

```
Here's a section about AI in education:

AI is transforming education in many ways. It helps teachers
and students learn better. Many schools are using AI tools...

[Generic content that ignores skill process]
```

> If you get prediction mode responses, your skill needs strengthening. Revise with more specific criteria and quality checks.

---

## Part D: Building Your Intelligence Library

### Organizing Your Skills

Standard directory structure (each skill gets its own folder):

```
my-research-paper/
├── .claude/
│   ├── commands/                    # Slash commands (from specifyplus)
│   └── skills/                      # YOUR accumulated intelligence
│       ├── section-writer/          # Skill directory
│       │   └── SKILL.md             # Main skill file
│       ├── outline-refiner/         # Future skill
│       │   └── SKILL.md
│       └── source-evaluator/        # Future skill
│           ├── SKILL.md
│           └── scripts/             # Optional supporting files
│               └── verify_source.py
├── .specify/
│   └── memory/
│       └── constitution.md
├── specs/
└── ...
```

### Intelligence Reuse Strategy

**Skill reuse (apply to new contexts):**

```
# Project 2: Different research paper
I'm writing a section on climate policy impacts.

Use the section-writer skill.

Context: This is for a policy paper, not education research.
Key points: (1) Current policy landscape, (2) Economic impacts, (3) Implementation challenges
Thesis: Carbon pricing is the most efficient policy mechanism.
```

**Intelligence composition (combine multiple skills):**

```
# Project 3: Comprehensive paper
Apply these skills in sequence:
1. outline-refiner → improve paper structure
2. section-writer → write each section
3. source-evaluator → validate all citations

Start with outline-refiner on my current outline.
```

---

## Common Mistakes

### Mistake 1: Creating Skills for Trivial Patterns

**The Error:** Creating a skill for "How to format headings"

**Why It's Wrong:** 1-2 decision points don't justify a skill. Save skills for complex, recurring workflows.

**The Fix:** Only create skills for patterns with 5+ decisions that recur across 3+ projects.

### Mistake 2: Skipping the Testing Phase

**The Error:** Saving a skill and assuming it works

**Why It's Wrong:** Skills need iteration. Your first version probably misses edge cases.

**The Fix:** Always test skills on real tasks. Update based on what's missing.

### Mistake 3: Over-Specific Skills

**The Error:** Creating "AI-Education-Literature-Review-Writer" that only works for one topic

**Why It's Wrong:** Intelligence should be reusable. Over-specificity limits value.

**The Fix:** Generalize patterns:

| ❌ Over-Specific | ✅ Generalizable |
|------------------|------------------|
| "AI-Education-Literature-Review-Writer" | "Section-Writer" (works for any research paper section) |

### Mistake 4: No Quality Criteria

**The Error:** Skill describes process but not what "good" looks like

**Why It's Wrong:** Without quality criteria, you can't verify output or improve skill.

**The Fix:** Every skill needs explicit quality criteria:

| Question | Answer |
|----------|--------|
| What makes output "ready"? | Define specific criteria |
| What makes output "needs work"? | Define failure modes |
| How do you check? | Provide verification steps |

---

## Skill Reuse in Practice

### Project 1: Research Paper (Lessons 04-08)

You execute the complete workflow from scratch:

- Write specification, plan, tasks
- Write sections through trial and error
- Learn what works through iteration

**Total: 8-10 hours**

### Project 2: New Paper (With section-writer Skill)

With your skill, dramatically faster:

- Write paper specification (30 min)
- Plan sections (30 min)
- Write sections using skill guidance (3 hours—skill provides structure)

**Total: 4 hours (50% faster)**

### Project 3: Multi-Paper Work (With Multiple Skills)

With accumulated skills:

- Use section-writer skill to write (2 hours)
- Use source-evaluator skill to check citations (1 hour)
- Use outline-refiner skill to improve structure (30 min)

**Total: 3.5 hours**

> **Intelligence compounds:** Each skill accelerates future work.

---

## Summary

Designing reusable intelligence transforms good sessions into assets that compound in value. By creating skills for recurring, complex workflows, you build an intelligence library that accelerates every future project.

**Key Takeaways:**

1. Create skills when patterns recur (3+ times), have complexity (5+ decisions), and require consistent quality
2. Skills are created through conversation—you explain your process, AI structures it
3. Skills need testing, iteration, and explicit quality criteria
4. Skills are for 2-6 decision points; subagents are for 7+ autonomous decisions
5. Intelligence compounds—each skill accelerates all future work

---

## Related Skills

- [Implement Phase](implement-phase.md) — Execute tasks with AI collaboration
- [Tasks Phase](tasks-phase.md) — Atomic work units and checkpoints
- [Plan Phase](plan-phase.md) — Architecture decisions and ADRs
- [Specification-Driven Development Preview](specification-driven-development-preview.md) — Understanding the SDD workflow
- [Spec-Kit Plus Foundation](spec-kit-plus-foundation.md) — Core Spec-Kit Plus concepts
