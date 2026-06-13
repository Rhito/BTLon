# CSS — Comprehensive Reference Guide

> **Version focus**: CSS3 + Modern CSS (2024–2026 features)  
> **Last updated**: May 2026  
> **Purpose**: Complete reference for every major CSS concept — selectors, box model, layout, animations, responsive design, and modern features.

---

## Table of Contents

1. [Syntax & Including CSS](#1-syntax--including-css)
2. [Selectors](#2-selectors)
3. [Specificity & Cascade](#3-specificity--cascade)
4. [Box Model](#4-box-model)
5. [Display & Visibility](#5-display--visibility)
6. [Colors & Backgrounds](#6-colors--backgrounds)
7. [Typography & Text](#7-typography--text)
8. [Flexbox](#8-flexbox)
9. [Grid](#9-grid)
10. [Positioning](#10-positioning)
11. [Float & Clear](#11-float--clear)
12. [Sizing & Units](#12-sizing--units)
13. [Borders & Outlines](#13-borders--outlines)
14. [Shadows](#14-shadows)
15. [Gradients](#15-gradients)
16. [Transforms](#16-transforms)
17. [Transitions](#17-transitions)
18. [Animations (Keyframes)](#18-animations-keyframes)
19. [Responsive Design & Media Queries](#19-responsive-design--media-queries)
20. [CSS Variables (Custom Properties)](#20-css-variables-custom-properties)
21. [Filters & Blend Modes](#21-filters--blend-modes)
22. [Clipping & Masking](#22-clipping--masking)
23. [Scroll & Overflow](#23-scroll--overflow)
24. [Lists & Counters](#24-lists--counters)
25. [Tables Styling](#25-tables-styling)
26. [Forms Styling](#26-forms-styling)
27. [Pseudo-Classes](#27-pseudo-classes)
28. [Pseudo-Elements](#28-pseudo-elements)
29. [Modern CSS Features](#29-modern-css-features)
30. [Best Practices & Architecture](#30-best-practices--architecture)

---

## 1. Syntax & Including CSS

### 1.1 CSS Rule Structure

```css
/* Anatomy of a CSS rule */
selector {
    property: value;          /* Declaration */
    another-property: value;  /* Declaration */
}

/* Example */
h1 {
    color: #333;
    font-size: 2rem;
    margin-bottom: 1em;
}
```

### 1.2 Three Ways to Include CSS

```html
<!-- 1. External stylesheet (recommended) -->
<link rel="stylesheet" href="styles.css">

<!-- 2. Internal / embedded stylesheet -->
<style>
    body {
        margin: 0;
        font-family: 'Inter', sans-serif;
    }
</style>

<!-- 3. Inline styles (avoid — highest specificity) -->
<p style="color: red; font-size: 18px;">Hello</p>
```

### 1.3 CSS Comments

```css
/* This is a single-line comment */

/*
 * This is a
 * multi-line comment
 */

/* TODO: Refactor this section */
/* FIXME: Color contrast issue */
```

### 1.4 @import

```css
/* Import other stylesheets (at top of file) */
@import url('reset.css');
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
@import url('print.css') print;             /* Media-specific import */
@import url('mobile.css') (max-width: 768px);
```

> ⚠️ `@import` causes additional HTTP requests. Use `<link>` for production.

---

## 2. Selectors

### 2.1 Basic Selectors

```css
/* Universal selector (all elements) */
* { margin: 0; padding: 0; box-sizing: border-box; }

/* Type / Element selector */
p { color: #333; }
h1 { font-size: 2rem; }

/* Class selector */
.card { border: 1px solid #ddd; }
.text-bold { font-weight: bold; }
p.intro { font-size: 1.2em; }            /* p elements with class "intro" */

/* ID selector */
#header { background: #f5f5f5; }
#main-content { max-width: 1200px; }

/* Multiple selectors (grouping) */
h1, h2, h3, h4, h5, h6 {
    font-family: 'Inter', sans-serif;
    line-height: 1.2;
}
```

### 2.2 Combinator Selectors

```css
/* Descendant (any depth) */
article p { color: #555; }                 /* All p inside article */

/* Child (direct children only) */
ul > li { list-style: disc; }              /* Only direct li children */

/* Adjacent sibling (immediately after) */
h2 + p { margin-top: 0; }                 /* First p right after h2 */

/* General sibling (any sibling after) */
h2 ~ p { color: #666; }                   /* All p siblings after h2 */

/* Column combinator (tables — experimental) */
col.selected || td { background: yellow; }
```

### 2.3 Attribute Selectors

```css
/* Has attribute */
[disabled] { opacity: 0.5; }
input[required] { border-left: 3px solid red; }

/* Exact value */
[type="text"] { padding: 8px; }
a[target="_blank"] { color: blue; }

/* Contains word (space-separated list) */
[class~="card"] { border-radius: 8px; }   /* Matches "card" in "card featured" */

/* Starts with (prefix, often for lang) */
[lang|="en"] { font-family: 'Georgia'; }  /* Matches "en" or "en-US" */

/* Starts with (substring) */
a[href^="https"] { color: green; }
a[href^="mailto"] { color: blue; }
a[href^="tel"] { color: purple; }

/* Ends with */
a[href$=".pdf"] { color: red; }
a[href$=".zip"]::after { content: " 📦"; }
img[src$=".svg"] { width: 100%; }

/* Contains substring */
a[href*="example"] { font-weight: bold; }
[class*="btn-"] { cursor: pointer; }

/* Case-insensitive flag */
a[href$=".PDF" i] { color: red; }         /* Matches .pdf, .PDF, .Pdf */
```

### 2.4 Pseudo-Class Selectors

```css
/* ── State pseudo-classes ──────────────── */
a:link { color: blue; }                   /* Unvisited link */
a:visited { color: purple; }              /* Visited link */
a:hover { color: red; }                   /* Mouse over */
a:active { color: darkred; }              /* Being clicked */
a:focus { outline: 2px solid blue; }      /* Keyboard focus */
a:focus-visible { outline: 3px solid blue; } /* Keyboard focus only (not mouse) */
a:focus-within { border: 1px solid blue; }   /* Contains focused element */

/* ── Form pseudo-classes ───────────────── */
input:enabled { background: white; }
input:disabled { background: #eee; cursor: not-allowed; }
input:read-only { background: #f9f9f9; }
input:read-write { background: white; }
input:checked { accent-color: blue; }
input:indeterminate { opacity: 0.7; }
input:required { border-left: 3px solid red; }
input:optional { border-left: 3px solid gray; }
input:valid { border-color: green; }
input:invalid { border-color: red; }
input:in-range { border-color: green; }
input:out-of-range { border-color: red; }
input:placeholder-shown { border-style: dashed; }
input:default { box-shadow: 0 0 0 2px blue; }  /* Default submit button, checked radio/checkbox */
input:autofill { background: lightyellow; }
::placeholder { color: #999; }

/* ── Structural pseudo-classes ─────────── */
:first-child { margin-top: 0; }
:last-child { margin-bottom: 0; }
:nth-child(2) { color: red; }             /* Second child */
:nth-child(odd) { background: #f9f9f9; }  /* 1st, 3rd, 5th... */
:nth-child(even) { background: #fff; }    /* 2nd, 4th, 6th... */
:nth-child(3n) { color: blue; }           /* Every 3rd */
:nth-child(3n+1) { color: red; }          /* 1st, 4th, 7th... */
:nth-child(-n+3) { font-weight: bold; }   /* First 3 children */
:nth-child(n+4) { opacity: 0.7; }         /* 4th child and beyond */
:nth-last-child(1) { /* Same as :last-child */ }
:nth-last-child(2) { /* Second from last */ }
:only-child { margin: 0 auto; }
:first-of-type { margin-top: 0; }
:last-of-type { margin-bottom: 0; }
:nth-of-type(2) { color: red; }           /* Second of its type */
:nth-last-of-type(1) { /* Last of its type */ }
:only-of-type { /* Only one of its type */ }

/* ── Content pseudo-classes ────────────── */
:empty { display: none; }                 /* No children (not even text) */
:not(.hidden) { display: block; }         /* Negation */
:not(:first-child) { margin-top: 1em; }

/* ── Modern pseudo-classes ─────────────── */
:is(h1, h2, h3) { color: navy; }          /* Matches any (forgiving) */
:where(h1, h2, h3) { color: navy; }       /* Same but 0 specificity */
:has(> img) { padding: 0; }               /* Parent selector! */
:has(+ .error) { border-color: red; }     /* Has adjacent .error sibling */
:has(:focus) { box-shadow: 0 0 0 2px blue; }
article:has(h2) { border-bottom: 1px solid #ddd; }

/* ── Link pseudo-classes ───────────────── */
:any-link { color: blue; }                /* Any link (a[href]) */
:local-link { color: green; }             /* Links to same page */
:target { background: yellow; }           /* Element targeted by URL hash */
:target-within { outline: 2px solid blue; }

/* ── Language & direction ──────────────── */
:lang(en) { quotes: '"' '"'; }
:lang(vi) { quotes: '«' '»'; }
:dir(rtl) { text-align: right; }
:dir(ltr) { text-align: left; }

/* ── Other ─────────────────────────────── */
:root { /* HTML element (higher specificity than html) */ }
:fullscreen { background: black; }
:picture-in-picture { box-shadow: 0 0 10px blue; }
:modal { /* Applies to open <dialog> shown via showModal() */ }
:popover-open { /* Popover that is currently showing */ }
:defined { /* Custom elements that are defined */ }
:host { /* Shadow DOM host element */ }
:host(.dark) { /* Host with class */ }
:host-context(.dark-theme) { /* Host inside .dark-theme */ }
```

### 2.5 Pseudo-Element Selectors

```css
/* Before & After (generated content) */
.card::before {
    content: '';
    display: block;
    width: 100%;
    height: 4px;
    background: linear-gradient(to right, #4285f4, #ea4335);
}

.external-link::after {
    content: ' ↗';
    font-size: 0.8em;
}

blockquote::before {
    content: open-quote;       /* or '"' */
    font-size: 3em;
    color: #ddd;
}

/* First line & first letter */
p::first-line {
    font-weight: bold;
    font-variant: small-caps;
}

p::first-letter {
    font-size: 3em;
    float: left;
    line-height: 1;
    margin-right: 0.1em;
    color: navy;
}

/* Selection (user highlighting) */
::selection {
    background: #4285f4;
    color: white;
}

/* Placeholder text */
input::placeholder {
    color: #999;
    font-style: italic;
}

/* File input button */
input[type="file"]::file-selector-button {
    padding: 8px 16px;
    border: none;
    background: #4285f4;
    color: white;
    border-radius: 4px;
    cursor: pointer;
}

/* List marker */
li::marker {
    color: #4285f4;
    font-size: 1.2em;
}

/* Scrollbar styling (WebKit) */
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: #f1f1f1; }
::-webkit-scrollbar-thumb { background: #888; border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: #555; }

/* Backdrop (for <dialog> and fullscreen) */
dialog::backdrop {
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
}

/* Highlight (Custom Highlight API) */
::highlight(search-result) {
    background: yellow;
    color: black;
}

/* Grammar/Spelling error */
::spelling-error { text-decoration: wavy red underline; }
::grammar-error { text-decoration: wavy green underline; }

/* View Transition */
::view-transition-old(root) { animation: fade-out 0.3s; }
::view-transition-new(root) { animation: fade-in 0.3s; }
```

---

## 3. Specificity & Cascade

### 3.1 Specificity Calculation

```
Specificity is calculated as (A, B, C):
A = Number of ID selectors
B = Number of class selectors, attribute selectors, pseudo-classes
C = Number of type selectors, pseudo-elements

Higher specificity wins. If equal, last rule wins.
```

| Selector | Specificity | (A,B,C) |
|----------|:-----------:|:-------:|
| `*` | 0 | (0,0,0) |
| `p` | 1 | (0,0,1) |
| `p::before` | 2 | (0,0,2) |
| `.card` | 10 | (0,1,0) |
| `p.card` | 11 | (0,1,1) |
| `#header` | 100 | (1,0,0) |
| `#header .nav li` | 112 | (1,1,2) |
| `#header .nav li.active a:hover` | 132 | (1,3,2) |
| `style="..."` | 1000 | (inline) |
| `!important` | ∞ | (overrides all) |

### 3.2 Cascade Order (Priority Low → High)

```
1. User agent stylesheet (browser defaults)
2. User stylesheet
3. Author stylesheet (your CSS)
4. Author stylesheet with !important
5. User stylesheet with !important
6. User agent stylesheet with !important
```

### 3.3 Specificity Tips

```css
/* ❌ BAD: Over-specific selectors */
body div#main-container ul.nav-list li.nav-item a.nav-link { color: blue; }

/* ✅ GOOD: Flat, class-based selectors */
.nav-link { color: blue; }

/* ❌ BAD: Using !important as a fix */
.nav-link { color: red !important; }

/* ✅ GOOD: Increase specificity with :where() (0 specificity) */
:where(.card) .title { color: navy; }

/* ✅ GOOD: @layer for managing cascade */
@layer base, components, utilities;

@layer base {
    h1 { font-size: 2rem; }
}

@layer components {
    .card h1 { font-size: 1.5rem; }
}

@layer utilities {
    .text-xl { font-size: 1.25rem !important; }
}
```

### 3.4 Inheritance

```css
/* Properties that inherit by default: */
/* color, font-*, text-*, line-height, letter-spacing, word-spacing,
   visibility, cursor, list-style-*, quotes, direction */

/* Properties that do NOT inherit: */
/* margin, padding, border, background, width, height, display,
   position, top/right/bottom/left, overflow, box-shadow, transform */

/* Force inheritance */
.child {
    border: inherit;        /* Inherit from parent */
    margin: initial;        /* Reset to browser default */
    padding: unset;         /* Inherit if inheritable, else initial */
    color: revert;          /* Revert to user agent stylesheet */
    all: unset;             /* Reset ALL properties */
}
```

---

## 4. Box Model

### 4.1 Box Model Diagram

```
┌─────────────────────────────────────────────┐
│                 MARGIN                       │
│  ┌──────────────────────────────────────┐   │
│  │             BORDER                    │   │
│  │  ┌───────────────────────────────┐   │   │
│  │  │          PADDING               │   │   │
│  │  │  ┌────────────────────────┐   │   │   │
│  │  │  │       CONTENT          │   │   │   │
│  │  │  │  (width × height)      │   │   │   │
│  │  │  └────────────────────────┘   │   │   │
│  │  └───────────────────────────────┘   │   │
│  └──────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

### 4.2 Box Sizing

```css
/* content-box (default): width/height = content only */
.content-box {
    box-sizing: content-box;
    width: 200px;
    padding: 20px;
    border: 5px solid black;
    /* Total width = 200 + 20*2 + 5*2 = 250px */
}

/* border-box (recommended): width/height includes padding + border */
.border-box {
    box-sizing: border-box;
    width: 200px;
    padding: 20px;
    border: 5px solid black;
    /* Total width = 200px (content shrinks to 150px) */
}

/* Global border-box reset (best practice) */
*, *::before, *::after {
    box-sizing: border-box;
}
```

### 4.3 Margin

```css
.element {
    /* Individual sides */
    margin-top: 10px;
    margin-right: 20px;
    margin-bottom: 10px;
    margin-left: 20px;

    /* Shorthand */
    margin: 10px;                /* All sides */
    margin: 10px 20px;          /* Vertical | Horizontal */
    margin: 10px 20px 15px;     /* Top | Horizontal | Bottom */
    margin: 10px 20px 15px 25px;/* Top | Right | Bottom | Left */

    /* Auto (for centering block elements) */
    margin: 0 auto;             /* Center horizontally */
    margin-inline: auto;        /* Center in inline direction */

    /* Negative margins */
    margin-top: -10px;          /* Pull element up */

    /* Logical properties */
    margin-block: 10px;         /* Top + Bottom */
    margin-inline: 20px;        /* Left + Right */
    margin-block-start: 10px;   /* Top (in LTR) */
    margin-block-end: 10px;     /* Bottom (in LTR) */
    margin-inline-start: 20px;  /* Left (in LTR) */
    margin-inline-end: 20px;    /* Right (in LTR) */
}

/* Margin collapsing (vertical margins collapse to the larger value) */
.box-a { margin-bottom: 20px; }
.box-b { margin-top: 30px; }
/* Space between = 30px (not 50px) */
```

### 4.4 Padding

```css
.element {
    /* Individual sides */
    padding-top: 10px;
    padding-right: 20px;
    padding-bottom: 10px;
    padding-left: 20px;

    /* Shorthand (same as margin) */
    padding: 10px;
    padding: 10px 20px;
    padding: 10px 20px 15px;
    padding: 10px 20px 15px 25px;

    /* Logical properties */
    padding-block: 10px;
    padding-inline: 20px;
    padding-block-start: 10px;
    padding-inline-start: 20px;

    /* Percentage (relative to parent's width — even for top/bottom!) */
    padding: 5%;
}
```

---

## 5. Display & Visibility

### 5.1 Display Property

```css
/* Block: takes full width, starts on new line */
.block { display: block; }          /* div, p, h1-h6, section, article */

/* Inline: flows with text, no width/height */
.inline { display: inline; }        /* span, a, strong, em */

/* Inline-block: inline flow, but accepts width/height */
.inline-block { display: inline-block; }

/* None: removes from layout entirely */
.hidden { display: none; }

/* Flex: flexbox container */
.flex { display: flex; }
.inline-flex { display: inline-flex; }

/* Grid: grid container */
.grid { display: grid; }
.inline-grid { display: inline-grid; }

/* Contents: element disappears, children promoted */
.contents { display: contents; }

/* Table displays */
.table { display: table; }
.table-row { display: table-row; }
.table-cell { display: table-cell; }

/* Flow-root: creates new BFC (block formatting context) */
.flow-root { display: flow-root; }

/* List-item: like li (with marker) */
.list-item { display: list-item; }
```

### 5.2 Visibility

```css
/* visible (default) */
.visible { visibility: visible; }

/* hidden: invisible but still takes space */
.invisible { visibility: hidden; }

/* collapse (for table rows/columns) */
tr.collapsed { visibility: collapse; }
```

### 5.3 Opacity

```css
.element {
    opacity: 1;      /* Fully visible */
    opacity: 0.5;    /* 50% transparent */
    opacity: 0;      /* Fully transparent (still interactive!) */
}
```

### 5.4 Hiding Elements Comparison

| Method | Visible | Takes Space | Accessible | Interactive |
|--------|:-------:|:-----------:|:----------:|:-----------:|
| `display: none` | ❌ | ❌ | ❌ | ❌ |
| `visibility: hidden` | ❌ | ✅ | ❌ | ❌ |
| `opacity: 0` | ❌ | ✅ | ✅ | ✅ |
| `position: absolute; left: -9999px` | ❌ | ❌ | ✅ | ❌ |
| `clip-path: inset(50%)` | ❌ | ❌ | ✅ | ❌ |
| `[hidden]` attribute | ❌ | ❌ | ❌ | ❌ |
| `aria-hidden="true"` | ✅ | ✅ | ❌ | ✅ |

```css
/* Screen reader only (accessible but hidden visually) */
.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}
```

---

## 6. Colors & Backgrounds

### 6.1 Color Values

```css
.element {
    /* Named colors (147 total) */
    color: red;
    color: rebeccapurple;
    color: transparent;
    color: currentColor;       /* Inherits the current color value */

    /* Hex */
    color: #ff0000;            /* Red */
    color: #f00;               /* Shorthand (same as #ff0000) */
    color: #ff000080;          /* With alpha (50% transparent) */

    /* RGB / RGBA */
    color: rgb(255, 0, 0);
    color: rgba(255, 0, 0, 0.5);
    color: rgb(255 0 0);                /* Modern syntax (space-separated) */
    color: rgb(255 0 0 / 50%);          /* Modern with alpha */
    color: rgb(100% 0% 0%);             /* Percentage */

    /* HSL / HSLA (Hue Saturation Lightness) */
    color: hsl(0, 100%, 50%);           /* Red */
    color: hsl(120, 100%, 50%);         /* Green */
    color: hsl(240, 100%, 50%);         /* Blue */
    color: hsla(0, 100%, 50%, 0.5);     /* With alpha */
    color: hsl(0 100% 50% / 50%);       /* Modern syntax */
    /* Hue: 0-360° (color wheel) */
    /* Saturation: 0% (gray) - 100% (full color) */
    /* Lightness: 0% (black) - 50% (pure) - 100% (white) */

    /* HWB (Hue Whiteness Blackness) */
    color: hwb(0 0% 0%);                /* Red */
    color: hwb(120 0% 0%);              /* Green */
    color: hwb(0 0% 0% / 50%);          /* With alpha */

    /* Lab (perceptually uniform) */
    color: lab(50% 80 -80);
    color: lab(50% 80 -80 / 50%);

    /* LCH (Lightness Chroma Hue) */
    color: lch(50% 100 0);
    color: lch(50% 100 0 / 50%);

    /* OKLCH (improved LCH — recommended for modern CSS) */
    color: oklch(0.7 0.15 180);
    color: oklch(0.7 0.15 180 / 50%);

    /* color-mix() */
    color: color-mix(in srgb, #ff0000 50%, #0000ff 50%);  /* Mix two colors */
    color: color-mix(in oklch, red 70%, blue);             /* 70% red, 30% blue */

    /* Relative color syntax */
    color: oklch(from var(--primary) l c h / 50%);         /* Same color, 50% alpha */
    color: hsl(from var(--primary) h s calc(l + 20%));     /* Lighten by 20% */

    /* System colors */
    color: Canvas;
    color: CanvasText;
    color: LinkText;
    color: AccentColor;
    color: AccentColorText;
}
```

### 6.2 Background Properties

```css
.element {
    /* Color */
    background-color: #f5f5f5;

    /* Image */
    background-image: url('image.jpg');
    background-image: url('image.webp'), url('fallback.jpg');  /* Multiple */

    /* Repeat */
    background-repeat: no-repeat;      /* no-repeat | repeat | repeat-x | repeat-y | space | round */

    /* Position */
    background-position: center;
    background-position: top right;
    background-position: 50% 50%;
    background-position: 20px 40px;

    /* Size */
    background-size: cover;            /* Cover entire element */
    background-size: contain;          /* Fit within element */
    background-size: 200px 100px;      /* Width Height */
    background-size: 50% auto;

    /* Attachment */
    background-attachment: scroll;     /* Scrolls with content (default) */
    background-attachment: fixed;      /* Fixed to viewport (parallax) */
    background-attachment: local;      /* Scrolls with element's content */

    /* Origin */
    background-origin: border-box;     /* From border edge */
    background-origin: padding-box;    /* From padding edge (default) */
    background-origin: content-box;    /* From content edge */

    /* Clip */
    background-clip: border-box;       /* Extends to border (default) */
    background-clip: padding-box;      /* Clips at padding edge */
    background-clip: content-box;      /* Clips at content edge */
    background-clip: text;             /* Clips to text shape */
    -webkit-background-clip: text;     /* WebKit prefix still needed */

    /* Shorthand */
    background: #f5f5f5 url('bg.jpg') no-repeat center/cover fixed;
    /*          color    image        repeat    position/size attachment */

    /* Multiple backgrounds (layered, first = top) */
    background:
        url('overlay.png') no-repeat center/cover,
        url('pattern.svg') repeat left top,
        linear-gradient(to bottom, #000, #333);
}

/* Background clip text (gradient text effect) */
.gradient-text {
    background: linear-gradient(to right, #4285f4, #ea4335);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;
}
```

---

## 7. Typography & Text

### 7.1 Font Properties

```css
.text {
    /* Font family (with fallback stack) */
    font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
    font-family: 'Georgia', 'Times New Roman', serif;
    font-family: 'Fira Code', 'Courier New', monospace;
    font-family: system-ui;                     /* OS default */
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

    /* Font size */
    font-size: 16px;
    font-size: 1rem;                            /* Relative to root */
    font-size: 1.2em;                           /* Relative to parent */
    font-size: clamp(14px, 2vw, 20px);          /* Fluid typography */
    font-size: small | medium | large | x-large;

    /* Font weight */
    font-weight: normal;     /* 400 */
    font-weight: bold;       /* 700 */
    font-weight: lighter;    /* One step lighter */
    font-weight: bolder;     /* One step bolder */
    font-weight: 100;        /* Thin */
    font-weight: 200;        /* Extra Light */
    font-weight: 300;        /* Light */
    font-weight: 400;        /* Normal */
    font-weight: 500;        /* Medium */
    font-weight: 600;        /* Semi Bold */
    font-weight: 700;        /* Bold */
    font-weight: 800;        /* Extra Bold */
    font-weight: 900;        /* Black */

    /* Font style */
    font-style: normal;
    font-style: italic;
    font-style: oblique;
    font-style: oblique 14deg;

    /* Font variant */
    font-variant: small-caps;
    font-variant: all-small-caps;
    font-variant-numeric: tabular-nums;         /* Fixed-width numbers */
    font-variant-numeric: oldstyle-nums;
    font-variant-numeric: lining-nums;
    font-variant-ligatures: common-ligatures;

    /* Font stretch */
    font-stretch: condensed;
    font-stretch: expanded;
    font-stretch: 75%;

    /* Line height */
    line-height: 1.5;          /* Unitless (recommended): 1.5 × font-size */
    line-height: 24px;         /* Fixed */
    line-height: 150%;         /* Percentage */
    line-height: normal;       /* ~1.2 */

    /* Font shorthand */
    font: italic small-caps bold 16px/1.5 'Inter', sans-serif;
    /*    style  variant    weight size/line-height family */

    /* Font display (for @font-face) */
    font-display: swap;        /* Show fallback immediately, swap when loaded */
    font-display: block;       /* Hide text briefly, then show */
    font-display: fallback;    /* Brief block, then fallback if slow */
    font-display: optional;    /* Browser decides */
    font-display: auto;        /* Default behavior */
}
```

### 7.2 Text Properties

```css
.text {
    /* Alignment */
    text-align: left;
    text-align: right;
    text-align: center;
    text-align: justify;
    text-align: start;         /* Logical (LTR = left, RTL = right) */
    text-align: end;

    text-align-last: center;   /* Last line alignment */

    /* Decoration */
    text-decoration: none;
    text-decoration: underline;
    text-decoration: overline;
    text-decoration: line-through;
    text-decoration: underline dotted red;     /* Shorthand: line style color */
    text-decoration-thickness: 2px;
    text-decoration-skip-ink: auto;            /* Don't underline descenders */
    text-underline-offset: 4px;
    text-underline-position: under;

    /* Transform */
    text-transform: uppercase;
    text-transform: lowercase;
    text-transform: capitalize;
    text-transform: none;
    text-transform: full-width;

    /* Indentation */
    text-indent: 2em;
    text-indent: 40px;

    /* Spacing */
    letter-spacing: 0.05em;
    letter-spacing: 2px;
    letter-spacing: -0.5px;    /* Tighter */

    word-spacing: 2px;
    word-spacing: 0.2em;

    /* White space handling */
    white-space: normal;       /* Collapse whitespace, wrap */
    white-space: nowrap;       /* Collapse whitespace, no wrap */
    white-space: pre;          /* Preserve whitespace and newlines */
    white-space: pre-wrap;     /* Preserve whitespace, allow wrap */
    white-space: pre-line;     /* Collapse spaces, preserve newlines, wrap */
    white-space: break-spaces; /* Like pre-wrap, but wraps at end too */

    /* Word breaking */
    word-break: normal;
    word-break: break-all;     /* Break anywhere */
    word-break: keep-all;      /* No breaking for CJK */

    overflow-wrap: normal;
    overflow-wrap: break-word; /* Break long words to prevent overflow */
    overflow-wrap: anywhere;

    hyphens: none;
    hyphens: manual;           /* Only at &shy; */
    hyphens: auto;             /* Automatic (needs lang attribute) */

    /* Text overflow (requires overflow: hidden + white-space: nowrap) */
    text-overflow: ellipsis;   /* "This is a long te..." */
    text-overflow: clip;       /* Cut off abruptly */

    /* Text shadow */
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    /*          offset-x offset-y blur-radius color */
    text-shadow:
        1px 1px 2px #000,
        0 0 10px blue,
        0 0 20px blue;        /* Multiple shadows */

    /* Columns (multi-column text) */
    columns: 3;                /* 3 columns */
    columns: 300px;            /* Column width */
    columns: 3 200px;          /* Count and width */
    column-gap: 2em;
    column-rule: 1px solid #ddd;
    column-span: all;          /* Span all columns (for headings) */

    /* Writing mode */
    writing-mode: horizontal-tb;   /* Default (horizontal, top-to-bottom) */
    writing-mode: vertical-rl;     /* Vertical, right-to-left (CJK) */
    writing-mode: vertical-lr;     /* Vertical, left-to-right */

    /* Text wrap */
    text-wrap: balance;        /* Balance line lengths (for headings) */
    text-wrap: pretty;         /* Avoid orphans (for body text) */
    text-wrap: stable;         /* Prevent reflow when editing */
}
```

### 7.3 @font-face

```css
/* Web font declaration */
@font-face {
    font-family: 'CustomFont';
    src: url('font.woff2') format('woff2'),
         url('font.woff') format('woff');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
    unicode-range: U+0000-00FF;        /* Latin characters only */
}

/* Variable font */
@font-face {
    font-family: 'Inter Variable';
    src: url('Inter-Variable.woff2') format('woff2-variations');
    font-weight: 100 900;             /* Weight range */
    font-style: normal;
    font-display: swap;
}

.heading {
    font-family: 'Inter Variable', sans-serif;
    font-weight: 650;                 /* Any value in range */
    font-variation-settings: 'wght' 650, 'slnt' -10;
}
```

### 7.4 Multi-Line Text Truncation

```css
/* Single-line truncation */
.truncate {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

/* Multi-line truncation (3 lines) */
.line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
```

---

## 8. Flexbox

### 8.1 Flex Container Properties

```css
.flex-container {
    display: flex;              /* or inline-flex */

    /* Direction */
    flex-direction: row;             /* ← Default: left to right */
    flex-direction: row-reverse;     /* → Right to left */
    flex-direction: column;          /* ↓ Top to bottom */
    flex-direction: column-reverse;  /* ↑ Bottom to top */

    /* Wrapping */
    flex-wrap: nowrap;               /* Default: single line */
    flex-wrap: wrap;                 /* Wrap to new lines */
    flex-wrap: wrap-reverse;         /* Wrap in reverse */

    /* Shorthand */
    flex-flow: row wrap;             /* direction + wrap */

    /* Main axis alignment (justify-content) */
    justify-content: flex-start;     /* ■ ■ ■ _________ */
    justify-content: flex-end;       /* _________ ■ ■ ■ */
    justify-content: center;         /* ____ ■ ■ ■ ____ */
    justify-content: space-between;  /* ■ ____ ■ ____ ■ */
    justify-content: space-around;   /* _ ■ __ ■ __ ■ _ */
    justify-content: space-evenly;   /* __ ■ __ ■ __ ■ __ */

    /* Cross axis alignment (align-items) */
    align-items: stretch;            /* Default: fill container height */
    align-items: flex-start;         /* Top-aligned */
    align-items: flex-end;           /* Bottom-aligned */
    align-items: center;             /* Center-aligned */
    align-items: baseline;           /* Text baseline-aligned */

    /* Multi-line cross axis alignment (align-content) */
    align-content: flex-start;
    align-content: flex-end;
    align-content: center;
    align-content: space-between;
    align-content: space-around;
    align-content: space-evenly;
    align-content: stretch;          /* Default */

    /* Gap between items */
    gap: 16px;                       /* Row and column gap */
    row-gap: 16px;                   /* Gap between rows */
    column-gap: 24px;                /* Gap between columns */
}
```

### 8.2 Flex Item Properties

```css
.flex-item {
    /* Order (default: 0) */
    order: -1;                /* Move before others */
    order: 0;                 /* Default position */
    order: 1;                 /* Move after default items */

    /* Grow (how much item should grow relative to siblings) */
    flex-grow: 0;             /* Default: don't grow */
    flex-grow: 1;             /* Grow to fill space */
    flex-grow: 2;             /* Grow twice as much as flex-grow: 1 items */

    /* Shrink (how much item should shrink when space is tight) */
    flex-shrink: 1;           /* Default: allow shrinking */
    flex-shrink: 0;           /* Don't shrink */

    /* Basis (initial size before growing/shrinking) */
    flex-basis: auto;         /* Use width/height */
    flex-basis: 0;            /* Ignore content size */
    flex-basis: 200px;        /* Fixed starting size */
    flex-basis: 30%;          /* Percentage */

    /* Shorthand: grow shrink basis */
    flex: 0 1 auto;           /* Default */
    flex: 1;                  /* = 1 1 0 (grow, shrink, ignore content) */
    flex: auto;               /* = 1 1 auto */
    flex: none;               /* = 0 0 auto (fixed size) */
    flex: 1 0 200px;          /* Grow from 200px, don't shrink */

    /* Self alignment (override container's align-items) */
    align-self: auto;         /* Use parent's align-items */
    align-self: flex-start;
    align-self: flex-end;
    align-self: center;
    align-self: stretch;
    align-self: baseline;
}
```

### 8.3 Common Flexbox Patterns

```css
/* Center everything */
.center-all {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
}

/* Navigation bar */
.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
}

/* Holy grail layout */
.layout {
    display: flex;
    min-height: 100vh;
}
.sidebar { flex: 0 0 250px; }
.main { flex: 1; }
.aside { flex: 0 0 200px; }

/* Equal-width columns */
.columns { display: flex; gap: 1rem; }
.columns > * { flex: 1; }

/* Footer at bottom (sticky footer) */
body {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}
main { flex: 1; }
footer { flex-shrink: 0; }

/* Card grid with wrapping */
.card-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
}
.card { flex: 1 1 300px; max-width: 400px; }

/* Push item to the end */
.spacer { margin-left: auto; }        /* Pushes everything after it to the right */
```

---

## 9. Grid

### 9.1 Grid Container Properties

```css
.grid-container {
    display: grid;              /* or inline-grid */

    /* Define columns */
    grid-template-columns: 200px 200px 200px;           /* 3 fixed columns */
    grid-template-columns: 1fr 1fr 1fr;                 /* 3 equal columns */
    grid-template-columns: 1fr 2fr 1fr;                 /* Middle is 2x wider */
    grid-template-columns: repeat(3, 1fr);              /* 3 equal columns */
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); /* Responsive! */
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));  /* Fill space */
    grid-template-columns: 200px 1fr 200px;             /* Fixed sidebar + fluid */
    grid-template-columns: minmax(200px, 300px) 1fr;    /* Min-max width */
    grid-template-columns: fit-content(200px) 1fr;      /* Fit content up to max */

    /* Define rows */
    grid-template-rows: 80px 1fr 60px;                  /* Header, main, footer */
    grid-template-rows: repeat(3, 200px);               /* 3 rows of 200px */
    grid-auto-rows: 200px;                              /* Auto-created rows */
    grid-auto-rows: minmax(100px, auto);                /* Min 100px, auto max */

    /* Named grid areas */
    grid-template-areas:
        "header header header"
        "sidebar main aside"
        "footer footer footer";

    /* Gap */
    gap: 16px;                      /* Row + column gap */
    row-gap: 16px;
    column-gap: 24px;

    /* Alignment (items within cells) */
    justify-items: stretch;          /* Default: fill cell width */
    justify-items: start;            /* Align to start of cell */
    justify-items: end;
    justify-items: center;

    align-items: stretch;            /* Default: fill cell height */
    align-items: start;
    align-items: end;
    align-items: center;

    place-items: center;             /* Both align + justify */
    place-items: center start;       /* align-items / justify-items */

    /* Alignment (grid within container) */
    justify-content: start;          /* Grid tracks alignment (horizontal) */
    justify-content: end;
    justify-content: center;
    justify-content: space-between;
    justify-content: space-around;
    justify-content: space-evenly;

    align-content: start;            /* Grid tracks alignment (vertical) */
    align-content: center;
    align-content: space-between;

    place-content: center;           /* Both */

    /* Auto flow */
    grid-auto-flow: row;             /* Default: fill rows first */
    grid-auto-flow: column;          /* Fill columns first */
    grid-auto-flow: dense;           /* Fill holes (may reorder) */
    grid-auto-flow: row dense;
}
```

### 9.2 Grid Item Properties

```css
.grid-item {
    /* Placement by line numbers */
    grid-column-start: 1;
    grid-column-end: 3;              /* Span columns 1-2 */
    grid-row-start: 1;
    grid-row-end: 3;                 /* Span rows 1-2 */

    /* Shorthand */
    grid-column: 1 / 3;             /* Start / End */
    grid-column: 1 / span 2;        /* Start / Span N */
    grid-column: 1 / -1;            /* First to last line */
    grid-row: 1 / 3;

    /* Place in named area */
    grid-area: header;               /* Must match grid-template-areas */

    /* Grid-area shorthand: row-start / col-start / row-end / col-end */
    grid-area: 1 / 1 / 3 / 3;

    /* Self alignment (override container) */
    justify-self: start;
    justify-self: end;
    justify-self: center;
    justify-self: stretch;

    align-self: start;
    align-self: end;
    align-self: center;
    align-self: stretch;

    place-self: center;              /* Both */

    /* Order */
    order: -1;
}
```

### 9.3 Common Grid Patterns

```css
/* Full page layout */
.page {
    display: grid;
    grid-template-areas:
        "header header"
        "sidebar main"
        "footer footer";
    grid-template-columns: 250px 1fr;
    grid-template-rows: auto 1fr auto;
    min-height: 100vh;
}
.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.footer { grid-area: footer; }

/* Responsive card grid (no media queries!) */
.card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
}

/* 12-column grid system */
.grid-12 {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: 1rem;
}
.col-4 { grid-column: span 4; }
.col-6 { grid-column: span 6; }
.col-8 { grid-column: span 8; }
.col-12 { grid-column: span 12; }

/* Masonry-like (using auto-fill rows) */
.masonry {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    grid-auto-rows: 10px;
    gap: 10px;
}
.masonry-item-short { grid-row: span 15; }
.masonry-item-tall { grid-row: span 25; }

/* Overlap / Stack */
.stack {
    display: grid;
}
.stack > * {
    grid-area: 1 / 1;                /* All items occupy same cell */
}

/* Subgrid (inherit parent's grid lines) */
.parent {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
}
.child {
    grid-column: span 3;
    display: grid;
    grid-template-columns: subgrid;   /* Use parent's column lines */
}
```

---

## 10. Positioning

```css
.element {
    /* Static (default — normal document flow) */
    position: static;

    /* Relative (offset from normal position, space preserved) */
    position: relative;
    top: 10px;                 /* Move down 10px from original position */
    left: 20px;                /* Move right 20px */

    /* Absolute (removed from flow, relative to nearest positioned ancestor) */
    position: absolute;
    top: 0;
    right: 0;
    /* If no positioned ancestor, positions relative to <html> */

    /* Fixed (removed from flow, relative to viewport) */
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;               /* Fixed header/navbar */

    /* Sticky (hybrid: relative until scroll threshold, then fixed) */
    position: sticky;
    top: 0;                    /* Sticks when scrolled to top of container */
    z-index: 100;

    /* Offsets */
    top: 10px;
    right: 10px;
    bottom: 10px;
    left: 10px;
    inset: 10px;               /* All sides */
    inset: 10px 20px;          /* Vertical | Horizontal */
    inset: 10px 20px 30px 40px;/* Top Right Bottom Left */

    /* Logical properties */
    inset-block-start: 10px;   /* Top */
    inset-block-end: 10px;     /* Bottom */
    inset-inline-start: 10px;  /* Left (LTR) */
    inset-inline-end: 10px;    /* Right (LTR) */

    /* Z-index (stacking order — only works with positioned elements) */
    z-index: auto;
    z-index: 1;
    z-index: 100;
    z-index: 9999;
    z-index: -1;               /* Behind */
}
```

### Common Positioning Patterns

```css
/* Center with absolute */
.centered {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

/* Or with inset + margin */
.centered-alt {
    position: absolute;
    inset: 0;
    margin: auto;
    width: fit-content;
    height: fit-content;
}

/* Fixed header */
.header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
}

/* Sticky sidebar */
.sidebar {
    position: sticky;
    top: 80px;                 /* Below fixed header */
    height: fit-content;
}

/* Overlay */
.overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
}

/* Badge on avatar */
.avatar-wrapper {
    position: relative;
    display: inline-block;
}
.badge {
    position: absolute;
    top: -4px;
    right: -4px;
    width: 12px;
    height: 12px;
    background: red;
    border-radius: 50%;
}
```

---

## 11. Float & Clear

```css
/* Float (legacy layout — prefer Flexbox/Grid) */
.float-left { float: left; }
.float-right { float: right; }
.float-none { float: none; }
.float-inline-start { float: inline-start; }
.float-inline-end { float: inline-end; }

/* Clear */
.clear-left { clear: left; }
.clear-right { clear: right; }
.clear-both { clear: both; }

/* Clearfix (prevent parent collapse) */
.clearfix::after {
    content: '';
    display: table;
    clear: both;
}

/* Modern alternative to clearfix */
.parent { display: flow-root; }
```

---

## 12. Sizing & Units

### 12.1 Width & Height

```css
.element {
    /* Fixed */
    width: 300px;
    height: 200px;

    /* Percentage (relative to parent) */
    width: 50%;
    height: 100%;

    /* Viewport units */
    width: 100vw;              /* 100% of viewport width */
    height: 100vh;             /* 100% of viewport height */
    width: 50vmin;             /* 50% of smaller dimension */
    height: 50vmax;            /* 50% of larger dimension */

    /* Dynamic viewport units (account for mobile browser chrome) */
    height: 100dvh;            /* Dynamic viewport height */
    height: 100svh;            /* Small viewport height (with chrome) */
    height: 100lvh;            /* Large viewport height (without chrome) */

    /* Intrinsic sizing */
    width: auto;               /* Default */
    width: max-content;        /* As wide as content needs */
    width: min-content;        /* As narrow as possible */
    width: fit-content;        /* min(max-content, max(min-content, available)) */
    width: fit-content(300px); /* fit-content with max clamp */

    /* Min & Max */
    min-width: 200px;
    max-width: 1200px;
    min-height: 100px;
    max-height: 80vh;

    /* Logical properties */
    inline-size: 300px;        /* Width (in LTR) */
    block-size: 200px;         /* Height (in LTR) */
    min-inline-size: 200px;
    max-inline-size: 1200px;
    min-block-size: 100px;
    max-block-size: 80vh;

    /* Aspect ratio */
    aspect-ratio: 16 / 9;
    aspect-ratio: 1;           /* Square */
    aspect-ratio: 4 / 3;
}
```

### 12.2 CSS Units Reference

| Unit | Type | Relative To | Example |
|------|------|-------------|---------|
| `px` | Absolute | Screen pixel | `16px` |
| `em` | Relative | Parent's font-size | `1.5em` |
| `rem` | Relative | Root font-size (`:root` / `html`) | `1rem` |
| `%` | Relative | Parent element | `50%` |
| `vw` | Viewport | 1% of viewport width | `100vw` |
| `vh` | Viewport | 1% of viewport height | `100vh` |
| `vmin` | Viewport | 1% of smaller dimension | `50vmin` |
| `vmax` | Viewport | 1% of larger dimension | `50vmax` |
| `dvh` | Viewport | Dynamic viewport height | `100dvh` |
| `svh` | Viewport | Small viewport height | `100svh` |
| `lvh` | Viewport | Large viewport height | `100lvh` |
| `ch` | Relative | Width of "0" character | `60ch` |
| `ex` | Relative | Height of "x" character | `2ex` |
| `lh` | Relative | Line height of element | `3lh` |
| `rlh` | Relative | Root line height | `2rlh` |
| `cap` | Relative | Height of capital letter | `1cap` |
| `cqw` | Container | 1% of container width | `50cqw` |
| `cqh` | Container | 1% of container height | `50cqh` |
| `cm` | Absolute | Centimeters | `2cm` |
| `mm` | Absolute | Millimeters | `10mm` |
| `in` | Absolute | Inches | `1in` |
| `pt` | Absolute | Points (1/72 inch) | `12pt` |
| `pc` | Absolute | Picas (1/6 inch) | `1pc` |

### 12.3 CSS Math Functions

```css
.element {
    /* calc() — arithmetic */
    width: calc(100% - 200px);
    padding: calc(1rem + 5px);
    font-size: calc(14px + 0.5vw);
    margin: calc(var(--spacing) * 2);

    /* min() — smallest value */
    width: min(90%, 1200px);                  /* Max width of 1200px */
    font-size: min(5vw, 2rem);

    /* max() — largest value */
    width: max(300px, 50%);                   /* Min width of 300px */
    font-size: max(1rem, 14px);

    /* clamp(min, preferred, max) */
    width: clamp(300px, 50%, 1200px);         /* Responsive with limits */
    font-size: clamp(14px, 2vw + 0.5rem, 22px); /* Fluid typography */
    padding: clamp(1rem, 3vw, 3rem);

    /* round() */
    width: round(100px / 3, 1px);             /* Round to nearest 1px */

    /* mod() */
    width: mod(100px, 30px);                  /* 10px (remainder) */

    /* rem() */
    width: rem(100px, 30px);                  /* 10px */

    /* abs() */
    margin: abs(-10px);                       /* 10px */

    /* sign() */
    --s: sign(var(--value));                  /* -1, 0, or 1 */

    /* Trigonometric */
    transform: rotate(sin(45deg));
    transform: rotate(cos(45deg));
    transform: rotate(tan(45deg));
    transform: rotate(atan2(1, 1));

    /* Exponential */
    width: pow(2, 10);                        /* 1024 */
    width: sqrt(144);                         /* 12 */
    width: log(100);
    width: exp(2);
}
```

---

## 13. Borders & Outlines

```css
.element {
    /* Border shorthand */
    border: 1px solid #ddd;
    border: 2px dashed red;
    border: 3px double #333;

    /* Individual sides */
    border-top: 2px solid #333;
    border-right: 1px solid #ddd;
    border-bottom: 2px solid #333;
    border-left: 1px solid #ddd;

    /* Individual properties */
    border-width: 1px 2px 3px 4px;     /* Top Right Bottom Left */
    border-style: solid;                /* none|solid|dashed|dotted|double|groove|ridge|inset|outset */
    border-color: #333;

    /* Border radius */
    border-radius: 8px;                /* All corners */
    border-radius: 50%;                /* Circle */
    border-radius: 10px 20px 30px 40px;/* TL TR BR BL */
    border-radius: 10px / 20px;        /* Horizontal / Vertical (elliptical) */
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    border-bottom-left-radius: 10px;

    /* Border image */
    border-image: url('border.png') 30 round;
    border-image-source: url('border.png');
    border-image-slice: 30;
    border-image-width: 30px;
    border-image-outset: 0;
    border-image-repeat: round;        /* stretch | repeat | round | space */

    /* Outline (doesn't affect layout) */
    outline: 2px solid blue;
    outline: 3px dashed red;
    outline-width: 2px;
    outline-style: solid;
    outline-color: blue;
    outline-offset: 4px;               /* Space between border and outline */
    outline: none;                      /* ⚠️ BAD for accessibility! Use :focus-visible instead */

    /* Logical properties */
    border-block: 1px solid #ddd;       /* Top + Bottom */
    border-inline: 1px solid #ddd;      /* Left + Right */
    border-block-start: 1px solid #ddd; /* Top */
    border-inline-end: 1px solid #ddd;  /* Right (LTR) */
}
```

---

## 14. Shadows

```css
.element {
    /* Box shadow */
    box-shadow: 2px 4px 8px rgba(0, 0, 0, 0.1);
    /*          x    y    blur  color */

    box-shadow: 2px 4px 8px 2px rgba(0, 0, 0, 0.1);
    /*          x    y    blur spread color */

    /* Inset shadow */
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);

    /* Multiple shadows */
    box-shadow:
        0 1px 3px rgba(0,0,0,0.12),
        0 1px 2px rgba(0,0,0,0.24);

    /* No shadow */
    box-shadow: none;

    /* Elevation system */
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    --shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
    --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
    --shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);

    /* Text shadow */
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}
```

---

## 15. Gradients

```css
.element {
    /* Linear gradient */
    background: linear-gradient(to right, #4285f4, #ea4335);
    background: linear-gradient(45deg, red, blue);
    background: linear-gradient(to bottom right, #000, #333, #666);
    background: linear-gradient(180deg, #000 0%, #333 50%, #fff 100%);

    /* Radial gradient */
    background: radial-gradient(circle, #4285f4, #ea4335);
    background: radial-gradient(ellipse at top left, #4285f4, transparent);
    background: radial-gradient(circle at 50% 50%, red 0%, blue 100%);
    background: radial-gradient(circle closest-side, red, blue);

    /* Conic gradient */
    background: conic-gradient(red, yellow, lime, aqua, blue, magenta, red);
    background: conic-gradient(from 90deg, red, blue);
    background: conic-gradient(from 0deg at 50% 50%, red 0%, blue 100%);

    /* Repeating gradients */
    background: repeating-linear-gradient(45deg, #fff 0px, #fff 10px, #000 10px, #000 20px);
    background: repeating-radial-gradient(circle, red 0px, red 10px, blue 10px, blue 20px);
    background: repeating-conic-gradient(red 0deg, red 10deg, blue 10deg, blue 20deg);

    /* Color stops with positions */
    background: linear-gradient(
        to right,
        red 0%,
        red 25%,        /* Solid red 0-25% */
        yellow 25%,     /* Hard transition at 25% */
        yellow 50%,     /* Solid yellow 25-50% */
        green 50%,
        green 100%
    );

    /* Gradient text */
    background: linear-gradient(to right, #4285f4, #ea4335);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;

    /* Gradient border */
    border: 3px solid transparent;
    background-image: linear-gradient(white, white), linear-gradient(to right, #4285f4, #ea4335);
    background-origin: padding-box, border-box;
    background-clip: padding-box, border-box;
}
```

---

## 16. Transforms

```css
.element {
    /* 2D Transforms */
    transform: translate(50px, 100px);         /* Move X, Y */
    transform: translateX(50px);
    transform: translateY(100px);
    transform: scale(1.5);                     /* Scale uniformly */
    transform: scale(1.5, 2);                  /* Scale X, Y */
    transform: scaleX(1.5);
    transform: scaleY(2);
    transform: rotate(45deg);                  /* Rotate */
    transform: rotate(0.5turn);
    transform: skew(10deg, 20deg);             /* Skew X, Y */
    transform: skewX(10deg);
    transform: skewY(20deg);

    /* 3D Transforms */
    transform: translate3d(50px, 100px, 200px);
    transform: translateZ(100px);
    transform: rotate3d(1, 0, 0, 45deg);       /* Axis vector + angle */
    transform: rotateX(45deg);                 /* Rotate around X axis */
    transform: rotateY(45deg);                 /* Rotate around Y axis */
    transform: rotateZ(45deg);                 /* Rotate around Z axis */
    transform: scale3d(1, 1.5, 2);
    transform: perspective(500px);             /* 3D perspective */

    /* Multiple transforms (applied right to left) */
    transform: translateX(100px) rotate(45deg) scale(1.5);

    /* Transform origin */
    transform-origin: center;                  /* Default */
    transform-origin: top left;
    transform-origin: 50% 50%;
    transform-origin: 0 0;
    transform-origin: 100px 200px;

    /* 3D settings */
    perspective: 1000px;                       /* On parent: 3D depth */
    perspective-origin: 50% 50%;               /* Vanishing point */
    transform-style: flat;                     /* Default */
    transform-style: preserve-3d;              /* Children maintain 3D */
    backface-visibility: visible;              /* Default */
    backface-visibility: hidden;               /* Hide back of rotated elements */

    /* Individual transform properties (modern) */
    translate: 50px 100px;
    rotate: 45deg;
    scale: 1.5;
}
```

---

## 17. Transitions

```css
.element {
    /* Shorthand */
    transition: all 0.3s ease;
    transition: background-color 0.3s ease, transform 0.2s ease-out;

    /* Individual properties */
    transition-property: background-color, transform, opacity;
    transition-duration: 0.3s;
    transition-timing-function: ease;
    transition-delay: 0s;

    /* Timing functions */
    transition-timing-function: ease;          /* Default (slow start, fast middle, slow end) */
    transition-timing-function: ease-in;       /* Slow start */
    transition-timing-function: ease-out;      /* Slow end */
    transition-timing-function: ease-in-out;   /* Slow start and end */
    transition-timing-function: linear;        /* Constant speed */
    transition-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55); /* Custom bounce */
    transition-timing-function: steps(4, jump-start);    /* Stepped */
    transition-timing-function: step-start;
    transition-timing-function: step-end;

    /* Common transitions */
    transition-behavior: allow-discrete;       /* Animate display/visibility */
}

/* Trigger on hover */
.button {
    background-color: blue;
    transform: scale(1);
    transition: background-color 0.3s ease, transform 0.2s ease;
}

.button:hover {
    background-color: darkblue;
    transform: scale(1.05);
}

/* Performance tip: only transition transform and opacity */
/* These are GPU-accelerated and don't trigger layout/paint */
.optimized {
    transition: transform 0.3s ease, opacity 0.3s ease;
}
```

---

## 18. Animations (Keyframes)

```css
/* Define animation */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-30px); }
    60% { transform: translateY(-15px); }
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
}

@keyframes gradient-shift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}

/* Apply animation */
.element {
    /* Shorthand */
    animation: fadeIn 0.5s ease-out forwards;
    animation: bounce 2s ease infinite;

    /* Individual properties */
    animation-name: fadeIn;
    animation-duration: 0.5s;
    animation-timing-function: ease-out;
    animation-delay: 0s;
    animation-iteration-count: 1;          /* or infinite */
    animation-direction: normal;           /* normal | reverse | alternate | alternate-reverse */
    animation-fill-mode: forwards;         /* none | forwards | backwards | both */
    animation-play-state: running;         /* running | paused */
    animation-composition: replace;        /* replace | add | accumulate */
    animation-timeline: auto;              /* auto | scroll() | view() */

    /* Multiple animations */
    animation:
        fadeIn 0.5s ease-out forwards,
        pulse 2s ease-in-out 0.5s infinite;

    /* Staggered animations */
    &:nth-child(1) { animation-delay: 0.1s; }
    &:nth-child(2) { animation-delay: 0.2s; }
    &:nth-child(3) { animation-delay: 0.3s; }
}

/* Scroll-driven animations */
.element {
    animation: fadeIn linear;
    animation-timeline: view();                    /* Animate as element enters viewport */
    animation-range: entry 0% entry 100%;          /* During entry */
}

.progress-bar {
    animation: grow linear;
    animation-timeline: scroll(root);              /* Based on page scroll */
}

@keyframes grow {
    from { width: 0%; }
    to { width: 100%; }
}

/* Reduced motion preference */
@media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
    }
}
```

---

## 19. Responsive Design & Media Queries

### 19.1 Viewport Meta Tag

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

### 19.2 Media Queries

```css
/* Breakpoint system (mobile-first) */
/* Mobile: 0 – 767px (default styles) */
/* Tablet: 768px – 1023px */
/* Desktop: 1024px – 1279px */
/* Large: 1280px+ */

/* Min-width (mobile-first — recommended) */
@media (min-width: 768px) { /* Tablet and up */ }
@media (min-width: 1024px) { /* Desktop and up */ }
@media (min-width: 1280px) { /* Large screens */ }

/* Max-width (desktop-first) */
@media (max-width: 767px) { /* Mobile */ }
@media (max-width: 1023px) { /* Tablet and below */ }

/* Range syntax (modern) */
@media (768px <= width < 1024px) { /* Tablet only */ }
@media (width >= 1024px) { /* Desktop and up */ }
@media (width < 768px) { /* Mobile only */ }

/* Combine conditions */
@media (min-width: 768px) and (max-width: 1023px) { /* Tablet only */ }
@media (min-width: 768px) and (orientation: landscape) { }

/* OR conditions */
@media (max-width: 767px), (orientation: portrait) { }

/* NOT */
@media not print { }
@media not (color) { }

/* Media types */
@media screen { }           /* Screens */
@media print { }             /* Print */
@media all { }               /* All (default) */

/* Feature queries */
@media (orientation: portrait) { }
@media (orientation: landscape) { }
@media (hover: hover) { }            /* Device supports hover */
@media (hover: none) { }             /* Touch devices */
@media (pointer: fine) { }           /* Mouse */
@media (pointer: coarse) { }         /* Touch */
@media (any-hover: hover) { }        /* Any input supports hover */
@media (prefers-color-scheme: dark) { }   /* Dark mode */
@media (prefers-color-scheme: light) { }  /* Light mode */
@media (prefers-reduced-motion: reduce) { } /* Reduce motion */
@media (prefers-reduced-transparency: reduce) { }
@media (prefers-contrast: high) { }       /* High contrast */
@media (forced-colors: active) { }        /* Windows high contrast */
@media (display-mode: standalone) { }     /* PWA standalone */
@media (color-gamut: p3) { }              /* Wide color gamut */
@media (resolution: 2dppx) { }           /* Retina / 2x */
@media (min-resolution: 192dpi) { }      /* High DPI */
@media (scripting: enabled) { }           /* JavaScript available */
@media (update: fast) { }                 /* Can update quickly (screen) */
@media (update: slow) { }                 /* Slow update (e-ink) */
```

### 19.3 Container Queries

```css
/* Define a containment context */
.card-container {
    container-type: inline-size;       /* Enable container queries */
    container-name: card;              /* Optional name */
    /* Shorthand: container: card / inline-size; */
}

/* Query the container's size */
@container card (min-width: 400px) {
    .card-title { font-size: 1.5rem; }
    .card-body { display: flex; }
}

@container (min-width: 600px) {
    .card { flex-direction: row; }
}

/* Container query units */
.element {
    font-size: 5cqw;                   /* 5% of container width */
    padding: 2cqh;                     /* 2% of container height */
    width: 50cqi;                      /* 50% of container inline size */
    height: 30cqb;                     /* 30% of container block size */
    font-size: 3cqmin;                 /* 3% of smaller dimension */
    font-size: 3cqmax;                 /* 3% of larger dimension */
}

/* Style queries (query custom properties — experimental) */
@container style(--theme: dark) {
    .card { background: #1a1a2e; color: white; }
}
```

### 19.4 Responsive Patterns

```css
/* Fluid typography */
html {
    font-size: clamp(14px, 0.875rem + 0.5vw, 18px);
}

h1 { font-size: clamp(1.75rem, 1.5rem + 2vw, 3.5rem); }
h2 { font-size: clamp(1.4rem, 1.2rem + 1.5vw, 2.5rem); }

/* Fluid spacing */
.section {
    padding: clamp(2rem, 5vw, 6rem) clamp(1rem, 3vw, 4rem);
}

/* Responsive grid (no media queries) */
.auto-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(250px, 100%), 1fr));
    gap: clamp(1rem, 2vw, 2rem);
}
```

---

## 20. CSS Variables (Custom Properties)

```css
/* Define variables */
:root {
    /* Colors */
    --color-primary: #4285f4;
    --color-secondary: #34a853;
    --color-accent: #ea4335;
    --color-bg: #ffffff;
    --color-text: #1a1a2e;
    --color-text-muted: #6b7280;
    --color-border: #e5e7eb;

    /* Typography */
    --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
    --font-mono: 'Fira Code', monospace;
    --font-size-sm: 0.875rem;
    --font-size-base: 1rem;
    --font-size-lg: 1.125rem;
    --font-size-xl: 1.25rem;
    --font-size-2xl: 1.5rem;
    --font-size-3xl: 1.875rem;

    /* Spacing */
    --space-1: 0.25rem;
    --space-2: 0.5rem;
    --space-3: 0.75rem;
    --space-4: 1rem;
    --space-6: 1.5rem;
    --space-8: 2rem;
    --space-12: 3rem;
    --space-16: 4rem;

    /* Border radius */
    --radius-sm: 0.25rem;
    --radius: 0.5rem;
    --radius-lg: 1rem;
    --radius-full: 9999px;

    /* Shadows */
    --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
    --shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);

    /* Transitions */
    --transition-fast: 150ms ease;
    --transition: 300ms ease;
    --transition-slow: 500ms ease;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
    :root {
        --color-bg: #1a1a2e;
        --color-text: #e5e7eb;
        --color-text-muted: #9ca3af;
        --color-border: #374151;
    }
}

/* Or class-based dark mode */
.dark {
    --color-bg: #1a1a2e;
    --color-text: #e5e7eb;
}

/* Using variables */
.card {
    background: var(--color-bg);
    color: var(--color-text);
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    padding: var(--space-4);
    box-shadow: var(--shadow);
    transition: box-shadow var(--transition);
}

.card:hover {
    box-shadow: var(--shadow-lg);
}

/* Fallback value */
.element {
    color: var(--undefined-var, #333);          /* Uses #333 if undefined */
    padding: var(--custom-padding, var(--space-4)); /* Nested fallback */
}

/* Scoped variables */
.card {
    --card-padding: var(--space-4);
    padding: var(--card-padding);
}

.card.compact {
    --card-padding: var(--space-2);            /* Override within scope */
}

/* Variables in calc() */
.grid {
    --columns: 3;
    --gap: 1rem;
    gap: var(--gap);
    grid-template-columns: repeat(var(--columns), 1fr);
}

/* Variables in media queries — NOT supported directly */
/* Use @property for typed custom properties */
@property --rotation {
    syntax: '<angle>';
    inherits: false;
    initial-value: 0deg;
}

.spinner {
    --rotation: 0deg;
    transform: rotate(var(--rotation));
    transition: --rotation 0.3s ease;
}
.spinner:hover {
    --rotation: 360deg;                        /* Now animatable! */
}
```

---

## 21. Filters & Blend Modes

```css
.element {
    /* Filter functions */
    filter: blur(4px);                 /* Gaussian blur */
    filter: brightness(1.5);          /* Brightness (1 = normal) */
    filter: contrast(1.5);            /* Contrast */
    filter: grayscale(100%);          /* Grayscale */
    filter: hue-rotate(90deg);        /* Rotate hue */
    filter: invert(100%);             /* Invert colors */
    filter: opacity(50%);             /* Opacity */
    filter: saturate(200%);           /* Saturation */
    filter: sepia(100%);              /* Sepia tone */
    filter: drop-shadow(2px 4px 6px rgba(0,0,0,0.3)); /* Drop shadow (follows shape) */

    /* Multiple filters */
    filter: brightness(1.2) contrast(1.1) saturate(1.3);

    /* Backdrop filter (affects content BEHIND the element) */
    backdrop-filter: blur(10px);
    backdrop-filter: blur(10px) saturate(180%);    /* Glassmorphism */
    -webkit-backdrop-filter: blur(10px);           /* Safari */

    /* Blend modes */
    mix-blend-mode: normal;
    mix-blend-mode: multiply;
    mix-blend-mode: screen;
    mix-blend-mode: overlay;
    mix-blend-mode: darken;
    mix-blend-mode: lighten;
    mix-blend-mode: color-dodge;
    mix-blend-mode: color-burn;
    mix-blend-mode: difference;
    mix-blend-mode: exclusion;
    mix-blend-mode: hue;
    mix-blend-mode: saturation;
    mix-blend-mode: color;
    mix-blend-mode: luminosity;

    /* Background blend mode */
    background-image: url('image.jpg'), linear-gradient(to right, red, blue);
    background-blend-mode: overlay;
}

/* Glassmorphism effect */
.glass {
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(12px) saturate(180%);
    -webkit-backdrop-filter: blur(12px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 12px;
}
```

---

## 22. Clipping & Masking

```css
.element {
    /* Clip-path shapes */
    clip-path: circle(50%);                                /* Circle */
    clip-path: circle(50% at 50% 50%);                    /* Circle with position */
    clip-path: ellipse(50% 30% at 50% 50%);               /* Ellipse */
    clip-path: inset(10px 20px 30px 40px round 8px);       /* Rounded rectangle */
    clip-path: polygon(50% 0%, 100% 100%, 0% 100%);       /* Triangle */
    clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%); /* Star */
    clip-path: path('M 0 0 L 100 0 L 100 100 Z');          /* SVG path */
    clip-path: url(#svgClip);                               /* SVG clip-path reference */

    /* Mask */
    mask-image: url('mask.svg');
    mask-image: linear-gradient(to bottom, black 80%, transparent);
    mask-size: cover;
    mask-repeat: no-repeat;
    mask-position: center;

    /* Object fit (for images/videos within containers) */
    object-fit: fill;              /* Stretch to fill (may distort) */
    object-fit: contain;           /* Fit within, maintain ratio */
    object-fit: cover;             /* Fill container, crop excess */
    object-fit: none;              /* Natural size */
    object-fit: scale-down;        /* Smaller of contain or none */
    object-position: center;       /* Position within container */
    object-position: top right;
}
```

---

## 23. Scroll & Overflow

```css
.element {
    /* Overflow */
    overflow: visible;             /* Default: content overflows */
    overflow: hidden;              /* Clip overflow */
    overflow: scroll;              /* Always show scrollbar */
    overflow: auto;                /* Scrollbar when needed */
    overflow: clip;                /* Like hidden, but no scroll programmatically */
    overflow-x: auto;              /* Horizontal only */
    overflow-y: auto;              /* Vertical only */

    /* Scroll behavior */
    scroll-behavior: smooth;       /* Smooth scrolling */
    scroll-behavior: auto;         /* Instant (default) */

    /* Scroll snap */
    scroll-snap-type: x mandatory;   /* Horizontal, must snap */
    scroll-snap-type: y proximity;   /* Vertical, snap if close */
    scroll-snap-type: both mandatory;

    /* On children */
    scroll-snap-align: start;
    scroll-snap-align: center;
    scroll-snap-align: end;
    scroll-snap-stop: always;        /* Must stop at this point */

    /* Scroll padding (offset from snap edge) */
    scroll-padding: 80px 0 0 0;     /* e.g., below fixed header */
    scroll-padding-top: 80px;

    /* Scroll margin (on children) */
    scroll-margin-top: 80px;

    /* Overscroll behavior */
    overscroll-behavior: auto;       /* Default chain behavior */
    overscroll-behavior: contain;    /* Don't scroll parent */
    overscroll-behavior: none;       /* No overscroll effect */
    overscroll-behavior-y: contain;

    /* Scrollbar styling */
    scrollbar-width: auto;           /* Default */
    scrollbar-width: thin;           /* Thin scrollbar */
    scrollbar-width: none;           /* Hide scrollbar */
    scrollbar-color: #888 #f1f1f1;   /* thumb track */
    scrollbar-gutter: stable;        /* Reserve space for scrollbar */
    scrollbar-gutter: stable both-edges;

    /* Touch scrolling */
    -webkit-overflow-scrolling: touch;   /* Momentum scrolling (iOS) */
    touch-action: pan-y;                 /* Only allow vertical scroll */
    touch-action: none;                  /* Disable touch gestures */
}

/* Scroll snap carousel example */
.carousel {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    gap: 1rem;
    -webkit-overflow-scrolling: touch;
}
.carousel > .slide {
    flex: 0 0 100%;
    scroll-snap-align: start;
}
```

---

## 24. Lists & Counters

```css
/* List styling */
ul {
    list-style-type: disc;         /* disc | circle | square | none */
    list-style-type: "→ ";         /* Custom string */
    list-style-position: outside;  /* outside | inside */
    list-style-image: url('bullet.svg');
    list-style: none;              /* Remove all styling */
    padding-left: 0;               /* Remove indent */
}

li::marker {
    color: #4285f4;
    font-size: 1.2em;
    content: '✓ ';
}

/* CSS Counters */
.toc {
    counter-reset: section;
}

.toc h2 {
    counter-increment: section;
}

.toc h2::before {
    content: counter(section) ". ";
    color: #4285f4;
}

/* Nested counters */
ol {
    counter-reset: item;
    list-style: none;
}

ol li::before {
    counter-increment: item;
    content: counters(item, ".") " ";    /* 1.1, 1.2, 2.1, etc. */
}
```

---

## 25. Tables Styling

```css
table {
    width: 100%;
    border-collapse: collapse;         /* or separate */
    border-spacing: 0;                 /* Only with border-collapse: separate */
    table-layout: fixed;              /* Fixed column widths (faster rendering) */
    table-layout: auto;               /* Auto column widths (default) */
    caption-side: top;                /* top | bottom */
    empty-cells: show;                /* show | hide */
}

th, td {
    padding: 12px 16px;
    text-align: left;
    border-bottom: 1px solid #e5e7eb;
    vertical-align: middle;           /* top | middle | bottom */
}

th {
    background: #f9fafb;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.75rem;
    letter-spacing: 0.05em;
    color: #6b7280;
}

/* Zebra striping */
tbody tr:nth-child(even) {
    background: #f9fafb;
}

/* Hover */
tbody tr:hover {
    background: #f3f4f6;
}

/* Responsive table (horizontal scroll) */
.table-wrapper {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
}
```

---

## 26. Forms Styling

```css
/* Reset form elements */
input, select, textarea, button {
    font: inherit;
    color: inherit;
}

/* Text input styling */
.input {
    width: 100%;
    padding: 0.625rem 0.75rem;
    border: 1px solid var(--color-border, #d1d5db);
    border-radius: 0.375rem;
    background: white;
    font-size: 1rem;
    line-height: 1.5;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
    outline: none;
}

.input:focus {
    border-color: var(--color-primary, #4285f4);
    box-shadow: 0 0 0 3px rgba(66, 133, 244, 0.15);
}

.input:invalid:not(:placeholder-shown) {
    border-color: red;
}

/* Custom checkbox */
.checkbox {
    appearance: none;
    -webkit-appearance: none;
    width: 1.25rem;
    height: 1.25rem;
    border: 2px solid #d1d5db;
    border-radius: 0.25rem;
    cursor: pointer;
    position: relative;
    transition: all 0.15s ease;
}

.checkbox:checked {
    background: var(--color-primary, #4285f4);
    border-color: var(--color-primary, #4285f4);
}

.checkbox:checked::after {
    content: '✓';
    position: absolute;
    color: white;
    font-size: 0.875rem;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

/* Custom select */
.select {
    appearance: none;
    -webkit-appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.75rem center;
    padding-right: 2.5rem;
}

/* Accent color (native controls) */
input[type="checkbox"],
input[type="radio"],
input[type="range"],
progress {
    accent-color: var(--color-primary, #4285f4);
}

/* Color scheme for form controls */
:root {
    color-scheme: light dark;     /* Support both themes for native controls */
}
```

---

## 27. Pseudo-Classes

*(Comprehensive list included in [Section 2.4 — Selectors](#24-pseudo-class-selectors))*

### Quick Reference by Category

| Category | Pseudo-Classes |
|----------|---------------|
| **Link** | `:link`, `:visited`, `:any-link`, `:local-link` |
| **User action** | `:hover`, `:active`, `:focus`, `:focus-visible`, `:focus-within` |
| **Input** | `:enabled`, `:disabled`, `:read-only`, `:read-write`, `:checked`, `:indeterminate`, `:required`, `:optional`, `:valid`, `:invalid`, `:in-range`, `:out-of-range`, `:placeholder-shown`, `:default`, `:autofill` |
| **Structural** | `:root`, `:empty`, `:first-child`, `:last-child`, `:only-child`, `:nth-child()`, `:nth-last-child()`, `:first-of-type`, `:last-of-type`, `:only-of-type`, `:nth-of-type()`, `:nth-last-of-type()` |
| **Functional** | `:is()`, `:where()`, `:not()`, `:has()` |
| **Other** | `:target`, `:lang()`, `:dir()`, `:fullscreen`, `:modal`, `:popover-open`, `:defined` |

---

## 28. Pseudo-Elements

*(Comprehensive list included in [Section 2.5 — Selectors](#25-pseudo-element-selectors))*

### Quick Reference

| Pseudo-Element | Description |
|---------------|-------------|
| `::before` | Insert content before element |
| `::after` | Insert content after element |
| `::first-line` | First line of text |
| `::first-letter` | First letter of text |
| `::selection` | User-selected text |
| `::placeholder` | Input placeholder text |
| `::marker` | List item marker |
| `::file-selector-button` | File input button |
| `::backdrop` | Behind dialog/fullscreen |
| `::cue` | WebVTT subtitle styling |
| `::highlight()` | Custom Highlight API |
| `::spelling-error` | Misspelled words |
| `::grammar-error` | Grammar errors |
| `::view-transition-old()` | View transition |
| `::view-transition-new()` | View transition |

---

## 29. Modern CSS Features

### 29.1 Nesting (Native CSS)

```css
/* Native CSS nesting (2023+) */
.card {
    padding: 1rem;
    border: 1px solid #ddd;

    .title {
        font-size: 1.5rem;
        font-weight: bold;
    }

    .body {
        color: #666;
    }

    &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    &.featured {
        border-color: gold;
    }

    @media (min-width: 768px) {
        padding: 2rem;

        .title {
            font-size: 2rem;
        }
    }
}

/* Complex nesting */
.nav {
    & ul {
        display: flex;
        gap: 1rem;

        & li {
            list-style: none;

            & a {
                color: inherit;
                text-decoration: none;

                &:hover {
                    color: var(--color-primary);
                }

                &.active {
                    font-weight: bold;
                }
            }
        }
    }
}
```

### 29.2 @layer (Cascade Layers)

```css
/* Define layer order (first = lowest priority) */
@layer reset, base, components, utilities;

/* Add rules to layers */
@layer reset {
    *, *::before, *::after {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
}

@layer base {
    body {
        font-family: 'Inter', sans-serif;
        line-height: 1.6;
    }

    h1 { font-size: 2rem; }
}

@layer components {
    .btn {
        padding: 0.5rem 1rem;
        border-radius: 0.25rem;
    }
}

@layer utilities {
    .text-center { text-align: center; }
    .hidden { display: none; }
}

/* Import into a layer */
@import url('third-party.css') layer(vendor);
```

### 29.3 @scope

```css
/* Scoped styles (limit where styles apply) */
@scope (.card) {
    :scope {
        padding: 1rem;
        border: 1px solid #ddd;
    }

    h2 {
        font-size: 1.5rem;
    }

    p {
        color: #666;
    }
}

/* Scope with lower boundary */
@scope (.card) to (.card-footer) {
    /* Styles apply inside .card but not inside .card-footer */
    p { color: #333; }
}
```

### 29.4 @starting-style (Entry Animations)

```css
/* Animate elements when they first appear */
.toast {
    opacity: 1;
    transform: translateY(0);
    transition: opacity 0.3s, transform 0.3s;

    @starting-style {
        opacity: 0;
        transform: translateY(20px);
    }
}

/* Animate dialog opening */
dialog[open] {
    opacity: 1;
    transform: scale(1);
    transition: opacity 0.3s, transform 0.3s, overlay 0.3s allow-discrete, display 0.3s allow-discrete;

    @starting-style {
        opacity: 0;
        transform: scale(0.9);
    }
}
```

### 29.5 View Transitions API

```css
/* Page transition */
::view-transition-old(root) {
    animation: fade-out 0.3s ease forwards;
}

::view-transition-new(root) {
    animation: fade-in 0.3s ease forwards;
}

@keyframes fade-out {
    to { opacity: 0; }
}

@keyframes fade-in {
    from { opacity: 0; }
}

/* Element-specific transitions */
.card {
    view-transition-name: card;
}

::view-transition-group(card) {
    animation-duration: 0.4s;
}
```

### 29.6 @property (Typed Custom Properties)

```css
@property --gradient-angle {
    syntax: '<angle>';
    inherits: false;
    initial-value: 0deg;
}

.gradient-border {
    --gradient-angle: 0deg;
    border-image: linear-gradient(var(--gradient-angle), red, blue) 1;
    animation: rotate-gradient 3s linear infinite;
}

@keyframes rotate-gradient {
    to { --gradient-angle: 360deg; }
}
```

### 29.7 @supports (Feature Queries)

```css
/* Check for feature support */
@supports (display: grid) {
    .layout { display: grid; }
}

@supports not (display: grid) {
    .layout { display: flex; }
}

@supports (backdrop-filter: blur(10px)) or (-webkit-backdrop-filter: blur(10px)) {
    .glass { backdrop-filter: blur(10px); }
}

@supports selector(:has(*)) {
    /* Browser supports :has() */
}

/* Combine conditions */
@supports (display: grid) and (gap: 1rem) {
    .grid { display: grid; gap: 1rem; }
}
```

### 29.8 Color Schemes & System Colors

```css
:root {
    color-scheme: light dark;          /* Support both */
}

/* Using light-dark() function */
.element {
    background: light-dark(#ffffff, #1a1a2e);
    color: light-dark(#333333, #e5e7eb);
    border-color: light-dark(#e5e7eb, #374151);
}

/* System colors */
.element {
    background: Canvas;
    color: CanvasText;
    border-color: ButtonBorder;
    accent-color: AccentColor;
}
```

---

## 30. Best Practices & Architecture

### 30.1 CSS Reset / Normalize

```css
/* Modern CSS Reset */
*, *::before, *::after {
    box-sizing: border-box;
}

* {
    margin: 0;
    padding: 0;
}

html {
    -webkit-text-size-adjust: none;
    text-size-adjust: none;
}

body {
    min-height: 100vh;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
}

img, picture, video, canvas, svg {
    display: block;
    max-width: 100%;
}

input, button, textarea, select {
    font: inherit;
}

p, h1, h2, h3, h4, h5, h6 {
    overflow-wrap: break-word;
}

h1, h2, h3, h4, h5, h6 {
    text-wrap: balance;
}

p {
    text-wrap: pretty;
}

#root, #__next {
    isolation: isolate;
}
```

### 30.2 Naming Conventions — BEM

```css
/* BEM: Block__Element--Modifier */

/* Block */
.card { }

/* Element (child of block) */
.card__header { }
.card__body { }
.card__footer { }
.card__title { }
.card__image { }

/* Modifier (variation) */
.card--featured { }
.card--compact { }
.card__title--large { }
.card__button--primary { }

/* Example */
.search-form { }
.search-form__input { }
.search-form__button { }
.search-form--inline { }
.search-form__button--disabled { }
```

### 30.3 CSS Architecture Patterns

```
/* ITCSS (Inverted Triangle CSS) — Layers from generic to specific */
styles/
├── 01-settings/     → Variables, config (no output)
│   ├── _colors.css
│   └── _typography.css
├── 02-tools/        → Mixins, functions (no output)
├── 03-generic/      → Reset, normalize
│   └── _reset.css
├── 04-elements/     → Bare HTML elements (h1, p, a, etc.)
│   └── _base.css
├── 05-objects/       → Layout patterns (grid, container)
│   └── _layout.css
├── 06-components/   → UI components (card, button, modal)
│   ├── _card.css
│   ├── _button.css
│   └── _modal.css
├── 07-utilities/    → Helper classes (!important OK here)
│   └── _utilities.css
└── main.css          → Import all files
```

### 30.4 Performance Tips

```css
/* ✅ DO: Use transform and opacity for animations */
.animated { transition: transform 0.3s, opacity 0.3s; }

/* ❌ AVOID: Animating layout properties */
.slow { transition: width 0.3s, height 0.3s, margin 0.3s; }

/* ✅ DO: Use will-change sparingly for complex animations */
.complex-animation { will-change: transform; }

/* ✅ DO: Use content-visibility for off-screen content */
.below-fold { content-visibility: auto; contain-intrinsic-size: 0 500px; }

/* ✅ DO: Use contain for layout isolation */
.widget { contain: layout style paint; }

/* ✅ DO: Use font-display: swap */
@font-face { font-display: swap; }

/* ✅ DO: Reduce selector complexity */
.card-title { }              /* Simple — fast */
body div.container ul li a { } /* Complex — slow */
```

### 30.5 Accessibility Checklist

```css
/* ✅ Focus styles */
:focus-visible {
    outline: 3px solid var(--color-primary);
    outline-offset: 2px;
}

/* ✅ Reduced motion */
@media (prefers-reduced-motion: reduce) {
    * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}

/* ✅ High contrast */
@media (forced-colors: active) {
    .btn { border: 2px solid ButtonText; }
}

/* ✅ Minimum touch target (44x44px) */
button, a { min-width: 44px; min-height: 44px; }

/* ✅ Color contrast (WCAG AA: 4.5:1 for text, 3:1 for large text) */

/* ✅ Don't rely on color alone */
.error { color: red; border-left: 3px solid red; } /* Color + visual indicator */

/* ✅ Screen reader only */
.sr-only {
    position: absolute; width: 1px; height: 1px;
    padding: 0; margin: -1px; overflow: hidden;
    clip: rect(0,0,0,0); white-space: nowrap; border: 0;
}
```

---

> **End of CSS Comprehensive Reference Guide**
>
> This document covers all major CSS features through 2026. For the latest specifications, refer to [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS) and the [W3C CSS specifications](https://www.w3.org/Style/CSS/).
