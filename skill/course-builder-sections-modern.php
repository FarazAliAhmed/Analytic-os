<?php
/**
 * Course Builder - Section Management
 *
 * Main Course Builder page for managing sections and activities
 * within a dynamic course (course_type=2).
 *
 * Features:
 * - Display course title, description, and existing sections
 * - Add/Edit/Delete sections with title, description, intro video
 * - Section access control (draft/soon/free/paid)
 * - Reorder sections via up/down buttons
 * - Preview course button
 *
 * @package Course Builder
 * @version 2.0 - Modern UI Redesign (Luxury Editorial Design)
 */
session_start();
require_once('../../../Connections/conn_mysqli.php');
require 'admin_auth_inc.php';
$language = 'eng';
require_once ('../../includes/wrapper_lang_inc_msi.php');

// Generate CSRF token
$token = md5(uniqid(rand(), true));
$_SESSION['token'] = $token;

// Get course ID and language from URL
$courseId = isset($_GET['course_id']) ? trim($_GET['course_id']) : '';
$langId = isset($_GET['lang_id']) ? trim($_GET['lang_id']) : '';

// Validate course ID
if (empty($courseId)) {
    header('Location: course_create.php');
    exit;
}

// Sanitize inputs
$courseId = preg_replace('/[^a-zA-Z0-9_-]/', '', $courseId);
$langId = preg_replace('/[^a-zA-Z]/', '', $langId);

// Fetch course details
$courseQuery = "SELECT course_id, lang_id, course_name, cert, cover_image, access_type, course_type
                FROM courses WHERE course_id = ? AND lang_id = ? LIMIT 1";
$stmt = mysqli_prepare($conn_mysqli, $courseQuery);
mysqli_stmt_bind_param($stmt, 'ss', $courseId, $langId);
mysqli_stmt_execute($stmt);
$courseResult = mysqli_stmt_get_result($stmt);

if (mysqli_num_rows($courseResult) === 0) {
    // Course not found
    header('Location: course_create.php?error=course_not_found');
    exit;
}

$course = mysqli_fetch_assoc($courseResult);
mysqli_stmt_close($stmt);

// Verify this is a dynamic course (course_type=2)
if ($course['course_type'] != 2) {
    header('Location: course_create.php?error=not_dynamic_course');
    exit;
}

// Fetch existing sections for this course
$sectionsQuery = "SELECT section_id, section_order, title, description, video_url, video_file, access_type, status
                  FROM course_sections
                  WHERE course_id = ?
                  ORDER BY section_order ASC";
$stmt = mysqli_prepare($conn_mysqli, $sectionsQuery);
mysqli_stmt_bind_param($stmt, 's', $courseId);
mysqli_stmt_execute($stmt);
$sectionsResult = mysqli_stmt_get_result($stmt);

$sections = [];
while ($row = mysqli_fetch_assoc($sectionsResult)) {
    // Count activities in this section
    $activityCountQuery = "SELECT COUNT(*) as count FROM section_activities WHERE section_id = ?";
    $actStmt = mysqli_prepare($conn_mysqli, $activityCountQuery);
    mysqli_stmt_bind_param($actStmt, 'i', $row['section_id']);
    mysqli_stmt_execute($actStmt);
    $actResult = mysqli_stmt_get_result($actStmt);
    $actCount = mysqli_fetch_assoc($actResult)['count'];
    mysqli_stmt_close($actStmt);

    $row['activity_count'] = $actCount;
    $sections[] = $row;
}
mysqli_stmt_close($stmt);

// Section access type options
$sectionAccessTypes = [
    'draft' => 'Draft - Hidden from students',
    'soon' => 'Coming Soon - Visible but locked',
    'free' => 'Free - Available to all',
    'paid' => 'Paid - Only for purchasers'
];
?>
<!DOCTYPE HTML>
<html lang="en">
<head>
<meta http-equiv="X-UA-Compatible" content="IE=Edge">
<meta name="viewport" content="width=device-width">
<title>WEI LMS Administration - Course Builder</title>
<link href="p7dmm/p7DMM03.css" rel="stylesheet" type="text/css" media="all">
<script type="text/javascript" src="../../p7ehc/p7EHCscripts.js"></script>
<link href="../../p7affinity/p7affinity-3.css" rel="stylesheet" type="text/css" media="all">
<script type="text/javascript" src="p7dmm/p7DMMscripts.js"></script>
<script type="text/javascript" src="https://www.weicourses.com/scripts/mm_functions.js"></script>
<script type="text/javascript" src="https://www.weicourses.com/scripts/jquery-1.7.2.min.js"></script>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Cormorant+Garamond:wght@500;600;700&display=swap" rel="stylesheet">

