# AI Loan Eligibility Checker

A responsive BFSI web application inspired by the supplied SkillWallet project brief.

## Features
- Loan eligibility estimate using income, age, credit score, employment and existing EMI.
- Credit score analysis and guidance.
- EMI calculator with monthly EMI, interest and total payment.
- AI Financial Tips UI with a secure optional Claude backend.
- Local session persistence for the demo.
- Responsive dark glassmorphism UI.
- Ready for Netlify/Vercel static deployment, or Node deployment for AI integration.

## Run locally

### Static mode
Open `index.html` directly in a browser.

### Node mode
Requires Node.js 18+.

```bash
npm install
cp .env.example .env
npm start
```

Then open `http://localhost:3000`.

## Claude integration
Put the Anthropic API key only in `.env`. The sample backend exposes `/api/financial-tips`. Do not expose API keys in browser JavaScript or commit `.env`.

## Google Sheets
The project currently stores demo sessions in browser localStorage. A production implementation should add a backend endpoint using Google Sheets API / service-account or OAuth credentials, with proper authentication and access controls.

## Deployment
- Static: deploy the project folder to Netlify, Vercel, GitHub Pages, etc.
- Node: deploy `server.js` to a Node-compatible host and configure environment variables.

## Important
This is an educational/demo eligibility estimator, not a lender decision engine. Real lending decisions require lender-specific underwriting, documentation, consent, privacy controls and regulatory compliance.
