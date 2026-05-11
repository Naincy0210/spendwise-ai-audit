# REFLECTION.md

## 1. Hardest Bug
The hardest bug was managing the reactive state of a dynamic multi-tool form where each tool has a different schema of plans and seat requirements. Initializing the form with sensible defaults while allowing users to "add/remove" tools frequently led to state synchronization issues. I solved this by using `react-hook-form`'s `useFieldArray`, which correctly manages the lifecycle of dynamic inputs and validation.

## 2. Decision Reversal
Mid-week, I initially planned to use a pure AI-based audit engine where the prompt would calculate the savings. I reversed this decision when I realized that LLMs are inconsistent with precise pricing arithmetic. I moved the arithmetic to a hardcoded `PricingEngine` and repurposed the AI strictly for the "Personalized Summary" to combine numerical accuracy with persuasive prose.

## 3. Week 2 Plans
If I had a second week, I would implement:
- **Direct CSV Import**: Allow users to upload their billing exports from OpenAI/Anthropic for exact API auditing.
- **Chrome Extension**: A "Spend Intelligence" extension that detects seat-sharing or unused licenses by tracking browser activity on AI domains.
- **Team Seat Management**: A dashboard to invite team members to "Self-Audit" their own tool usage for better data granularity.

## 4. Use of AI Tools
I used Gemini heavily for boilerplate component structures and for styling ideas. One specific time the AI was wrong: It suggested a pricing model for Cursor that was outdated (from 2024). I caught it because my `PRICING_DATA.md` phase required manual verification from vendor URLs, proving that "Human-in-the-loop" is essential for data-critical features.

## 5. Self-Rating
- **Discipline (10/10)**: Followed a strict daily devlog and met all MVP requirements ahead of schedule.
- **Code Quality (9/10)**: Strong typing and sensible abstractions, though some visual components could be further refactored.
- **Design Sense (9/10)**: High focus on readability and "Product Hunt" logic.
- **Problem Solving (10/10)**: Effectively navigated the "Terms of Service" blocker by building a robust hybrid persistence layer.
- **Entrepreneurial Thinking (10/10)**: Prioritized GTM and Economics files as much as the code, treating the project as a product launch.
