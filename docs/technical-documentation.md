# Technical Documentation — Assignment 3

**Student:** Rakan Almehmadi  
**Student ID:** 202345970  
**Course:** SWE 363  
**Implementation:** Static HTML, CSS, and JavaScript

## 1. Overview and architecture

The project is a personal software engineering portfolio. It extends the earlier assignments with more interactive project browsing and live GitHub repository information. The page is implemented without a server application, database, build pipeline, or front-end framework.

- `index.html` contains the page structure, text, controls, three project cards, image references, and accessibility labels.
- `css/styles.css` contains CSS custom properties for themes, page and card layout, responsive breakpoints, hover/focus effects, and reduced-motion rules.
- `js/script.js` manages form validation, theme state, project controls, page timer, and GitHub API requests.
- `assets/images/` contains local artwork; the laundry illustration is a compressed WebP file.
- `tests/` holds static checks and optional automated Chromium interaction checks.

The JavaScript is loaded with the `defer` attribute so it can use the HTML elements after the document has been parsed.

## 2. Page structure and navigation

The main navigation links to five on-page sections:

| Section ID | Purpose |
| --- | --- |
| `#about` | Student introduction and page timer. |
| `#projects` | Portfolio cards with search, category selection, and sorting. |
| `#github` | Dynamic public GitHub repository cards and profile link. |
| `#skills` | HTML, CSS, and JavaScript learning summary. |
| `#contact` | Local contact-form validation demonstration. |

The existing projects are **Dormdry** (concept/prototype), **KFUPM Building Alert System** (concept), and **Personal Portfolio Website** (website). The two concept entries describe proposed functionality rather than claiming completed systems.

The top bar offers section navigation and a theme button; there is **no separate notification service**.

## 3. Project search, category filtering, and sorting

`index.html` holds three `.project-card` elements. Each has a `data-category` value of `concept` or `website`. The related control IDs are `project-search`, `project-category`, `project-sort`, `reset-projects`, and `project-grid`.

The JavaScript reads the cards once and creates `searchableProjects`, caching each card's title, lowercase searchable text, category, and original position.

`updateProjects()` performs the following steps:

1. Read the current text query, selected category, and selected sort mode.
2. Copy the cached project list to avoid modifying the original list.
3. Sort by title with `localeCompare()` for A–Z or Z–A, or retain the original order.
4. Reappend existing card elements in the chosen order. This avoids reconstructing the cards and preserves open `<details>` states.
5. Show only cards matching both the search term and category; update the visible-project count.
6. Show an empty-state message when nothing matches and save preferences if storage is available.

Sort options: `original`, `title-asc`, and `title-desc`. Search is case-insensitive and checks the text of the project cards. **Sorting affects portfolio projects, not GitHub API results.** Reset clears the query, selects `all`, restores `original` sorting, and focuses the search input.

## 4. State and browser storage

The site uses `localStorage` to remember preferences:

| Storage key | Stored value |
| --- | --- |
| `rakan-portfolio-theme` | `light` or `dark`. |
| `rakan-portfolio-filters-v1` | JSON containing `query`, `category`, and `sort`. |

The initial theme defaults to the operating system's preferred color scheme when no valid saved value exists. JavaScript sets `data-theme` on the root `<html>` element. The theme button's `aria-pressed` state is synchronized with the visual theme.

`restoreFilters()` parses saved filter JSON and validates its type, maximum query length (120 characters), category, and sort option before reusing it. It accepts records from the earlier version that lack `sort` and defaults them to `original`. Storage calls use `try/catch`: if storage is blocked or a saved value is invalid, the page stays interactive and shows a status message instead of failing.

Project preferences and theme are per-browser values; they are **not synchronized to a server**.

## 5. Page-visit timer

The timer is displayed in the About card with the format:

```text
Time on this page: 02:35
```

`visitStart = Date.now()` records the start when the script runs. Every second, `updateVisitDuration()` calculates elapsed seconds using the current time minus the start time, converts them into minutes and seconds, and formats both with `padStart(2, "0")`. The time is written into the `#visit-duration` element. It begins at `00:00` and resets on a fresh page load.

Using actual elapsed time means it stays meaningful if the browser delays a scheduled interval in a background tab. This measures time since page load, **not total lifetime visits or active attention**.

## 6. GitHub REST API integration

The GitHub username is `sweRakan`. The application requests the following public resource:

