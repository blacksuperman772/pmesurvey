# PMEPQ Survey Website

A web version of the **Performance Management System & Employee Productivity Questionnaire (PMEPQ)**
for the Oyo State Ministry of Education research.

## Structure
- `index.html` — the public questionnaire (Section A bio-data + 17 Likert statements across 4 clusters)
- `admin.html` — admin portal (login `Admin` / `Favors123`) with stats, charts, table & CSV export
- `survey-config.js` — single source of truth for questions/scale (shared by both pages)
- `api/submit.js` — serverless function that stores each submission (appended JSON)
- `api/read.js` — serverless function (admin-auth) that returns all submissions
- `api/stats.js` — serverless function (admin-auth) that returns aggregates

## Data collection
Submissions are saved to a **private** GitHub repo (`pmesurvey-data`, `submissions/submissions.json`)
via the `/api/submit` function. The GitHub token is stored only as a Vercel env var (`GH_TOKEN`)
and never reaches the browser. The admin portal reads the same data through `/api/read`.

## Environment variables (set on Vercel)
- `GH_TOKEN` — GitHub PAT with write access to the data repo
- `DATA_REPO` — owner/repo for submissions (default `blacksuperman772/pmesurvey-data`)
- `ADMIN_USER` — admin username (default `Admin`)
- `ADMIN_PASS` — admin password (default `Favors123`)

## Deploy
```
vercel --prod
```

## Questionnaire cleanup notes
The original PMEPQ had duplicated items (Q3=Q2, Q5=Q4, Q9=Q8, Q13=Q12) and an inconsistent
scale label (used both "U" and "UD"). The web version:
- removed the 4 duplicate items, leaving 17 distinct statements
- unified the scale to SA / A / UD / D / SD
- renumbered questions 1–17 across the four clusters
