# Brownfield Adoption

Most of what you've learned in previous lessons applies to greenfield projects—new codebases where you start from scratch and control the entire structure. But real work is different. You'll inherit existing projects with months or years of accumulated code, decisions, and team knowledge.

Brownfield adoption is the process of bringing Spec-Kit Plus into an existing project. The challenge isn't technical—it's strategic. How do you add a structured workflow framework without losing the institutional knowledge your team has already captured? How do you protect against data loss when the framework overwrites key files like CLAUDE.md?

This lesson teaches you a safe, proven workflow for brownfield adoption that preserves existing knowledge, prevents accidental data loss, and integrates Spec-Kit Plus incrementally.

---

## Foundation — Greenfield vs Brownfield

### What's the Difference?

| Aspect | Greenfield Project | Brownfield Project |
|--------|-------------------|-------------------|
| **Starting point** | Empty directory | Existing codebase |
| **Existing code** | None | Months/years of accumulated code |
| **Team conventions** | None established | Custom patterns and standards |
| **Architectural decisions** | None made | History of decisions embedded |
| **Custom tools** | None | Project-specific workflows |
| **init command** | `specifyplus init` | `specifyplus init --here` (requires care) |

**Greenfield Project:** You start with an empty directory. You have no existing code to protect, no team conventions to preserve, no architectural decisions made, and no custom tools or workflows. Running `specifyplus init` in a greenfield project is straightforward—you're building from scratch.

**Brownfield Project:** You inherit an existing codebase with working code, a custom CLAUDE.md with team knowledge, custom slash commands in `.claude/commands/`, git history containing architectural decisions, and team members relying on existing conventions. Running `specifyplus init --here` (the brownfield command) requires careful strategy to avoid data loss.

### The Core Problem

When you run `specifyplus init --here`, the command initializes Spec-Kit Plus in your existing directory. Here's what happens:

| Files that get OVERWRITTEN | Files that are PRESERVED |
|---------------------------|-------------------------|
| CLAUDE.md — Complete replacement (~240 lines) | All custom slash commands in `.claude/commands/` |
| Any existing `.specify/` directory gets reset | All source code (`src/`, `lib/`, etc.) |
| | Tests, configuration files, project artifacts |
| | Your git history |

**The Risk:** Your CLAUDE.md contains months or years of team knowledge. Without a backup before running init, that content is permanently lost—no recovery mechanism exists.

---

## Example: Three Real Project Types

Let's see how brownfield adoption affects different project types:

### Scenario 1: Existing Blog/Website Project

```
blog-project/
├── CLAUDE.md          (200 lines of team conventions)
├── src/
│   ├── pages/
│   ├── components/
│   └── styles/
├── README.md
└── .claude/commands/
    └── deploy-netlify.md   (custom deployment workflow)
```

**After `init --here`:**

| File | Change |
|------|--------|
| CLAUDE.md | Replaced (200 → 240 lines) — Your content lost without backup |
| `.specify/` | Created with constitution template |
| `deploy-netlify.md` | **Preserved** — Works as before |
| Source code | **Preserved** — Completely untouched |

### Scenario 2: Existing API Project

```
api-project/
├── CLAUDE.md          (150 lines of coding standards)
├── src/
│   ├── routes/
│   ├── models/
│   └── middleware/
├── tests/
└── .claude/commands/
    ├── run-tests.md
    └── format-code.md
```

**After `init --here`:**

| File | Change |
|------|--------|
| CLAUDE.md | Replaced — Your coding standards lost without backup |
| `.specify/` | Created with constitution template |
| `run-tests.md`, `format-code.md` | **Preserved** — Both commands work |
| Code and tests | **Preserved** — Completely safe |

### Scenario 3: Documentation Project

```
docs-project/
├── CLAUDE.md          (100 lines of documentation standards)
├── docs/
│   ├── guides/
│   ├── api/
│   └── tutorials/
└── .claude/commands/
    └── publish-docs.md
```

**After `init --here`:**

| File | Change |
|------|--------|
| CLAUDE.md | Replaced |
| `.specify/` | Created |
| `publish-docs.md` | **Preserved** |
| Documentation source | **Preserved** |

---

## Collaboration — Safe Brownfield Testing Workflow

The key to safe brownfield adoption is redundant safety measures: git branches + manual backups + clear inspection of what actually changed.

### Designing the Workflow

**Your situation:** You have an existing project with a custom CLAUDE.md that your team values. You want to test `specifyplus init --here` but can't afford to lose the content.

**AI's response:**

> "The solution is creating multiple recovery points before testing. Here's the proven workflow:

```bash
# STEP 1: Create experimental branch (isolates risk from main)
git checkout -b experiment/specifykit

# STEP 2: Create backup copies (manual recovery option)
cp CLAUDE.md CLAUDE.md.backup
cp -r .claude .claude.backup

# STEP 3: Commit current state (git recovery option)
git add -A
git commit -m 'backup: preserve team knowledge before Spec-Kit Plus init'

# STEP 4: NOW test safely (you have multiple recovery paths)
specifyplus init --here
```

**Why this approach works:**

| Recovery Method | What It Protects Against |
|-----------------|-------------------------|
| **Experiment branch** | Your main branch stays completely untouched |
| **Backup files** | If you need your original content, `.backup` files have it |
| **Git commit** | Historical recovery via `git show HEAD~1:CLAUDE.md` |
| **Multiple paths** | If one method fails, you have alternatives |

### Understanding What Actually Changed

After running init, you inspect the results:

```bash
# Check what changed
git diff --name-only
```

**Output:**

```
CLAUDE.md
.specify/memory/constitution.md
.specify/memory/context-quality-memory.md
.specify/templates/spec-template.md
.specify/templates/plan-template.md
.specify/templates/tasks-template.md
[... more .specify/ files ...]
```

