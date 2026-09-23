# Expanded Interactive Portfolio

## Goal
Rebuild the reference portfolio as a polished, playable developer portfolio while preserving its verified biography, career history, contacts, project details, and image URLs. Reposition Mohamed as **Full-Stack Developer & Technical Lead — Web, Mobile, SaaS, AI & Unity** without inventing unverified work.

## Public portfolio
- Keep the dark cyber-arcade identity, neon accents, animated profile portrait, “level” language, and playful interactions, but improve spacing, typography, accessibility, motion restraint, and mobile behavior.
- Build separate shareable pages for Home, About, Skills, Projects, Experience, and Contact, with a consistent navigation shell and unique metadata.
- Rewrite the hero, about summary, expertise labels, and page descriptions to emphasize technical leadership and transferable full-stack skills while retaining the original factual career content.
- Import all 14 verified projects with their existing names, descriptions, technologies, links, and image URLs.
- Add project filtering for All, Web, Mobile, SaaS, AI, Unity/Games, Tools, AR/VR, and Prototypes. Categories without verified projects remain ready for future entries rather than showing fake work.
- Keep the existing email, WhatsApp, and LinkedIn details. Add a working contact form that stores enquiries for review in the dashboard.

## Mini-game
- Replace the falling-object clicker with a compact “Signal Runner” arcade game integrated into the portfolio.
- The player guides a data packet across lanes, dodges bugs, and collects technology tokens using keyboard, touch, or pointer controls.
- Include score, best score, pause/restart, clear instructions, sound control, and reduced-motion support without blocking portfolio browsing.

## Backoffice
- Add a private sign-in page and protected dashboard available only to **medbouissa.contact@gmail.com**.
- Provide editors for profile/hero text, profile image URL, About content, skills and proficiency, projects and categories, career entries, contact details, social links, and incoming messages.
- Support create, edit, publish/unpublish, reorder, and delete actions where appropriate, with clear save feedback and confirmation for destructive actions.
- Store roles separately and enforce the owner restriction on the server and database, not only in the visible interface.

## Data and security
- Create content, category, skill, experience, contact, message, and role tables with public read access limited to published portfolio content.
- Restrict every content write and message read to the owner account; allow public visitors only to submit contact messages.
- Seed the database with the complete verified content from the reference site so the first screen is populated immediately.
- Use hosted email/password sign-in for the private dashboard and a public asset bucket for dashboard-managed images.

## Validation
- Verify public navigation, category filters, contact submission, game controls, owner sign-in, dashboard edits, and sign-out.
- Check desktop and mobile layouts, keyboard access, reduced motion, metadata, broken images, console errors, and the final build signal.

## Technical details
- TanStack Start routes with React 19 and Tailwind v4 semantic tokens.
- Lovable Cloud for authentication, database, content security, contact messages, and image storage.
- Canvas-based mini-game with no heavy game engine dependency; browser-local best score only.
