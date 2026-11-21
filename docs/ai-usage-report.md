# AI Usage Report — Assignment 3

**Student:** Rakan Almehmadi  
**Student ID:** 202345970  
**Course:** SWE 363 — Web Engineering & Development  
**Report prepared:** 21 November 2026  
**Confirmed AI tool in the documented conversation:** ChatGPT (GPT-6)

> **Declaration status: REVIEW REQUIRED.** This report records AI assistance that can be identified from the supplied project and this conversation. It does **not** claim that a complete AI Evidence ZIP has already been assembled or submitted. Before signing the declaration, I must check every other AI conversation or artifact I used, add missing usage-log rows, and export the original unedited evidence.

## 1. Why I used AI

Assignment 3 expands my portfolio from Assignments 1 and 2. I used ChatGPT as a learning and review tool while working on the new features and documentation. I wanted to understand the GitHub API integration, add a page timer, check that the website still worked, and prepare documentation that matched the actual source code.

The portfolio's project ideas and details came from my coursework and my existing portfolio. Some implementation and documentation in the earlier assignments were also AI-assisted; the original disclosure is preserved in `assignment2-records/ai-usage-report.md`.

## 2. Tools used and use cases

| Tool | Confirmed role | Output / affected files |
| --- | --- | --- |
| ChatGPT (GPT-6) | Explained and checked the GitHub REST API request; reviewed the timer approach; discussed portfolio features and limited code changes; reviewed the uploaded Assignment 3 files and testing results. | Guidance for `js/script.js`; review of `index.html`, `css/styles.css`, `js/script.js`, `package.json`, and `tests/`. |
| ChatGPT (GPT-6) | Helped write documentation based on the actual project code, assignment instructions, and test scripts. | `README.md`; `docs/ai-usage-report.md`; `docs/technical-documentation.md`; `docs/testing.md`. |

**Other AI use:** The project history includes earlier AI-assisted Assignment 2 work, and a separate Assignment 3 implementation/completion discussion is referenced in the available chat history. Before submitting, I must check its complete export and add a distinct conversation row for it if it is separate from the conversation listed below. I must also declare any Copilot/autocomplete, other chatbots, or AI design tools actually used, even if their contribution was small. **No use of those other tools is claimed here without evidence.**

## 3. Features involved in this assignment

The Assignment 3 website includes these additions:

- **Project sorting:** Original order, alphabetical A–Z, and reverse alphabetical Z–A. It combines with the existing search and category filters.
- **Visit timer:** A `MM:SS` count starting automatically when the page loads. It uses `Date.now()` so elapsed time is calculated from real timestamps.
- **GitHub integration:** A public API request for up to six recently updated repositories owned by `sweRakan`. The site displays the results, provides safe links to the repositories and profile, and shows a message when the request fails.
- **Refresh control:** Visitors can request the GitHub data again after a failure or when they want an updated list.

Earlier features kept in the site include saved theme/search/filter choices and contact-form validation. The contact form is intentionally **only a demonstration** and does not send messages. A GitHub navigation link was added to the top bar; this is **not** a separate notification service.

## 4. AI usage log

The course requires one entry per **conversation** or independently generated **artifact**, with matching full evidence. The confirmed entries below refer to work identifiable in the present discussion. They are **not** a representation that all previous sessions have already been audited.

| ID | Tool (model) | Date | Purpose | Files affected | What I changed and how it was verified |
| --- | --- | --- | --- | --- | --- |
| **C01** | ChatGPT (GPT-6) | 21 Nov 2026 | Discuss the GitHub API call, provide a simple page timer, review the completed GitHub section, sorting, navigation, and contact section, and prepare the missing Assignment 3 documentation. | Guidance related to `js/script.js`; review of `index.html`, `css/styles.css`, `js/script.js`, and `tests/`; drafted `README.md` and `docs/*.md`. | I supplied my API code and chose to keep that part unchanged. I added the timer with my own modifications and integrated the GitHub and sorting features into my project. AI reviewed the resulting ZIP. The project was checked using JavaScript syntax validation, static checks, and mocked Chromium interaction tests; their limits are explained in `docs/testing.md`. |
| **A01** | ChatGPT (GPT-6) | 21 Nov 2026 | Timer code example and step-by-step guidance on integrating it. | Suggested code for `js/script.js` and a timer element in `index.html`. | I did not simply copy a complete final project from the snippet. I reported integrating the timer with modifications; the submitted version uses `visitStart`, `updateVisitDuration()`, and `#visit-duration`. I reviewed the displayed `MM:SS` behavior. |
| **A02** | ChatGPT (GPT-6) | 21 Nov 2026 | Create the four missing Assignment 3 documentation files based on the existing project and instructions. | `README.md`, `docs/ai-usage-report.md`, `docs/technical-documentation.md`, `docs/testing.md`. | These drafts are AI-assisted. The underlying HTML, CSS, JavaScript, images, and test code were preserved in the documentation-only project copy. Automated checks were run again after adding the files. I must read and correct the drafts before submission. |

