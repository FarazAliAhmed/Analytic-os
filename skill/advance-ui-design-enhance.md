---
name: advance-ui-design-enhance
description: Apply premium luxury editorial design to admin pages with sophisticated dark theme and amber/gold accents. Use this skill to transform existing PHP admin pages with smooth animations, gradient borders, and SVG iconography.
license: Complete terms in LICENSE.txt
---

This skill provides a comprehensive design system for creating premium luxury editorial interfaces for admin dashboards. Apply this when transforming existing PHP admin pages or building new admin interfaces that require a sophisticated, high-end look.

## Design Aesthetic

**Luxury Editorial Dark Theme** - Sophisticated admin interface with:
- Deep slate backgrounds (slate-950 to slate-850 gradient)
- Rich amber/gold accents (#f59e0b primary)
- Cormorant Garamond (display) + DM Sans (body) typography
- Smooth animations and hover effects
- Gradient borders and glow effects
- SVG decorative elements

## CSS Variables

Add these to `:root` in your CSS:

```css
:root {
    /* Primary - Rich Amber/Gold */
    --amber-50: #fffbeb;
    --amber-100: #fef3c7;
    --amber-200: #fde68a;
    --amber-300: #fcd34d;
    --amber-400: #fbbf24;
    --amber-500: #f59e0b;
    --amber-600: #d97706;
    --amber-700: #b45309;
    --amber-800: #92400e;
    --amber-900: #78350f;

    /* Accent - Deep Bronze/Purple */
    --bronze-500: #a78bfa;
    --bronze-600: #8b5cf6;

    /* Neutral - Deep Slate */
    --slate-50: #f8fafc;
    --slate-100: #f1f5f9;
    --slate-200: #e2e8f0;
    --slate-300: #cbd5e1;
    --slate-400: #94a3b8;
    --slate-500: #64748b;
    --slate-600: #475569;
    --slate-700: #334155;
    --slate-800: #1e293b;
    --slate-850: #162032;
    --slate-900: #0f172a;
    --slate-950: #020617;

    /* Semantic */
    --success: #10b981;
    --success-bg: rgba(16, 185, 129, 0.1);
    --success-border: rgba(16, 185, 129, 0.3);
    --danger: #f43f5e;
    --danger-bg: rgba(244, 63, 94, 0.1);
    --danger-border: rgba(244, 63, 94, 0.3);
    --info: #06b6d4;
    --info-bg: rgba(6, 182, 212, 0.1);
    --info-border: rgba(6, 182, 212, 0.3);

    /* Typography */
    --font-display: 'Cormorant Garamond', Georgia, serif;
    --font-body: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;

    /* Shadows */
    --shadow-glow: 0 0 40px rgba(245, 158, 11, 0.15);
    --shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);

    /* Transitions */
    --transition-base: 250ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

## Google Fonts

Add to `<head>`:
```html
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Cormorant+Garamond:wght@500;600;700&display=swap" rel="stylesheet">
```

## Animations

```css
@keyframes heroShimmer {
    0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.5; }
    50% { transform: translateY(20px) rotate(2deg); opacity: 1; }
}

@keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
}

@keyframes rotateFloat {
    from { transform: translateY(-50%) rotate(0deg); }
    to { transform: translateY(-50%) rotate(360deg); }
}

@keyframes spin {
    to { transform: rotate(360deg); }
}
```

## Component Patterns

### 1. Hero Section

```html
<div class="hero-section">
    <div class="hero-content">
        <div class="hero-eyebrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
            Section Label
        </div>
        <h1 class="hero-title">Page Title</h1>
        <p class="hero-subtitle">Brief description of the page purpose.</p>
        <div class="hero-actions">
            <a href="#" class="btn btn-outline">Secondary</a>
            <button class="btn btn-primary">Primary Action</button>
        </div>
    </div>
    <div class="hero-decoration">
        <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
    </div>
</div>
```

```css
.hero-section {
    position: relative;
    background: linear-gradient(135deg,
        var(--slate-900) 0%,
        var(--slate-800) 40%,
        var(--amber-900) 100%);
    padding: 60px 48px;
    border-radius: 24px;
    margin: 24px 24px 32px 24px;
    overflow: hidden;
    box-shadow: var(--shadow-2xl), 0 0 0 1px rgba(245, 158, 11, 0.1);
}

