# SpendWise: AI Spend Auditor for Startups

SpendWise is a free tool designed to help startup founders and engineering managers identify overspend in their AI tool stack. Built as a lead-generation asset for **Credex**, it provides defensible, numbers-backed audits to surface savings opportunities.

## Quick Start
1. **Install**: `npm install`
2. **Dev**: `npm run dev`
3. **Build**: `npm run build`

## Decisions
1. **Hardcoded Engine vs AI**: Chose a hardcoded engine for pricing math to ensure 100% accuracy and "defensible" reasoning that a Finance lead would trust. AI is used only for the narrative summary.
2. **LocalStorage-First Persistence**: To ensure the form persists across reloads (as required), I use a hybrid state strategy: React state -> LocalStorage -> Firestore (on submission).
3. **Anonymized Sharing**: Shared URLs use a UUID that maps to an audit record in Firestore but intentionally strips the email/company name to protect user privacy.
4. **Tailwind-Only Styling**: To meet Lighthouse scores, I avoided heavy CSS-in-JS libraries, opting for Tailwind's zero-runtime overhead.
5. **Shadcn/UI Foundation**: Used Radix-based primitives to ensure high accessibility levels (Lighthouse >= 90).

## Deployed URL
[Live App Persistence URL]