<style>
/* ═══════════════════════════════════════════════════════════════════════════════════
   LUXURY EDITORIAL DESIGN SYSTEM
   Aesthetic: Sophisticated Dark Theme with Amber/Gold Accents
   ═══════════════════════════════════════════════════════════════════════════════════ */

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

    /* Accent - Deep Bronze */
    --bronze-500: #a78bfa;
    --bronze-600: #8b5cf6;

    /* Neutral - Deep Slate */
    --slate-50: #f8fafc;
    --slate-100: #f1f5f9;
    --slate-200: #e2e8f0;
    --slate-300: #cbd5e1;
    --slate-350: #bfc7d5;
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
    --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
    --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
    --shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);
    --shadow-glow: 0 0 40px rgba(245, 158, 11, 0.15);

    /* Transitions */
    --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
    --transition-base: 250ms cubic-bezier(0.4, 0, 0.2, 1);
    --transition-slow: 350ms cubic-bezier(0.4, 0, 0.2, 1);
}

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

html {
    font-size: 16px;
}

body {
    font-family: var(--font-body);
    background: linear-gradient(135deg, var(--slate-950) 0%, var(--slate-900) 50%, var(--slate-850) 100%);
    color: var(--slate-200);
    min-height: 100vh;
    line-height: 1.6;
}

/* ═══════════════════════════════════════════════════════════════════════════════════
   HERO SECTION - Grand Course Header
   ═══════════════════════════════════════════════════════════════════════════════════ */

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

.hero-section::after {
    content: '';
    position: absolute;
    bottom: -30%;
    left: -20%;
    width: 60%;
    height: 100%;
    background: radial-gradient(ellipse at center, rgba(139, 92, 246, 0.05) 0%, transparent 60%);
}

@keyframes heroShimmer {
    0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.5; }
    50% { transform: translateY(20px) rotate(2deg); opacity: 1; }
}

.hero-content {
    position: relative;
    z-index: 1;
    max-width: 700px;
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
    margin-bottom: 20px;
    animation: fadeSlideDown 0.6s ease-out;
}

.hero-eyebrow svg {
    width: 14px;
    height: 14px;
}

.hero-title {
    font-family: var(--font-display);
    font-size: 2.5rem;
    font-weight: 700;
    color: white;
    line-height: 1.1;
    margin-bottom: 16px;
    letter-spacing: -0.02em;
    animation: fadeSlideUp 0.6s ease-out 0.1s both;
}

.hero-subtitle {
    font-size: 1.05rem;
    color: var(--slate-400);
    max-width: 500px;
    animation: fadeSlideUp 0.6s ease-out 0.2s both;
}

.hero-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-top: 20px;
    animation: fadeSlideUp 0.6s ease-out 0.25s both;
}

.hero-meta-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    font-size: 0.9rem;
}

.hero-meta-item strong {
    color: var(--slate-300);
    font-weight: 600;
}

.hero-actions {
    display: flex;
    gap: 12px;
    margin-top: 28px;
    animation: fadeSlideUp 0.6s ease-out 0.3s both;
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

.hero-decoration svg {
    width: 100%;
    height: 100%;
    color: var(--amber-500);
}

@keyframes rotateFloat {
    from { transform: translateY(-50%) rotate(0deg); }
    to { transform: translateY(-50%) rotate(360deg); }
}

@keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeSlideDown {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
}

/* ═══════════════════════════════════════════════════════════════════════════════════
   INFO BANNER - Elegant Callout
   ═══════════════════════════════════════════════════════════════════════════════════ */

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
    position: relative;
    overflow: hidden;
}

.info-banner::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(245, 158, 11, 0.5), transparent);
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

.info-banner-content {
    flex: 1;
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
    margin-bottom: 12px;
}

.info-banner-text:last-child {
    margin-bottom: 0;
}

.info-banner-text strong {
    color: var(--amber-400);
}

/* ═══════════════════════════════════════════════════════════════════════════════════
   SECTIONS CONTAINER - Central Focus
   ═══════════════════════════════════════════════════════════════════════════════════ */

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
    letter-spacing: -0.01em;
}

/* ═══════════════════════════════════════════════════════════════════════════════════
   SECTION CARDS - Elegant Cards
   ═══════════════════════════════════════════════════════════════════════════════════ */