.hero-section::before {
    content: '';
    position: absolute;
    top: -100%;
    right: -50%;
    width: 100%;
    height: 300%;
    background: radial-gradient(ellipse at center, rgba(245, 158, 11, 0.08) 0%, transparent 60%);
    animation: heroShimmer 15s ease-in-out infinite;
}

.hero-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: rgba(245, 158, 11, 0.15);
    border: 1px solid rgba(245, 158, 11, 0.3);
    border-radius: 30px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--amber-400);
}

.hero-title {
    font-family: var(--font-display);
    font-size: 2.5rem;
    font-weight: 700;
    color: white;
    line-height: 1.1;
    margin-bottom: 16px;
    letter-spacing: -0.02em;
}

.hero-subtitle {
    font-size: 1.05rem;
    color: var(--slate-400);
    max-width: 500px;
}

.hero-actions {
    display: flex;
    gap: 12px;
    margin-top: 28px;
}

.hero-decoration {
    position: absolute;
    right: 60px;
    top: 50%;
    transform: translateY(-50%);
    width: 200px;
    height: 200px;
    opacity: 0.1;
    animation: rotateFloat 20s linear infinite;
}
```

### 2. Info Banner

```html
<div class="info-banner">
    <div class="info-banner-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
        </svg>
    </div>
    <div class="info-banner-content">
        <h2 class="info-banner-title">Banner Title</h2>
        <p class="info-banner-text">Descriptive text with <strong>highlighted terms</strong>.</p>
    </div>
</div>
```

```css
.info-banner {
    display: flex;
    align-items: flex-start;
    gap: 20px;
    background: linear-gradient(135deg,
        rgba(245, 158, 11, 0.08) 0%,
        rgba(139, 92, 246, 0.05) 50%,
        rgba(6, 182, 212, 0.05) 100%);
    border: 1px solid rgba(245, 158, 11, 0.2);
    border-radius: 20px;
    padding: 28px 32px;
    margin: 0 24px 32px 24px;
}

.info-banner-icon {
    width: 56px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, var(--amber-500), var(--amber-600));
    border-radius: 16px;
    flex-shrink: 0;
    box-shadow: 0 8px 24px rgba(245, 158, 11, 0.3);
}

.info-banner-icon svg {
    width: 28px;
    height: 28px;
    color: white;
}

.info-banner-title {
    font-family: var(--font-display);
    font-size: 1.35rem;
    font-weight: 600;
    color: white;
    margin-bottom: 8px;
}

.info-banner-text {
    color: var(--slate-400);
    font-size: 0.95rem;
    line-height: 1.7;
}

.info-banner-text strong {
    color: var(--amber-400);
}
```

### 3. Main Content Card

```html
<div class="sections-container">
    <div class="sections-card">
        <div class="sections-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
            </svg>
            <h2>Section Title</h2>
        </div>
        <!-- Content here -->
    </div>
</div>
```

```css
.sections-container {
    margin: 0 24px 48px 24px;
}

.sections-card {
    background: var(--slate-850);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 24px;
    padding: 40px 48px;
    box-shadow: var(--shadow-2xl), var(--shadow-glow);
    position: relative;
    overflow: hidden;
}

.sections-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg,
        var(--amber-500),
        var(--amber-400) 25%,
        var(--bronze-600) 50%,
        var(--info) 75%,
        var(--success) 100%);
}

.sections-title {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 32px;
}

.sections-title svg {
    width: 32px;
    height: 32px;
    color: var(--amber-500);
}

.sections-title h2 {
    font-family: var(--font-display);
    font-size: 1.75rem;
    font-weight: 600;
    color: white;
    margin: 0;
}
```

### 4. Buttons

```css
.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 14px 28px;
    font-family: var(--font-body);
    font-size: 0.9rem;
    font-weight: 600;
    border-radius: 12px;
    border: none;
    cursor: pointer;
    text-decoration: none;
    transition: all var(--transition-base);
    position: relative;
    overflow: hidden;
}

.btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
    transition: left 0.5s ease;
}

.btn:hover::before {
    left: 100%;
}

.btn:hover {
    transform: translateY(-2px);
}

/* Primary - Amber */
.btn-primary {
    background: linear-gradient(135deg, var(--amber-500), var(--amber-600));
    color: white;
    box-shadow: 0 4px 14px rgba(245, 158, 11, 0.3);
}