**Reconciliation required:** If the conversation in which I originally asked ChatGPT to complete Assignment 3 is separate, I must give it another entry (for example `C02`) with its actual model, date, exact purpose, and affected code. Its complete, unedited export and any initial generated code ZIP must also be included as evidence. I must not treat this summary as a substitute for that conversation.

## 5. Benefits and challenges

**Benefits:** AI explanations helped me understand the meaning of the API endpoint parameters, the `fetch()` call, the timer calculation, and the way sorting combines with existing project filters. Code review and test guidance helped me look for regressions while keeping changes to my existing project small. Drafting documentation from the real files helped keep the descriptions connected to the implementation.

**Challenges:** AI suggestions can differ from my current HTML element IDs or existing code. For example, I chose not to replace the GitHub API request I had already written and made my own changes when adding the timer. Automated browser tests can also appear conclusive even though they use fake GitHub responses; I must describe that distinction correctly. Documentation written by AI requires review because AI cannot prove actions I have not performed, such as deploying the site or exporting every conversation.

## 6. What I learned

Through developing and reviewing this assignment, I practiced:

- Using `fetch()` with a public API and converting a JSON response into repository cards.
- Handling failed or slow requests with status messages and `AbortController`.
- Using `textContent` rather than HTML insertion for externally supplied descriptions.
- Sorting objects by title with `localeCompare()` and keeping project search, category, and sort controls consistent.
- Remembering selected values with browser `localStorage` and restoring them safely.
- Measuring elapsed time with timestamps instead of trusting each interval to fire exactly on time.
- Distinguishing client-side form validation from actually submitting a message to a server.
- Testing behavior in Chromium with mocked API data and documenting what remains unverified.

## 7. Responsible use, student decisions, and modifications

My choices and integration are part of the assignment. I supplied the existing portfolio and GitHub API snippet, decided to keep that API code, and reported changing the timer suggestion before using it. I requested a code review with a clear instruction to avoid unnecessary changes. The four documentation files were added separately from the source files, so documentation work did not silently replace the implementation.

I must be able to explain all submitted code in my own words, including sections that received AI assistance. I must not claim AI-generated code was independently written by me. I must not claim that live GitHub loading, deployment, or cross-browser testing occurred without corresponding evidence.

The Assignment 3 documentation and verification records describe current implementation behavior; they do not establish authorship of every existing code line. Any additional AI-assisted implementation sessions must be disclosed after inspecting their complete logs. AI-assisted code commits should contain the required credit line, for example:

```text
Assisted-by: ChatGPT (GPT-6)
```

## 8. Required evidence package — not included in this repository

The Assignment 3 instructions require a separate Blackboard file named:

```text
202345970-RakanAlmehmadi-assignment3-ai-evidence.zip
```

This ZIP should contain the **complete, unedited conversations** (including unsuccessful prompts and responses) and the **intermediate AI-produced artifacts**, not only the final code. One suitable structure is:

```text
conversations/
  C01_Rakan_ChatGPT_timer-github-review-documentation.pdf
  C02_Rakan_ChatGPT_assignment3-implementation.pdf   # Only if confirmed by export
artifacts/
  A01_Rakan_ChatGPT_timer-suggestion.txt
  A02_Rakan_ChatGPT_documentation-drafts/
  ... other original AI outputs and corresponding final versions ...
```

These are **example filenames**, not a claim the files were created. IDs and dates must be adjusted to match the real exported conversation and actual AI outputs. The assignment guidelines explicitly require full evidence; summarized or invented chat logs are not acceptable. Do **not** commit the evidence ZIP or the raw conversations to the public repository. The repository link must be included with the Blackboard submission as instructed.

The Assignment 2 documents kept in `assignment2-records/` are historical documentation and **not a substitute** for the complete Assignment 3 evidence.

## 9. Required declaration — verify before signing

**Name:** Rakan Almehmadi  
**Student ID:** 202345970  
**Date prepared:** 21 November 2026  
**Status:** Not yet verified against the complete AI evidence export.

> I declare that this report and the attached evidence document all of my AI use in this assignment, with complete and unedited conversations, and that I understand and can explain all the code I submitted. I understand that undeclared AI use or a false declaration will be treated as plagiarism according to KFUPM regulations.

**Important:** This is the declaration text required by the course, provided for final review. I should adopt/sign it **only after** the usage log matches every AI session, all evidence is exported and attached, and I have checked that the wording is true. This documentation-only ZIP **does not include the evidence package**.
