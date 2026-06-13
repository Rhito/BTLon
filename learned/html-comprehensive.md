# HTML — Comprehensive Reference Guide

> **Version focus**: HTML5 (Living Standard)  
> **Last updated**: May 2026  
> **Purpose**: Complete reference for every major HTML element, attribute, semantic structure, and modern APIs.

---

## Table of Contents

1. [Document Structure](#1-document-structure)
2. [Head Elements & Meta](#2-head-elements--meta)
3. [Text Content](#3-text-content)
4. [Inline Text Semantics](#4-inline-text-semantics)
5. [Links & Navigation](#5-links--navigation)
6. [Lists](#6-lists)
7. [Tables](#7-tables)
8. [Forms & Input](#8-forms--input)
9. [Media Elements](#9-media-elements)
10. [Semantic / Structural Elements](#10-semantic--structural-elements)
11. [Sectioning & Content Model](#11-sectioning--content-model)
12. [Interactive Elements](#12-interactive-elements)
13. [Embedded Content](#13-embedded-content)
14. [Scripting & Templates](#14-scripting--templates)
15. [Global Attributes](#15-global-attributes)
16. [Data Attributes](#16-data-attributes)
17. [ARIA & Accessibility](#17-aria--accessibility)
18. [Character Entities](#18-character-entities)
19. [HTML5 APIs Overview](#19-html5-apis-overview)
20. [SEO Best Practices](#20-seo-best-practices)
21. [Complete Element Reference Table](#21-complete-element-reference-table)

---

## 1. Document Structure

### 1.1 Basic HTML5 Boilerplate

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Page Title</title>
    <meta name="description" content="A brief description of the page content.">
    <link rel="stylesheet" href="styles.css">
    <link rel="icon" type="image/png" href="/favicon.png">
</head>
<body>
    <!-- Page content goes here -->

    <script src="app.js"></script>
</body>
</html>
```

### 1.2 DOCTYPE Declaration

```html
<!-- HTML5 (current standard) -->
<!DOCTYPE html>

<!-- Older DOCTYPEs (historical reference) -->
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
```

> ⚠️ Always use `<!DOCTYPE html>` for HTML5. It ensures the browser renders in standards mode.

### 1.3 The `<html>` Element

```html
<!-- Language declaration (important for SEO & accessibility) -->
<html lang="en">           <!-- English -->
<html lang="vi">           <!-- Vietnamese -->
<html lang="ja">           <!-- Japanese -->
<html lang="en" dir="ltr"> <!-- Left-to-right -->
<html lang="ar" dir="rtl"> <!-- Right-to-left (Arabic) -->
```

### 1.4 Full Production Boilerplate

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Character encoding -->
    <meta charset="UTF-8">

    <!-- Responsive viewport -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- Page title (50–60 characters ideal) -->
    <title>My Website — Home Page</title>

    <!-- SEO meta -->
    <meta name="description" content="Brief, compelling page description (150-160 chars).">
    <meta name="keywords" content="keyword1, keyword2, keyword3">
    <meta name="author" content="Author Name">
    <meta name="robots" content="index, follow">

    <!-- Open Graph (Facebook / LinkedIn) -->
    <meta property="og:title" content="My Website — Home Page">
    <meta property="og:description" content="Brief description for social sharing.">
    <meta property="og:image" content="https://example.com/og-image.jpg">
    <meta property="og:url" content="https://example.com/">
    <meta property="og:type" content="website">
    <meta property="og:locale" content="en_US">
    <meta property="og:site_name" content="My Website">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@username">
    <meta name="twitter:title" content="My Website — Home Page">
    <meta name="twitter:description" content="Brief description for Twitter.">
    <meta name="twitter:image" content="https://example.com/twitter-image.jpg">

    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="manifest" href="/site.webmanifest">

    <!-- Canonical URL -->
    <link rel="canonical" href="https://example.com/">

    <!-- Preconnect for performance -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

    <!-- DNS prefetch -->
    <link rel="dns-prefetch" href="https://cdn.example.com">

    <!-- Preload critical resources -->
    <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="/css/critical.css" as="style">

    <!-- Stylesheets -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap">
    <link rel="stylesheet" href="/css/styles.css">

    <!-- Theme color (mobile browsers) -->
    <meta name="theme-color" content="#4285f4">

    <!-- Structured data (JSON-LD) -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "My Website",
        "url": "https://example.com"
    }
    </script>
</head>
<body>
    <!-- Content -->

    <!-- Scripts (defer for non-critical) -->
    <script src="/js/app.js" defer></script>
</body>
</html>
```

---

## 2. Head Elements & Meta

### 2.1 Essential Meta Tags

```html
<!-- Character encoding (must be in first 1024 bytes) -->
<meta charset="UTF-8">

<!-- Viewport for responsive design -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">

<!-- Compatibility -->
<meta http-equiv="X-UA-Compatible" content="IE=edge">

<!-- Description for search engines -->
<meta name="description" content="Page description here, 150-160 characters ideal.">

<!-- Robots directives -->
<meta name="robots" content="index, follow">          <!-- Default: crawl + index -->
<meta name="robots" content="noindex, nofollow">       <!-- Don't crawl or index -->
<meta name="robots" content="noindex, follow">         <!-- Follow links but don't index -->
<meta name="robots" content="index, nofollow">         <!-- Index but don't follow links -->
<meta name="robots" content="noarchive">               <!-- Don't cache -->
<meta name="robots" content="nosnippet">               <!-- Don't show snippet -->
<meta name="googlebot" content="notranslate">          <!-- Google-specific -->

<!-- Author -->
<meta name="author" content="Author Name">

<!-- Generator -->
<meta name="generator" content="WordPress 6.0">

<!-- Application name -->
<meta name="application-name" content="My App">

<!-- Theme color -->
<meta name="theme-color" content="#4285f4">
<meta name="theme-color" content="#1a1a2e" media="(prefers-color-scheme: dark)">

<!-- Color scheme -->
<meta name="color-scheme" content="light dark">
```

### 2.2 HTTP-Equiv Meta Tags

```html
<!-- Redirect after N seconds -->
<meta http-equiv="refresh" content="5; url=https://example.com/new-page">

<!-- Content Security Policy -->
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' https://cdn.example.com;">

<!-- Cache control -->
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Expires" content="0">

<!-- Content type (legacy — use charset instead) -->
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
```

### 2.3 Link Elements

```html
<!-- Stylesheets -->
<link rel="stylesheet" href="styles.css">
<link rel="stylesheet" href="print.css" media="print">
<link rel="stylesheet" href="mobile.css" media="(max-width: 768px)">

<!-- Favicon variants -->
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">

<!-- Canonical URL (avoid duplicate content) -->
<link rel="canonical" href="https://example.com/page">

<!-- Alternate versions -->
<link rel="alternate" hreflang="en" href="https://example.com/en/page">
<link rel="alternate" hreflang="vi" href="https://example.com/vi/page">
<link rel="alternate" hreflang="x-default" href="https://example.com/page">
<link rel="alternate" type="application/rss+xml" title="RSS Feed" href="/feed.xml">

<!-- Pagination -->
<link rel="prev" href="/page/1">
<link rel="next" href="/page/3">

<!-- Performance hints -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="dns-prefetch" href="https://cdn.example.com">
<link rel="preload" href="/font.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/hero.webp" as="image">
<link rel="prefetch" href="/next-page.html">         <!-- Likely next navigation -->
<link rel="prerender" href="/next-page.html">         <!-- Pre-render entire page -->
<link rel="modulepreload" href="/js/module.js">        <!-- Preload ES module -->

<!-- Licensing -->
<link rel="license" href="/license.html">

<!-- Search -->
<link rel="search" type="application/opensearchdescription+xml" title="Search" href="/opensearch.xml">
```

### 2.4 Title & Base

```html
<!-- Page title (crucial for SEO) -->
<title>Primary Keyword — Secondary Keyword | Brand Name</title>

<!-- Base URL for relative links -->
<base href="https://example.com/">
<base target="_blank">    <!-- All links open in new tab by default -->
```

### 2.5 Style & Script in Head

```html
<!-- Inline styles -->
<style>
    body { margin: 0; font-family: 'Inter', sans-serif; }
</style>

<!-- External script -->
<script src="app.js"></script>           <!-- Blocks parsing -->
<script src="app.js" defer></script>     <!-- Download parallel, execute after parse -->
<script src="app.js" async></script>     <!-- Download parallel, execute immediately -->
<script src="app.js" type="module"></script> <!-- ES module (deferred by default) -->
<script src="app.js" nomodule></script>  <!-- Fallback for browsers without module support -->

<!-- Inline script -->
<script>
    console.log('Hello, World!');
</script>

<!-- Noscript fallback -->
<noscript>
    <p>JavaScript is required to use this application.</p>
</noscript>
```

**Script Loading Strategies:**

| Attribute | Download | Execution | Order Guaranteed |
|-----------|----------|-----------|-----------------|
| (none) | Blocks parsing | Immediately | Yes |
| `async` | Parallel | When ready | No |
| `defer` | Parallel | After DOM parse | Yes |
| `type="module"` | Parallel | After DOM parse | Yes |

---

## 3. Text Content

### 3.1 Headings

```html
<!-- Headings h1–h6 (hierarchical, one h1 per page) -->
<h1>Main Page Title</h1>         <!-- Only ONE per page -->
<h2>Section Heading</h2>
<h3>Subsection Heading</h3>
<h4>Sub-subsection</h4>
<h5>Minor heading</h5>
<h6>Smallest heading</h6>

<!-- Heading group (with subtitle) -->
<hgroup>
    <h1>Main Title</h1>
    <p>A subtitle or tagline</p>
</hgroup>
```

### 3.2 Paragraphs & Line Breaks

```html
<!-- Paragraph -->
<p>This is a paragraph of text. It creates a block-level container for text content.</p>

<!-- Line break (void element — no closing tag) -->
<p>Line one<br>Line two<br>Line three</p>

<!-- Horizontal rule (thematic break) -->
<hr>

<!-- Preformatted text (preserves whitespace & line breaks) -->
<pre>
    This   text   preserves
    all   spaces  and
    line breaks exactly as written.
</pre>

<!-- Code block (combine with pre) -->
<pre><code class="language-javascript">
function greet(name) {
    return `Hello, ${name}!`;
}
</code></pre>
```

### 3.3 Block Quotations

```html
<!-- Block quotation -->
<blockquote cite="https://example.com/source">
    <p>The only way to do great work is to love what you do.</p>
    <footer>— <cite>Steve Jobs</cite></footer>
</blockquote>

<!-- Inline quotation (adds quotation marks automatically) -->
<p>He said, <q>This is amazing!</q></p>
```

### 3.4 Figures & Captions

```html
<figure>
    <img src="chart.png" alt="Sales chart for Q4 2025">
    <figcaption>Figure 1: Quarterly sales performance</figcaption>
</figure>

<!-- Figures can contain any content -->
<figure>
    <pre><code>console.log('Hello');</code></pre>
    <figcaption>Example: Basic JavaScript output</figcaption>
</figure>

<figure>
    <blockquote>
        <p>To be or not to be.</p>
    </blockquote>
    <figcaption>— William Shakespeare, <cite>Hamlet</cite></figcaption>
</figure>
```

### 3.5 Address

```html
<!-- Contact information for the nearest article or body -->
<address>
    Written by <a href="mailto:john@example.com">John Doe</a>.<br>
    123 Main Street<br>
    City, State 12345
</address>
```

---

## 4. Inline Text Semantics

### 4.1 Emphasis & Importance

```html
<!-- Emphasis (usually italic) -->
<em>This text is emphasized</em>

<!-- Strong importance (usually bold) -->
<strong>This text is strongly important</strong>

<!-- Bold (stylistic, no semantic emphasis) -->
<b>Bold text without semantic emphasis</b>

<!-- Italic (stylistic, e.g., technical terms, foreign words) -->
<i>Technical term</i>
<i lang="la">Homo sapiens</i>

<!-- Small (side comments, fine print) -->
<small>Copyright © 2026. All rights reserved.</small>

<!-- Nested emphasis -->
<p><strong>Warning: <em>Do not</em> open this door.</strong></p>
```

### 4.2 Text Annotations

```html
<!-- Marked / highlighted text -->
<p>Search results: The word <mark>JavaScript</mark> was found.</p>

<!-- Deleted text (with timestamp) -->
<del datetime="2026-01-15">Old price: $99</del>

<!-- Inserted text -->
<ins datetime="2026-01-15">New price: $79</ins>

<!-- Strikethrough (no longer relevant — use del for edits) -->
<s>Out of stock</s>

<!-- Underline (stylistic, e.g., proper names in Chinese) -->
<u>Misspelled word</u>

<!-- Superscript & Subscript -->
<p>E = mc<sup>2</sup></p>
<p>H<sub>2</sub>O</p>

<!-- Ruby annotation (East Asian characters) -->
<ruby>
    漢<rp>(</rp><rt>kan</rt><rp>)</rp>
    字<rp>(</rp><rt>ji</rt><rp>)</rp>
</ruby>
```

### 4.3 Code & Technical

```html
<!-- Inline code -->
<p>Use the <code>console.log()</code> function to debug.</p>

<!-- Keyboard input -->
<p>Press <kbd>Ctrl</kbd> + <kbd>C</kbd> to copy.</p>

<!-- Sample output -->
<p>The compiler returned: <samp>Error: undefined variable</samp></p>

<!-- Variable -->
<p>The area of a circle is <var>π</var><var>r</var><sup>2</sup>.</p>

<!-- Machine-readable data -->
<p>The event starts at <data value="2026-05-26T09:00">9:00 AM</data>.</p>

<!-- Time (machine-readable datetime) -->
<p>Posted on <time datetime="2026-05-26">May 26, 2026</time></p>
<p>Event at <time datetime="2026-05-26T14:30:00+07:00">2:30 PM</time></p>
<p>Duration: <time datetime="PT2H30M">2 hours 30 minutes</time></p>
<p>Born in <time datetime="1990">1990</time></p>
```

### 4.4 Spans & Divs

```html
<!-- Span: inline generic container (for styling/scripting) -->
<p>My favorite color is <span style="color: blue;">blue</span>.</p>
<p>Total: <span class="price" id="total">$99.00</span></p>

<!-- Div: block-level generic container -->
<div class="card">
    <div class="card-header">Title</div>
    <div class="card-body">Content</div>
</div>
```

### 4.5 Bi-Directional Text

```html
<!-- Override text direction -->
<bdo dir="rtl">This text will be reversed</bdo>

<!-- Bi-directional isolation (for mixed LTR/RTL content) -->
<p>User <bdi>إيان</bdi> scored 3 points.</p>

<!-- Word break opportunity -->
<p>www.example<wbr>.com/really<wbr>/long<wbr>/url</p>
```

---

## 5. Links & Navigation

### 5.1 Anchor Links

```html
<!-- Basic link -->
<a href="https://example.com">Visit Example</a>

<!-- Open in new tab (always add rel for security) -->
<a href="https://example.com" target="_blank" rel="noopener noreferrer">
    External Link
</a>

<!-- Email link -->
<a href="mailto:hello@example.com">Email Us</a>
<a href="mailto:hello@example.com?subject=Hello&body=Hi there">
    Email with Subject
</a>

<!-- Phone link -->
<a href="tel:+1234567890">Call Us: (123) 456-7890</a>

<!-- SMS link -->
<a href="sms:+1234567890?body=Hello">Send SMS</a>

<!-- Download link -->
<a href="/files/report.pdf" download>Download Report</a>
<a href="/files/report.pdf" download="custom-name.pdf">Download Report</a>

<!-- Anchor / fragment link (jump to section) -->
<a href="#section-2">Jump to Section 2</a>
<h2 id="section-2">Section 2</h2>

<!-- Skip to main content (accessibility) -->
<a href="#main-content" class="skip-link">Skip to main content</a>

<!-- Link targets -->
<a href="page.html" target="_self">Same tab (default)</a>
<a href="page.html" target="_blank">New tab/window</a>
<a href="page.html" target="_parent">Parent frame</a>
<a href="page.html" target="_top">Top-level frame</a>

<!-- Link with title (tooltip) -->
<a href="https://example.com" title="Visit Example.com">Example</a>

<!-- Link with hreflang -->
<a href="/vi/" hreflang="vi">Tiếng Việt</a>

<!-- Link types (rel attribute) -->
<a href="/next" rel="next">Next Page</a>
<a href="/prev" rel="prev">Previous Page</a>
<a href="https://external.com" rel="nofollow">Sponsored Link</a>
<a href="https://external.com" rel="noopener noreferrer">External Link</a>
<a href="https://example.com" rel="external">External Site</a>
<a href="/help" rel="help">Help</a>
<a href="/license" rel="license">License</a>
<a href="#" rel="bookmark">Bookmark</a>
<a href="https://example.com" rel="sponsored">Sponsored</a>
<a href="https://example.com" rel="ugc">User Generated Content</a>
```

### 5.2 Navigation

```html
<!-- Nav element (landmark for screen readers) -->
<nav aria-label="Main navigation">
    <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/services">Services</a></li>
        <li><a href="/contact">Contact</a></li>
    </ul>
</nav>

<!-- Breadcrumb navigation -->
<nav aria-label="Breadcrumb">
    <ol>
        <li><a href="/">Home</a></li>
        <li><a href="/products">Products</a></li>
        <li aria-current="page">Widget Pro</li>
    </ol>
</nav>

<!-- Pagination -->
<nav aria-label="Pagination">
    <ul>
        <li><a href="/page/1" aria-label="Previous page">&laquo;</a></li>
        <li><a href="/page/1">1</a></li>
        <li><a href="/page/2" aria-current="page">2</a></li>
        <li><a href="/page/3">3</a></li>
        <li><a href="/page/3" aria-label="Next page">&raquo;</a></li>
    </ul>
</nav>
```

---

## 6. Lists

### 6.1 Unordered Lists

```html
<!-- Basic unordered list -->
<ul>
    <li>Item one</li>
    <li>Item two</li>
    <li>Item three</li>
</ul>

<!-- Nested list -->
<ul>
    <li>Frontend
        <ul>
            <li>HTML</li>
            <li>CSS</li>
            <li>JavaScript</li>
        </ul>
    </li>
    <li>Backend
        <ul>
            <li>PHP</li>
            <li>Node.js</li>
        </ul>
    </li>
</ul>
```

### 6.2 Ordered Lists

```html
<!-- Basic ordered list -->
<ol>
    <li>First step</li>
    <li>Second step</li>
    <li>Third step</li>
</ol>

<!-- Custom starting number -->
<ol start="5">
    <li>Fifth item</li>
    <li>Sixth item</li>
</ol>

<!-- Reversed order -->
<ol reversed>
    <li>Third place</li>
    <li>Second place</li>
    <li>First place</li>
</ol>

<!-- Custom type -->
<ol type="a">   <!-- a, b, c... -->
    <li>Item a</li>
    <li>Item b</li>
</ol>
<ol type="A">   <!-- A, B, C... -->
<ol type="i">   <!-- i, ii, iii... (roman numerals) -->
<ol type="I">   <!-- I, II, III... -->
<ol type="1">   <!-- 1, 2, 3... (default) -->

<!-- Custom value for specific item -->
<ol>
    <li>Normal (1)</li>
    <li value="10">Jump to 10</li>
    <li>Continues at 11</li>
</ol>
```

### 6.3 Description Lists

```html
<!-- Definition / description list -->
<dl>
    <dt>HTML</dt>
    <dd>HyperText Markup Language — the standard language for web pages.</dd>

    <dt>CSS</dt>
    <dd>Cascading Style Sheets — used for styling web pages.</dd>

    <dt>JavaScript</dt>
    <dd>A programming language for the web.</dd>
    <dd>Can be used on both frontend and backend.</dd>
</dl>

<!-- Grouped with div (for styling) -->
<dl>
    <div>
        <dt>Name</dt>
        <dd>John Doe</dd>
    </div>
    <div>
        <dt>Age</dt>
        <dd>30</dd>
    </div>
    <div>
        <dt>Occupation</dt>
        <dd>Web Developer</dd>
    </div>
</dl>
```

---

## 7. Tables

### 7.1 Basic Table Structure

```html
<table>
    <caption>Monthly Sales Report</caption>
    <thead>
        <tr>
            <th scope="col">Month</th>
            <th scope="col">Revenue</th>
            <th scope="col">Profit</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>January</td>
            <td>$10,000</td>
            <td>$2,500</td>
        </tr>
        <tr>
            <td>February</td>
            <td>$12,000</td>
            <td>$3,000</td>
        </tr>
    </tbody>
    <tfoot>
        <tr>
            <th scope="row">Total</th>
            <td>$22,000</td>
            <td>$5,500</td>
        </tr>
    </tfoot>
</table>
```

### 7.2 Spanning Rows & Columns

```html
<table>
    <thead>
        <tr>
            <th rowspan="2">Name</th>
            <th colspan="2">Scores</th>
        </tr>
        <tr>
            <th>Math</th>
            <th>English</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Alice</td>
            <td>95</td>
            <td>88</td>
        </tr>
        <tr>
            <td>Bob</td>
            <td>82</td>
            <td>91</td>
        </tr>
    </tbody>
</table>
```

### 7.3 Column Groups

```html
<table>
    <colgroup>
        <col>                                      <!-- Column 1 -->
        <col span="2" style="background: #f0f0f0"> <!-- Columns 2-3 -->
        <col style="background: #e0e0e0">          <!-- Column 4 -->
    </colgroup>
    <thead>
        <tr>
            <th>Name</th>
            <th>Q1</th>
            <th>Q2</th>
            <th>Total</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Widget A</td>
            <td>100</td>
            <td>150</td>
            <td>250</td>
        </tr>
    </tbody>
</table>
```

### 7.4 Accessible Tables

```html
<table aria-describedby="table-desc">
    <caption id="table-desc">Employee directory with contact information</caption>
    <thead>
        <tr>
            <th scope="col" id="name">Name</th>
            <th scope="col" id="dept">Department</th>
            <th scope="col" id="email">Email</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th scope="row" headers="name">John Doe</th>
            <td headers="dept">Engineering</td>
            <td headers="email">john@example.com</td>
        </tr>
    </tbody>
</table>
```

---

## 8. Forms & Input

### 8.1 Form Element

```html
<form action="/submit" method="POST" enctype="multipart/form-data"
      id="registration-form" name="registration"
      autocomplete="on" novalidate
      accept-charset="UTF-8"
      target="_self">
    <!-- Form content -->
</form>

<!-- Form attributes reference -->
<!-- action     — URL to submit data to -->
<!-- method     — GET | POST -->
<!-- enctype    — multipart/form-data (for files) | application/x-www-form-urlencoded (default) | text/plain -->
<!-- novalidate — Disable browser validation -->
<!-- autocomplete — on | off -->
<!-- target     — _self | _blank | _parent | _top -->
```

### 8.2 Text Inputs

```html
<!-- Text input -->
<label for="username">Username:</label>
<input type="text" id="username" name="username"
       placeholder="Enter username"
       value=""
       maxlength="50"
       minlength="3"
       size="30"
       pattern="[A-Za-z0-9]+"
       required
       autofocus
       autocomplete="username"
       spellcheck="false"
       aria-describedby="username-help">
<small id="username-help">Only letters and numbers, 3-50 characters.</small>

<!-- Password -->
<input type="password" id="password" name="password"
       minlength="8"
       required
       autocomplete="new-password">

<!-- Email -->
<input type="email" id="email" name="email"
       placeholder="user@example.com"
       required
       multiple          <!-- Allow multiple emails separated by commas -->
       autocomplete="email">

<!-- URL -->
<input type="url" id="website" name="website"
       placeholder="https://example.com"
       pattern="https?://.+"
       autocomplete="url">

<!-- Phone -->
<input type="tel" id="phone" name="phone"
       placeholder="+1 (123) 456-7890"
       pattern="[+]?[0-9\s\-\(\)]+"
       autocomplete="tel">

<!-- Search -->
<input type="search" id="search" name="q"
       placeholder="Search..."
       autocomplete="off"
       list="search-suggestions">
<datalist id="search-suggestions">
    <option value="HTML">
    <option value="CSS">
    <option value="JavaScript">
</datalist>

<!-- Hidden -->
<input type="hidden" name="csrf_token" value="abc123">
<input type="hidden" name="user_id" value="42">
```

### 8.3 Number & Range Inputs

```html
<!-- Number -->
<input type="number" id="quantity" name="quantity"
       min="1" max="100" step="1" value="1">

<!-- Range (slider) -->
<label for="volume">Volume: <output id="volume-output">50</output>%</label>
<input type="range" id="volume" name="volume"
       min="0" max="100" step="5" value="50"
       oninput="document.getElementById('volume-output').value = this.value">
```

### 8.4 Date & Time Inputs

```html
<!-- Date -->
<input type="date" id="birthday" name="birthday"
       min="1900-01-01" max="2026-12-31" value="2000-01-01">

<!-- Time -->
<input type="time" id="alarm" name="alarm"
       min="06:00" max="22:00" step="900"> <!-- step in seconds (900 = 15 min) -->

<!-- Datetime-local -->
<input type="datetime-local" id="meeting" name="meeting"
       min="2026-01-01T00:00" max="2026-12-31T23:59">

<!-- Month -->
<input type="month" id="expire" name="expire" min="2026-01">

<!-- Week -->
<input type="week" id="week" name="week" min="2026-W01">
```

### 8.5 Color Picker

```html
<label for="color">Choose a color:</label>
<input type="color" id="color" name="color" value="#4285f4">
```

### 8.6 File Upload

```html
<!-- Single file -->
<input type="file" id="avatar" name="avatar"
       accept="image/png, image/jpeg, image/webp">

<!-- Multiple files -->
<input type="file" id="gallery" name="gallery[]"
       accept="image/*" multiple>

<!-- Specific file types -->
<input type="file" accept=".pdf,.doc,.docx">        <!-- By extension -->
<input type="file" accept="video/*">                 <!-- All video types -->
<input type="file" accept="audio/*">                 <!-- All audio types -->

<!-- Camera capture (mobile) -->
<input type="file" accept="image/*" capture="user">  <!-- Front camera -->
<input type="file" accept="image/*" capture="environment"> <!-- Back camera -->
<input type="file" accept="video/*" capture="user">  <!-- Video from front camera -->
```

### 8.7 Checkboxes & Radio Buttons

```html
<!-- Checkbox (multiple selections) -->
<fieldset>
    <legend>Select your interests:</legend>

    <label>
        <input type="checkbox" name="interests[]" value="html" checked>
        HTML
    </label>

    <label>
        <input type="checkbox" name="interests[]" value="css">
        CSS
    </label>

    <label>
        <input type="checkbox" name="interests[]" value="js">
        JavaScript
    </label>

    <!-- Indeterminate state (set via JavaScript) -->
    <label>
        <input type="checkbox" name="select_all" id="select-all">
        Select All
    </label>
</fieldset>

<!-- Radio buttons (single selection) -->
<fieldset>
    <legend>Choose a plan:</legend>

    <label>
        <input type="radio" name="plan" value="free" checked>
        Free
    </label>

    <label>
        <input type="radio" name="plan" value="pro">
        Pro ($9/month)
    </label>

    <label>
        <input type="radio" name="plan" value="enterprise">
        Enterprise ($29/month)
    </label>
</fieldset>
```

### 8.8 Select & Datalist

```html
<!-- Select dropdown -->
<label for="country">Country:</label>
<select id="country" name="country" required>
    <option value="" disabled selected>Choose a country</option>
    <optgroup label="Asia">
        <option value="VN">Vietnam</option>
        <option value="JP">Japan</option>
        <option value="KR">South Korea</option>
    </optgroup>
    <optgroup label="Europe">
        <option value="UK">United Kingdom</option>
        <option value="DE">Germany</option>
        <option value="FR">France</option>
    </optgroup>
</select>

<!-- Multiple select -->
<select id="skills" name="skills[]" multiple size="5">
    <option value="html">HTML</option>
    <option value="css">CSS</option>
    <option value="js" selected>JavaScript</option>
    <option value="php">PHP</option>
    <option value="python">Python</option>
</select>

<!-- Datalist (autocomplete suggestions) -->
<label for="browser">Browser:</label>
<input list="browsers" id="browser" name="browser">
<datalist id="browsers">
    <option value="Chrome">
    <option value="Firefox">
    <option value="Safari">
    <option value="Edge">
    <option value="Opera">
</datalist>
```

### 8.9 Textarea

```html
<label for="message">Message:</label>
<textarea id="message" name="message"
          rows="5" cols="50"
          minlength="10" maxlength="1000"
          placeholder="Write your message here..."
          required
          wrap="soft"
          spellcheck="true"
          autocomplete="off"></textarea>

<!-- wrap attribute: -->
<!-- soft — no hard line breaks in submitted data (default) -->
<!-- hard — hard line breaks added (requires cols) -->
<!-- off  — no wrapping at all -->
```

### 8.10 Buttons

```html
<!-- Submit button -->
<button type="submit">Submit Form</button>
<input type="submit" value="Submit Form">

<!-- Reset button -->
<button type="reset">Reset</button>
<input type="reset" value="Reset">

<!-- Generic button (for JavaScript) -->
<button type="button" onclick="doSomething()">Click Me</button>

<!-- Button with icon -->
<button type="submit">
    <svg>...</svg>
    <span>Save</span>
</button>

<!-- Image button -->
<input type="image" src="submit-button.png" alt="Submit"
       width="100" height="40">

<!-- Disabled button -->
<button type="submit" disabled>Processing...</button>

<!-- Form override attributes -->
<button type="submit"
        formaction="/alternative-submit"
        formmethod="GET"
        formenctype="multipart/form-data"
        formnovalidate
        formtarget="_blank">
    Submit to Alternative
</button>
```

### 8.11 Output & Progress & Meter

```html
<!-- Output (result of calculation) -->
<form oninput="result.value = parseInt(a.value) + parseInt(b.value)">
    <input type="number" id="a" name="a" value="0"> +
    <input type="number" id="b" name="b" value="0"> =
    <output name="result" for="a b">0</output>
</form>

<!-- Progress bar -->
<progress value="70" max="100">70%</progress>
<progress>Loading...</progress>  <!-- Indeterminate (no value) -->

<!-- Meter (gauge/measurement) -->
<meter value="0.7" min="0" max="1"
       low="0.3" high="0.7" optimum="1">
    70%
</meter>

<!-- Meter examples -->
<label for="fuel">Fuel level:</label>
<meter id="fuel" min="0" max="100" low="25" high="75" optimum="100" value="80">
    80/100
</meter>

<label for="grade">Grade:</label>
<meter id="grade" min="0" max="100" low="40" high="80" optimum="100" value="55">
    C
</meter>
```

### 8.12 Fieldset & Legend

```html
<form>
    <fieldset>
        <legend>Personal Information</legend>
        <label for="fname">First Name:</label>
        <input type="text" id="fname" name="fname" required>

        <label for="lname">Last Name:</label>
        <input type="text" id="lname" name="lname" required>
    </fieldset>

    <fieldset>
        <legend>Account Settings</legend>
        <label for="email2">Email:</label>
        <input type="email" id="email2" name="email" required>

        <label for="pass">Password:</label>
        <input type="password" id="pass" name="password" required>
    </fieldset>

    <!-- Disabled fieldset (disables all children) -->
    <fieldset disabled>
        <legend>Locked Section</legend>
        <input type="text" name="locked" value="Cannot edit">
    </fieldset>

    <button type="submit">Register</button>
</form>
```

### 8.13 Input Attributes Reference

| Attribute | Description | Applies To |
|-----------|-------------|------------|
| `type` | Input type | All inputs |
| `name` | Form data key | All |
| `value` | Default/current value | All |
| `id` | Unique identifier | All |
| `placeholder` | Hint text | text, search, url, tel, email, password, number |
| `required` | Must be filled | All except hidden, image, submit, reset, button |
| `disabled` | Cannot interact | All |
| `readonly` | Cannot modify (still submitted) | text, search, url, tel, email, password, number, date/time |
| `autofocus` | Focus on page load | All (one per page) |
| `autocomplete` | Browser autocomplete | text, search, url, tel, email, password, date, range, color |
| `form` | Associate with form by ID | All |
| `min` / `max` | Minimum / maximum value | number, range, date, time, datetime-local, month, week |
| `step` | Increment step | number, range, date, time, datetime-local |
| `minlength` / `maxlength` | Character count limits | text, search, url, tel, email, password, textarea |
| `pattern` | Regex validation pattern | text, search, url, tel, email, password |
| `multiple` | Allow multiple values | email, file |
| `size` | Visible character width | text, search, url, tel, email, password |
| `accept` | Allowed file types | file |
| `capture` | Camera preference | file |
| `list` | Reference to datalist | text, search, url, tel, email, number, range, date, time, datetime-local, month, week, color |
| `checked` | Pre-selected | checkbox, radio |
| `spellcheck` | Spell checking | text, textarea |
| `inputmode` | Virtual keyboard type | text, search |
| `enterkeyhint` | Action key label | text, search |

### 8.14 Inputmode & Enterkeyhint

```html
<!-- Virtual keyboard hints (mobile) -->
<input type="text" inputmode="numeric">       <!-- Number pad -->
<input type="text" inputmode="decimal">       <!-- Number pad with decimal -->
<input type="text" inputmode="tel">           <!-- Phone keypad -->
<input type="text" inputmode="email">         <!-- Email keyboard (@, .) -->
<input type="text" inputmode="url">           <!-- URL keyboard (/, .com) -->
<input type="text" inputmode="search">        <!-- Search keyboard -->
<input type="text" inputmode="none">          <!-- No virtual keyboard -->

<!-- Enter key customization (mobile) -->
<input type="text" enterkeyhint="enter">      <!-- Default -->
<input type="text" enterkeyhint="done">       <!-- "Done" button -->
<input type="text" enterkeyhint="go">         <!-- "Go" button -->
<input type="text" enterkeyhint="next">       <!-- "Next" button -->
<input type="text" enterkeyhint="previous">   <!-- "Previous" button -->
<input type="text" enterkeyhint="search">     <!-- "Search" button -->
<input type="text" enterkeyhint="send">       <!-- "Send" button -->
```

### 8.15 Autocomplete Values

```html
<!-- Name -->
<input autocomplete="name">                   <!-- Full name -->
<input autocomplete="given-name">             <!-- First name -->
<input autocomplete="family-name">            <!-- Last name -->
<input autocomplete="honorific-prefix">       <!-- Mr., Ms., Dr. -->
<input autocomplete="nickname">

<!-- Contact -->
<input autocomplete="email">
<input autocomplete="tel">
<input autocomplete="tel-country-code">
<input autocomplete="url">

<!-- Address -->
<input autocomplete="street-address">
<input autocomplete="address-line1">
<input autocomplete="address-line2">
<input autocomplete="address-level1">         <!-- State/Province -->
<input autocomplete="address-level2">         <!-- City -->
<input autocomplete="postal-code">
<input autocomplete="country">
<input autocomplete="country-name">

<!-- Payment -->
<input autocomplete="cc-name">               <!-- Cardholder name -->
<input autocomplete="cc-number">             <!-- Card number -->
<input autocomplete="cc-exp">               <!-- Expiry date -->
<input autocomplete="cc-exp-month">
<input autocomplete="cc-exp-year">
<input autocomplete="cc-csc">               <!-- Security code -->
<input autocomplete="cc-type">              <!-- Visa, Mastercard -->

<!-- Account -->
<input autocomplete="username">
<input autocomplete="new-password">          <!-- Registration -->
<input autocomplete="current-password">      <!-- Login -->
<input autocomplete="one-time-code">         <!-- OTP/2FA -->

<!-- Personal -->
<input autocomplete="bday">                  <!-- Birthday -->
<input autocomplete="bday-day">
<input autocomplete="bday-month">
<input autocomplete="bday-year">
<input autocomplete="sex">
<input autocomplete="organization">
<input autocomplete="organization-title">     <!-- Job title -->
```

---

## 9. Media Elements

### 9.1 Images

```html
<!-- Basic image -->
<img src="photo.jpg" alt="Description of the image"
     width="800" height="600"
     loading="lazy">

<!-- Responsive image with srcset -->
<img src="photo-800.jpg"
     srcset="photo-400.jpg 400w,
             photo-800.jpg 800w,
             photo-1200.jpg 1200w,
             photo-1600.jpg 1600w"
     sizes="(max-width: 600px) 100vw,
            (max-width: 1200px) 50vw,
            33vw"
     alt="Responsive photo"
     loading="lazy"
     decoding="async">

<!-- Picture element (art direction + format fallback) -->
<picture>
    <!-- WebP format (preferred) -->
    <source srcset="photo.webp" type="image/webp">
    <!-- AVIF format -->
    <source srcset="photo.avif" type="image/avif">
    <!-- Different crop for mobile -->
    <source media="(max-width: 768px)" srcset="photo-mobile.jpg">
    <!-- Different crop for dark mode -->
    <source media="(prefers-color-scheme: dark)" srcset="photo-dark.jpg">
    <!-- Fallback -->
    <img src="photo.jpg" alt="Photo description" loading="lazy">
</picture>

<!-- Image attributes -->
<!-- src       — Image URL -->
<!-- alt       — Alternative text (REQUIRED for accessibility) -->
<!-- width     — Intrinsic width (prevents layout shift) -->
<!-- height    — Intrinsic height -->
<!-- loading   — lazy | eager (default) -->
<!-- decoding  — async | sync | auto -->
<!-- fetchpriority — high | low | auto (for LCP images) -->
<!-- crossorigin   — anonymous | use-credentials -->
<!-- referrerpolicy — no-referrer | origin | ... -->
<!-- ismap     — Server-side image map -->
<!-- usemap    — Client-side image map reference -->

<!-- Critical image (above the fold — load immediately) -->
<img src="hero.jpg" alt="Hero image"
     width="1920" height="1080"
     loading="eager"
     fetchpriority="high"
     decoding="async">

<!-- Decorative image (empty alt) -->
<img src="decoration.svg" alt="" role="presentation">

<!-- Image map -->
<img src="workspace.jpg" alt="Office layout" usemap="#office-map">
<map name="office-map">
    <area shape="rect" coords="0,0,200,200" href="/room-a" alt="Room A">
    <area shape="circle" coords="300,150,50" href="/room-b" alt="Room B">
    <area shape="poly" coords="400,100,500,200,400,300" href="/room-c" alt="Room C">
</map>
```

### 9.2 Video

```html
<!-- Basic video -->
<video src="video.mp4" controls width="640" height="360">
    Your browser does not support the video tag.
</video>

<!-- Video with multiple sources -->
<video controls width="640" height="360"
       poster="thumbnail.jpg"
       preload="metadata"
       playsinline
       crossorigin="anonymous">
    <source src="video.webm" type="video/webm">
    <source src="video.mp4" type="video/mp4">
    <source src="video.ogg" type="video/ogg">

    <!-- Subtitles / Captions -->
    <track kind="subtitles" src="subs-en.vtt" srclang="en" label="English" default>
    <track kind="subtitles" src="subs-vi.vtt" srclang="vi" label="Tiếng Việt">
    <track kind="captions" src="captions-en.vtt" srclang="en" label="English (CC)">
    <track kind="descriptions" src="descriptions.vtt" srclang="en" label="Audio Descriptions">
    <track kind="chapters" src="chapters.vtt" srclang="en" label="Chapters">

    <!-- Fallback -->
    <p>Your browser doesn't support HTML video.
       <a href="video.mp4">Download the video</a>.</p>
</video>

<!-- Video attributes -->
<!-- controls    — Show player controls -->
<!-- autoplay    — Auto-start (requires muted for most browsers) -->
<!-- muted       — Start muted -->
<!-- loop        — Loop playback -->
<!-- poster      — Preview image -->
<!-- preload     — none | metadata | auto -->
<!-- playsinline — Inline on mobile (not fullscreen) -->
<!-- width/height — Dimensions -->
<!-- crossorigin — CORS setting -->
<!-- disablepictureinpicture — Disable PiP -->
<!-- disableremoteplayback   — Disable cast/remote -->

<!-- Autoplay with muted (most reliable) -->
<video autoplay muted loop playsinline>
    <source src="background.mp4" type="video/mp4">
</video>
```

### 9.3 Audio

```html
<!-- Basic audio -->
<audio controls>
    <source src="audio.mp3" type="audio/mpeg">
    <source src="audio.ogg" type="audio/ogg">
    <source src="audio.wav" type="audio/wav">
    <p>Your browser doesn't support HTML audio.
       <a href="audio.mp3">Download</a>.</p>
</audio>

<!-- Audio attributes (same as video minus visual ones) -->
<!-- controls, autoplay, muted, loop, preload, crossorigin -->
```

### 9.4 Track Element (Subtitles/Captions)

```html
<!-- WebVTT format (.vtt) -->
<!--
WEBVTT

00:00:01.000 --> 00:00:05.000
Hello and welcome to this video.

00:00:05.500 --> 00:00:10.000
Today we'll learn about HTML5 video.
-->

<!-- Track kinds -->
<!-- subtitles    — Translation of dialogue -->
<!-- captions     — Transcription + sound effects (for deaf/hard of hearing) -->
<!-- descriptions — Text descriptions of visual content (for blind users) -->
<!-- chapters     — Chapter titles for navigation -->
<!-- metadata     — Machine-readable data -->
```

### 9.5 SVG (Inline)

```html
<!-- Inline SVG -->
<svg width="100" height="100" viewBox="0 0 100 100"
     xmlns="http://www.w3.org/2000/svg"
     role="img" aria-labelledby="svg-title">
    <title id="svg-title">Red Circle</title>
    <circle cx="50" cy="50" r="40" fill="red" stroke="black" stroke-width="2"/>
</svg>

<!-- Common SVG shapes -->
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <!-- Rectangle -->
    <rect x="10" y="10" width="80" height="60" rx="5" fill="blue"/>

    <!-- Circle -->
    <circle cx="150" cy="40" r="30" fill="green"/>

    <!-- Ellipse -->
    <ellipse cx="50" cy="120" rx="40" ry="20" fill="orange"/>

    <!-- Line -->
    <line x1="10" y1="180" x2="190" y2="180" stroke="black" stroke-width="2"/>

    <!-- Polyline -->
    <polyline points="10,150 50,130 90,170 130,140"
              fill="none" stroke="purple" stroke-width="2"/>

    <!-- Polygon -->
    <polygon points="150,100 180,160 120,160" fill="red"/>

    <!-- Path (most powerful) -->
    <path d="M10 190 Q 50 100, 90 190 T 170 190"
          fill="none" stroke="teal" stroke-width="2"/>

    <!-- Text -->
    <text x="100" y="195" text-anchor="middle" font-size="12" fill="black">
        SVG Shapes
    </text>
</svg>
```

---

## 10. Semantic / Structural Elements

### 10.1 Page Layout Semantics

```html
<body>
    <!-- Site header -->
    <header>
        <nav aria-label="Main navigation">
            <a href="/" class="logo">MySite</a>
            <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/about">About</a></li>
                <li><a href="/blog">Blog</a></li>
                <li><a href="/contact">Contact</a></li>
            </ul>
        </nav>
    </header>

    <!-- Main content (one per page) -->
    <main id="main-content">
        <!-- Article (self-contained content) -->
        <article>
            <header>
                <h1>Article Title</h1>
                <p>Published on <time datetime="2026-05-26">May 26, 2026</time></p>
            </header>

            <section>
                <h2>Introduction</h2>
                <p>Article content here...</p>
            </section>

            <section>
                <h2>Main Points</h2>
                <p>More content...</p>
            </section>

            <footer>
                <p>Written by <a href="/author/john">John Doe</a></p>
                <p>Tags: <a href="/tag/html">HTML</a>, <a href="/tag/web">Web</a></p>
            </footer>
        </article>

        <!-- Sidebar -->
        <aside aria-label="Sidebar">
            <section>
                <h2>Related Articles</h2>
                <ul>
                    <li><a href="/post-1">Related Post 1</a></li>
                    <li><a href="/post-2">Related Post 2</a></li>
                </ul>
            </section>

            <section>
                <h2>Newsletter</h2>
                <form>
                    <label for="newsletter-email">Email:</label>
                    <input type="email" id="newsletter-email" required>
                    <button type="submit">Subscribe</button>
                </form>
            </section>
        </aside>
    </main>

    <!-- Site footer -->
    <footer>
        <nav aria-label="Footer navigation">
            <ul>
                <li><a href="/privacy">Privacy Policy</a></li>
                <li><a href="/terms">Terms of Service</a></li>
            </ul>
        </nav>
        <p><small>&copy; 2026 MySite. All rights reserved.</small></p>
    </footer>
</body>
```

### 10.2 Semantic Elements Reference

| Element | Purpose | Use Case |
|---------|---------|----------|
| `<header>` | Introductory content | Page header, article header |
| `<footer>` | Footer content | Page footer, article footer |
| `<nav>` | Navigation links | Main nav, breadcrumbs, pagination |
| `<main>` | Primary content | One per page, skip-nav target |
| `<article>` | Self-contained content | Blog post, news article, comment, widget |
| `<section>` | Thematic grouping | Chapter, tab panel, feature group |
| `<aside>` | Tangentially related | Sidebar, pull quote, ads, related links |
| `<figure>` | Self-contained figure | Image + caption, code + caption, diagram |
| `<figcaption>` | Figure caption | Caption for `<figure>` |
| `<hgroup>` | Heading group | Title + subtitle |
| `<address>` | Contact information | Author/owner contact info |
| `<time>` | Date/time | Published date, event time |
| `<mark>` | Highlighted text | Search results highlight |
| `<details>` | Disclosure widget | FAQ, collapsible sections |
| `<summary>` | Details heading | Clickable header for `<details>` |
| `<dialog>` | Dialog/modal | Modal, alert, confirmation |
| `<search>` | Search section | Search form wrapper (HTML 5.2+) |

### 10.3 When to Use What

```
┌─────────────────────────────────────────────────────┐
│ Is it the primary content of the page?              │
│   → YES → <main>                                    │
│                                                     │
│ Is it self-contained and independently meaningful?  │
│   → YES → <article>                                 │
│                                                     │
│ Is it a thematic grouping of content?               │
│   → YES → <section>                                 │
│                                                     │
│ Is it navigation links?                             │
│   → YES → <nav>                                     │
│                                                     │
│ Is it related but tangential content?               │
│   → YES → <aside>                                   │
│                                                     │
│ Is it introductory or heading content?              │
│   → YES → <header>                                  │
│                                                     │
│ Is it footer/end content?                           │
│   → YES → <footer>                                  │
│                                                     │
│ None of the above?                                  │
│   → <div> (no semantic meaning)                     │
└─────────────────────────────────────────────────────┘
```

---

## 11. Sectioning & Content Model

### 11.1 Content Categories

| Category | Description | Examples |
|----------|-------------|---------|
| **Flow** | Most elements in `<body>` | `<div>`, `<p>`, `<h1>`, `<table>`, `<form>`, `<img>` |
| **Phrasing** | Text-level content | `<span>`, `<a>`, `<strong>`, `<em>`, `<code>`, `<img>` |
| **Heading** | Section headings | `<h1>`–`<h6>`, `<hgroup>` |
| **Sectioning** | Outline-creating | `<article>`, `<aside>`, `<nav>`, `<section>` |
| **Embedded** | External content | `<img>`, `<video>`, `<audio>`, `<iframe>`, `<canvas>`, `<svg>` |
| **Interactive** | User interaction | `<a>`, `<button>`, `<input>`, `<select>`, `<textarea>`, `<details>` |
| **Metadata** | Document metadata | `<meta>`, `<title>`, `<link>`, `<style>`, `<script>`, `<base>` |

### 11.2 Document Outline

```html
<!-- Proper heading hierarchy -->
<body>
    <h1>Site Title</h1>                    <!-- Level 1 -->

    <main>
        <article>
            <h2>Article Title</h2>         <!-- Level 2 -->

            <section>
                <h3>Section 1</h3>         <!-- Level 3 -->
                <p>Content...</p>

                <h4>Subsection 1.1</h4>    <!-- Level 4 -->
                <p>Content...</p>
            </section>

            <section>
                <h3>Section 2</h3>         <!-- Level 3 -->
                <p>Content...</p>
            </section>
        </article>
    </main>

    <aside>
        <h2>Related Content</h2>           <!-- Level 2 -->
    </aside>
</body>

<!-- ❌ BAD: Skipping heading levels -->
<h1>Title</h1>
<h3>Oops, skipped h2!</h3>

<!-- ✅ GOOD: Sequential heading levels -->
<h1>Title</h1>
<h2>Subtitle</h2>
<h3>Sub-subtitle</h3>
```

---

## 12. Interactive Elements

### 12.1 Details / Summary (Accordion)

```html
<!-- Basic disclosure -->
<details>
    <summary>Click to expand</summary>
    <p>This content is hidden by default and revealed when clicked.</p>
</details>

<!-- Open by default -->
<details open>
    <summary>Already expanded</summary>
    <p>This content is visible on load.</p>
</details>

<!-- FAQ pattern -->
<div class="faq">
    <details>
        <summary>What is HTML?</summary>
        <p>HTML (HyperText Markup Language) is the standard language for creating web pages.</p>
    </details>

    <details>
        <summary>What is CSS?</summary>
        <p>CSS (Cascading Style Sheets) describes how HTML elements should be displayed.</p>
    </details>

    <details>
        <summary>What is JavaScript?</summary>
        <p>JavaScript is a programming language that adds interactivity to web pages.</p>
    </details>
</div>

<!-- Exclusive accordion (name attribute — only one open at a time) -->
<details name="faq-group">
    <summary>Question 1</summary>
    <p>Answer 1</p>
</details>
<details name="faq-group">
    <summary>Question 2</summary>
    <p>Answer 2</p>
</details>
<details name="faq-group">
    <summary>Question 3</summary>
    <p>Answer 3</p>
</details>
```

### 12.2 Dialog (Modal)

```html
<!-- Dialog element -->
<dialog id="confirm-dialog">
    <h2>Confirm Action</h2>
    <p>Are you sure you want to delete this item?</p>
    <form method="dialog">
        <button value="cancel">Cancel</button>
        <button value="confirm">Confirm</button>
    </form>
</dialog>

<!-- Open with JavaScript -->
<button onclick="document.getElementById('confirm-dialog').showModal()">
    Delete Item
</button>

<script>
    const dialog = document.getElementById('confirm-dialog');

    // Show as modal (with backdrop, traps focus)
    dialog.showModal();

    // Show as non-modal
    dialog.show();

    // Close
    dialog.close();
    dialog.close('return-value');

    // Listen for close
    dialog.addEventListener('close', () => {
        console.log(dialog.returnValue); // 'cancel' or 'confirm'
    });

    // Click outside to close
    dialog.addEventListener('click', (e) => {
        if (e.target === dialog) {
            dialog.close();
        }
    });
</script>

<!-- Styled dialog with backdrop -->
<style>
    dialog::backdrop {
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
    }
</style>
```

### 12.3 Popover API

```html
<!-- Popover (new in 2024+) -->
<button popovertarget="my-popover">Toggle Popover</button>
<div id="my-popover" popover>
    <p>This is a popover! Click anywhere outside to dismiss.</p>
</div>

<!-- Popover types -->
<div popover="auto">...</div>     <!-- Auto-dismiss (default) -->
<div popover="manual">...</div>   <!-- Must be explicitly closed -->

<!-- Show/hide controls -->
<button popovertarget="pop" popovertargetaction="show">Show</button>
<button popovertarget="pop" popovertargetaction="hide">Hide</button>
<button popovertarget="pop" popovertargetaction="toggle">Toggle</button>
<div id="pop" popover>Content</div>
```

---

## 13. Embedded Content

### 13.1 Iframes

```html
<!-- Basic iframe -->
<iframe src="https://example.com" width="800" height="600"
        title="Example Website">
</iframe>

<!-- Iframe with security -->
<iframe src="https://example.com"
        width="800" height="600"
        title="Embedded content"
        sandbox="allow-scripts allow-same-origin allow-popups"
        loading="lazy"
        allow="camera; microphone; fullscreen"
        referrerpolicy="no-referrer"
        frameborder="0">
    <p>Your browser does not support iframes.</p>
</iframe>

<!-- Sandbox values -->
<!-- (no value)              — All restrictions -->
<!-- allow-forms             — Allow form submission -->
<!-- allow-modals            — Allow alert(), confirm(), prompt() -->
<!-- allow-popups            — Allow window.open() -->
<!-- allow-scripts           — Allow JavaScript -->
<!-- allow-same-origin       — Allow same-origin access -->
<!-- allow-top-navigation    — Allow navigating the top window -->
<!-- allow-downloads         — Allow downloads -->

<!-- YouTube embed -->
<iframe width="560" height="315"
        src="https://www.youtube.com/embed/VIDEO_ID"
        title="Video title"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        loading="lazy">
</iframe>

<!-- Google Maps embed -->
<iframe src="https://www.google.com/maps/embed?pb=..."
        width="600" height="450"
        style="border:0;"
        allowfullscreen
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
        title="Google Maps">
</iframe>
```

### 13.2 Canvas

```html
<canvas id="myCanvas" width="500" height="300">
    Your browser does not support the canvas element.
</canvas>

<script>
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');

    // Rectangle
    ctx.fillStyle = '#4285f4';
    ctx.fillRect(10, 10, 150, 100);

    // Stroke rectangle
    ctx.strokeStyle = '#ea4335';
    ctx.lineWidth = 3;
    ctx.strokeRect(180, 10, 150, 100);

    // Circle
    ctx.beginPath();
    ctx.arc(100, 200, 50, 0, Math.PI * 2);
    ctx.fillStyle = '#34a853';
    ctx.fill();

    // Line
    ctx.beginPath();
    ctx.moveTo(200, 150);
    ctx.lineTo(350, 250);
    ctx.strokeStyle = '#fbbc05';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Text
    ctx.font = '24px Inter';
    ctx.fillStyle = '#333';
    ctx.fillText('Hello Canvas!', 200, 200);
</script>
```

### 13.3 Object & Embed

```html
<!-- Object (for embedding external resources) -->
<object data="document.pdf" type="application/pdf" width="800" height="600">
    <p>PDF cannot be displayed. <a href="document.pdf">Download PDF</a>.</p>
</object>

<!-- Embed (plugin content) -->
<embed src="animation.swf" type="application/x-shockwave-flash"
       width="400" height="300">
```

---

## 14. Scripting & Templates

### 14.1 Script Element

```html
<!-- External script -->
<script src="app.js"></script>
<script src="app.js" defer></script>
<script src="app.js" async></script>
<script src="app.js" type="module"></script>
<script src="legacy.js" nomodule></script>

<!-- Inline script -->
<script>
    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOM is ready!');
    });
</script>

<!-- ES Module -->
<script type="module">
    import { greet } from './utils.js';
    greet('World');
</script>

<!-- Import map (resolve module specifiers) -->
<script type="importmap">
{
    "imports": {
        "lodash": "https://cdn.skypack.dev/lodash",
        "utils": "./js/utils.js"
    }
}
</script>
<script type="module">
    import _ from 'lodash';
    import { helper } from 'utils';
</script>

<!-- JSON data -->
<script type="application/json" id="config">
{
    "apiUrl": "https://api.example.com",
    "version": "1.0"
}
</script>
<script>
    const config = JSON.parse(document.getElementById('config').textContent);
</script>

<!-- Structured data (SEO) -->
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Article Title",
    "author": {
        "@type": "Person",
        "name": "John Doe"
    },
    "datePublished": "2026-05-26"
}
</script>
```

### 14.2 Template Element

```html
<!-- Template (not rendered, used as a blueprint) -->
<template id="card-template">
    <div class="card">
        <img src="" alt="" class="card-image">
        <h3 class="card-title"></h3>
        <p class="card-description"></p>
        <a href="" class="card-link">Read more</a>
    </div>
</template>

<div id="cards-container"></div>

<script>
    const template = document.getElementById('card-template');
    const container = document.getElementById('cards-container');

    const data = [
        { title: 'Card 1', desc: 'Description 1', img: 'img1.jpg', url: '/1' },
        { title: 'Card 2', desc: 'Description 2', img: 'img2.jpg', url: '/2' },
    ];

    data.forEach(item => {
        const clone = template.content.cloneNode(true);
        clone.querySelector('.card-title').textContent = item.title;
        clone.querySelector('.card-description').textContent = item.desc;
        clone.querySelector('.card-image').src = item.img;
        clone.querySelector('.card-image').alt = item.title;
        clone.querySelector('.card-link').href = item.url;
        container.appendChild(clone);
    });
</script>
```

### 14.3 Slot Element (Web Components)

```html
<!-- Custom element with slots -->
<template id="user-card-template">
    <style>
        .card { border: 1px solid #ddd; padding: 16px; border-radius: 8px; }
        .header { font-weight: bold; font-size: 1.2em; }
    </style>
    <div class="card">
        <div class="header"><slot name="name">Default Name</slot></div>
        <div class="body"><slot>Default content</slot></div>
        <div class="footer"><slot name="footer"></slot></div>
    </div>
</template>

<script>
    class UserCard extends HTMLElement {
        constructor() {
            super();
            const shadow = this.attachShadow({ mode: 'open' });
            const template = document.getElementById('user-card-template');
            shadow.appendChild(template.content.cloneNode(true));
        }
    }
    customElements.define('user-card', UserCard);
</script>

<!-- Usage -->
<user-card>
    <span slot="name">John Doe</span>
    <p>Web developer with 5 years of experience.</p>
    <span slot="footer">john@example.com</span>
</user-card>
```

---

## 15. Global Attributes

These attributes can be used on **any** HTML element.

| Attribute | Description | Example |
|-----------|-------------|---------|
| `id` | Unique identifier | `<div id="header">` |
| `class` | CSS class(es) | `<p class="text-bold text-red">` |
| `style` | Inline CSS | `<p style="color: red;">` |
| `title` | Tooltip text | `<abbr title="HyperText Markup Language">HTML</abbr>` |
| `lang` | Language code | `<p lang="vi">Xin chào</p>` |
| `dir` | Text direction | `<p dir="rtl">مرحبا</p>` |
| `hidden` | Hide element | `<div hidden>Invisible</div>` |
| `tabindex` | Tab order | `<div tabindex="0">Focusable</div>` |
| `contenteditable` | Editable content | `<div contenteditable="true">Edit me</div>` |
| `draggable` | Drag-and-drop | `<div draggable="true">Drag me</div>` |
| `spellcheck` | Spell checking | `<textarea spellcheck="true">` |
| `translate` | Translation hint | `<span translate="no">Brand Name</span>` |
| `accesskey` | Keyboard shortcut | `<button accesskey="s">Save</button>` |
| `autocapitalize` | Auto-capitalize | `<input autocapitalize="words">` |
| `autofocus` | Auto-focus on load | `<input autofocus>` |
| `enterkeyhint` | Enter key label | `<input enterkeyhint="search">` |
| `inputmode` | Virtual keyboard | `<input inputmode="numeric">` |
| `is` | Custom element extension | `<button is="fancy-button">` |
| `itemscope` | Microdata scope | `<div itemscope itemtype="...">` |
| `itemprop` | Microdata property | `<span itemprop="name">` |
| `nonce` | CSP nonce | `<script nonce="abc123">` |
| `part` | Shadow DOM part | `<span part="label">` |
| `slot` | Shadow DOM slot | `<span slot="title">` |
| `popover` | Popover | `<div popover>` |
| `inert` | Inert subtree | `<div inert>Non-interactive</div>` |

```html
<!-- hidden attribute variations -->
<div hidden>Completely hidden</div>
<div hidden="hidden">Same as above</div>
<div hidden="until-found">Hidden but searchable (Ctrl+F finds it)</div>

<!-- tabindex values -->
<div tabindex="-1">Focusable by script, not Tab key</div>
<div tabindex="0">Focusable by Tab key (natural order)</div>
<div tabindex="1">Focusable, tab order 1 (avoid positive values)</div>

<!-- inert (disables all interaction in subtree) -->
<div inert>
    <button>Can't click me</button>
    <a href="/">Can't focus me</a>
    <input type="text"> <!-- Can't type here -->
</div>
```

---

## 16. Data Attributes

```html
<!-- Custom data attributes (data-*) -->
<article id="post-1"
         data-author="john-doe"
         data-category="technology"
         data-publish-date="2026-05-26"
         data-views="1234"
         data-is-featured="true">
    <h2>Article Title</h2>
    <p>Article content...</p>
</article>

<button data-action="delete"
        data-target="#post-1"
        data-confirm="Are you sure?">
    Delete Post
</button>

<script>
    const article = document.getElementById('post-1');

    // Access via dataset (camelCase conversion)
    console.log(article.dataset.author);        // "john-doe"
    console.log(article.dataset.category);      // "technology"
    console.log(article.dataset.publishDate);   // "2026-05-26" (note: camelCase)
    console.log(article.dataset.views);         // "1234" (always string)
    console.log(article.dataset.isFeatured);    // "true" (string, not boolean)

    // Set data attribute
    article.dataset.views = "1235";
    article.dataset.newAttribute = "value";     // Creates data-new-attribute

    // Delete data attribute
    delete article.dataset.views;

    // Access via getAttribute
    article.getAttribute('data-author');         // "john-doe"
    article.setAttribute('data-author', 'jane');
    article.removeAttribute('data-author');

    // Query by data attribute
    document.querySelector('[data-action="delete"]');
    document.querySelectorAll('[data-category="technology"]');
    document.querySelectorAll('[data-views]');    // Has the attribute
</script>

<!-- CSS can also target data attributes -->
<style>
    [data-is-featured="true"] {
        border-left: 4px solid gold;
    }
    [data-category="technology"]::before {
        content: "💻 ";
    }
</style>
```

---

## 17. ARIA & Accessibility

### 17.1 ARIA Roles

```html
<!-- Landmark roles -->
<div role="banner">Site header</div>           <!-- = <header> (top-level) -->
<div role="navigation">Nav links</div>         <!-- = <nav> -->
<div role="main">Primary content</div>         <!-- = <main> -->
<div role="complementary">Sidebar</div>        <!-- = <aside> -->
<div role="contentinfo">Footer</div>           <!-- = <footer> (top-level) -->
<div role="search">Search form</div>           <!-- = <search> -->
<div role="form">Form</div>                    <!-- = <form> (with name) -->
<div role="region" aria-label="Section">       <!-- = <section> (with name) -->

<!-- Widget roles -->
<div role="alert">Error message!</div>
<div role="alertdialog">Confirm action</div>
<div role="dialog">Modal dialog</div>
<div role="tooltip">Tooltip text</div>
<div role="status">Status update</div>
<div role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100">
<div role="tablist">
    <button role="tab">Tab 1</button>
</div>
<div role="tabpanel">Tab content</div>
<div role="menu">
    <div role="menuitem">Option 1</div>
</div>
<div role="tree">
    <div role="treeitem">Item</div>
</div>
<div role="listbox">
    <div role="option">Option</div>
</div>

<!-- Document structure roles -->
<div role="presentation">No semantic meaning</div>    <!-- = aria-hidden -->
<div role="none">Same as presentation</div>
<div role="img" aria-label="Description">Complex image</div>
<div role="list"><div role="listitem">Item</div></div>
<div role="table"><div role="row"><div role="cell">Data</div></div></div>
```

### 17.2 ARIA Properties & States

```html
<!-- Labels & descriptions -->
<button aria-label="Close dialog">×</button>
<input aria-labelledby="label1 label2">
<input aria-describedby="help-text">
<div aria-details="detailed-description">

<!-- State attributes -->
<button aria-expanded="false">Toggle Menu</button>
<input aria-invalid="true">
<div aria-hidden="true">Screen reader skip</div>
<li aria-selected="true">Selected item</li>
<button aria-pressed="true">Toggle On</button>
<button aria-disabled="true">Can't click</button>
<section aria-busy="true">Loading...</section>
<input aria-required="true">
<input aria-readonly="true">
<option aria-checked="true">Checked</option>

<!-- Live regions (dynamic content updates) -->
<div aria-live="polite">Updated content (announced when idle)</div>
<div aria-live="assertive">Urgent update (announced immediately)</div>
<div aria-live="off">Not announced</div>
<div aria-atomic="true">Announce entire region on change</div>
<div aria-relevant="additions text">What changes to announce</div>

<!-- Relationships -->
<input aria-controls="dropdown-menu">
<div aria-owns="child-element">
<div aria-flowto="next-section">
<tr aria-rowindex="5">
<td aria-colindex="3">
<span aria-posinset="3" aria-setsize="10">Item 3 of 10</span>
<li aria-current="page">Current page</li>
<li aria-current="step">Current step</li>
<li aria-current="date">Today</li>

<!-- Keyboard -->
<div aria-keyshortcuts="Alt+S">Save (Alt+S)</div>
<div aria-roledescription="carousel">Custom role name</div>
```

### 17.3 Accessible Patterns

```html
<!-- Skip navigation link -->
<a href="#main-content" class="sr-only focus:not-sr-only">
    Skip to main content
</a>

<!-- Screen reader only text -->
<span class="sr-only">Additional context for screen readers</span>
<!-- CSS: .sr-only { position:absolute; width:1px; height:1px; overflow:hidden; clip:rect(0,0,0,0); } -->

<!-- Accessible icon button -->
<button aria-label="Search">
    <svg aria-hidden="true">...</svg>
</button>

<!-- Accessible tabs -->
<div role="tablist" aria-label="Settings">
    <button role="tab" id="tab-1" aria-selected="true" aria-controls="panel-1">
        General
    </button>
    <button role="tab" id="tab-2" aria-selected="false" aria-controls="panel-2" tabindex="-1">
        Security
    </button>
</div>
<div role="tabpanel" id="panel-1" aria-labelledby="tab-1">
    General settings...
</div>
<div role="tabpanel" id="panel-2" aria-labelledby="tab-2" hidden>
    Security settings...
</div>

<!-- Accessible form errors -->
<label for="email-input">Email:</label>
<input type="email" id="email-input"
       aria-invalid="true"
       aria-describedby="email-error"
       aria-errormessage="email-error">
<span id="email-error" role="alert">
    Please enter a valid email address.
</span>

<!-- Accessible loading state -->
<div aria-live="polite" aria-busy="true">
    <p>Loading results...</p>
</div>

<!-- Image with long description -->
<figure>
    <img src="chart.png" alt="Sales chart" aria-describedby="chart-desc">
    <figcaption id="chart-desc">
        Bar chart showing quarterly sales: Q1 $10K, Q2 $15K, Q3 $12K, Q4 $20K.
    </figcaption>
</figure>
```

---

## 18. Character Entities

### 18.1 Common Entities

| Entity | Character | Description |
|--------|-----------|-------------|
| `&amp;` | & | Ampersand |
| `&lt;` | < | Less than |
| `&gt;` | > | Greater than |
| `&quot;` | " | Double quote |
| `&apos;` | ' | Single quote / apostrophe |
| `&nbsp;` | (space) | Non-breaking space |
| `&ensp;` | (space) | En space |
| `&emsp;` | (space) | Em space |
| `&thinsp;` | (space) | Thin space |
| `&copy;` | © | Copyright |
| `&reg;` | ® | Registered |
| `&trade;` | ™ | Trademark |
| `&deg;` | ° | Degree |
| `&plusmn;` | ± | Plus-minus |
| `&times;` | × | Multiplication |
| `&divide;` | ÷ | Division |
| `&ndash;` | – | En dash |
| `&mdash;` | — | Em dash |
| `&laquo;` | « | Left guillemet |
| `&raquo;` | » | Right guillemet |
| `&ldquo;` | " | Left double quote |
| `&rdquo;` | " | Right double quote |
| `&lsquo;` | ' | Left single quote |
| `&rsquo;` | ' | Right single quote |
| `&bull;` | • | Bullet |
| `&hellip;` | … | Horizontal ellipsis |
| `&larr;` | ← | Left arrow |
| `&rarr;` | → | Right arrow |
| `&uarr;` | ↑ | Up arrow |
| `&darr;` | ↓ | Down arrow |
| `&hearts;` | ♥ | Heart |
| `&check;` | ✓ | Check mark |
| `&cross;` | ✗ | Cross mark |
| `&euro;` | € | Euro |
| `&pound;` | £ | Pound |
| `&yen;` | ¥ | Yen |
| `&cent;` | ¢ | Cent |
| `&infin;` | ∞ | Infinity |
| `&sum;` | ∑ | Summation |
| `&radic;` | √ | Square root |
| `&alpha;` | α | Alpha |
| `&beta;` | β | Beta |
| `&pi;` | π | Pi |
| `&Delta;` | Δ | Delta |

```html
<!-- Numeric character references -->
&#169;    <!-- © (decimal) -->
&#x00A9;  <!-- © (hexadecimal) -->
&#128512; <!-- 😀 (emoji via decimal) -->
&#x1F600; <!-- 😀 (emoji via hex) -->
```

---

## 19. HTML5 APIs Overview

### 19.1 Web Storage

```html
<script>
    // localStorage (persists across sessions)
    localStorage.setItem('key', 'value');
    const value = localStorage.getItem('key');
    localStorage.removeItem('key');
    localStorage.clear();

    // sessionStorage (cleared when tab closes)
    sessionStorage.setItem('key', 'value');

    // Store objects
    localStorage.setItem('user', JSON.stringify({ name: 'John', age: 30 }));
    const user = JSON.parse(localStorage.getItem('user'));
</script>
```

### 19.2 Geolocation

```html
<script>
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log('Latitude:', position.coords.latitude);
                console.log('Longitude:', position.coords.longitude);
                console.log('Accuracy:', position.coords.accuracy, 'meters');
            },
            (error) => {
                console.error('Error:', error.message);
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );

        // Watch position (continuous)
        const watchId = navigator.geolocation.watchPosition(callback);
        navigator.geolocation.clearWatch(watchId);
    }
</script>
```

### 19.3 Drag & Drop

```html
<!-- Draggable element -->
<div draggable="true"
     ondragstart="event.dataTransfer.setData('text/plain', this.id)"
     id="drag-item">
    Drag me!
</div>

<!-- Drop zone -->
<div ondragover="event.preventDefault()"
     ondrop="handleDrop(event)"
     id="drop-zone">
    Drop here
</div>

<script>
    function handleDrop(event) {
        event.preventDefault();
        const id = event.dataTransfer.getData('text/plain');
        event.target.appendChild(document.getElementById(id));
    }
</script>
```

### 19.4 Other HTML5 APIs

```html
<script>
    // ── History API ───────────────────────
    history.pushState({ page: 1 }, 'Title', '/page/1');
    history.replaceState({ page: 1 }, 'Title', '/page/1');
    history.back();
    history.forward();
    history.go(-2);
    window.addEventListener('popstate', (event) => {
        console.log(event.state);
    });

    // ── Clipboard API ─────────────────────
    await navigator.clipboard.writeText('Copied text');
    const text = await navigator.clipboard.readText();

    // ── Notification API ──────────────────
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
        new Notification('Hello!', {
            body: 'This is a notification',
            icon: '/icon.png'
        });
    }

    // ── Fullscreen API ────────────────────
    element.requestFullscreen();
    document.exitFullscreen();
    document.fullscreenElement;

    // ── Intersection Observer ─────────────
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    observer.observe(document.querySelector('.lazy'));

    // ── Mutation Observer ─────────────────
    const mutObserver = new MutationObserver((mutations) => {
        mutations.forEach(m => console.log(m));
    });
    mutObserver.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true
    });

    // ── Resize Observer ───────────────────
    const resizeObserver = new ResizeObserver((entries) => {
        entries.forEach(entry => {
            console.log(entry.contentRect.width, entry.contentRect.height);
        });
    });
    resizeObserver.observe(document.querySelector('.resizable'));

    // ── Web Workers ───────────────────────
    const worker = new Worker('worker.js');
    worker.postMessage({ data: 'hello' });
    worker.onmessage = (event) => console.log(event.data);

    // ── Fetch API ─────────────────────────
    const response = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'value' })
    });
    const data = await response.json();

    // ── WebSocket ─────────────────────────
    const ws = new WebSocket('wss://example.com/socket');
    ws.onopen = () => ws.send('Hello');
    ws.onmessage = (event) => console.log(event.data);
    ws.onclose = () => console.log('Disconnected');
</script>
```

---

## 20. SEO Best Practices

### 20.1 Essential SEO Checklist

```html
<!-- 1. Unique, descriptive title (50-60 chars) -->
<title>Primary Keyword — Secondary Keyword | Brand</title>

<!-- 2. Meta description (150-160 chars) -->
<meta name="description" content="Compelling description with keywords...">

<!-- 3. One H1 per page -->
<h1>Main Page Heading with Primary Keyword</h1>

<!-- 4. Proper heading hierarchy -->
<h1>Main</h1>
  <h2>Section</h2>
    <h3>Subsection</h3>

<!-- 5. Canonical URL (prevent duplicates) -->
<link rel="canonical" href="https://example.com/page">

<!-- 6. Alt text on images -->
<img src="photo.jpg" alt="Descriptive text with relevant keywords">

<!-- 7. Semantic HTML elements -->
<article>, <section>, <nav>, <aside>, <header>, <footer>, <main>

<!-- 8. Open Graph & Twitter Cards -->
<meta property="og:title" content="...">
<meta name="twitter:card" content="summary_large_image">

<!-- 9. Structured data (JSON-LD) -->
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Article Title"
}
</script>

<!-- 10. Mobile-friendly viewport -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<!-- 11. Language declaration -->
<html lang="en">

<!-- 12. Fast loading -->
<link rel="preload" href="critical.css" as="style">
<img loading="lazy" src="image.jpg" alt="...">

<!-- 13. HTTPS (configure on server) -->

<!-- 14. Descriptive URLs -->
<!-- Good: /blog/html-best-practices -->
<!-- Bad:  /blog/post?id=123 -->

<!-- 15. Internal linking with descriptive anchor text -->
<a href="/guide">Read our complete HTML guide</a>
<!-- Bad: <a href="/guide">Click here</a> -->
```

### 20.2 Schema.org Structured Data

```html
<!-- Article -->
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "How to Learn HTML",
    "author": { "@type": "Person", "name": "John Doe" },
    "datePublished": "2026-05-26",
    "dateModified": "2026-05-26",
    "image": "https://example.com/article-image.jpg",
    "publisher": {
        "@type": "Organization",
        "name": "My Website",
        "logo": { "@type": "ImageObject", "url": "https://example.com/logo.png" }
    }
}
</script>

<!-- FAQ -->
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        {
            "@type": "Question",
            "name": "What is HTML?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "HTML is the standard markup language for creating web pages."
            }
        }
    ]
}
</script>

<!-- Breadcrumb -->
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://example.com" },
        { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://example.com/blog" },
        { "@type": "ListItem", "position": 3, "name": "HTML Guide" }
    ]
}
</script>

<!-- Product -->
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Widget Pro",
    "image": "https://example.com/widget.jpg",
    "offers": {
        "@type": "Offer",
        "price": "29.99",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.5",
        "reviewCount": "123"
    }
}
</script>
```

---

## 21. Complete Element Reference Table

### Block-Level Elements

| Element | Description | Self-closing |
|---------|-------------|:---:|
| `<address>` | Contact information | No |
| `<article>` | Self-contained content | No |
| `<aside>` | Tangentially related content | No |
| `<blockquote>` | Extended quotation | No |
| `<details>` | Disclosure widget | No |
| `<dialog>` | Dialog box / modal | No |
| `<div>` | Generic block container | No |
| `<dl>` | Description list | No |
| `<fieldset>` | Form group | No |
| `<figcaption>` | Figure caption | No |
| `<figure>` | Self-contained figure | No |
| `<footer>` | Footer content | No |
| `<form>` | User input form | No |
| `<h1>`–`<h6>` | Headings | No |
| `<header>` | Introductory content | No |
| `<hgroup>` | Heading group | No |
| `<hr>` | Thematic break | **Yes** |
| `<main>` | Primary content | No |
| `<nav>` | Navigation | No |
| `<ol>` | Ordered list | No |
| `<p>` | Paragraph | No |
| `<pre>` | Preformatted text | No |
| `<search>` | Search section | No |
| `<section>` | Thematic section | No |
| `<table>` | Table | No |
| `<ul>` | Unordered list | No |

### Inline Elements

| Element | Description | Self-closing |
|---------|-------------|:---:|
| `<a>` | Hyperlink | No |
| `<abbr>` | Abbreviation | No |
| `<b>` | Bold (stylistic) | No |
| `<bdi>` | Bi-directional isolation | No |
| `<bdo>` | Bi-directional override | No |
| `<br>` | Line break | **Yes** |
| `<cite>` | Citation | No |
| `<code>` | Code fragment | No |
| `<data>` | Machine-readable value | No |
| `<del>` | Deleted text | No |
| `<dfn>` | Definition term | No |
| `<em>` | Emphasis | No |
| `<i>` | Italic (stylistic) | No |
| `<ins>` | Inserted text | No |
| `<kbd>` | Keyboard input | No |
| `<mark>` | Highlighted text | No |
| `<q>` | Inline quotation | No |
| `<ruby>` | Ruby annotation | No |
| `<s>` | Strikethrough | No |
| `<samp>` | Sample output | No |
| `<small>` | Fine print | No |
| `<span>` | Generic inline container | No |
| `<strong>` | Strong importance | No |
| `<sub>` | Subscript | No |
| `<sup>` | Superscript | No |
| `<time>` | Date/time | No |
| `<u>` | Underline | No |
| `<var>` | Variable | No |
| `<wbr>` | Word break opportunity | **Yes** |

### Void (Self-Closing) Elements

```html
<area>    <base>    <br>      <col>
<embed>   <hr>      <img>     <input>
<link>    <meta>    <source>  <track>
<wbr>
```

> These elements have **no closing tag** and **cannot have children**.

---

> **End of HTML Comprehensive Reference Guide**
>
> This document covers all major HTML5 elements, attributes, and APIs. For the latest specification, refer to the [WHATWG HTML Living Standard](https://html.spec.whatwg.org/).