```text
https://api.github.com/users/sweRakan/repos?sort=updated&per_page=6&type=owner
```

This returns up to six repositories owned by the account, ordered by their most recent updates. No authentication token or secret is included in the source code.

`loadRepositories()`:

1. Clears prior cards, displays a loading message, and disables the Refresh button.
2. Starts a `fetch()` request using an `AbortController` and an eight-second timeout.
3. Checks `response.ok`; on failure, displays a user-friendly message. Statuses 403/429 receive a message about possible API rate limits.
4. Parses JSON, requires an array, and filters for basic valid public-repository fields.
5. Builds cards showing repository name, description, main language, and formatted last-update date.
6. Re-enables Refresh when the current request ends.

`requestNumber` ensures an older request cannot replace the results from a newer one. A user can retry without reloading the website. The GitHub profile link remains accessible even if the API fails.

**Output safety:** External repository fields are inserted using `textContent`, so a description is not interpreted as HTML. `safeGithubRepoUrl()` permits only `https://github.com/...` URLs under the expected username. Links opening a new tab use `rel="noopener noreferrer"`. Missing descriptions/languages and invalid dates receive readable fallback text.

**Limitations:** Public GitHub requests depend on an internet connection, can be rate-limited, and may change as repository data changes. Automated browser tests mock the API; they do not prove a live GitHub request succeeds. The fetched repository list is not individually sortable by the project sort control.

## 7. Contact form: validation, not delivery

The Contact section uses a standard HTML form. Its input rules include:

- Name: required, maximum 80 characters, not only spaces.
- Email: required, browser `type="email"` validation, maximum 254 characters.
- Message: required, minimum 10 characters after trimming leading and trailing whitespace, maximum 2,000 characters.

The submit handler calls `event.preventDefault()`, checks additional whitespace rules through `setCustomValidity()`, and invokes `reportValidity()`. Successful input shows confirmation through `textContent`. The form does **not** send email, make a network request, or store the entered message. The on-page explanation makes this clear.

The submit button is initially disabled in HTML and enabled after its JavaScript handler is attached. This prevents a non-functional submit action while scripts are unavailable.

## 8. Responsiveness, accessibility, and performance

**Responsive layout:** CSS Grid and Flexbox control the cards and navigation. The main layouts stack at smaller widths; GitHub cards use three columns on large screens, two on medium screens, and one on phones. The project control grid also adapts through media queries.

**Accessibility:** Semantic sections, form labels, alt text on local illustrations, a keyboard skip link, visible `:focus-visible` outlines, `aria-live` status text, accessible controls, and reduced-motion media queries help support keyboard and assistive-technology use. These features are present in the source; a full assistive-technology audit has not been performed.

**Performance:** The portfolio has no runtime JavaScript dependencies or web fonts. Illustrations use local files, `loading="lazy"` on project images, and a WebP laundry image under 100 KB. The page reuses DOM elements instead of rebuilding the portfolio on every search or sort. Live data is requested once initially and again only when Refresh is clicked. No measured Lighthouse score is claimed.

## 9. Testing and maintenance

To open the site locally from its root directory:

```powershell
py -m http.server 8000
```

Open `http://localhost:8000`. To run static checks with Node.js:

```powershell
npm test
```

To run the optional browser tests, install Playwright and Chromium and execute `npm run test:browser`. See [testing.md](testing.md) for installation commands, test results, and the distinction between mocked and live API behavior.

To update project content, edit the `.project-card` entries in `index.html` and use `data-category="concept"` or `data-category="website"` so the existing category controls continue to work. To change the GitHub account, update the username and matching profile link consistently. The endpoint, link validation, and profile link should all refer to the same account.

## 10. Known limitations and future improvements

- Contact is a front-end demonstration. Delivering messages requires a separate backend or trusted form service.
- The timer resets when the page reloads; it does not record lifetime usage or individual visitor analytics.
- GitHub public API availability and rate limits are outside the site's control.
- The project sorting UI applies only to the local portfolio cards.
- No real notification system, user account, or persistent server-side data store exists.
- Browser and accessibility compatibility beyond the documented checks requires additional manual verification.

**AI assistance:** The implementation and documentation received ChatGPT assistance. See [ai-usage-report.md](ai-usage-report.md) and the required separately submitted evidence for a disclosure of specific sessions and artifacts.
