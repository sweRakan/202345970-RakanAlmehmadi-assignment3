# Rakan's Software Engineering Portfolio — Assignment 3

**Student:** Rakan Almehmadi  
**Student ID:** 202345970  
**Course:** SWE 363 — Web Engineering & Development  
**Technologies:** HTML, CSS, and vanilla JavaScript

## Project overview

This is my personal portfolio website. It introduces me, shows my software projects and skills, and lets visitors explore my work. Assignment 3 builds on my earlier portfolio by adding a GitHub API integration, project sorting, and a page-visit timer. The existing project search, category filter, dark/light theme, and contact-form demonstration remain available.

The site is a **static front-end website**. It does not require a backend, database, GitHub API token, or JavaScript framework.

## Features

| Feature | What visitors can do |
| --- | --- |
| Portfolio navigation | Use the top links to jump to About, Projects, GitHub, Skills, and Contact. |
| Project cards | Explore Dormdry, the KFUPM Building Alert System concept, and this portfolio website. Open **Project details** for more information. |
| Search and filter | Search project text, choose **Concepts** or **Websites**, and see the matching result count. |
| Sort projects | Choose original order, **Name: A to Z**, or **Name: Z to A**. Sorting combines with searching and category filtering. |
| Saved preferences | Keep the chosen theme and project search/filter/sort settings across reloads when browser storage is available. |
| Visit timer | See **Time on this page: MM:SS**, starting at `00:00` on each new page load. |
| GitHub integration | Display up to six recently updated public repositories from the GitHub REST API, including descriptions, languages, update dates, and repository links. |
| GitHub links and refresh | Open my GitHub profile or request an updated repository list with **Refresh repositories**. |
| Contact form | Check name, email, and message entries with browser validation and see local feedback. **No message is sent or stored.** |
| Accessibility and layout | Use a skip link, keyboard focus indicators, responsive cards, status messages, and reduced-motion styling. |

**GitHub profile:** https://github.com/sweRakan

## How to run locally

1. Download or clone the project and open the `202345970-RakanAlmehmadi-assignment3` folder.
2. In VS Code, select **Terminal → New Terminal**, and make sure the terminal is inside the folder containing `index.html`.
3. Start a local server. On Windows, run:

   ```powershell
   py -m http.server 8000
   ```

   If `py` is not installed but Python is available, use `python -m http.server 8000` instead.
4. Open **http://localhost:8000** in a browser.
5. Press `Ctrl+C` in the terminal to stop the server.

The site has **no runtime npm dependencies**. You can also open `index.html` directly for basic viewing, but a local web server is recommended when testing the GitHub API and browser behavior. An internet connection is needed to retrieve live GitHub repositories; the rest of the static portfolio can load locally.

## Using the website

In **Projects**, type a search term, select a project type, or choose a sort order. You can combine these controls. The result count updates automatically, and **Reset filters** returns to the original three-project view. Select **Dark mode** to switch the theme; saved preferences are restored on future visits if the browser permits it.

In **GitHub**, public repository cards load from my GitHub account. Select **Refresh repositories** to retry. If GitHub is unavailable or rate-limited, an explanatory message appears and the profile link remains usable.

In **Contact**, enter a name, a valid email address, and at least 10 non-whitespace message characters to test the form. Successful input produces a confirmation **only on this page**; there is no email delivery or backend submission.

## Files and folders

```text
202345970-RakanAlmehmadi-assignment3/
├── index.html                       # Portfolio page and content
├── css/styles.css                   # Theme, responsive layout, and component styling
├── js/script.js                     # Interactions, timer, GitHub API, and validation
├── assets/images/                   # Portfolio illustrations
├── docs/
│   ├── ai-usage-report.md           # AI assistance, usage log, and declaration review
│   ├── technical-documentation.md   # Architecture and feature implementation
│   └── testing.md                   # Checks performed and testing instructions
├── tests/
│   ├── check.cjs                    # Dependency-free static checks
│   └── browser_check.py             # Optional Chromium interaction checks
├── assignment2-records/            # Archived Assignment 2 documentation
├── package.json                     # Test commands only; no runtime packages
├── .gitignore
└── README.md
```

## Testing

With **Node.js** installed, run these commands from the project folder:

```powershell
npm test
```

This checks JavaScript syntax and runs eight static checks. The optional browser tests require Python, Playwright, and Chromium:

```powershell
pip install playwright
python -m playwright install chromium
npm run test:browser
```

The browser tests use **mock GitHub API responses and mock browser storage**. They validate interactions, but do not replace a manual check of the actual live GitHub response or a deployed website. See [docs/testing.md](docs/testing.md) for results and limitations.

## Technical notes and limitations

- GitHub data comes from the public endpoint for user `sweRakan`, ordered by recent updates and limited to six repositories. Results depend on network access and GitHub availability/rate limits.
- Project sorting applies to the **three portfolio project cards**, not to the GitHub repository list.
- The timer measures elapsed time in the currently loaded page. It resets on refresh or navigation to a new page load.
- Theme, search, category, and sort choices are stored locally in the visitor's browser where permitted; the site has no accounts or remote storage.
- The contact form intentionally does not deliver messages. The top navigation contains links to sections, not a push-notification feature.
- Automated browser tests use simulated API data; a live network request and deployment must be checked separately if required.

More implementation detail is in [docs/technical-documentation.md](docs/technical-documentation.md).

## AI assistance and academic integrity

ChatGPT (GPT-6) has been used to explain, review, test, and help document parts of this assignment, including reviewing the GitHub API code and suggesting a visit-timer implementation. The student integrated and adjusted the work. Additional development sessions and AI-created artifacts must be reconciled against the student's **actual complete chat exports** before submission. Details and the AI usage log are in [docs/ai-usage-report.md](docs/ai-usage-report.md).

The Assignment 3 instructions require a **separate AI Evidence ZIP** containing full, unedited conversations and before/after artifacts. That evidence is **not** included in this repository or documentation bundle. Review and complete the usage declaration before submitting the repository link and evidence to Blackboard.