.section-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.section-card {
    background: var(--slate-850);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 16px;
    box-shadow: var(--shadow-md);
    transition: all var(--transition-base);
    animation: fadeSlideUp 0.5s ease-out both;
    overflow: visible;
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

.section-card:nth-child(1) { animation-delay: 0.1s; }
.section-card:nth-child(2) { animation-delay: 0.15s; }
.section-card:nth-child(3) { animation-delay: 0.2s; }
.section-card:nth-child(4) { animation-delay: 0.25s; }
.section-card:nth-child(5) { animation-delay: 0.3s; }

.section-card-header {
    background: linear-gradient(135deg, var(--slate-850), var(--slate-800));
    padding: 20px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 16px 16px 0 0;
}

.section-card-header-main {
    display: flex;
    align-items: center;
    gap: 16px;
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
    flex-shrink: 0;
    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
}

.section-card-header h3 {
    margin: 0;
    font-family: var(--font-body);
    font-size: 1.1rem;
    font-weight: 600;
    color: white;
    display: flex;
    align-items: center;
    gap: 12px;
}

.section-card-body {
    padding: 20px 24px 24px 24px;
    background: var(--slate-850);
    border-radius: 0 0 16px 16px;
}

.section-description-wrapper {
    position: relative;
    margin-bottom: 16px;
}

.section-card-body p.section-desc {
    font-family: var(--font-body);
    color: var(--slate-400);
    font-size: 0.9rem;
    line-height: 1.6;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
    padding: 12px 16px;
    background: var(--slate-900);
    border-radius: 10px;
    border-left: 3px solid var(--amber-500);
    transition: all var(--transition-base);
}

.section-card-body p.section-desc:hover {
    background: rgba(245, 158, 11, 0.05);
}

.section-description-wrapper .tooltip-popup {
    display: none;
    position: absolute;
    bottom: 100%;
    left: 0;
    right: 0;
    background: var(--slate-800);
    color: white;
    padding: 16px 20px;
    border-radius: 12px;
    font-family: var(--font-body);
    font-size: 0.9rem;
    line-height: 1.6;
    z-index: 9999;
    box-shadow: 0 -4px 30px rgba(0,0,0,0.4);
    margin-bottom: 10px;
    max-width: 100%;
    word-wrap: break-word;
    white-space: normal;
}

.section-description-wrapper .tooltip-popup::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 28px;
    border: 10px solid transparent;
    border-top-color: var(--slate-800);
}

.section-description-wrapper:hover .tooltip-popup {
    display: block;
}

.section-meta {
    font-family: var(--font-body);
    font-size: 0.85rem;
    color: var(--slate-500);
    margin-bottom: 16px;
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
}

.section-meta span {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: var(--slate-800);
    padding: 8px 14px;
    border-radius: 10px;
    border: 1px solid var(--slate-700);
}

.section-actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

/* Reorder Controls */
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
    transition: all 0.2s ease;
}

.reorder-btn:hover:not(:disabled) {
    background: var(--amber-500);
    border-color: var(--amber-500);
    color: white;
    transform: scale(1.05);
}

.reorder-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}

/* ═══════════════════════════════════════════════════════════════════════════════════
   BADGES - Status Indicators
   ═══════════════════════════════════════════════════════════════════════════════════ */

.badge {
    display: inline-flex;
    align-items: center;
    padding: 6px 14px;
    border-radius: 8px;
    font-family: var(--font-body);
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

/* ═══════════════════════════════════════════════════════════════════════════════════
   EMPTY STATE
   ═══════════════════════════════════════════════════════════════════════════════════ */

.empty-state {
    text-align: center;
    padding: 60px 48px;
    background: var(--slate-850);
    border: 2px dashed rgba(245, 158, 11, 0.2);
    border-radius: 20px;
    animation: fadeSlideUp 0.5s ease-out;
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
    font-weight: 600;
}

.empty-state p {
    font-family: var(--font-body);
    color: var(--slate-400);
    margin-bottom: 28px;
    font-size: 1rem;
}

/* ═══════════════════════════════════════════════════════════════════════════════════
   BUTTONS - Bold & Tactile
   ═══════════════════════════════════════════════════════════════════════════════════ */

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
    text-decoration: none;
    color: white !important;
}

.btn:active {
    transform: translateY(0);
}

.btn-primary {
    background: linear-gradient(135deg, var(--amber-500), var(--amber-600));
    color: white;
    box-shadow: 0 4px 14px rgba(245, 158, 11, 0.3);
}

.btn-primary:hover {
    background: linear-gradient(135deg, var(--amber-400), var(--amber-500));
    box-shadow: 0 8px 24px rgba(245, 158, 11, 0.4);
    color: white !important;
}

.btn-success {
    background: linear-gradient(135deg, var(--success), #059669);
    color: white;
    box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);
}

