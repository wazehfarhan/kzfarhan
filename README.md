# kzfarhan

A polished personal portfolio website for Kazi Md. Wazeh Ullah Farhan. The system is designed as a modern, single-page experience that presents the owner’s background, selected work, internships, skills, and contact information in a visually rich and interactive format.

## System Overview

This repository contains a front-end-only portfolio system built with plain HTML, CSS, and JavaScript. There is no backend, database, or build pipeline required. The site is static by design, making it easy to host on GitHub Pages, Netlify, Vercel, or any simple web server.

The experience is organized as a single scrolling website with a cinematic presentation:

- A hero section introduces the person and key professional identity.
- A work section highlights selected projects with visual previews and external links.
- An about section communicates educational and professional context.
- A contact section provides channels for reaching out.
- Motion effects, smooth scrolling, animated counters, and custom cursor behavior create a more dynamic user experience.

## Main Components

### 1. Content Layer
The main content lives in [index.html](index.html). It defines:

- The page structure and semantic sections
- Navigation links
- Hero content and call-to-action buttons
- Project cards and project preview media
- About and contact information
- SEO metadata and schema markup for discoverability

### 2. Styling System
The visual design is split across three stylesheet files:

- [css/styles.css](css/styles.css) for global layout, typography, theme, animation, and shared UI styles
- [css/projects.css](css/projects.css) for project card visuals and preview interactions
- [css/internships.css](css/internships.css) for internship-related presentation and section-specific styling

Together, these files define the portfolio’s aesthetic identity, spacing, colors, responsiveness, and motion behavior.

### 3. Interaction Layer
The behavior of the site is handled by [js/app.js](js/app.js). This script manages:

- The loading preloader and progress counter
- Smooth scrolling and keyboard navigation
- Scroll-triggered reveal animations
- Animated numeric counters for statistics
- Custom cursor dot and ring behavior
- Hover states for links and interactive elements
- Project thumbnail switching on hover
- Active project highlighting while scrolling

### 4. Media Assets
The [Images](Images) directory stores visual assets used in the site, especially the screenshots displayed inside project cards.

### 5. Project Data
The [projects.json](projects.json) file is included as a structured data source for project entries. It is currently a template/example for future expansion, and the front-end can be adapted to load project data from it dynamically.

## How the System Works

1. The browser loads [index.html](index.html).
2. The page loads the required CSS and JavaScript files.
3. The JavaScript initializes the preloader, animation system, and interactive behaviors.
4. The user navigates through the single-page experience using the navigation and scrolling interactions.
5. Project cards display previews and link out to live demos or external resources.

## Customization Guide

To update the portfolio, the main places to edit are:

- Personal information and text: [index.html](index.html)
- Visual theme and layout: [css/styles.css](css/styles.css)
- Project card styling: [css/projects.css](css/projects.css)
- Internship presentation: [css/internships.css](css/internships.css)
- Interactive behavior: [js/app.js](js/app.js)
- Project preview images: [Images](Images)
- Project metadata: [projects.json](projects.json)

## Local Development

Because the site is static, you can preview it locally without installing dependencies.

Run a simple local server from the project root:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000 in your browser.

## Deployment

This project can be deployed easily to:

- GitHub Pages
- Netlify
- Vercel
- Any static hosting platform

## Summary

This system is a lightweight, elegant portfolio website that combines content, presentation, and interaction into a single cohesive experience. Its strength lies in its simplicity: it is easy to maintain, easy to host, and easy to customize while still feeling modern and polished.
