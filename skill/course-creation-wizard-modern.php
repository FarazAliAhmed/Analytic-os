<?php
/**
 * Course Creation Wizard - Modern Admin Page
 *
 * Allows administrators to create a new dynamic course (course_type=2)
 * with title, description, language, access type, and cover image.
 *
 * Part of the LearnWorlds-style Course Builder feature.
 *
 * @package Course Builder
 * @version 2.0 - Modern UI Redesign
 */
session_start();
require_once('../../../Connections/conn_mysqli.php');
require 'admin_auth_inc.php';
$language = 'eng';
require_once ('../../includes/wrapper_lang_inc_msi.php');

// Generate CSRF token
$token = md5(uniqid(rand(), true));
$_SESSION['token'] = $token;

// Get available languages from database
$langQuery = "SELECT DISTINCT `lang_id`, `lang_desc` FROM languages ORDER BY `lang_desc`";
$langResult = db_query($langQuery, $conn_mysqli, __LINE__);
$languages = [];
while ($row = mysqli_fetch_assoc($langResult)) {
    $languages[] = ['lang_id' => $row['lang_id'], 'lang_name' => $row['lang_desc']];
}
// Fallback if no languages found
if (empty($languages)) {
    $languages = [
        ['lang_id' => 'eng', 'lang_name' => 'English'],
        ['lang_id' => 'fre', 'lang_name' => 'French'],
        ['lang_id' => 'spa', 'lang_name' => 'Spanish']
    ];
}

// Access type options matching LearnWorlds
$accessTypes = [
    'draft' => 'Draft - Unpublished, only visible to admin',
    'free' => 'Free - Available to all registered users',
    'paid' => 'Paid - Only accessible to purchasers',
    'private' => 'Private - Only accessible to manually enrolled users',
    'coming_soon' => 'Coming Soon - Visible but not available for enrollment',
    'enrollment_closed' => 'Enrollment Closed - Displayed but not accepting new enrollments'
];
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta http-equiv="X-UA-Compatible" content="IE=Edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta charset="UTF-8">
<title>Create New Course - Course Builder</title>
<link href="p7dmm/p7DMM03.css" rel="stylesheet" type="text/css" media="all">
<script type="text/javascript" src="../../p7ehc/p7EHCscripts.js"></script>
<link href="../../p7affinity/p7affinity-3.css" rel="stylesheet" type="text/css" media="all">
<script type="text/javascript" src="p7dmm/p7DMMscripts.js"></script>
<script type="text/javascript" src="https://www.weicourses.com/scripts/mm_functions.js"></script>
<script type="text/javascript" src="https://www.weicourses.com/scripts/jquery-1.7.2.min.js"></script>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@500;600;700;800&family=Cormorant+Garamond:wght@500;600;700&display=swap" rel="stylesheet">

<script language="JavaScript" type="text/JavaScript">
$(document).ready(function() {
    // Cover image preview
    $('#cover_image').on('change', function() {
        var file = this.files[0];
        $('#image_preview').html('');

        if (!file) {
            return;
        }

        var validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (validTypes.indexOf(file.type) === -1) {
            showMessage('error', 'Please select a valid image file (JPEG, PNG, GIF, or WebP).');
            this.value = '';
            return;
        }

        var maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            showMessage('error', 'Image is too large. Maximum size is 5MB.');
            this.value = '';
            return;
        }

        var reader = new FileReader();
        reader.onload = function(e) {
            $('#image_preview').html(
                '<div class="preview-image-container"><img src="' + e.target.result + '" alt="Cover preview"></div>' +
                '<div class="preview-file-info"><span class="preview-file-name">' + escapeHtml(file.name) + '</span><span class="preview-file-size">' + formatFileSize(file.size) + '</span></div>'
            );
        };
        reader.readAsDataURL(file);
    });

    // Form submission via AJAX
    $("#courseCreateForm").on('submit', function(e) {
        e.preventDefault();

        var courseTitle = $('#course_title').val().trim();
        var langId = $('#lang_id').val();

        if (!courseTitle) {
            showMessage('error', 'Please enter a Course Title.');
            $('#course_title').focus();
            return false;
        }

        if (courseTitle.length < 3) {
            showMessage('error', 'Course Title must be at least 3 characters.');
            $('#course_title').focus();
            return false;
        }

        if (!langId) {
            showMessage('error', 'Please select a Language.');
            $('#lang_id').focus();
            return false;
        }

        $('#submit_create').prop('disabled', true).html('<span class="btn-loader"></span> Creating Course...');
        showMessage('info', '<div class="loading-indicator"><span class="loader"></span> Creating course...</div>');

        $.ajax({
            url: "code/course_create_ajax.php",
            type: "POST",
            data: new FormData(this),
            contentType: false,
            cache: false,
            processData: false,
            success: function(response) {
                try {
                    var data = (typeof response === 'string') ? JSON.parse(response) : response;
                    if (data.success) {
                        showMessage('success', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> ' + data.message);
                        if (data.redirect) {
                            setTimeout(function() {
                                window.location.href = data.redirect;
                            }, 1500);
                        }
                    } else {
                        showMessage('error', data.message);
                        $('#submit_create').prop('disabled', false).html('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Create Course');
                    }
                } catch (e) {
                    showMessage('error', 'Unexpected response from server. Please try again.');
                    $('#submit_create').prop('disabled', false).html('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Create Course');
                }
            },
            error: function(xhr, status, error) {
                var errorMsg = 'Request failed. ';
                if (xhr.status === 413) {
                    errorMsg += 'Cover image too large.';
                } else if (xhr.status === 0) {
                    errorMsg += 'Network error.';
                } else {
                    errorMsg += error || 'Please try again.';
                }
                showMessage('error', errorMsg);
                $('#submit_create').prop('disabled', false).html('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Create Course');
            }
        });
    });

    // Input animations
    $('.modern-input').on('focus', function() {
        $(this).closest('.form-group').addClass('focused');
    }).on('blur', function() {
        $(this).closest('.form-group').removeClass('focused');
    });
});