.btn-success:hover {
    background: linear-gradient(135deg, #34d399, var(--success));
    box-shadow: 0 8px 24px rgba(16, 185, 129, 0.4);
    color: white !important;
}

.btn-warning {
    background: linear-gradient(135deg, var(--amber-500), var(--amber-600));
    color: white;
    box-shadow: 0 4px 14px rgba(245, 158, 11, 0.3);
}

.btn-warning:hover {
    background: linear-gradient(135deg, var(--amber-400), var(--amber-500));
    box-shadow: 0 8px 24px rgba(245, 158, 11, 0.4);
    color: white !important;
}

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
    color: white !important;
}

.btn-danger {
    background: linear-gradient(135deg, #dc2626, #b91c1c);
    color: white;
    box-shadow: 0 4px 14px rgba(220, 38, 38, 0.3);
}

.btn-danger:hover {
    background: linear-gradient(135deg, #ef4444, #dc2626);
    box-shadow: 0 8px 24px rgba(220, 38, 38, 0.4);
    color: white !important;
}

.btn-secondary {
    background: var(--slate-700);
    color: var(--slate-200);
    border: 1px solid var(--slate-600);
}

.btn-secondary:hover {
    background: var(--slate-600);
    color: white;
    box-shadow: 0 8px 24px rgba(71, 85, 105, 0.35);
    text-decoration: none;
}

.btn-sm {
    padding: 10px 18px;
    font-size: 0.85rem;
    border-radius: 10px;
}

.btn-outline {
    background: transparent;
    border: 2px solid rgba(255,255,255,0.2);
    color: white !important;
    box-shadow: none;
}

.btn-outline:hover {
    background: rgba(255,255,255,0.1);
    border-color: rgba(255,255,255,0.4);
    box-shadow: 0 4px 20px rgba(255,255,255,0.15);
    color: white !important;
}

/* ═══════════════════════════════════════════════════════════════════════════════════
   MODAL - Elegant Popup
   ═══════════════════════════════════════════════════════════════════════════════════ */

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
    animation: fadeIn 0.2s ease-out;
}

.modal-overlay.active {
    display: flex;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
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
    animation: modalSlideUp 0.3s ease-out;
}

.modal-content::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--amber-500), var(--amber-400));
    border-radius: 24px 24px 0 0;
}

@keyframes modalSlideUp {
    from { opacity: 0; transform: translateY(30px) scale(0.95); }
    to { opacity: 1; transform: translateY(0) scale(1); }
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
    margin: 0;
    font-family: var(--font-display);
    font-size: 1.35rem;
    font-weight: 600;
    color: white;
    display: flex;
    align-items: center;
    gap: 12px;
}

.modal-header h2 svg {
    width: 24px;
    height: 24px;
    color: var(--amber-500);
}

.modal-header h2::after {
    display: none;
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
    transition: all 0.2s ease;
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

.modal-body .form-group label .label-icon {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(245, 158, 11, 0.1);
    border-radius: 8px;
    font-size: 12px;
}

.modal-body input[type="text"],
.modal-body input[type="file"],
.modal-body select,
.modal-body textarea {
    width: 100%;
    padding: 14px 18px;
    background: var(--slate-900);
    border: 2px solid var(--slate-700);
    border-radius: 12px;
    font-family: var(--font-body);
    font-size: 0.95rem;
    color: white;
    transition: all 0.2s ease;
}

.modal-body input[type="text"]:focus,
.modal-body select:focus,
.modal-body textarea:focus {
    outline: none;
    border-color: var(--amber-500);
    box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.1);
}

.modal-body textarea {
    min-height: 120px;
    resize: vertical;
}

.modal-body select {
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 16px center;
    padding-right: 48px;
}

.modal-body .help-text {
    font-family: var(--font-body);
    font-size: 0.8rem;
    color: var(--slate-500);
    margin-top: 8px;
    line-height: 1.5;
}

.modal-body .video-type-toggle {
    display: flex;
    gap: 20px;
    margin-bottom: 16px;
}

.modal-body .video-type-toggle label {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: normal !important;
    font-size: 0.9rem !important;
    text-transform: none !important;
    letter-spacing: 0 !important;
    cursor: pointer;
    padding: 12px 16px;
    background: var(--slate-800);
    border: 2px solid var(--slate-700);
    border-radius: 10px;
    transition: all 0.2s ease;
}

.modal-body .video-type-toggle input[type="radio"] {
    width: 18px;
    height: 18px;
    accent-color: var(--amber-500);
}

.modal-body .video-type-toggle label:hover {
    border-color: var(--slate-600);
}

