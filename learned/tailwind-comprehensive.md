# Tailwind CSS — Comprehensive Reference Guide

> **Version focus**: Tailwind CSS v3.x / v4.x  
> **Last updated**: May 2026  
> **Purpose**: Complete reference for every major Tailwind utility class, configuration, customization, and patterns.

---

## Table of Contents

1. [Installation & Setup](#1-installation--setup)
2. [Core Concepts](#2-core-concepts)
3. [Layout](#3-layout)
4. [Flexbox](#4-flexbox)
5. [Grid](#5-grid)
6. [Spacing (Padding & Margin)](#6-spacing-padding--margin)
7. [Sizing (Width & Height)](#7-sizing-width--height)
8. [Typography](#8-typography)
9. [Colors & Background](#9-colors--background)
10. [Borders](#10-borders)
11. [Effects (Shadows, Opacity, Blend)](#11-effects-shadows-opacity-blend)
12. [Filters](#12-filters)
13. [Transforms](#13-transforms)
14. [Transitions & Animation](#14-transitions--animation)
15. [Interactivity](#15-interactivity)
16. [Responsive Design](#16-responsive-design)
17. [State Modifiers (Hover, Focus, etc.)](#17-state-modifiers-hover-focus-etc)
18. [Dark Mode](#18-dark-mode)
19. [Customization (tailwind.config.js)](#19-customization-tailwindconfigjs)
20. [Plugins & Extensions](#20-plugins--extensions)
21. [@apply & Custom Classes](#21-apply--custom-classes)
22. [Arbitrary Values & CSS Variables](#22-arbitrary-values--css-variables)
23. [Common Patterns & Components](#23-common-patterns--components)
24. [Tailwind v4 Changes](#24-tailwind-v4-changes)

---

## 1. Installation & Setup

### 1.1 Installation Methods

```bash
# ── Via Vite (recommended) ─────────────────
npm install -D tailwindcss @tailwindcss/vite
# Then add plugin to vite.config.js

# ── Via PostCSS ────────────────────────────
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p                    # Creates tailwind.config.js + postcss.config.js

# ── Via CLI (standalone) ───────────────────
npm install -D tailwindcss
npx tailwindcss init
npx tailwindcss -i ./src/input.css -o ./dist/output.css --watch

# ── Via CDN (development/prototyping only) ─
# <script src="https://cdn.tailwindcss.com"></script>
```

### 1.2 Configuration (tailwind.config.js — v3)

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx,vue,blade.php}',
        './resources/views/**/*.blade.php',
    ],
    darkMode: 'class',               // 'media' | 'class' | 'selector'
    theme: {
        extend: {
            // Custom additions (merged with defaults)
            colors: {
                primary: {
                    50:  '#eff6ff',
                    100: '#dbeafe',
                    200: '#bfdbfe',
                    300: '#93c5fd',
                    400: '#60a5fa',
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1d4ed8',
                    800: '#1e40af',
                    900: '#1e3a8a',
                    950: '#172554',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['Fira Code', 'monospace'],
            },
            spacing: {
                '18': '4.5rem',
                '128': '32rem',
            },
            borderRadius: {
                '4xl': '2rem',
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out',
                'slide-up': 'slideUp 0.3s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography'),
        require('@tailwindcss/aspect-ratio'),
        require('@tailwindcss/container-queries'),
    ],
};
```

### 1.3 CSS Entry Point

```css
/* src/input.css (v3) */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom base styles */
@layer base {
    html {
        @apply scroll-smooth;
    }
    body {
        @apply bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100;
    }
}

/* Custom component classes */
@layer components {
    .btn {
        @apply px-4 py-2 rounded-lg font-medium transition-colors duration-200;
    }
    .btn-primary {
        @apply bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800;
    }
}

/* Custom utility classes */
@layer utilities {
    .text-balance {
        text-wrap: balance;
    }
}
```

---

## 2. Core Concepts

### 2.1 Utility-First Approach

```html
<!-- Traditional CSS approach -->
<div class="chat-notification">
    <div class="chat-notification-logo-wrapper">
        <img class="chat-notification-logo" src="logo.svg" alt="Logo">
    </div>
    <div class="chat-notification-content">
        <h4 class="chat-notification-title">New Message</h4>
        <p class="chat-notification-message">You have a new message!</p>
    </div>
</div>

<!-- Tailwind approach -->
<div class="flex items-center gap-4 rounded-xl bg-white p-6 shadow-lg">
    <div class="shrink-0">
        <img class="h-12 w-12" src="logo.svg" alt="Logo">
    </div>
    <div>
        <h4 class="text-lg font-semibold text-gray-900">New Message</h4>
        <p class="text-sm text-gray-500">You have a new message!</p>
    </div>
</div>
```

### 2.2 Important Modifier

```html
<!-- Force !important on a utility -->
<p class="!font-bold">This will always be bold</p>
<div class="!p-4">Padding with !important</div>
```

### 2.3 Negative Values

```html
<!-- Prefix with dash for negative values -->
<div class="-mt-4">Negative margin top</div>
<div class="-translate-x-full">Negative translate</div>
<div class="-rotate-45">Negative rotation</div>
<div class="-skew-x-6">Negative skew</div>
<div class="-top-4">Negative top position</div>
```

---

## 3. Layout

### 3.1 Container

```html
<!-- Centered container with responsive max-width -->
<div class="container mx-auto px-4">
    <!-- Content -->
</div>

<!-- Container breakpoints (default):
     sm:  640px
     md:  768px
     lg:  1024px
     xl:  1280px
     2xl: 1536px
-->
```

### 3.2 Display

```html
<div class="block">Block</div>
<div class="inline-block">Inline Block</div>
<div class="inline">Inline</div>
<div class="flex">Flex</div>
<div class="inline-flex">Inline Flex</div>
<div class="grid">Grid</div>
<div class="inline-grid">Inline Grid</div>
<div class="hidden">Hidden (display: none)</div>
<div class="contents">Contents</div>
<div class="table">Table</div>
<div class="flow-root">Flow Root</div>
<div class="list-item">List Item</div>
```

### 3.3 Position

```html
<div class="static">Static (default)</div>
<div class="relative">Relative</div>
<div class="absolute top-0 left-0">Absolute</div>
<div class="fixed top-0 left-0 right-0">Fixed</div>
<div class="sticky top-0">Sticky</div>

<!-- Inset (top, right, bottom, left) -->
<div class="inset-0">All sides 0</div>
<div class="inset-x-0">Left + Right 0</div>
<div class="inset-y-0">Top + Bottom 0</div>
<div class="top-0 right-0">Top-right corner</div>
<div class="top-4 left-4">Offset from top-left</div>
<div class="bottom-0 right-0">Bottom-right</div>
<div class="start-0">Inline start (LTR: left)</div>
<div class="end-0">Inline end (LTR: right)</div>

<!-- Values: 0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 9, 10, 11, 12,
             14, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 72, 80, 96,
             auto, 1/2, 1/3, 2/3, 1/4, 2/4, 3/4, full -->
```

### 3.4 Z-Index

```html
<div class="z-0">z-index: 0</div>
<div class="z-10">z-index: 10</div>
<div class="z-20">z-index: 20</div>
<div class="z-30">z-index: 30</div>
<div class="z-40">z-index: 40</div>
<div class="z-50">z-index: 50</div>
<div class="z-auto">z-index: auto</div>
<div class="-z-10">z-index: -10</div>
<div class="z-[100]">z-index: 100 (arbitrary)</div>
```

### 3.5 Float & Clear

```html
<div class="float-left">Float left</div>
<div class="float-right">Float right</div>
<div class="float-none">No float</div>
<div class="float-start">Float start (logical)</div>
<div class="float-end">Float end (logical)</div>
<div class="clear-left">Clear left</div>
<div class="clear-right">Clear right</div>
<div class="clear-both">Clear both</div>
```

### 3.6 Overflow

```html
<div class="overflow-auto">Auto scrollbars</div>
<div class="overflow-hidden">Clip overflow</div>
<div class="overflow-visible">Show overflow</div>
<div class="overflow-scroll">Always scrollbars</div>
<div class="overflow-clip">Clip (no scroll)</div>
<div class="overflow-x-auto">Horizontal auto</div>
<div class="overflow-y-auto">Vertical auto</div>
<div class="overflow-x-hidden overflow-y-scroll">Mix</div>
```

### 3.7 Object Fit & Position

```html
<img class="object-contain" src="photo.jpg" alt="">
<img class="object-cover" src="photo.jpg" alt="">
<img class="object-fill" src="photo.jpg" alt="">
<img class="object-none" src="photo.jpg" alt="">
<img class="object-scale-down" src="photo.jpg" alt="">
<img class="object-center" src="photo.jpg" alt="">
<img class="object-top" src="photo.jpg" alt="">
<img class="object-bottom" src="photo.jpg" alt="">
<img class="object-left-top" src="photo.jpg" alt="">
<img class="object-right-bottom" src="photo.jpg" alt="">
```

### 3.8 Aspect Ratio

```html
<div class="aspect-auto">Auto</div>
<div class="aspect-square">1:1</div>
<div class="aspect-video">16:9</div>
<div class="aspect-[4/3]">4:3 (arbitrary)</div>
```

### 3.9 Visibility & Isolation

```html
<div class="visible">Visible</div>
<div class="invisible">Invisible (takes space)</div>
<div class="collapse">Collapse (table rows)</div>
<div class="isolate">Create stacking context</div>
<div class="isolation-auto">Auto</div>
```

---

## 4. Flexbox

### 4.1 Flex Container

```html
<!-- Direction -->
<div class="flex flex-row">Horizontal (default)</div>
<div class="flex flex-row-reverse">Horizontal reverse</div>
<div class="flex flex-col">Vertical</div>
<div class="flex flex-col-reverse">Vertical reverse</div>

<!-- Wrap -->
<div class="flex flex-nowrap">No wrap (default)</div>
<div class="flex flex-wrap">Wrap</div>
<div class="flex flex-wrap-reverse">Wrap reverse</div>

<!-- Justify Content (main axis) -->
<div class="flex justify-start">Start</div>
<div class="flex justify-end">End</div>
<div class="flex justify-center">Center</div>
<div class="flex justify-between">Space between</div>
<div class="flex justify-around">Space around</div>
<div class="flex justify-evenly">Space evenly</div>
<div class="flex justify-normal">Normal</div>
<div class="flex justify-stretch">Stretch</div>

<!-- Align Items (cross axis) -->
<div class="flex items-start">Top</div>
<div class="flex items-end">Bottom</div>
<div class="flex items-center">Center</div>
<div class="flex items-stretch">Stretch (default)</div>
<div class="flex items-baseline">Baseline</div>

<!-- Align Content (multi-line) -->
<div class="flex flex-wrap content-start">Start</div>
<div class="flex flex-wrap content-end">End</div>
<div class="flex flex-wrap content-center">Center</div>
<div class="flex flex-wrap content-between">Space between</div>
<div class="flex flex-wrap content-around">Space around</div>
<div class="flex flex-wrap content-evenly">Space evenly</div>
<div class="flex flex-wrap content-stretch">Stretch</div>

<!-- Gap -->
<div class="flex gap-4">All gap: 1rem</div>
<div class="flex gap-x-4 gap-y-2">Column: 1rem, Row: 0.5rem</div>
```

### 4.2 Flex Items

```html
<!-- Flex shorthand -->
<div class="flex-1">flex: 1 1 0% (grow)</div>
<div class="flex-auto">flex: 1 1 auto</div>
<div class="flex-initial">flex: 0 1 auto (default)</div>
<div class="flex-none">flex: none (fixed size)</div>

<!-- Grow -->
<div class="grow">flex-grow: 1</div>
<div class="grow-0">flex-grow: 0</div>

<!-- Shrink -->
<div class="shrink">flex-shrink: 1 (default)</div>
<div class="shrink-0">flex-shrink: 0 (don't shrink)</div>

<!-- Basis -->
<div class="basis-0">flex-basis: 0</div>
<div class="basis-auto">flex-basis: auto</div>
<div class="basis-full">flex-basis: 100%</div>
<div class="basis-1/2">flex-basis: 50%</div>
<div class="basis-1/3">flex-basis: 33.333%</div>
<div class="basis-2/3">flex-basis: 66.667%</div>
<div class="basis-1/4">flex-basis: 25%</div>
<div class="basis-64">flex-basis: 16rem</div>

<!-- Order -->
<div class="order-first">order: -9999</div>
<div class="order-last">order: 9999</div>
<div class="order-none">order: 0</div>
<div class="order-1">order: 1</div>
<div class="order-2">order: 2</div>

<!-- Align Self -->
<div class="self-auto">Auto</div>
<div class="self-start">Start</div>
<div class="self-end">End</div>
<div class="self-center">Center</div>
<div class="self-stretch">Stretch</div>
<div class="self-baseline">Baseline</div>

<!-- Place Content / Place Items / Place Self -->
<div class="place-content-center">Place content center</div>
<div class="place-items-center">Place items center</div>
<div class="place-self-center">Place self center</div>
```

---

## 5. Grid

### 5.1 Grid Container

```html
<!-- Template Columns -->
<div class="grid grid-cols-1">1 column</div>
<div class="grid grid-cols-2">2 columns</div>
<div class="grid grid-cols-3">3 columns</div>
<div class="grid grid-cols-4">4 columns</div>
<div class="grid grid-cols-6">6 columns</div>
<div class="grid grid-cols-12">12 columns</div>
<div class="grid grid-cols-none">No columns</div>
<div class="grid grid-cols-subgrid">Subgrid</div>
<div class="grid grid-cols-[200px_1fr_200px]">Custom (arbitrary)</div>

<!-- Template Rows -->
<div class="grid grid-rows-1">1 row</div>
<div class="grid grid-rows-3">3 rows</div>
<div class="grid grid-rows-6">6 rows</div>
<div class="grid grid-rows-none">No rows</div>
<div class="grid grid-rows-subgrid">Subgrid</div>

<!-- Auto Columns -->
<div class="auto-cols-auto">auto</div>
<div class="auto-cols-min">min-content</div>
<div class="auto-cols-max">max-content</div>
<div class="auto-cols-fr">1fr</div>

<!-- Auto Rows -->
<div class="auto-rows-auto">auto</div>
<div class="auto-rows-min">min-content</div>
<div class="auto-rows-max">max-content</div>
<div class="auto-rows-fr">1fr</div>

<!-- Grid Flow -->
<div class="grid-flow-row">By row (default)</div>
<div class="grid-flow-col">By column</div>
<div class="grid-flow-dense">Dense packing</div>
<div class="grid-flow-row-dense">Row dense</div>
<div class="grid-flow-col-dense">Column dense</div>

<!-- Gap -->
<div class="grid gap-4">Gap: 1rem</div>
<div class="grid gap-x-8 gap-y-4">Column: 2rem, Row: 1rem</div>
```

### 5.2 Grid Items

```html
<!-- Column Span -->
<div class="col-auto">auto</div>
<div class="col-span-1">Span 1</div>
<div class="col-span-2">Span 2</div>
<div class="col-span-3">Span 3</div>
<div class="col-span-full">Span all columns</div>
<div class="col-start-1">Start at line 1</div>
<div class="col-start-2 col-end-4">Lines 2-4</div>
<div class="col-end-auto">Auto end</div>

<!-- Row Span -->
<div class="row-auto">auto</div>
<div class="row-span-1">Span 1 row</div>
<div class="row-span-2">Span 2 rows</div>
<div class="row-span-full">Span all rows</div>
<div class="row-start-1 row-end-3">Rows 1-3</div>
```

### 5.3 Responsive Grid Example

```html
<!-- Mobile: 1 col → Tablet: 2 cols → Desktop: 3 cols → Large: 4 cols -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    <div class="bg-white rounded-lg shadow p-6">Card 1</div>
    <div class="bg-white rounded-lg shadow p-6">Card 2</div>
    <div class="bg-white rounded-lg shadow p-6">Card 3</div>
    <div class="bg-white rounded-lg shadow p-6">Card 4</div>
</div>

<!-- Auto-fit responsive grid (no breakpoints!) -->
<div class="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6">
    <div>Auto-sizing card</div>
    <div>Auto-sizing card</div>
    <div>Auto-sizing card</div>
</div>
```

---

## 6. Spacing (Padding & Margin)

### 6.1 Spacing Scale

| Class | Value | Pixels |
|-------|-------|--------|
| `0` | `0px` | 0 |
| `px` | `1px` | 1 |
| `0.5` | `0.125rem` | 2 |
| `1` | `0.25rem` | 4 |
| `1.5` | `0.375rem` | 6 |
| `2` | `0.5rem` | 8 |
| `2.5` | `0.625rem` | 10 |
| `3` | `0.75rem` | 12 |
| `3.5` | `0.875rem` | 14 |
| `4` | `1rem` | 16 |
| `5` | `1.25rem` | 20 |
| `6` | `1.5rem` | 24 |
| `7` | `1.75rem` | 28 |
| `8` | `2rem` | 32 |
| `9` | `2.25rem` | 36 |
| `10` | `2.5rem` | 40 |
| `11` | `2.75rem` | 44 |
| `12` | `3rem` | 48 |
| `14` | `3.5rem` | 56 |
| `16` | `4rem` | 64 |
| `20` | `5rem` | 80 |
| `24` | `6rem` | 96 |
| `28` | `7rem` | 112 |
| `32` | `8rem` | 128 |
| `36` | `9rem` | 144 |
| `40` | `10rem` | 160 |
| `44` | `11rem` | 176 |
| `48` | `12rem` | 192 |
| `52` | `13rem` | 208 |
| `56` | `14rem` | 224 |
| `60` | `15rem` | 240 |
| `64` | `16rem` | 256 |
| `72` | `18rem` | 288 |
| `80` | `20rem` | 320 |
| `96` | `24rem` | 384 |

### 6.2 Padding

```html
<!-- All sides -->
<div class="p-4">padding: 1rem</div>

<!-- Individual sides -->
<div class="pt-4">padding-top</div>
<div class="pr-4">padding-right</div>
<div class="pb-4">padding-bottom</div>
<div class="pl-4">padding-left</div>

<!-- Axis -->
<div class="px-4">padding-left + padding-right</div>
<div class="py-4">padding-top + padding-bottom</div>

<!-- Logical properties -->
<div class="ps-4">padding-inline-start</div>
<div class="pe-4">padding-inline-end</div>
```

### 6.3 Margin

```html
<!-- All sides -->
<div class="m-4">margin: 1rem</div>
<div class="m-auto">margin: auto</div>

<!-- Individual sides -->
<div class="mt-4">margin-top</div>
<div class="mr-4">margin-right</div>
<div class="mb-4">margin-bottom</div>
<div class="ml-4">margin-left</div>

<!-- Axis -->
<div class="mx-auto">margin-left + margin-right: auto (center)</div>
<div class="my-8">margin-top + margin-bottom</div>

<!-- Logical -->
<div class="ms-4">margin-inline-start</div>
<div class="me-4">margin-inline-end</div>

<!-- Negative margins -->
<div class="-mt-4">margin-top: -1rem</div>
<div class="-mx-4">Negative horizontal margins</div>

<!-- Space between children -->
<div class="flex flex-col space-y-4">
    <div>Child 1</div>
    <div>Child 2</div>   <!-- margin-top: 1rem -->
    <div>Child 3</div>   <!-- margin-top: 1rem -->
</div>

<div class="flex space-x-4">
    <div>Child 1</div>
    <div>Child 2</div>   <!-- margin-left: 1rem -->
    <div>Child 3</div>   <!-- margin-left: 1rem -->
</div>

<!-- Prefer gap over space-x/y when possible -->
<div class="flex gap-4">
    <div>Child 1</div>
    <div>Child 2</div>
    <div>Child 3</div>
</div>
```

---

## 7. Sizing (Width & Height)

### 7.1 Width

```html
<div class="w-0">width: 0</div>
<div class="w-px">width: 1px</div>
<div class="w-4">width: 1rem</div>
<div class="w-64">width: 16rem</div>
<div class="w-auto">width: auto</div>
<div class="w-full">width: 100%</div>
<div class="w-screen">width: 100vw</div>
<div class="w-dvw">width: 100dvw</div>
<div class="w-min">width: min-content</div>
<div class="w-max">width: max-content</div>
<div class="w-fit">width: fit-content</div>

<!-- Fractions -->
<div class="w-1/2">50%</div>
<div class="w-1/3">33.333%</div>
<div class="w-2/3">66.667%</div>
<div class="w-1/4">25%</div>
<div class="w-3/4">75%</div>
<div class="w-1/5">20%</div>
<div class="w-2/5">40%</div>
<div class="w-3/5">60%</div>
<div class="w-4/5">80%</div>
<div class="w-1/6">16.667%</div>
<div class="w-5/6">83.333%</div>
<div class="w-1/12">8.333%</div>
<div class="w-11/12">91.667%</div>

<!-- Min/Max Width -->
<div class="min-w-0">min-width: 0</div>
<div class="min-w-full">min-width: 100%</div>
<div class="min-w-min">min-width: min-content</div>
<div class="min-w-max">min-width: max-content</div>
<div class="min-w-fit">min-width: fit-content</div>

<div class="max-w-xs">max-width: 20rem</div>
<div class="max-w-sm">max-width: 24rem</div>
<div class="max-w-md">max-width: 28rem</div>
<div class="max-w-lg">max-width: 32rem</div>
<div class="max-w-xl">max-width: 36rem</div>
<div class="max-w-2xl">max-width: 42rem</div>
<div class="max-w-3xl">max-width: 48rem</div>
<div class="max-w-4xl">max-width: 56rem</div>
<div class="max-w-5xl">max-width: 64rem</div>
<div class="max-w-6xl">max-width: 72rem</div>
<div class="max-w-7xl">max-width: 80rem</div>
<div class="max-w-full">max-width: 100%</div>
<div class="max-w-none">max-width: none</div>
<div class="max-w-prose">max-width: 65ch</div>
<div class="max-w-screen-sm">max-width: 640px</div>
<div class="max-w-screen-md">max-width: 768px</div>
<div class="max-w-screen-lg">max-width: 1024px</div>
<div class="max-w-screen-xl">max-width: 1280px</div>
<div class="max-w-screen-2xl">max-width: 1536px</div>
```

### 7.2 Height

```html
<div class="h-0">height: 0</div>
<div class="h-4">height: 1rem</div>
<div class="h-full">height: 100%</div>
<div class="h-screen">height: 100vh</div>
<div class="h-dvh">height: 100dvh (dynamic)</div>
<div class="h-svh">height: 100svh (small)</div>
<div class="h-lvh">height: 100lvh (large)</div>
<div class="h-auto">height: auto</div>
<div class="h-min">height: min-content</div>
<div class="h-max">height: max-content</div>
<div class="h-fit">height: fit-content</div>

<!-- Min/Max Height -->
<div class="min-h-0">min-height: 0</div>
<div class="min-h-full">min-height: 100%</div>
<div class="min-h-screen">min-height: 100vh</div>
<div class="min-h-dvh">min-height: 100dvh</div>

<div class="max-h-full">max-height: 100%</div>
<div class="max-h-screen">max-height: 100vh</div>
<div class="max-h-none">max-height: none</div>

<!-- Size (width AND height simultaneously) -->
<div class="size-4">width: 1rem; height: 1rem</div>
<div class="size-8">width: 2rem; height: 2rem</div>
<div class="size-full">width: 100%; height: 100%</div>
```

---

## 8. Typography

```html
<!-- Font Family -->
<p class="font-sans">Inter, system-ui, sans-serif</p>
<p class="font-serif">Georgia, serif</p>
<p class="font-mono">Fira Code, monospace</p>

<!-- Font Size -->
<p class="text-xs">0.75rem / 12px</p>
<p class="text-sm">0.875rem / 14px</p>
<p class="text-base">1rem / 16px</p>
<p class="text-lg">1.125rem / 18px</p>
<p class="text-xl">1.25rem / 20px</p>
<p class="text-2xl">1.5rem / 24px</p>
<p class="text-3xl">1.875rem / 30px</p>
<p class="text-4xl">2.25rem / 36px</p>
<p class="text-5xl">3rem / 48px</p>
<p class="text-6xl">3.75rem / 60px</p>
<p class="text-7xl">4.5rem / 72px</p>
<p class="text-8xl">6rem / 96px</p>
<p class="text-9xl">8rem / 128px</p>

<!-- Font Weight -->
<p class="font-thin">100</p>
<p class="font-extralight">200</p>
<p class="font-light">300</p>
<p class="font-normal">400</p>
<p class="font-medium">500</p>
<p class="font-semibold">600</p>
<p class="font-bold">700</p>
<p class="font-extrabold">800</p>
<p class="font-black">900</p>

<!-- Font Style -->
<p class="italic">Italic</p>
<p class="not-italic">Not italic</p>

<!-- Text Alignment -->
<p class="text-left">Left</p>
<p class="text-center">Center</p>
<p class="text-right">Right</p>
<p class="text-justify">Justify</p>
<p class="text-start">Start (logical)</p>
<p class="text-end">End (logical)</p>

<!-- Text Color -->
<p class="text-black">Black</p>
<p class="text-white">White</p>
<p class="text-gray-500">Gray 500</p>
<p class="text-blue-600">Blue 600</p>
<p class="text-red-500">Red 500</p>
<p class="text-transparent">Transparent</p>
<p class="text-inherit">Inherit</p>
<p class="text-current">Current color</p>

<!-- Text Decoration -->
<p class="underline">Underline</p>
<p class="overline">Overline</p>
<p class="line-through">Line-through</p>
<p class="no-underline">No underline</p>
<p class="decoration-blue-500">Blue underline</p>
<p class="decoration-2">2px thick</p>
<p class="decoration-dotted">Dotted</p>
<p class="decoration-dashed">Dashed</p>
<p class="decoration-wavy">Wavy</p>
<p class="underline-offset-4">Offset: 4px</p>

<!-- Text Transform -->
<p class="uppercase">UPPERCASE</p>
<p class="lowercase">lowercase</p>
<p class="capitalize">Capitalize Each Word</p>
<p class="normal-case">Normal case</p>

<!-- Line Height -->
<p class="leading-none">1</p>
<p class="leading-tight">1.25</p>
<p class="leading-snug">1.375</p>
<p class="leading-normal">1.5</p>
<p class="leading-relaxed">1.625</p>
<p class="leading-loose">2</p>
<p class="leading-3">0.75rem</p>
<p class="leading-10">2.5rem</p>

<!-- Letter Spacing -->
<p class="tracking-tighter">-0.05em</p>
<p class="tracking-tight">-0.025em</p>
<p class="tracking-normal">0em</p>
<p class="tracking-wide">0.025em</p>
<p class="tracking-wider">0.05em</p>
<p class="tracking-widest">0.1em</p>

<!-- Word Break -->
<p class="break-normal">Normal</p>
<p class="break-words">Break words</p>
<p class="break-all">Break all</p>
<p class="break-keep">Keep all</p>

<!-- Truncation -->
<p class="truncate">Single line truncation...</p>  <!-- Ellipsis -->
<p class="text-ellipsis overflow-hidden">Ellipsis</p>
<p class="text-clip overflow-hidden">Clip</p>

<!-- Line clamp (multi-line truncation) -->
<p class="line-clamp-1">Clamp to 1 line</p>
<p class="line-clamp-2">Clamp to 2 lines</p>
<p class="line-clamp-3">Clamp to 3 lines</p>
<p class="line-clamp-none">No clamp</p>

<!-- Whitespace -->
<p class="whitespace-normal">Normal</p>
<p class="whitespace-nowrap">No wrap</p>
<p class="whitespace-pre">Preserve</p>
<p class="whitespace-pre-line">Pre-line</p>
<p class="whitespace-pre-wrap">Pre-wrap</p>
<p class="whitespace-break-spaces">Break spaces</p>

<!-- Text Wrap -->
<h1 class="text-balance">Balanced heading text</h1>
<p class="text-pretty">Pretty body text</p>
<p class="text-nowrap">No wrapping</p>
<p class="text-wrap">Allow wrapping</p>

<!-- Hyphens -->
<p class="hyphens-none">No hyphens</p>
<p class="hyphens-manual">Manual</p>
<p class="hyphens-auto">Auto</p>

<!-- List Style -->
<ul class="list-disc">Disc bullets</ul>
<ul class="list-decimal">Numbered</ul>
<ul class="list-none">No bullets</ul>
<ul class="list-inside">Bullets inside</ul>
<ul class="list-outside">Bullets outside</ul>

<!-- Font Variant Numeric -->
<p class="tabular-nums">Tabular numbers (fixed width)</p>
<p class="oldstyle-nums">Old-style numbers</p>
<p class="lining-nums">Lining numbers</p>
<p class="proportional-nums">Proportional numbers</p>
<p class="ordinal">1st 2nd 3rd</p>
<p class="slashed-zero">0</p>
```

---

## 9. Colors & Background

### 9.1 Default Color Palette

```html
<!-- Colors available for ALL color utilities:
     text-{color}, bg-{color}, border-{color}, ring-{color},
     shadow-{color}, accent-{color}, etc. -->

<!-- Shades: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950 -->

<!-- Built-in colors:
     slate, gray, zinc, neutral, stone,
     red, orange, amber, yellow, lime, green,
     emerald, teal, cyan, sky, blue, indigo,
     violet, purple, fuchsia, pink, rose -->

<div class="bg-blue-500 text-white">Blue 500</div>
<div class="bg-gray-100 text-gray-900">Light gray</div>
<div class="bg-emerald-600 text-emerald-50">Emerald</div>

<!-- Special values -->
<div class="bg-transparent">Transparent</div>
<div class="bg-current">Current text color</div>
<div class="bg-inherit">Inherit from parent</div>
<div class="bg-black">Black (#000)</div>
<div class="bg-white">White (#fff)</div>

<!-- Opacity modifier -->
<div class="bg-blue-500/50">50% opacity blue</div>
<div class="bg-black/25">25% opacity black</div>
<div class="text-white/80">80% opacity white text</div>
<div class="border-gray-300/50">50% opacity border</div>
```

### 9.2 Background

```html
<!-- Background color -->
<div class="bg-white dark:bg-gray-900">White / Dark gray</div>

<!-- Background image -->
<div class="bg-[url('/image.jpg')]">Custom image</div>
<div class="bg-none">No background image</div>

<!-- Gradients -->
<div class="bg-gradient-to-r from-blue-500 to-purple-600">
    Right gradient
</div>
<div class="bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500">
    Bottom-right with via color
</div>

<!-- Gradient directions -->
<div class="bg-gradient-to-t">Top</div>
<div class="bg-gradient-to-tr">Top right</div>
<div class="bg-gradient-to-r">Right</div>
<div class="bg-gradient-to-br">Bottom right</div>
<div class="bg-gradient-to-b">Bottom</div>
<div class="bg-gradient-to-bl">Bottom left</div>
<div class="bg-gradient-to-l">Left</div>
<div class="bg-gradient-to-tl">Top left</div>

<!-- Gradient color stops with positions -->
<div class="from-blue-500 from-10% via-purple-500 via-50% to-pink-500 to-90%">
    Gradient with stop positions
</div>

<!-- Background size -->
<div class="bg-auto">Auto</div>
<div class="bg-cover">Cover</div>
<div class="bg-contain">Contain</div>

<!-- Background position -->
<div class="bg-center">Center</div>
<div class="bg-top">Top</div>
<div class="bg-bottom">Bottom</div>
<div class="bg-left">Left</div>
<div class="bg-right">Right</div>
<div class="bg-left-top">Left top</div>
<div class="bg-right-bottom">Right bottom</div>

<!-- Background repeat -->
<div class="bg-repeat">Repeat</div>
<div class="bg-no-repeat">No repeat</div>
<div class="bg-repeat-x">Repeat X</div>
<div class="bg-repeat-y">Repeat Y</div>
<div class="bg-repeat-round">Round</div>
<div class="bg-repeat-space">Space</div>

<!-- Background attachment -->
<div class="bg-fixed">Fixed (parallax)</div>
<div class="bg-local">Local</div>
<div class="bg-scroll">Scroll</div>

<!-- Background clip -->
<div class="bg-clip-border">Border box</div>
<div class="bg-clip-padding">Padding box</div>
<div class="bg-clip-content">Content box</div>
<div class="bg-clip-text">Text (gradient text!)</div>

<!-- Background origin -->
<div class="bg-origin-border">Border box</div>
<div class="bg-origin-padding">Padding box</div>
<div class="bg-origin-content">Content box</div>
```

---

## 10. Borders

```html
<!-- Border width -->
<div class="border">1px all sides</div>
<div class="border-0">0px</div>
<div class="border-2">2px</div>
<div class="border-4">4px</div>
<div class="border-8">8px</div>
<div class="border-t">Top only</div>
<div class="border-r-2">Right 2px</div>
<div class="border-b-4">Bottom 4px</div>
<div class="border-l">Left only</div>
<div class="border-x">Left + Right</div>
<div class="border-y-2">Top + Bottom 2px</div>
<div class="border-s">Start (logical)</div>
<div class="border-e">End (logical)</div>

<!-- Border color -->
<div class="border-gray-300">Gray border</div>
<div class="border-blue-500">Blue border</div>
<div class="border-transparent">Transparent</div>
<div class="border-t-red-500">Red top border</div>

<!-- Border style -->
<div class="border-solid">Solid</div>
<div class="border-dashed">Dashed</div>
<div class="border-dotted">Dotted</div>
<div class="border-double">Double</div>
<div class="border-hidden">Hidden</div>
<div class="border-none">None</div>

<!-- Border radius -->
<div class="rounded-none">0px</div>
<div class="rounded-sm">0.125rem</div>
<div class="rounded">0.25rem</div>
<div class="rounded-md">0.375rem</div>
<div class="rounded-lg">0.5rem</div>
<div class="rounded-xl">0.75rem</div>
<div class="rounded-2xl">1rem</div>
<div class="rounded-3xl">1.5rem</div>
<div class="rounded-full">9999px (circle/pill)</div>

<!-- Individual corners -->
<div class="rounded-t-lg">Top left + right</div>
<div class="rounded-r-lg">Top right + bottom right</div>
<div class="rounded-b-lg">Bottom left + right</div>
<div class="rounded-l-lg">Top left + bottom left</div>
<div class="rounded-tl-lg">Top left only</div>
<div class="rounded-tr-lg">Top right only</div>
<div class="rounded-br-lg">Bottom right only</div>
<div class="rounded-bl-lg">Bottom left only</div>
<div class="rounded-ss-lg">Start-start (logical)</div>
<div class="rounded-ee-lg">End-end (logical)</div>

<!-- Divide (borders between children) -->
<div class="divide-y divide-gray-200">
    <div class="py-4">Item 1</div>
    <div class="py-4">Item 2</div>
    <div class="py-4">Item 3</div>
</div>
<div class="divide-x divide-blue-300">Horizontal divide</div>
<div class="divide-dashed">Dashed dividers</div>

<!-- Ring (box-shadow based outline) -->
<div class="ring-2 ring-blue-500">2px ring</div>
<div class="ring-4 ring-red-500">4px ring</div>
<div class="ring-1 ring-gray-300">1px ring</div>
<div class="ring-offset-2 ring-offset-white ring-2 ring-blue-500">
    Ring with offset
</div>
<div class="ring-inset ring-2 ring-blue-500">Inset ring</div>

<!-- Outline -->
<div class="outline outline-2 outline-blue-500">Outline</div>
<div class="outline-none">No outline</div>
<div class="outline-dashed">Dashed</div>
<div class="outline-offset-2">Offset: 2px</div>
```

---

## 11. Effects (Shadows, Opacity, Blend)

```html
<!-- Box Shadow -->
<div class="shadow-sm">Small shadow</div>
<div class="shadow">Default shadow</div>
<div class="shadow-md">Medium</div>
<div class="shadow-lg">Large</div>
<div class="shadow-xl">Extra large</div>
<div class="shadow-2xl">2XL</div>
<div class="shadow-inner">Inner shadow</div>
<div class="shadow-none">No shadow</div>

<!-- Colored shadows -->
<div class="shadow-lg shadow-blue-500/50">Blue shadow</div>
<div class="shadow-xl shadow-red-500/25">Red shadow</div>

<!-- Opacity -->
<div class="opacity-0">0%</div>
<div class="opacity-5">5%</div>
<div class="opacity-25">25%</div>
<div class="opacity-50">50%</div>
<div class="opacity-75">75%</div>
<div class="opacity-100">100%</div>

<!-- Mix Blend Mode -->
<div class="mix-blend-normal">Normal</div>
<div class="mix-blend-multiply">Multiply</div>
<div class="mix-blend-screen">Screen</div>
<div class="mix-blend-overlay">Overlay</div>
<div class="mix-blend-darken">Darken</div>
<div class="mix-blend-lighten">Lighten</div>
<div class="mix-blend-color-dodge">Color dodge</div>
<div class="mix-blend-difference">Difference</div>

<!-- Background Blend Mode -->
<div class="bg-blend-multiply">Multiply</div>
<div class="bg-blend-overlay">Overlay</div>
```

---

## 12. Filters

```html
<!-- Blur -->
<div class="blur-none">No blur</div>
<div class="blur-sm">4px blur</div>
<div class="blur">8px blur</div>
<div class="blur-md">12px blur</div>
<div class="blur-lg">16px blur</div>
<div class="blur-xl">24px blur</div>
<div class="blur-2xl">40px blur</div>
<div class="blur-3xl">64px blur</div>

<!-- Brightness -->
<div class="brightness-50">50%</div>
<div class="brightness-75">75%</div>
<div class="brightness-100">100% (normal)</div>
<div class="brightness-125">125%</div>
<div class="brightness-150">150%</div>
<div class="brightness-200">200%</div>

<!-- Contrast, Saturate, Grayscale, Sepia, Invert, Hue-rotate -->
<div class="contrast-125">Contrast 125%</div>
<div class="saturate-150">Saturate 150%</div>
<div class="grayscale">Full grayscale</div>
<div class="grayscale-0">No grayscale</div>
<div class="sepia">Full sepia</div>
<div class="invert">Full invert</div>
<div class="hue-rotate-90">Hue rotate 90deg</div>
<div class="hue-rotate-180">Hue rotate 180deg</div>

<!-- Drop Shadow (follows shape, unlike box-shadow) -->
<div class="drop-shadow-sm">Small</div>
<div class="drop-shadow">Default</div>
<div class="drop-shadow-md">Medium</div>
<div class="drop-shadow-lg">Large</div>
<div class="drop-shadow-xl">XL</div>
<div class="drop-shadow-2xl">2XL</div>
<div class="drop-shadow-none">None</div>

<!-- Backdrop Filter (affects content BEHIND element) -->
<div class="backdrop-blur-sm">Backdrop blur 4px</div>
<div class="backdrop-blur-md">Backdrop blur 12px</div>
<div class="backdrop-blur-xl">Backdrop blur 24px</div>
<div class="backdrop-brightness-75">Backdrop brightness</div>
<div class="backdrop-contrast-125">Backdrop contrast</div>
<div class="backdrop-grayscale">Backdrop grayscale</div>
<div class="backdrop-saturate-150">Backdrop saturate</div>
<div class="backdrop-sepia">Backdrop sepia</div>
```

---

## 13. Transforms

```html
<!-- Scale -->
<div class="scale-0">0%</div>
<div class="scale-50">50%</div>
<div class="scale-75">75%</div>
<div class="scale-90">90%</div>
<div class="scale-95">95%</div>
<div class="scale-100">100%</div>
<div class="scale-105">105%</div>
<div class="scale-110">110%</div>
<div class="scale-125">125%</div>
<div class="scale-150">150%</div>
<div class="scale-x-75 scale-y-100">Horizontal 75%, Vertical 100%</div>

<!-- Rotate -->
<div class="rotate-0">0deg</div>
<div class="rotate-1">1deg</div>
<div class="rotate-2">2deg</div>
<div class="rotate-3">3deg</div>
<div class="rotate-6">6deg</div>
<div class="rotate-12">12deg</div>
<div class="rotate-45">45deg</div>
<div class="rotate-90">90deg</div>
<div class="rotate-180">180deg</div>
<div class="-rotate-45">-45deg</div>

<!-- Translate -->
<div class="translate-x-4">Right 1rem</div>
<div class="-translate-x-4">Left 1rem</div>
<div class="translate-y-4">Down 1rem</div>
<div class="-translate-y-full">Up 100%</div>
<div class="translate-x-1/2">Right 50%</div>

<!-- Skew -->
<div class="skew-x-3">Skew X 3deg</div>
<div class="skew-y-6">Skew Y 6deg</div>
<div class="-skew-x-6">Skew X -6deg</div>

<!-- Transform Origin -->
<div class="origin-center">Center (default)</div>
<div class="origin-top">Top</div>
<div class="origin-top-right">Top right</div>
<div class="origin-right">Right</div>
<div class="origin-bottom-right">Bottom right</div>
<div class="origin-bottom">Bottom</div>
<div class="origin-bottom-left">Bottom left</div>
<div class="origin-left">Left</div>
<div class="origin-top-left">Top left</div>
```

---

## 14. Transitions & Animation

```html
<!-- Transition Property -->
<div class="transition-none">No transition</div>
<div class="transition-all">All properties</div>
<div class="transition">Color, bg, border, text-decoration, fill, stroke, opacity, shadow, transform, filter, backdrop-filter</div>
<div class="transition-colors">Color properties only</div>
<div class="transition-opacity">Opacity only</div>
<div class="transition-shadow">Shadow only</div>
<div class="transition-transform">Transform only</div>

<!-- Duration -->
<div class="duration-0">0ms</div>
<div class="duration-75">75ms</div>
<div class="duration-100">100ms</div>
<div class="duration-150">150ms</div>
<div class="duration-200">200ms</div>
<div class="duration-300">300ms (default)</div>
<div class="duration-500">500ms</div>
<div class="duration-700">700ms</div>
<div class="duration-1000">1000ms</div>

<!-- Timing Function -->
<div class="ease-linear">Linear</div>
<div class="ease-in">Ease in</div>
<div class="ease-out">Ease out</div>
<div class="ease-in-out">Ease in out</div>

<!-- Delay -->
<div class="delay-0">0ms</div>
<div class="delay-75">75ms</div>
<div class="delay-100">100ms</div>
<div class="delay-150">150ms</div>
<div class="delay-200">200ms</div>
<div class="delay-300">300ms</div>
<div class="delay-500">500ms</div>
<div class="delay-700">700ms</div>
<div class="delay-1000">1000ms</div>

<!-- Animation -->
<div class="animate-none">No animation</div>
<div class="animate-spin">Spinning (infinite)</div>
<div class="animate-ping">Ping (radar effect)</div>
<div class="animate-pulse">Pulse (fade in/out)</div>
<div class="animate-bounce">Bounce</div>

<!-- Common transition pattern -->
<button class="bg-blue-600 text-white px-4 py-2 rounded-lg
               transition-all duration-200 ease-in-out
               hover:bg-blue-700 hover:scale-105 hover:shadow-lg
               active:scale-95">
    Click Me
</button>
```

---

## 15. Interactivity

```html
<!-- Cursor -->
<div class="cursor-auto">Auto</div>
<div class="cursor-default">Default</div>
<div class="cursor-pointer">Pointer</div>
<div class="cursor-wait">Wait</div>
<div class="cursor-text">Text</div>
<div class="cursor-move">Move</div>
<div class="cursor-help">Help</div>
<div class="cursor-not-allowed">Not allowed</div>
<div class="cursor-none">None</div>
<div class="cursor-crosshair">Crosshair</div>
<div class="cursor-grab">Grab</div>
<div class="cursor-grabbing">Grabbing</div>
<div class="cursor-zoom-in">Zoom in</div>
<div class="cursor-zoom-out">Zoom out</div>
<div class="cursor-col-resize">Column resize</div>
<div class="cursor-row-resize">Row resize</div>

<!-- Pointer Events -->
<div class="pointer-events-none">No pointer events</div>
<div class="pointer-events-auto">Auto</div>

<!-- User Select -->
<div class="select-none">Can't select text</div>
<div class="select-text">Can select text</div>
<div class="select-all">Select all on click</div>
<div class="select-auto">Auto</div>

<!-- Resize (for textareas) -->
<textarea class="resize-none">No resize</textarea>
<textarea class="resize-y">Vertical resize</textarea>
<textarea class="resize-x">Horizontal resize</textarea>
<textarea class="resize">Both</textarea>

<!-- Touch Action -->
<div class="touch-auto">Auto</div>
<div class="touch-none">None</div>
<div class="touch-pan-x">Pan X only</div>
<div class="touch-pan-y">Pan Y only</div>
<div class="touch-manipulation">Pan + pinch zoom</div>

<!-- Scroll Behavior -->
<div class="scroll-auto">Instant scroll</div>
<div class="scroll-smooth">Smooth scroll</div>

<!-- Scroll Snap -->
<div class="snap-x snap-mandatory">Horizontal mandatory snap</div>
<div class="snap-y snap-proximity">Vertical proximity snap</div>
<div class="snap-start">Snap to start</div>
<div class="snap-center">Snap to center</div>
<div class="snap-end">Snap to end</div>
<div class="snap-always">Always stop</div>

<!-- Scroll Padding & Margin -->
<div class="scroll-pt-16">Scroll padding top (for fixed header)</div>
<div class="scroll-mt-16">Scroll margin top</div>

<!-- Accent Color (native form controls) -->
<input type="checkbox" class="accent-blue-600">
<input type="range" class="accent-pink-500">

<!-- Caret Color -->
<input class="caret-blue-500" type="text">
<input class="caret-transparent" type="text">

<!-- Will Change -->
<div class="will-change-auto">Auto</div>
<div class="will-change-scroll">Scroll</div>
<div class="will-change-contents">Contents</div>
<div class="will-change-transform">Transform</div>

<!-- Content Visibility -->
<div class="content-auto">content-visibility: auto</div>
<div class="content-hidden">content-visibility: hidden</div>
<div class="content-visible">content-visibility: visible</div>
```

---

## 16. Responsive Design

### 16.1 Breakpoints

| Prefix | Min-Width | CSS |
|--------|-----------|-----|
| `sm:` | 640px | `@media (min-width: 640px)` |
| `md:` | 768px | `@media (min-width: 768px)` |
| `lg:` | 1024px | `@media (min-width: 1024px)` |
| `xl:` | 1280px | `@media (min-width: 1280px)` |
| `2xl:` | 1536px | `@media (min-width: 1536px)` |

### 16.2 Usage (Mobile-First)

```html
<!-- Base = mobile → sm = tablet → lg = desktop -->
<div class="text-sm sm:text-base lg:text-lg xl:text-xl">
    Responsive text
</div>

<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    <!-- Responsive grid -->
</div>

<div class="p-4 md:p-8 lg:p-12">
    Responsive padding
</div>

<div class="flex flex-col md:flex-row gap-4">
    Column on mobile, row on tablet+
</div>

<!-- Hide/show at breakpoints -->
<div class="hidden md:block">Visible only on md+</div>
<div class="block md:hidden">Visible only on mobile</div>
<div class="hidden lg:flex">Flex on lg+, hidden below</div>

<!-- Max-width breakpoints (v3.4+) -->
<div class="max-sm:hidden">Hidden below sm</div>
<div class="max-md:flex-col">Column below md</div>
<div class="max-lg:text-sm">Small text below lg</div>

<!-- Range breakpoints -->
<div class="md:max-lg:text-center">Center text only between md and lg</div>
```

### 16.3 Container Queries

```html
<!-- Define container -->
<div class="@container">
    <!-- Query container's size -->
    <div class="@sm:flex @md:grid @lg:grid-cols-3">
        Responsive to container, not viewport
    </div>
</div>

<!-- Named container -->
<div class="@container/sidebar">
    <div class="@sm/sidebar:flex">
        Responds to sidebar container size
    </div>
</div>

<!-- Container query breakpoints:
     @xs:  20rem (320px)
     @sm:  24rem (384px)
     @md:  28rem (448px)
     @lg:  32rem (512px)
     @xl:  36rem (576px)
     @2xl: 42rem (672px)
-->
```

---

## 17. State Modifiers (Hover, Focus, etc.)

```html
<!-- Pseudo-class modifiers -->
<button class="hover:bg-blue-700">Hover</button>
<button class="focus:ring-2 focus:ring-blue-500">Focus</button>
<button class="focus-visible:ring-2">Focus visible (keyboard only)</button>
<button class="active:scale-95">Active (clicking)</button>
<a class="visited:text-purple-600">Visited link</a>

<!-- Focus-within (parent has focused child) -->
<div class="focus-within:ring-2 focus-within:ring-blue-500">
    <input type="text">
</div>

<!-- Form states -->
<input class="disabled:opacity-50 disabled:cursor-not-allowed" disabled>
<input class="required:border-red-500" required>
<input class="invalid:border-red-500 valid:border-green-500">
<input class="read-only:bg-gray-100" readonly>
<input class="placeholder-shown:border-gray-300">
<input class="autofill:bg-yellow-100">
<input class="checked:bg-blue-500" type="checkbox">
<input class="indeterminate:bg-gray-300" type="checkbox">

<!-- Group hover/focus (parent → child) -->
<div class="group cursor-pointer">
    <h3 class="group-hover:text-blue-600">Title</h3>
    <p class="group-hover:text-gray-600">Description</p>
    <span class="group-focus:ring-2">Focus indicator</span>
</div>

<!-- Named groups -->
<div class="group/card">
    <h3 class="group-hover/card:text-blue-600">Title</h3>
</div>

<!-- Peer states (sibling → sibling) -->
<input class="peer" type="checkbox">
<label class="peer-checked:text-blue-600">Label changes when checked</label>
<p class="peer-invalid:text-red-500">Error shown when invalid</p>

<!-- Structural pseudo-classes -->
<li class="first:pt-0">First child</li>
<li class="last:pb-0">Last child</li>
<li class="odd:bg-gray-50">Odd items</li>
<li class="even:bg-white">Even items</li>
<li class="only:mx-auto">Only child</li>
<li class="first-of-type:font-bold">First of type</li>
<li class="last-of-type:mb-0">Last of type</li>
<div class="empty:hidden">Hidden when empty</div>

<!-- Before & After pseudo-elements -->
<div class="before:content-['→'] before:mr-2">With arrow before</div>
<div class="after:content-[''] after:block after:h-1 after:bg-blue-500">
    With line after
</div>
<li class="marker:text-blue-500">Custom marker color</li>
<p class="first-line:font-bold first-line:text-lg">First line styling</p>
<p class="first-letter:text-4xl first-letter:font-bold first-letter:float-left">
    Drop cap
</p>
<p class="selection:bg-blue-200 selection:text-blue-900">Custom selection</p>
<input class="placeholder:text-gray-400 placeholder:italic">
<input class="file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-blue-700 file:cursor-pointer" type="file">

<!-- Has modifier (parent selector) -->
<div class="has-[input:focus]:ring-2 has-[input:focus]:ring-blue-500">
    <input type="text">
</div>
<div class="has-[>img]:p-0">No padding when has direct img child</div>

<!-- Media & preference modifiers -->
<div class="motion-safe:animate-bounce">Animate if motion OK</div>
<div class="motion-reduce:animate-none">No animation if reduced motion</div>
<div class="contrast-more:border-2">Extra border in high contrast</div>
<div class="print:hidden">Hidden when printing</div>
<div class="portrait:flex-col landscape:flex-row">Orientation</div>

<!-- Data attributes -->
<div data-active="true" class="data-[active=true]:bg-blue-500">
    Data attribute conditional
</div>

<!-- Aria attributes -->
<div aria-selected="true" class="aria-selected:bg-blue-100">
    ARIA selected
</div>
<div aria-expanded="true" class="aria-expanded:rotate-180">
    ARIA expanded
</div>

<!-- Open modifier (for details/dialog) -->
<details class="open:bg-gray-100">
    <summary>Click to expand</summary>
    <p>Content</p>
</details>

<!-- Stacking modifiers -->
<button class="dark:hover:bg-blue-800 sm:hover:bg-blue-700 focus:hover:ring-4">
    Multiple state + breakpoint combinations
</button>
```

---

## 18. Dark Mode

```html
<!-- Class-based dark mode (recommended) -->
<html class="dark">
<body class="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
    <div class="bg-gray-100 dark:bg-gray-800 border dark:border-gray-700">
        <h2 class="text-gray-900 dark:text-white">Title</h2>
        <p class="text-gray-600 dark:text-gray-400">Description</p>
    </div>
</body>
</html>

<!-- Toggle dark mode via JavaScript -->
<script>
    // Toggle
    document.documentElement.classList.toggle('dark');

    // Check system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
    }

    // Persist preference
    localStorage.setItem('theme', 'dark');
</script>
```

---

## 19. Customization (tailwind.config.js)

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{html,js,jsx,tsx,vue}'],
    darkMode: 'class',
    theme: {
        // Override defaults entirely
        screens: {
            'sm': '640px',
            'md': '768px',
            'lg': '1024px',
            'xl': '1280px',
            '2xl': '1536px',
        },
        // Extend defaults (add to existing)
        extend: {
            colors: {
                brand: {
                    50:  '#f0f7ff',
                    500: '#3b82f6',
                    900: '#1e3a8a',
                },
            },
            fontFamily: {
                display: ['Outfit', 'sans-serif'],
            },
            fontSize: {
                '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
            },
            spacing: {
                '18': '4.5rem',
                '88': '22rem',
            },
            maxWidth: {
                '8xl': '88rem',
            },
            borderRadius: {
                '4xl': '2rem',
            },
            boxShadow: {
                'glow': '0 0 20px rgba(59, 130, 246, 0.5)',
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out forwards',
                'slide-up': 'slideUp 0.3s ease-out forwards',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(100%)' },
                    '100%': { transform: 'translateY(0)' },
                },
            },
            backgroundImage: {
                'hero-pattern': "url('/images/hero-bg.svg')",
            },
        },
    },
    plugins: [],
};
```

---

## 20. Plugins & Extensions

### 20.1 Official Plugins

```bash
# Forms — Better default form styles
npm install @tailwindcss/forms

# Typography — Prose styles for content
npm install @tailwindcss/typography

# Aspect Ratio — Aspect ratio utilities (legacy, now built-in)
npm install @tailwindcss/aspect-ratio

# Container Queries — @container support
npm install @tailwindcss/container-queries
```

```html
<!-- @tailwindcss/typography — Prose class -->
<article class="prose prose-lg prose-blue dark:prose-invert max-w-none">
    <h1>Article Title</h1>
    <p>Beautiful default typography for rendered HTML content...</p>
    <pre><code>console.log('hello');</code></pre>
    <blockquote>A thoughtful quote.</blockquote>
</article>

<!-- Prose sizes: prose-sm, prose-base, prose-lg, prose-xl, prose-2xl -->
<!-- Prose colors: prose-gray, prose-slate, prose-zinc, prose-neutral, prose-stone -->
```

### 20.2 Custom Plugin

```js
// tailwind.config.js
const plugin = require('tailwindcss/plugin');

module.exports = {
    plugins: [
        plugin(function({ addUtilities, addComponents, matchUtilities, theme }) {
            // Add utilities
            addUtilities({
                '.text-balance': { 'text-wrap': 'balance' },
                '.text-pretty': { 'text-wrap': 'pretty' },
                '.content-auto': { 'content-visibility': 'auto' },
            });

            // Add components
            addComponents({
                '.btn': {
                    padding: theme('spacing.2') + ' ' + theme('spacing.4'),
                    borderRadius: theme('borderRadius.lg'),
                    fontWeight: theme('fontWeight.semibold'),
                    transition: 'all 200ms ease',
                },
                '.btn-primary': {
                    backgroundColor: theme('colors.blue.600'),
                    color: theme('colors.white'),
                    '&:hover': {
                        backgroundColor: theme('colors.blue.700'),
                    },
                },
            });

            // Dynamic utilities
            matchUtilities(
                {
                    'text-shadow': (value) => ({
                        textShadow: value,
                    }),
                },
                { values: theme('textShadow') }
            );
        }),
    ],
};
```

---

## 21. @apply & Custom Classes

```css
/* Using @apply to compose utility classes */
@layer components {
    .btn {
        @apply px-4 py-2 rounded-lg font-semibold text-sm
               transition-all duration-200 ease-in-out
               focus:outline-none focus:ring-2 focus:ring-offset-2;
    }

    .btn-primary {
        @apply btn bg-blue-600 text-white
               hover:bg-blue-700 active:bg-blue-800
               focus:ring-blue-500;
    }

    .btn-secondary {
        @apply btn bg-gray-100 text-gray-700
               hover:bg-gray-200 active:bg-gray-300
               focus:ring-gray-400;
    }

    .btn-outline {
        @apply btn border-2 border-blue-600 text-blue-600
               hover:bg-blue-600 hover:text-white
               focus:ring-blue-500;
    }

    .input {
        @apply w-full px-3 py-2 border border-gray-300 rounded-lg
               text-gray-900 placeholder:text-gray-400
               focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
               disabled:bg-gray-50 disabled:cursor-not-allowed
               transition-colors duration-150;
    }

    .card {
        @apply bg-white dark:bg-gray-800 rounded-xl shadow-sm
               border border-gray-200 dark:border-gray-700
               overflow-hidden;
    }

    .badge {
        @apply inline-flex items-center px-2.5 py-0.5
               rounded-full text-xs font-medium;
    }
    .badge-green {
        @apply badge bg-green-100 text-green-800
               dark:bg-green-900/30 dark:text-green-400;
    }
    .badge-red {
        @apply badge bg-red-100 text-red-800
               dark:bg-red-900/30 dark:text-red-400;
    }
}
```

---

## 22. Arbitrary Values & CSS Variables

```html
<!-- Arbitrary values (any CSS value in square brackets) -->
<div class="w-[200px]">Width: 200px</div>
<div class="h-[calc(100vh-80px)]">Height: calc</div>
<div class="top-[117px]">Top: 117px</div>
<div class="bg-[#1da1f2]">Custom hex color</div>
<div class="bg-[rgb(255,0,0)]">Custom RGB</div>
<div class="text-[22px]">Font size: 22px</div>
<div class="text-[length:22px]">With type hint</div>
<div class="text-[color:#f00]">With type hint</div>
<div class="grid-cols-[200px_1fr_200px]">Custom grid</div>
<div class="grid-cols-[repeat(auto-fill,minmax(250px,1fr))]">Auto-fill grid</div>
<div class="font-[900]">Font weight: 900</div>
<div class="leading-[3rem]">Line height: 3rem</div>
<div class="shadow-[0_0_15px_rgba(0,0,0,0.2)]">Custom shadow</div>
<div class="animate-[wiggle_1s_ease-in-out_infinite]">Custom animation</div>
<div class="bg-[url('/img/hero.svg')]">Background image</div>
<div class="[mask-type:luminance]">Any CSS property</div>
<div class="hover:[transform:rotateX(15deg)]">Hover arbitrary</div>
<div class="lg:[&:nth-child(3)]:hover:underline">Complex arbitrary selector</div>

<!-- Arbitrary variants (selectors) -->
<div class="[&>*]:mb-4">All direct children: mb-4</div>
<div class="[&_p]:text-gray-600">All descendant p tags</div>
<div class="[&:nth-child(3)]:bg-red-500">Third child</div>
<div class="[@media(min-width:900px)]:flex">Custom breakpoint</div>
<div class="[@supports(backdrop-filter:blur(0))]:backdrop-blur">Feature query</div>

<!-- CSS Variables -->
<div class="bg-[var(--brand-color)]">CSS variable</div>
<div class="text-[var(--text-color,#333)]">With fallback</div>
<div style="--brand-color: #4285f4" class="bg-[var(--brand-color)]">
    Inline variable + Tailwind
</div>

<!-- Tailwind arbitrary properties -->
<div class="[--scroll-offset:80px] scroll-mt-[var(--scroll-offset)]">
    Define and use in same element
</div>
```

---

## 23. Common Patterns & Components

### 23.1 Centering

```html
<!-- Flex center -->
<div class="flex items-center justify-center min-h-screen">
    <div>Centered content</div>
</div>

<!-- Grid center -->
<div class="grid place-items-center min-h-screen">
    <div>Centered content</div>
</div>

<!-- Absolute center -->
<div class="relative">
    <div class="absolute inset-0 flex items-center justify-center">
        Centered overlay
    </div>
</div>
```

### 23.2 Card Component

```html
<div class="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm
            hover:shadow-xl border border-gray-200 dark:border-gray-700
            overflow-hidden transition-all duration-300">
    <div class="relative overflow-hidden">
        <img src="image.jpg" alt="Card image"
             class="w-full h-48 object-cover transition-transform duration-300
                    group-hover:scale-105">
        <div class="absolute top-3 right-3">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full
                         text-xs font-medium bg-green-100 text-green-800">
                New
            </span>
        </div>
    </div>
    <div class="p-5">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white
                   group-hover:text-blue-600 transition-colors">
            Card Title
        </h3>
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
            A brief description of this card's content that might be truncated
            after two lines if it's too long.
        </p>
        <div class="mt-4 flex items-center justify-between">
            <span class="text-xl font-bold text-gray-900 dark:text-white">$29.99</span>
            <button class="px-4 py-2 bg-blue-600 text-white text-sm font-medium
                          rounded-lg hover:bg-blue-700 active:scale-95
                          transition-all duration-150">
                Buy Now
            </button>
        </div>
    </div>
</div>
```

### 23.3 Modal / Dialog

```html
<!-- Overlay -->
<div class="fixed inset-0 z-50 flex items-center justify-center p-4
            bg-black/50 backdrop-blur-sm">
    <!-- Modal -->
    <div class="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl
                shadow-2xl p-6 animate-fade-in">
        <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                Modal Title
            </h2>
            <button class="p-1 rounded-lg text-gray-400 hover:text-gray-600
                          hover:bg-gray-100 transition-colors">
                ✕
            </button>
        </div>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
            Modal content goes here.
        </p>
        <div class="flex gap-3 justify-end">
            <button class="px-4 py-2 text-sm font-medium text-gray-700
                          bg-gray-100 rounded-lg hover:bg-gray-200">
                Cancel
            </button>
            <button class="px-4 py-2 text-sm font-medium text-white
                          bg-blue-600 rounded-lg hover:bg-blue-700">
                Confirm
            </button>
        </div>
    </div>
</div>
```

### 23.4 Navbar

```html
<nav class="sticky top-0 z-40 w-full bg-white/80 dark:bg-gray-950/80
            backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
            <!-- Logo -->
            <a href="/" class="text-xl font-bold text-gray-900 dark:text-white">
                Brand
            </a>
            <!-- Desktop nav -->
            <div class="hidden md:flex items-center gap-8">
                <a href="#" class="text-sm font-medium text-gray-600 dark:text-gray-300
                                   hover:text-gray-900 dark:hover:text-white transition-colors">
                    Features
                </a>
                <a href="#" class="text-sm font-medium text-gray-600 dark:text-gray-300
                                   hover:text-gray-900 dark:hover:text-white transition-colors">
                    Pricing
                </a>
                <button class="px-4 py-2 bg-blue-600 text-white text-sm font-medium
                              rounded-lg hover:bg-blue-700 transition-colors">
                    Get Started
                </button>
            </div>
            <!-- Mobile menu button -->
            <button class="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100">
                ☰
            </button>
        </div>
    </div>
</nav>
```

### 23.5 Glassmorphism

```html
<div class="bg-white/10 dark:bg-white/5 backdrop-blur-xl
            border border-white/20 rounded-2xl shadow-xl p-8">
    <h2 class="text-white text-2xl font-bold">Glass Card</h2>
    <p class="text-white/80 mt-2">Frosted glass effect</p>
</div>
```

---

## 24. Tailwind v4 Changes

### 24.1 CSS-First Configuration (v4)

```css
/* Tailwind v4: Configuration in CSS instead of JS */
@import "tailwindcss";

/* Theme configuration */
@theme {
    --color-primary-50: #eff6ff;
    --color-primary-500: #3b82f6;
    --color-primary-900: #1e3a8a;

    --font-display: "Outfit", sans-serif;
    --font-body: "Inter", sans-serif;

    --breakpoint-sm: 640px;
    --breakpoint-md: 768px;
    --breakpoint-lg: 1024px;

    --spacing-18: 4.5rem;

    --animate-fade-in: fade-in 0.5s ease-out;
}

@keyframes fade-in {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
```

### 24.2 Key v4 Differences

| Feature | v3 | v4 |
|---------|----|----|
| Config | `tailwind.config.js` | CSS `@theme` block |
| Import | `@tailwind base/components/utilities` | `@import "tailwindcss"` |
| Colors | Config-defined | CSS custom properties |
| JIT | Built-in | Default engine |
| Content paths | Config `content` array | Auto-detection |
| PostCSS | Required | Optional (built-in bundler) |
| Dark mode | `darkMode: 'class'` | `@variant dark { ... }` |
| Plugins | JS `plugin()` | CSS `@plugin` directive |

### 24.3 v4 New Features

```css
/* @variant for custom variants */
@variant dark (&:where(.dark, .dark *));
@variant hocus (&:hover, &:focus);

/* @source for content detection */
@source "../components/**/*.vue";

/* Native CSS nesting works everywhere */
.card {
    @apply rounded-xl p-4;

    &:hover {
        @apply shadow-lg;
    }
}
```

---

> **End of Tailwind CSS Comprehensive Reference Guide**
>
> This document covers Tailwind CSS v3 and v4. For the latest docs, visit [tailwindcss.com](https://tailwindcss.com/docs).
