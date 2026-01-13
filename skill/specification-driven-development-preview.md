# Specification-Driven Development Preview

In Lesson 4, you learned that orchestration is about direction—making judgments that guide AI implementation. But direction requires clarity. It requires thinking first.

This lesson previews the methodology that makes this thinking systematic: Specification-Driven Development (SDD).

You've heard about this in the preface. This chapter established that the orchestrator role requires clear specifications that direct AI agents. Now we'll explore what a specification is and why it matters before you learn to write specifications in depth (Part 2).

Think of this lesson as a compass pointing toward a more sophisticated capability you'll build throughout the book.

---

## Why Specifications Matter More Than Code

Imagine you ask a colleague to build a user registration system. Here are two approaches:

### Approach 1: Vague Direction

> "Build a registration system. Users should be able to sign up with email and password."

Your colleague interprets this differently than you intended:

- What about password requirements? They hardcode minimum 6 characters (you need 8 + uppercase)
- What about duplicate emails? They allow re-registration (you need uniqueness)
- What about errors? They return technical messages (you need user-friendly messages)
- What about rate limiting? They implement none (you need protection against brute force)

**Result:** 3-5 iteration cycles to fix what they misunderstood.

### Approach 2: Clear Specification

```
## User Registration Specification

**Intent**: Enable new users to create accounts securely

**Success Criteria**:
- Accepts email (valid format) and password (8+ chars, 1 uppercase, 1 number)
- Prevents duplicate emails with clear error message
- Returns user-friendly errors, never technical details
- Limits registration attempts: 5 per hour per IP
- Hashes passwords with bcrypt (12 rounds)

**Constraints**:
- Response time < 200ms (excluding email verification)
- Support 10,000 simultaneous registrations
- GDPR compliant (no unnecessary data retention)
```

Your colleague (or AI) now understands not just what to build, but why it matters. They make correct decisions about edge cases because the intent is explicit.

**Result:** 1-2 iteration cycles for refinement only.

---

## The Core Insight: AI Executes Specifications, Not Ideas

This is critical: AI systems cannot convert vague ideas into quality implementations.

When you say "build a registration system," an AI system has to guess:

- What does "registration" mean in your context?
- What constraints matter? (Security, performance, user experience?)
- What does success look like?
- What edge cases matter?

Each guess increases the chance of misalignment.

When you provide a specification, you've made your assumptions explicit. AI can execute against explicit intent. It struggles with implicit assumptions.

The productivity equation is simple:

```
Clear Specification + AI Execution = 1 iteration
Vague Idea + AI Execution = 5+ iterations
```

In the agentic era, specification quality is the primary skill. Code quality is delegated to AI.

---

## The SDD Workflow: Four Phases

Specification-Driven Development is a four-phase workflow. Understanding these phases prepares you for Part 2, where you'll practice them in depth.

### Phase 1: Specification (Define What)

**Question:** What are we building and why does it matter?

**Output:** A clear specification that captures:

- **Intent:** Why does this exist? (User intent, not technical implementation)
- **Success Criteria:** What does correct implementation look like?
- **Constraints:** What limits exist? (Performance, security, compliance, scale)
- **Non-Goals:** What are we explicitly NOT building?

**Example:**

```
Spec: Email validation system

Intent: Prevent invalid emails in user accounts

Success Criteria:
  ✓ Rejects addresses without @ symbol
  ✓ Rejects domains without TLD
  ✓ Accepts international domain names
  ✓ Returns validation result in < 10ms

Non-Goals:
  ✗ We don't verify email deliverability
  ✗ We don't send test emails
```

### Phase 2: Plan (Design How)

**Question:** How will we approach building this?

**Output:** A plan that shows:

- **Architecture decisions:** What components are needed?
- **Dependency sequence:** What must be built first?
- **Testing strategy:** How will we validate correctness?
- **Tradeoff analysis:** Why this approach over alternatives?

**Example:**

```
Plan: Email validation system

Architecture:
  1. Regex pattern library (built-in)
  2. Internationalization handler (npm package: `isemail`)
  3. Validation wrapper function

Sequence:
  → Start with basic regex validation
  → Layer in international domain support
  → Wrap with error handling

Validation:
  → Unit tests for each regex pattern
  → Edge case tests (special characters, international domains)
```

### Phase 3: Tasks (Break Down Work)

**Question:** What are the concrete work items?

**Output:** A task list that specifies:

- **Individual items:** Each task should take 30 min - 2 hours
- **Dependencies:** What tasks must complete first?
- **Acceptance criteria:** How do we know task is done?

**Example:**

```
Tasks:

1. [ ] Create regex patterns for basic email validation
   Acceptance: Pattern test file passes with 15 test cases

2. [ ] Integrate isemail package for international domains
   Acceptance: Dependency installed, import verified
   Depends on: Task 1 complete

3. [ ] Create validation wrapper function
   Acceptance: Function handles valid/invalid input, returns typed response
   Depends on: Task 2 complete
```

### Phase 4: Implement (AI Executes)

**Question:** How do we execute the plan?

**Output:** Working code that:

- **Matches specification:** Does it satisfy all success criteria?
- **Follows the plan:** Are components built in right sequence?
- **Passes acceptance criteria:** Do tasks meet their definitions of done?

**Example:**

```python
def validate_email(email: str) -> dict:
    """Validate email format according to spec."""
    # Implementation follows plan phases
    # Tests validate against spec criteria
```

---

## Why This Matters for AI Collaboration

The diagram below shows how these four phases interact with AI:

```
┌──────────────────────────────────────────────────────┐
│ Phase 1: Specification                               │
│ (Human writes intent, criteria, constraints)         │
│ → AI reads and understands exact requirements        │
└──────────────────────────────────────────────────────┘
                          ↓
┌──────────────────────────────────────────────────────┐
│ Phase 2: Plan                                        │
│ (Human + AI collaborate on architecture)             │
│ → Decisions about how to structure solution          │
└──────────────────────────────────────────────────────┘
                          ↓
┌──────────────────────────────────────────────────────┐
│ Phase 3: Tasks                                       │
│ (Human creates work breakdown; AI or human breaks    │
│  plan into executable items)                         │
└──────────────────────────────────────────────────────┘
                          ↓
┌──────────────────────────────────────────────────────┐
│ Phase 4: Implement                                   │
│ (AI generates code; human validates against spec)    │
│ → AI has clear requirements, executes precisely      │
└──────────────────────────────────────────────────────┘
```

The key: Each phase removes ambiguity.

| Phase | Removes Ambiguity About |
|-------|------------------------|
| Specification | What should we build? |
| Plan | How should we structure it? |
| Tasks | What are the concrete units of work? |
| Implementation | Execution against clear requirements |

This is radically different from traditional development where all four elements are jumbled together, with the coder figuring them out while typing.

---

## Connection: From Orchestrator to SDD

In Lesson 4, you learned that orchestrators direct AI. SDD is the system for orchestration.

An orchestrator provides:

- Clear intent (specification)
- Architectural direction (plan)
- Concrete boundaries (tasks)
- Validation criteria (success metrics)

Without this system, orchestration becomes "give tasks to AI and hope." With SDD, orchestration becomes directed implementation with measurable outcomes.