.modal-body .video-type-toggle input[type="radio"]:checked + label {
    background: rgba(245, 158, 11, 0.1);
    border-color: var(--amber-500);
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

/* Messages */
.msg-error,
.msg-success,
.msg-info {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 18px;
    border-radius: 12px;
    font-weight: 500;
    font-size: 0.9rem;
    margin-top: 16px;
}

.msg-error {
    background: var(--danger-bg);
    border: 1px solid var(--danger-border);
    color: var(--danger);
}

.msg-success {
    background: var(--success-bg);
    border: 1px solid var(--success-border);
    color: var(--success);
}

.msg-info {
    background: var(--info-bg);
    border: 1px solid var(--info-border);
    color: var(--info);
}

#section_msg {
    margin-top: 16px;
}

/* Loading Spinner */
.spinner {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255,255,255,0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 0.8s linear infinite;
    vertical-align: middle;
    margin-right: 8px;
}

.loading-indicator {
    display: flex;
    align-items: center;
    gap: 10px;
}

.loading-indicator .spinner {
    border-color: rgba(6, 182, 212, 0.3);
    border-top-color: var(--info);
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

/* Override affinity-row margins */
.affinity-row {
    margin: 0 !important;
    padding: 0 !important;
}

.column-content {
    padding: 0 !important;
}

#layout, #masthead, #banner {
    display: block !important;
}

/* Required field indicator */
.required-star {
    color: var(--danger);
}

/* ═══════════════════════════════════════════════════════════════════════════════════
   RESPONSIVE DESIGN
   ═══════════════════════════════════════════════════════════════════════════════════ */

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

    .hero-actions {
        flex-direction: column;
    }

    .sections-card {
        padding: 32px 24px;
        margin: 0 16px 32px 16px;
    }

    .section-card-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
    }

    .reorder-btns {
        flex-direction: row;
        position: absolute;
        top: 20px;
        right: 20px;
    }

    .section-card {
        padding-top: 12px;
    }

    .section-actions {
        flex-direction: column;
    }

    .section-actions .btn {
        width: 100%;
        justify-content: center;
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

    .info-banner-icon {
        width: 48px;
        height: 48px;
    }

    .info-banner-icon svg {
        width: 24px;
        height: 24px;
    }
}
</style>

<script>
var courseId = '<?php echo htmlspecialchars($courseId); ?>';
var langId = '<?php echo htmlspecialchars($langId); ?>';
var csrfToken = '<?php echo $token; ?>';

$(document).ready(function() {
    // Add Section button
    $('#btn-add-section').on('click', function() {
        openSectionModal();
    });

    // Close modal
    $('.modal-close, .modal-overlay').on('click', function(e) {
        if (e.target === this) {
            closeSectionModal();
        }
    });

    // Prevent modal content click from closing
    $('.modal-content').on('click', function(e) {
        e.stopPropagation();
    });

    // Section form submission
    $('#sectionForm').on('submit', function(e) {
        e.preventDefault();
        saveSection();
    });

    // Video type toggle
    $('input[name="video_type"]').on('change', function() {
        toggleVideoInput();
    });
});

function openSectionModal(sectionId) {
    // Reset form
    $('#sectionForm')[0].reset();
    $('#section_id').val('');
    $('#section_msg').html('');
    $('#video_url_group').show();
    $('#video_file_group').hide();
    $('input[name="video_type"][value="url"]').prop('checked', true);

    if (sectionId) {
        // Edit mode - load section data
        $('#modal-title').html('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> Edit Section');
        loadSectionData(sectionId);
    } else {
        // Add mode
        $('#modal-title').html('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Add New Section');
    }

    $('#sectionModal').addClass('active');
}

function closeSectionModal() {
    $('#sectionModal').removeClass('active');
}

function toggleVideoInput() {
    var videoType = $('input[name="video_type"]:checked').val();
    if (videoType === 'url') {
        $('#video_url_group').show();
        $('#video_file_group').hide();
    } else {
        $('#video_url_group').hide();
        $('#video_file_group').show();
    }
}