function formatFileSize(bytes) {
    if (bytes >= 1048576) return (bytes / 1048576).toFixed(2) + ' MB';
    if (bytes >= 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return bytes + ' bytes';
}

function showMessage(type, message) {
    var className = 'msg-' + type;
    $('#create_msg').html('<div class="' + className + '">' + message + '</div>');
}

function escapeHtml(text) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
}
</script>

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
    --danger: #f43f5e;
    --info: #06b6d4;

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
   HERO SECTION - Grand Entrance
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
    font-size: 3rem;
    font-weight: 700;
    color: white;
    line-height: 1.1;
    margin-bottom: 16px;
    letter-spacing: -0.02em;
    animation: fadeSlideUp 0.6s ease-out 0.1s both;
}

.hero-subtitle {
    font-size: 1.1rem;
    color: var(--slate-400);
    max-width: 500px;
    animation: fadeSlideUp 0.6s ease-out 0.2s both;
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
   FORM CARD - Central Focus
   ═══════════════════════════════════════════════════════════════════════════════════ */

.form-container {
    margin: 0 24px 48px 24px;
}

.form-card {
    background: var(--slate-850);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 24px;
    padding: 40px 48px;
    box-shadow: var(--shadow-2xl), var(--shadow-glow);
    position: relative;
    overflow: hidden;
}

.form-card::before {
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

.form-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 32px 40px;
}

.form-grid .full-width {
    grid-column: 1 / -1;
}

.form-group {
    position: relative;
}

.form-group label {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--slate-400);
    margin-bottom: 12px;
    transition: color var(--transition-fast);
}

.form-group.focused label {
    color: var(--amber-400);
}

.form-group label .label-icon {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(245, 158, 11, 0.1);
    border-radius: 8px;
    font-size: 14px;
}

.form-group input[type="text"],
.form-group select,
.form-group textarea {
    width: 100%;
    padding: 18px 20px;
    background: var(--slate-900);
    border: 2px solid var(--slate-700);
    border-radius: 14px;
    font-family: var(--font-body);
    font-size: 1rem;
    color: white;
    transition: all var(--transition-base);
}

.form-group input::placeholder,
.form-group textarea::placeholder {
    color: var(--slate-500);
}

.form-group input:hover,
.form-group select:hover,
.form-group textarea:hover {
    border-color: var(--slate-600);
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    outline: none;
    border-color: var(--amber-500);
    background: var(--slate-900);
    box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.1), 0 8px 24px rgba(0, 0, 0, 0.2);
}

.form-group textarea {
    min-height: 140px;
    resize: vertical;
    line-height: 1.6;
}

.form-group select {
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 16px center;
    padding-right: 48px;
}

.form-group select option {
    background: var(--slate-900);
    color: white;
    padding: 12px;
}

.form-group .help-text {
    margin-top: 10px;
    font-size: 0.8rem;
    color: var(--slate-500);
    line-height: 1.5;
}

.form-group input[type="file"] {
    width: 100%;
    padding: 16px 20px;
    background: var(--slate-900);
    border: 2px dashed var(--slate-600);
    border-radius: 14px;
    font-family: var(--font-body);
    font-size: 0.95rem;
    color: var(--slate-400);
    cursor: pointer;
    transition: all var(--transition-base);
}

.form-group input[type="file"]:hover {
    border-color: var(--amber-500);
    background: rgba(245, 158, 11, 0.05);
}

.form-group input[type="file"]::file-selector-button {
    display: none;
}

/* Image Preview */
#image_preview {
    margin-top: 20px;
}