.btn-primary:hover {
    background: linear-gradient(135deg, var(--amber-400), var(--amber-500));
    box-shadow: 0 8px 24px rgba(245, 158, 11, 0.4);
}

/* Success - Green */
.btn-success {
    background: linear-gradient(135deg, var(--success), #059669);
    color: white;
    box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);
}

.btn-success:hover {
    background: linear-gradient(135deg, #34d399, var(--success));
    box-shadow: 0 8px 24px rgba(16, 185, 129, 0.4);
}

/* Warning - Amber/Gold */
.btn-warning {
    background: linear-gradient(135deg, var(--amber-500), var(--amber-600));
    color: white;
    box-shadow: 0 4px 14px rgba(245, 158, 11, 0.3);
}

.btn-warning:hover {
    background: linear-gradient(135deg, var(--amber-400), var(--amber-500));
    box-shadow: 0 8px 24px rgba(245, 158, 11, 0.4);
}

/* Action - Indigo/Purple */
.btn-action,
.btn-info {
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: white;
    box-shadow: 0 4px 14px rgba(139, 92, 246, 0.3);
}

.btn-action:hover,
.btn-info:hover {
    background: linear-gradient(135deg, #818cf8, #a78bfa);
    box-shadow: 0 8px 24px rgba(139, 92, 246, 0.4);
}

/* Danger - Red */
.btn-danger {
    background: linear-gradient(135deg, #dc2626, #b91c1c);
    color: white;
    box-shadow: 0 4px 14px rgba(220, 38, 38, 0.3);
}

.btn-danger:hover {
    background: linear-gradient(135deg, #ef4444, #dc2626);
    box-shadow: 0 8px 24px rgba(220, 38, 38, 0.4);
}

/* Outline */
.btn-outline {
    background: transparent;
    border: 2px solid rgba(255,255,255,0.2);
    color: white;
}

.btn-outline:hover {
    background: rgba(255,255,255,0.1);
    border-color: rgba(255,255,255,0.4);
}

/* Small button */
.btn-sm {
    padding: 10px 18px;
    font-size: 0.85rem;
    border-radius: 10px;
}
```

### 5. Modal Dialog

```html
<div id="modal" class="modal-overlay">
    <div class="modal-content">
        <div class="modal-header">
            <h2 id="modal-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Modal Title
            </h2>
            <button type="button" class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
            <div class="form-group">
                <label for="field_name">
                    <span class="label-icon">✦</span>
                    Field Label <span class="required-star">*</span>
                </label>
                <input type="text" id="field_name" name="field_name" placeholder="Placeholder text">
                <div class="help-text">Helpful description text.</div>
            </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
            <button type="submit" class="btn btn-success">Save</button>
        </div>
    </div>
</div>
```

```css
.modal-overlay {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(2, 6, 23, 0.85);
    backdrop-filter: blur(8px);
    z-index: 1000;
    justify-content: center;
    align-items: center;
}

.modal-overlay.active {
    display: flex;
}

.modal-content {
    background: var(--slate-850);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 24px;
    width: 90%;
    max-width: 540px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: var(--shadow-2xl), var(--shadow-glow);
}

.modal-content::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--amber-500), var(--amber-400));
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px 28px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    background: linear-gradient(135deg, var(--slate-900), var(--slate-850));
    border-radius: 24px 24px 0 0;
}

.modal-header h2 {
    font-family: var(--font-display);
    font-size: 1.35rem;
    font-weight: 600;
    color: white;
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 0;
}

.modal-header h2 svg {
    width: 24px;
    height: 24px;
    color: var(--amber-500);
}

.modal-close {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--slate-700);
    border: 1px solid var(--slate-600);
    border-radius: 12px;
    font-size: 1.5rem;
    color: var(--slate-400);
    cursor: pointer;
}

.modal-close:hover {
    background: var(--danger);
    border-color: var(--danger);
    color: white;
    transform: rotate(90deg);
}

.modal-body {
    padding: 28px;
}

.modal-body .form-group {
    margin-bottom: 22px;
}