function loadSectionData(sectionId) {
    $.ajax({
        url: 'code/section_get_ajax.php',
        type: 'POST',
        data: {
            token: csrfToken,
            section_id: sectionId
        },
        dataType: 'json',
        success: function(response) {
            if (response.success) {
                var section = response.section;
                $('#section_id').val(section.section_id);
                $('#section_title').val(section.title);
                $('#section_description').val(section.description || '');
                $('#section_access_type').val(section.access_type);

                if (section.video_url) {
                    $('input[name="video_type"][value="url"]').prop('checked', true);
                    $('#section_video_url').val(section.video_url);
                    toggleVideoInput();
                } else if (section.video_file) {
                    $('input[name="video_type"][value="file"]').prop('checked', true);
                    toggleVideoInput();
                    // Show existing file info
                    $('#video_file_group').append('<p class="help-text">Current: ' + escapeHtml(section.video_file) + '</p>');
                }
            } else {
                showSectionMessage('error', response.message);
            }
        },
        error: function() {
            showSectionMessage('error', 'Failed to load section data.');
        }
    });
}

function saveSection() {
    var sectionId = $('#section_id').val();
    var title = $('#section_title').val().trim();

    if (!title) {
        showSectionMessage('error', '⚠️ Section title is required.');
        $('#section_title').focus();
        return;
    }

    if (title.length < 2) {
        showSectionMessage('error', '⚠️ Section title must be at least 2 characters.');
        $('#section_title').focus();
        return;
    }

    var formData = new FormData($('#sectionForm')[0]);
    formData.append('token', csrfToken);
    formData.append('course_id', courseId);

    var url = sectionId ? 'code/section_update_ajax.php' : 'code/section_add_ajax.php';

    $('#btn-save-section').prop('disabled', true).html('<span class="spinner"></span> Saving...');
    showSectionMessage('info', '<div class="loading-indicator"><span class="spinner"></span> Saving section...</div>');

    $.ajax({
        url: url,
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        dataType: 'json',
        success: function(response) {
            if (response.success) {
                showSectionMessage('success', '✅ ' + response.message);
                setTimeout(function() {
                    location.reload();
                }, 1000);
            } else {
                showSectionMessage('error', '❌ ' + response.message);
                $('#btn-save-section').prop('disabled', false).html('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Save Section');
            }
        },
        error: function(xhr, status, error) {
            var errorMsg = 'Request failed. ';
            if (xhr.status === 413) {
                errorMsg += 'File too large. Please reduce the file size.';
            } else if (xhr.status === 0) {
                errorMsg += 'Network error. Please check your connection.';
            } else {
                errorMsg += error || 'Please try again.';
            }
            showSectionMessage('error', '❌ ' + errorMsg);
            $('#btn-save-section').prop('disabled', false).html('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Save Section');
        }
    });
}

function editSection(sectionId) {
    openSectionModal(sectionId);
}

function deleteSection(sectionId, title) {
    if (!confirm('⚠️ Delete Section\n\nAre you sure you want to delete "' + title + '"?\n\nThis will permanently delete all activities within this section.\n\nThis action cannot be undone.')) {
        return;
    }

    // Show loading state on the section card
    var $card = $('.section-card[data-section-id="' + sectionId + '"]');
    $card.css('opacity', '0.5').find('.btn').prop('disabled', true);

    $.ajax({
        url: 'code/section_delete_ajax.php',
        type: 'POST',
        data: {
            token: csrfToken,
            section_id: sectionId,
            course_id: courseId
        },
        dataType: 'json',
        success: function(response) {
            if (response.success) {
                // Animate removal
                $card.slideUp(300, function() {
                    location.reload();
                });
            } else {
                $card.css('opacity', '1').find('.btn').prop('disabled', false);
                alert('❌ Error: ' + response.message);
            }
        },
        error: function(xhr, status, error) {
            $card.css('opacity', '1').find('.btn').prop('disabled', false);
            alert('❌ Request failed: ' + (error || 'Network error. Please check your connection and try again.'));
        }
    });
}

function moveSection(sectionId, direction) {
    // Show loading state
    var $card = $('.section-card[data-section-id="' + sectionId + '"]');
    $card.find('.reorder-btn').prop('disabled', true);

    $.ajax({
        url: 'code/section_reorder_ajax.php',
        type: 'POST',
        data: {
            token: csrfToken,
            section_id: sectionId,
            course_id: courseId,
            direction: direction
        },
        dataType: 'json',
        success: function(response) {
            if (response.success) {
                location.reload();
            } else {
                $card.find('.reorder-btn').prop('disabled', false);
                alert('❌ Error: ' + response.message);
            }
        },
        error: function(xhr, status, error) {
            $card.find('.reorder-btn').prop('disabled', false);
            alert('❌ Request failed: ' + (error || 'Network error. Please check your connection and try again.'));
        }
    });
}

function showSectionMessage(type, message) {
    var className = 'msg-' + type;
    $('#section_msg').html('<span class="' + className + '">' + message + '</span>');
}

function escapeHtml(text) {
    if (!text) return '';
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
}
</script>
</head>