.preview-image-container {
    width: 180px;
    height: 120px;
    border-radius: 12px;
    overflow: hidden;
    background: var(--slate-800);
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid var(--slate-700);
    margin-bottom: 12px;
}

.preview-image-container img {
    max-width: 100%;
    max-height: 100%;
    object-fit: cover;
}

.preview-file-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.preview-file-name {
    font-size: 0.9rem;
    color: var(--slate-300);
}

.preview-file-size {
    font-size: 0.8rem;
    color: var(--slate-500);
}

/* Checkbox Styling */
.checkbox-group {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 20px 24px;
    background: linear-gradient(135deg, rgba(245, 158, 11, 0.05), rgba(139, 92, 246, 0.05));
    border: 2px solid rgba(245, 158, 11, 0.2);
    border-radius: 14px;
    cursor: pointer;
    transition: all var(--transition-base);
}

.checkbox-group:hover {
    border-color: var(--amber-500);
    background: rgba(245, 158, 11, 0.1);
}

.checkbox-group input[type="checkbox"] {
    width: 22px;
    height: 22px;
    accent-color: var(--amber-500);
    cursor: pointer;
    flex-shrink: 0;
}

.checkbox-group label {
    font-size: 0.95rem;
    color: var(--slate-300);
    cursor: pointer;
    margin-bottom: 0 !important;
    text-transform: none !important;
    letter-spacing: 0 !important;
}

/* ═══════════════════════════════════════════════════════════════════════════════════
   FORM ACTIONS - Button Row
   ═══════════════════════════════════════════════════════════════════════════════════ */

.form-actions {
    display: flex;
    gap: 16px;
    margin-top: 44px;
    padding-top: 32px;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.btn {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 16px 32px;
    border-radius: 14px;
    font-family: var(--font-body);
    font-size: 0.95rem;
    font-weight: 600;
    text-decoration: none;
    border: none;
    cursor: pointer;
    transition: all var(--transition-base);
    position: relative;
    overflow: hidden;
}

.btn-primary {
    background: linear-gradient(135deg, var(--amber-500), var(--amber-600));
    color: white;
    box-shadow: 0 4px 16px rgba(245, 158, 11, 0.35);
}

.btn-primary::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.5s ease;
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(245, 158, 11, 0.45);
}

.btn-primary:hover::before {
    left: 100%;
}

.btn-primary:active {
    transform: translateY(0);
}

.btn-secondary {
    background: var(--slate-800);
    color: var(--slate-400);
    border: 2px solid var(--slate-700);
}

.btn-secondary:hover {
    background: var(--slate-700);
    color: var(--slate-200);
    border-color: var(--slate-600);
}

.btn svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
}

/* Loader */
.btn-loader,
.loader {
    width: 18px;
    height: 18px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    display: inline-block;
}

.loader {
    border-color: rgba(245, 158, 11, 0.3);
    border-top-color: var(--amber-500);
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

/* ═══════════════════════════════════════════════════════════════════════════════════
   MESSAGES
   ═══════════════════════════════════════════════════════════════════════════════════ */

#create_msg {
    margin-top: 24px;
}

.msg-error,
.msg-success,
.msg-info {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 20px;
    border-radius: 12px;
    font-weight: 500;
    font-size: 0.95rem;
}

.msg-error svg,
.msg-success svg,
.msg-info svg {
    width: 22px;
    height: 22px;
    flex-shrink: 0;
}

.msg-error {
    background: rgba(244, 63, 94, 0.1);
    border: 1px solid rgba(244, 63, 94, 0.3);
    color: var(--danger);
}

.msg-success {
    background: rgba(16, 185, 129, 0.1);
    border: 1px solid rgba(16, 185, 129, 0.3);
    color: var(--success);
}

.msg-success svg {
    color: var(--success);
}

.msg-info {
    background: rgba(245, 158, 11, 0.1);
    border: 1px solid rgba(245, 158, 11, 0.3);
    color: var(--amber-400);
}

.msg-info svg {
    color: var(--amber-400);
}

.loading-indicator {
    display: flex;
    align-items: center;
    gap: 10px;
}

/* ═══════════════════════════════════════════════════════════════════════════════════
   UTILITIES & OVERRIDES
   ═══════════════════════════════════════════════════════════════════════════════════ */

.affinity-row {
    margin: 0 !important;
    padding: 0 !important;
}

#layout, #masthead, #banner {
    display: block !important;
}

fieldset {
    border: none !important;
    padding: 0 !important;
    margin: 0 !important;
}

fieldset legend {
    display: none !important;
}

/* Required field indicator */
.required-star {
    color: var(--danger);
    margin-left: 4px;
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
        font-size: 2.2rem;
    }

    .hero-decoration {
        display: none;
    }

    .form-card {
        padding: 32px 24px;
        margin: 0 16px 32px 16px;
    }

    .form-grid {
        grid-template-columns: 1fr;
        gap: 24px;
    }

    .form-actions {
        flex-direction: column;
    }

    .btn {
        width: 100%;
        justify-content: center;
    }
}