.modal-body .form-group label {
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: var(--font-body);
    font-weight: 600;
    margin-bottom: 10px;
    color: var(--slate-300);
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.label-icon {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(245, 158, 11, 0.1);
    border-radius: 8px;
    font-size: 12px;
}

.modal-body input,
.modal-body select,
.modal-body textarea {
    width: 100%;
    padding: 14px 18px;
    background: var(--slate-900);
    border: 2px solid var(--slate-700);
    border-radius: 12px;
    color: white;
    font-size: 0.95rem;
    transition: all 0.2s ease;
}

.modal-body input:focus,
.modal-body select:focus,
.modal-body textarea:focus {
    outline: none;
    border-color: var(--amber-500);
    box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.1);
}

.help-text {
    font-size: 0.8rem;
    color: var(--slate-500);
    margin-top: 8px;
}

.required-star {
    color: var(--danger);
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 14px;
    padding: 20px 28px;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    background: var(--slate-900);
    border-radius: 0 0 24px 24px;
}
```

### 6. Content Cards (Sections/Items)

```html
<div class="section-card" data-id="1">
    <div class="section-card-header">
        <div class="section-card-header-main">
            <span class="section-order">1</span>
            <h3>Card Title</h3>
            <span class="badge badge-free">Free</span>
        </div>
        <div class="reorder-btns">
            <button class="reorder-btn" title="Move Up">▲</button>
            <button class="reorder-btn" title="Move Down">▼</button>
        </div>
    </div>
    <div class="section-card-body">
        <p class="section-desc">Description text with hover tooltip...</p>
        <div class="section-meta">
            <span>📚 5 Activities</span>
            <span>Access: Free</span>
        </div>
        <div class="section-actions">
            <button class="btn btn-sm btn-action">✏️ Edit</button>
            <button class="btn btn-sm btn-warning">📝 Activities</button>
            <button class="btn btn-sm btn-danger">🗑️ Delete</button>
        </div>
    </div>
</div>
```

```css
.section-card {
    background: var(--slate-850);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 16px;
    box-shadow: var(--shadow-md);
    transition: all var(--transition-base);
    animation: fadeSlideUp 0.5s ease-out both;
    position: relative;
}

.section-card::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: linear-gradient(180deg, var(--amber-500), var(--amber-600));
    opacity: 0;
    transition: opacity var(--transition-base);
    border-radius: 16px 0 0 16px;
}

.section-card:hover {
    box-shadow: var(--shadow-xl), var(--shadow-glow);
    border-color: rgba(245, 158, 11, 0.2);
    transform: translateY(-2px);
}

.section-card:hover::before {
    opacity: 1;
}

.section-order {
    background: linear-gradient(135deg, var(--amber-500), var(--amber-600));
    color: white;
    width: 36px;
    height: 36px;
    border-radius: 12px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 1rem;
    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
}

.section-card-header {
    background: linear-gradient(135deg, var(--slate-850), var(--slate-800));
    padding: 20px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 16px 16px 0 0;
}

.section-card-header h3 {
    font-family: var(--font-body);
    font-size: 1.1rem;
    font-weight: 600;
    color: white;
    margin: 0;
}

.section-card-body {
    padding: 20px 24px 24px 24px;
    background: var(--slate-850);
    border-radius: 0 0 16px 16px;
}

.section-card-body p.section-desc {
    color: var(--slate-400);
    font-size: 0.9rem;
    padding: 12px 16px;
    background: var(--slate-900);
    border-radius: 10px;
    border-left: 3px solid var(--amber-500);
}

.section-meta {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    margin: 16px 0;
}

.section-meta span {
    background: var(--slate-800);
    padding: 8px 14px;
    border-radius: 10px;
    border: 1px solid var(--slate-700);
    font-size: 0.85rem;
}

.section-actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