<body>
<div id="accessibility">
    <div class="floatleft"><?php include ('../../includes/access_menu_lms_inc_msi.php'); ?></div>
    <div class="floatright"><a name="skiptonav"></a><?php include ('../admin_includes/top_menu_lms_admin_inc.php'); ?></div>
</div>
<div id="layout">
    <div id="masthead"><a name="skiptonav"></a>
        <?php include ('../admin_includes/lms_admin_menu_resp_inc.php'); ?>
    </div>
    <div id="banner">
        <img src="https://www.weicourses.com/logos/logo_wei.png" align="right" alt="Werdermann eLearning Inc. logo" height="120" class="scalable accented logo_image">
    </div>
    <a name="maincontent"></a>

    <!-- Hero Section -->
    <div class="hero-section">
        <div class="hero-content">
            <div class="hero-eyebrow">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                </svg>
                Course Builder
            </div>
            <h1 class="hero-title"><?php echo htmlspecialchars($course['course_name']); ?></h1>
            <p class="hero-subtitle">Build your learning path by organizing content into logical modules that guide students through the material.</p>
            <div class="hero-meta">
                <div class="hero-meta-item">
                    <strong>ID:</strong> <?php echo htmlspecialchars($course['course_id']); ?>
                </div>
                <div class="hero-meta-item">
                    <strong>Language:</strong> <?php echo htmlspecialchars($course['lang_id']); ?>
                </div>
                <div class="hero-meta-item">
                    <strong>Access:</strong> <?php echo htmlspecialchars($course['access_type']); ?>
                </div>
                <div class="hero-meta-item">
                    <strong>Sections:</strong> <?php echo count($sections); ?>
                </div>
            </div>
            <div class="hero-actions">
                <a href="course_create.php" class="btn btn-outline">← Back to Courses</a>
                <button type="button" id="btn-add-section" class="btn btn-success">+ Add Section</button>
                <?php if (count($sections) > 0): ?>
                <a href="../../courses/dynamic_course_player.php?course=<?php echo urlencode($courseId); ?>&lang=<?php echo urlencode($langId); ?>&preview=1"
                   class="btn btn-warning" target="_blank">👁️ Preview Course</a>
                <?php endif; ?>
            </div>
        </div>
        <div class="hero-decoration">
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
        </div>
    </div>

    <!-- Info Banner -->
    <div class="info-banner">
        <div class="info-banner-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="16" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
        </div>
        <div class="info-banner-content">
            <h2 class="info-banner-title">Structure Your Course Content</h2>
            <p class="info-banner-text">Organize your course into <strong>sections</strong> (modules). Each section can contain multiple <strong>activities</strong> such as videos, PDFs, SCORM packages, audio files, and HTML content.</p>
            <p class="info-banner-text"><strong>Workflow:</strong> Add Sections → Add Activities to Each Section → Publish</p>
        </div>
    </div>

    <!-- Sections Container -->
    <div class="sections-container">
        <div class="sections-card">
            <div class="sections-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
                <h2>Course Sections</h2>
            </div>

            <div class="section-list">
                <?php if (empty($sections)): ?>
                <div class="empty-state">
                    <div class="empty-state-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                        </svg>
                    </div>
                    <h3>No Sections Yet</h3>
                    <p>Start building your course by adding the first section.</p>
                    <button type="button" class="btn btn-success" onclick="openSectionModal()">+ Add First Section</button>
                </div>
                <?php else: ?>
                    <?php foreach ($sections as $index => $section): ?>
                    <div class="section-card" data-section-id="<?php echo $section['section_id']; ?>">
                        <div class="section-card-header">
                            <div class="section-card-header-main">
                                <span class="section-order"><?php echo $section['section_order']; ?></span>
                                <h3><?php echo htmlspecialchars($section['title']); ?></h3>
                                <span class="badge badge-<?php echo $section['access_type']; ?>"><?php echo $section['access_type']; ?></span>
                            </div>
                            <div class="reorder-btns">
                                <button type="button" class="reorder-btn" onclick="moveSection(<?php echo $section['section_id']; ?>, 'up')"
                                        <?php echo $index === 0 ? 'disabled' : ''; ?> title="Move Up">▲</button>
                                <button type="button" class="reorder-btn" onclick="moveSection(<?php echo $section['section_id']; ?>, 'down')"
                                        <?php echo $index === count($sections) - 1 ? 'disabled' : ''; ?> title="Move Down">▼</button>
                            </div>
                        </div>
                        <div class="section-card-body">
                            <?php if ($section['description']): ?>
                            <div class="section-description-wrapper">
                                <p class="section-desc"><?php echo htmlspecialchars($section['description']); ?></p>
                                <div class="tooltip-popup"><?php echo htmlspecialchars($section['description']); ?></div>
                            </div>
                            <?php endif; ?>
                            <div class="section-meta">
                                <span>📚 <?php echo $section['activity_count']; ?> Activities</span>
                                <?php
                                // Show access_type instead of status
                                $accessLabels = [
                                    'draft' => 'Draft',
                                    'soon' => 'Coming Soon',
                                    'free' => 'Free',
                                    'paid' => 'Paid'
                                ];
                                $accessLabel = $accessLabels[$section['access_type']] ?? 'Draft';
                                ?>
                                <span>Access: <?php echo $accessLabel; ?></span>
                            </div>
                            <div class="section-actions">
                                <button type="button" class="btn btn-sm btn-action" onclick="editSection(<?php echo $section['section_id']; ?>)">✏️ Edit</button>
                                <a href="course_builder_activities.php?course_id=<?php echo urlencode($courseId); ?>&lang_id=<?php echo urlencode($langId); ?>&section_id=<?php echo $section['section_id']; ?>"
                                   class="btn btn-sm btn-warning">📝 Activities</a>
                                <button type="button" class="btn btn-sm btn-danger" onclick="deleteSection(<?php echo $section['section_id']; ?>, '<?php echo htmlspecialchars(addslashes($section['title'])); ?>')">🗑️ Delete</button>
                            </div>
                        </div>
                    </div>
                    <?php endforeach; ?>
                <?php endif; ?>
            </div>
        </div>
    </div>

    <div id="footer"><?php include('../../includes/footer_lms_inc_msi.php'); ?></div>