@media (max-width: 500px) {
    .hero-title {
        font-size: 1.8rem;
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
        <div class="hero-eyebrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
            Course Builder
        </div>
        <h1 class="hero-title">Create New Course</h1>
        <p class="hero-subtitle">Build a dynamic learning experience with sections, activities, and interactive content.</p>
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
            <h2 class="info-banner-title">Build Your Learning Path</h2>
            <p class="info-banner-text">After creating the course, you'll be redirected to add <strong>sections</strong> and <strong>learning activities</strong>. Organize your content into logical modules that guide students through the material.</p>
            <p class="info-banner-text"><strong>Structure:</strong> Course → Sections → Activities (PDF, Video, SCORM, Audio, HTML)</p>
        </div>
    </div>

    <!-- Form Container -->
    <div class="form-container">
        <div class="form-card">
            <form id="courseCreateForm" method="post" enctype="multipart/form-data">
                <fieldset>
                    <div class="form-grid">
                        <!-- Course Title -->
                        <div class="form-group full-width">
                            <label for="course_title">
                                <span class="label-icon">✦</span>
                                Course Title<span class="required-star">*</span>
                            </label>
                            <input type="text" name="course_title" id="course_title" class="modern-input"
                                   required maxlength="250" placeholder="e.g., Advanced Safety Training Fundamentals">
                            <div class="help-text">The display name shown to students in the course catalog.</div>
                        </div>

                        <!-- Course Description -->
                        <div class="form-group full-width">
                            <label for="course_description">
                                <span class="label-icon">◇</span>
                                Course Description
                            </label>
                            <textarea name="course_description" id="course_description" class="modern-input"
                                      maxlength="2000" placeholder="Describe the course content, learning objectives, and target audience..."></textarea>
                            <div class="help-text">Optional. Help students understand what they'll learn.</div>
                        </div>

                        <!-- Language -->
                        <div class="form-group">
                            <label for="lang_id">
                                <span class="label-icon">◎</span>
                                Language<span class="required-star">*</span>
                            </label>
                            <select name="lang_id" id="lang_id" class="modern-input" required>
                                <option value="">-- Select Language --</option>
                                <?php foreach ($languages as $lang): ?>
                                <option value="<?php echo htmlspecialchars($lang['lang_id']); ?>">
                                    <?php echo htmlspecialchars($lang['lang_name']); ?>
                                </option>
                                <?php endforeach; ?>
                            </select>
                        </div>

                        <!-- Access Type -->
                        <div class="form-group">
                            <label for="access_type">
                                <span class="label-icon">⟐</span>
                                Access Type
                            </label>
                            <select name="access_type" id="access_type" class="modern-input">
                                <?php foreach ($accessTypes as $value => $label): ?>
                                <option value="<?php echo htmlspecialchars($value); ?>" <?php echo $value === 'draft' ? 'selected' : ''; ?>>
                                    <?php echo htmlspecialchars($label); ?>
                                </option>
                                <?php endforeach; ?>
                            </select>
                            <div class="help-text">Controls who can access and enroll in this course.</div>
                        </div>

                        <!-- Cover Image -->
                        <div class="form-group">
                            <label for="cover_image">
                                <span class="label-icon">◈</span>
                                Cover Image
                            </label>
                            <input type="file" name="cover_image" id="cover_image"
                                   accept="image/jpeg,image/png,image/gif,image/webp">
                            <div class="help-text">Optional. Recommended size: 1280x720px (max 5MB).</div>
                            <div id="image_preview"></div>
                        </div>

                        <!-- Certificate -->
                        <div class="form-group">
                            <label><span class="label-icon">⬡</span>Certificate</label>
                            <div class="checkbox-group">
                                <input type="checkbox" name="has_cert" id="has_cert" value="1">
                                <label for="has_cert">This course offers a completion certificate</label>
                            </div>
                        </div>
                    </div>

                    <input type="hidden" name="token" value="<?php echo $token; ?>">

                    <div class="form-actions">
                        <button type="submit" id="submit_create" class="btn btn-primary">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="12" y1="5" x2="12" y2="19"/>
                                <line x1="5" y1="12" x2="19" y2="12"/>
                            </svg>
                            Create Course
                        </button>
                        <a href="course_list.php" class="btn btn-secondary">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="19" y1="12" x2="5" y2="12"/>
                                <polyline points="12 19 5 12 12 5"/>
                            </svg>
                            Cancel
                        </a>
                    </div>

                    <div id="create_msg"></div>
                </fieldset>
            </form>
        </div>
    </div>
</div>
</body>
</html>
