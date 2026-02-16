# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Website for **Gather Catering and Events** — a catering and event services business.

- Domains: gathercateringandevents.com, gathercafeandevents.com
- Contact email: catering@gathercafeandevents.com
- Requirements doc: `gatherwebsite-requirements.txt`

## Architecture

| Layer | Technology |
|-------|------------|
| Frontend | Plain HTML/CSS/JS — no framework, no build step |
| Email/Forms | Google Apps Script → Google Workspace (catering@gathercafeandevents.com) |
| Hosting | Self-hosted Linux containers: Traefik (SSL + reverse proxy) → Nginx (static files) |
| Backend | None initially; FastAPI container available if future features need it |

### Form Submission Flow
1. User fills out inquiry form on the website
2. Client-side JS POSTs form data to a deployed Google Apps Script web app URL
3. Apps Script parses the data and sends email via Google Workspace to catering@gathercafeandevents.com
4. Optionally logs submissions to a Google Sheet

### Deployment
Static HTML/CSS/JS files are served directly by Nginx. No build step — edit and deploy.

## Design System

### Fonts
| Font | Usage |
|------|-------|
| Abril Fatface | "GATHER" brand wordmark |
| Lucida Calligraphy | "From Dawn to Dusk" tagline |
| Source Sans Pro | Main website font, "Catering and Event Services" |
| Poppins | Business card info |

### Color Palette
| Color | Hex | Usage |
|-------|-----|-------|
| Midnight Blue | #2C3E50 | Background |
| Noodles | #F9E3B4 | Title text, link highlight |
| Light Steel Blue | #C9D6EA | General text |
| Rosewood/Muted Rose | #7F515F | Links |

## Site Structure

### Service Pages (each with its own dedicated page, linked from homepage with image + brief description)
- Full Planning
- "Day Of" Coordinating
- Mobile Bartending
- Catering
- Catering Staffing

### Other Pages
- About Us
- Photo Gallery (future version)
- Testimonials
- FAQs / Common Questions (future version — launch without)
- Policies

### Dynamic Functionality
- **Inquiry Form**: Generic (not wedding-focused), with service checkboxes, write-in budget field, open commentary field. Submits via email to catering@gathercafeandevents.com. Reference: gather.jjocapps.com
- **External Links**: The Knot and Wedding Wire icons linking to their profiles

### Future Versions
- Social media links
- FAQs page
- Photo Gallery
- Pop-ups