/* Reorder buttons */
.reorder-btns {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.reorder-btn {
    background: var(--slate-700);
    border: 1px solid var(--slate-600);
    padding: 8px 14px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.75rem;
    color: var(--slate-400);
}

.reorder-btn:hover:not(:disabled) {
    background: var(--amber-500);
    border-color: var(--amber-500);
    color: white;
}

.reorder-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}
```

### 7. Badges

```html
<span class="badge badge-draft">Draft</span>
<span class="badge badge-soon">Coming Soon</span>
<span class="badge badge-free">Free</span>
<span class="badge badge-paid">Paid</span>
```

```css
.badge {
    display: inline-flex;
    align-items: center;
    padding: 6px 14px;
    border-radius: 8px;
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.badge-draft {
    background: var(--slate-700);
    color: var(--slate-300);
    border: 1px solid var(--slate-600);
}

.badge-soon {
    background: rgba(251, 191, 36, 0.15);
    color: var(--amber-400);
    border: 1px solid rgba(251, 191, 36, 0.3);
}

.badge-free {
    background: var(--success-bg);
    color: var(--success);
    border: 1px solid var(--success-border);
}

.badge-paid {
    background: rgba(139, 92, 246, 0.15);
    color: var(--bronze-500);
    border: 1px solid rgba(139, 92, 246, 0.3);
}
```

### 8. Empty State

```html
<div class="empty-state">
    <div class="empty-state-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
        </svg>
    </div>
    <h3>No Items Yet</h3>
    <p>Start by adding your first item.</p>
    <button class="btn btn-success">+ Add First Item</button>
</div>
```

```css
.empty-state {
    text-align: center;
    padding: 60px 48px;
    background: var(--slate-850);
    border: 2px dashed rgba(245, 158, 11, 0.2);
    border-radius: 20px;
}

.empty-state-icon {
    width: 80px;
    height: 80px;
    margin: 0 auto 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(245, 158, 11, 0.08));
    border-radius: 50%;
}

.empty-state-icon svg {
    width: 40px;
    height: 40px;
    color: var(--amber-500);
}

.empty-state h3 {
    font-family: var(--font-display);
    color: white;
    margin-bottom: 12px;
    font-size: 1.5rem;
}

.empty-state p {
    color: var(--slate-400);
    margin-bottom: 28px;
}
```

### 9. Form Messages

```css
.msg-error {
    background: var(--danger-bg);
    border: 1px solid var(--danger-border);
    color: var(--danger);
    padding: 14px 18px;
    border-radius: 12px;
    font-weight: 500;
}

.msg-success {
    background: var(--success-bg);
    border: 1px solid var(--success-border);
    color: var(--success);
    padding: 14px 18px;
    border-radius: 12px;
    font-weight: 500;
}

.msg-info {
    background: var(--info-bg);
    border: 1px solid var(--info-border);
    color: var(--info);
    padding: 14px 18px;
    border-radius: 12px;
    font-weight: 500;
}
```

### 10. Loading Spinner

```html
<span class="spinner"></span> Loading...
```

```css
.spinner {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255,255,255,0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 0.8s linear infinite;
}

.loading-indicator {
    display: flex;
    align-items: center;
    gap: 10px;
}
```

## Responsive Breakpoints

```css
@media (max-width: 900px) {
    .hero-section {
        padding: 48px 32px;
        margin: 16px;
    }
    .hero-title {
        font-size: 2rem;
    }
    .hero-decoration {
        display: none;
    }
    .sections-card {
        padding: 32px 24px;
        margin: 0 16px 32px 16px;
    }
}

@media (max-width: 500px) {
    .hero-title {
        font-size: 1.6rem;
    }
    .info-banner {
        flex-direction: column;
        padding: 24px;
    }
}
```

## Quick Reference

| Element | Class | Purpose |
|---------|-------|---------|
| Hero section | `.hero-section` | Page header with decoration |
| Eyebrow label | `.hero-eyebrow` | Small uppercase label |
| Info banner | `.info-banner` | Instructional callout |
| Content card | `.sections-card` | Main content container |
| Section card | `.section-card` | List item card |
| Modal | `.modal-overlay`, `.modal-content` | Popup dialog |
| Primary button | `.btn-primary` | Main action (amber) |
| Success button | `.btn-success` | Positive action (green) |
| Warning button | `.btn-warning` | Secondary action (amber) |
| Action button | `.btn-action` | Info/action (purple) |
| Danger button | `.btn-danger` | Destructive action (red) |
| Badge | `.badge-*` | Status indicator |
| Spinner | `.spinner` | Loading indicator |

## Application Checklist

When applying this design system:

- [ ] Add Google Fonts to `<head>`
- [ ] Add CSS variables to `:root`
- [ ] Add animations to CSS
- [ ] Apply hero-section to page headers
- [ ] Use info-banner for instructional content
- [ ] Wrap main content in sections-card
- [ ] Use btn-* classes consistently
- [ ] Apply section-card for list items
- [ ] Use badge-* for status
- [ ] Test responsive breakpoints
- [ ] Preserve all original PHP/JS functionality