Your CLAUDE.md.backup still has the original content. Now you can make an informed decision about merging:

| Option | Where Content Goes | What It Covers |
|--------|-------------------|----------------|
| **Option 1: Constitution** | `.specify/memory/constitution.md` | Standards and architecture decisions |
| **Option 2: CLAUDE.md** | Append to end of CLAUDE.md | Behavioral collaboration patterns |

### Merging Strategy

For a real project, here's how you'd merge (using example content):

```bash
# Read your backup
cat CLAUDE.md.backup

# Identify content categories:
# - Coding standards → Move to constitution.md
# - Architecture principles → Move to constitution.md
# - AI collaboration patterns → Append to new CLAUDE.md

# Execute the merge:

# Add standards to constitution
cat >> .specify/memory/constitution.md << 'EOF'

## Project Development Standards
[paste your coding standards here]
EOF

# Append patterns to CLAUDE.md
cat >> CLAUDE.md << 'EOF'

## Team AI Collaboration Patterns
[paste your collaboration patterns here]
EOF

# Verify nothing was lost:
# Compare old vs new (backup has all your content)
diff CLAUDE.md.backup CLAUDE.md.backup.recovered
```

---

## Practice — Identifying Your Project's Content

Before you adopt Spec-Kit Plus on a real project, understand what you'd need to preserve.

### Self-Check: Content Categories

For each category, decide where your team's content would go:

| Category | Examples | Destination |
|----------|----------|-------------|
| **Development Standards** | Type hints requirements, line length limits, import ordering, naming conventions | `constitution.md` |
| **Architecture Principles** | Technology choices, design patterns, deployment strategy | `constitution.md` |
| **AI Collaboration Patterns** | "Specification first, then code", "Review AI output before merging", test coverage minimum | `CLAUDE.md` (appended) |

### Planning Your Adoption

Write down your actual content before running init:

**What's in your current CLAUDE.md?**

| Category | Line Count |
|----------|------------|
| Development standards | ___ lines |
| Architecture principles | ___ lines |
| AI collaboration patterns | ___ lines |
| Custom workflow notes | ___ lines |

**What custom commands do you rely on? (These are safe)**

| Command | Purpose |
|---------|---------|
| `/deploy` or `/deploy-staging` | ___ |
| `/test` or `/test-coverage` | ___ |
| `/format` or `/lint` | ___ |
| Others | ___ |

**What would break if CLAUDE.md disappeared?**

| Risk | Severity |
|------|----------|
| Team coding standard consensus lost? | High / Medium / Low |
| Architecture decisions undocumented? | High / Medium / Low |
| AI collaboration practices forgotten? | High / Medium / Low |

---

## Try With AI

You're evaluating whether to adopt Spec-Kit Plus on a real project. Let's plan the actual adoption strategy.

**Setup:** Open your project directory with Spec-Kit Plus ready.

### Prompt Set

**Prompt 1 (Understanding your current state):**

```
"My project already has a custom CLAUDE.md with our team's coding standards and
architecture principles. I want to use Spec-Kit Plus but can't lose this content.
What's my safe adoption strategy? Should I back up first? What will actually get overwritten?"
```

**Prompt 2 (Planning the workflow):**

```
"Here's what's in our CLAUDE.md:
[paste your actual content or describe it]

Walk me through the exact steps to:
1. Create a safe testing environment
2. Run specifyplus init --here
3. Merge my team's knowledge with the Spec-Kit Plus template"
```

**Prompt 3 (Merging strategy for your content):**

```
"After running init, how do I decide what content goes to constitution.md vs
appends to CLAUDE.md? Give me specific examples based on [your project type: blog, API, docs]"
```

### Expected Outcomes

- Clear understanding of what's safe to overwrite (you know in advance)
- Concrete backup and recovery plan before running init
- Decision framework for where your team's knowledge belongs in Spec-Kit Plus structure

---

## Safety Checklist

Before running `specifyplus init --here` on any real project:

| Step | Action | Verified |
|------|--------|----------|
| 1 | Create experimental branch | ☐ |
| 2 | Copy CLAUDE.md to CLAUDE.md.backup | ☐ |
| 3 | Backup `.claude/` directory | ☐ |
| 4 | Commit current state to git | ☐ |
| 5 | Document what you're preserving | ☐ |
| 6 | Run `specifyplus init --here` | ☐ |
| 7 | Inspect changes with `git diff` | ☐ |
| 8 | Merge team knowledge to appropriate locations | ☐ |
| 9 | Test that custom commands still work | ☐ |
| 10 | Verify all source code intact | ☐ |

---

## Summary

Brownfield adoption requires careful strategy to preserve accumulated team knowledge while integrating Spec-Kit Plus. The key is creating multiple recovery points before making changes.

**Key Takeaways:**

1. Brownfield projects have existing code, conventions, and knowledge to preserve
2. `specifyplus init --here` overwrites CLAUDE.md—backup first!
3. Custom slash commands in `.claude/commands/` are preserved
4. Source code, tests, and git history are completely safe
5. Create both git branch AND manual backups before testing
6. Development/architecture standards → `constitution.md`
7. AI collaboration patterns → Append to CLAUDE.md
8. Always verify what changed before making merge decisions

---

## Related Skills

- [Designing Reusable Intelligence](designing-reusable-intelligence.md) — Build skills from good sessions
- [Implement Phase](implement-phase.md) — Execute tasks with AI collaboration
- [Plan Phase](plan-phase.md) — Architecture decisions and ADRs
- [Spec-Kit Plus Foundation](spec-kit-plus-foundation.md) — Core Spec-Kit Plus concepts