</div>

<!-- Section Add/Edit Modal -->
<div id="sectionModal" class="modal-overlay">
    <div class="modal-content">
        <div class="modal-header">
            <h2 id="modal-title"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Add New Section</h2>
            <button type="button" class="modal-close">&times;</button>
        </div>
        <form id="sectionForm" enctype="multipart/form-data">
            <div class="modal-body">
                <input type="hidden" id="section_id" name="section_id" value="">

                <div class="form-group">
                    <label for="section_title">
                        <span class="label-icon">✦</span>
                        Section Title <span class="required-star">*</span>
                    </label>
                    <input type="text" id="section_title" name="section_title" required maxlength="255"
                           placeholder="e.g., Module 1: Introduction">
                </div>

                <div class="form-group">
                    <label for="section_description">
                        <span class="label-icon">◇</span>
                        Description
                    </label>
                    <textarea id="section_description" name="section_description" maxlength="2000"
                              placeholder="Brief description of this section..."></textarea>
                    <div class="help-text">Optional. Describe what students will learn in this section.</div>
                </div>

                <div class="form-group">
                    <label for="section_access_type">
                        <span class="label-icon">◎</span>
                        Access Type
                    </label>
                    <select id="section_access_type" name="section_access_type">
                        <?php foreach ($sectionAccessTypes as $value => $label): ?>
                        <option value="<?php echo htmlspecialchars($value); ?>"><?php echo htmlspecialchars($label); ?></option>
                        <?php endforeach; ?>
                    </select>
                    <div class="help-text">Controls who can access this section.</div>
                </div>

                <div class="form-group">
                    <label>
                        <span class="label-icon">◈</span>
                        Section Intro Video (Optional)
                    </label>
                    <div class="video-type-toggle">
                        <div>
                            <input type="radio" name="video_type" value="url" id="video_url_radio" checked>
                            <label for="video_url_radio">Video URL</label>
                        </div>
                        <div>
                            <input type="radio" name="video_type" value="file" id="video_file_radio">
                            <label for="video_file_radio">Upload File</label>
                        </div>
                    </div>

                    <div id="video_url_group">
                        <input type="text" id="section_video_url" name="section_video_url"
                               placeholder="https://www.youtube.com/watch?v=... or https://vimeo.com/...">
                        <div class="help-text">Paste a YouTube or Vimeo video URL.</div>
                    </div>

                    <div id="video_file_group" style="display: none;">
                        <input type="file" id="section_video_file" name="section_video_file" accept="video/mp4,video/webm,video/ogg">
                        <div class="help-text">Upload an MP4, WebM, or OGG video file (max 100MB).</div>
                    </div>
                </div>

                <div id="section_msg"></div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" onclick="closeSectionModal()">Cancel</button>
                <button type="submit" id="btn-save-section" class="btn btn-success"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Save Section</button>
            </div>
        </form>
    </div>
</div>

</body>
</html>