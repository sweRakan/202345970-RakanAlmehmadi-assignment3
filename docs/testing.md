# Testing Report — Assignment 3

**Student:** Rakan Almehmadi  
**Student ID:** 202345970  
**Course:** SWE 363  
**Verification date:** 21 November 2026

## 1. Testing scope

This report covers automated checks run on the uploaded Assignment 3 code and basic source inspection. It separates tests performed using mocked data from tests that would require a live API or deployed website. The implementation has not been changed to produce these results.

The three original portfolio projects are present: Dormdry, KFUPM Building Alert System, and Personal Portfolio Website.

## 2. Tools and commands

The website is static, so no backend is required. To view it on a local server:

```powershell
py -m http.server 8000
```

Then visit `http://localhost:8000`.

**Static checks (Node.js):**

```powershell
npm test
```

This runs `node --check js/script.js` and `node tests/check.cjs`.

**Optional browser interaction checks (Python + Playwright + Chromium):**

```powershell
pip install playwright
python -m playwright install chromium
npm run test:browser
```

The browser test script is `tests/browser_check.py`. It loads the HTML/CSS/JavaScript into an isolated Chromium page and **mocks the GitHub API and `localStorage`**. Therefore, results from this script verify client-side behavior, not access to a live GitHub account.

## 3. Static test results

**Executed 21 November 2026: 8 of 8 static checks passed.**

| Check | Result |
| --- | --- |
| Three project cards exist | Passed |
| HTML element IDs are unique | Passed |
| Local files linked from HTML exist | Passed |
| GitHub API, refresh control, status, and repository grid exist | Passed |
| Search, category, sorting, timer, and theme elements exist | Passed |
| The WebP laundry illustration is under 100 KB | Passed |
| Responsive breakpoint and reduced-motion styling exist | Passed |
| README and required Assignment 3 documentation files exist | Passed |

JavaScript syntax validation also passed. The last static check previously failed because the documentation was not yet present; these four documentation files were added without changing the site's source code.

## 4. Browser interaction test results

**Executed 21 November 2026: 19 of 19 automated Chromium checks passed** using mocked network data and storage.

| Area | Verified behavior | Result |
| --- | --- | --- |
| Initial page | All three original projects exist; count starts at `3 of 3` | Passed |
| GitHub rendering | Mock repository records produce repository cards | Passed |
| Safe content | HTML-like API descriptions are shown as text, not executed | Passed |
| Safe links | A non-GitHub URL is not rendered as an external repo link | Passed |
| Search | Case-insensitive input finds a matching project | Passed |
| Combined filters | Search + category can show the empty-state message | Passed |
| Reset | Restores all three project cards | Passed |
| Sorting | Z–A produces the expected project order | Passed |
| Saved preferences | Sort order and theme can be restored from mocked storage | Passed |
| Form validation | Blank names are rejected; valid entries get local-only feedback | Passed |
| Timer | Timer element becomes visible and shows a colon-formatted duration | Passed |
| API error handling | A simulated failure removes cards and shows an error message | Passed |
| API retry | Refresh works again after a simulated failure | Passed |
| Mobile layout | No horizontal overflow at 375 CSS pixels | Passed |
| Image optimization | Laundry illustration is below 100 KB | Passed |
| JavaScript errors | No uncaught browser script errors during test | Passed |

The table groups related assertions. The underlying browser script contains **19 assertions**, all of which passed in this run.

## 5. Responsive checks from prior code review

A separate review of the current Assignment 3 ZIP checked layouts at viewport widths of **320, 375, 430, 768, 1024, and 1280 pixels**, with no reported horizontal overflow. This supports basic responsiveness but does not prove equal rendering on every phone or browser.

## 6. Items that still require live or manual verification

These checks have **not** been established by the isolated browser tests and should be completed on the final deployed URL:

| Check to perform | Why it matters | Status |
| --- | --- | --- |
| Open the final published website | Confirms hosting and relative asset paths | Not verified here |
| Load repositories using the real GitHub API | Confirms network access and current API data | Not verified here |
| Click profile and repository links | Confirms links open the intended public pages | Manual check needed |
| Repeat navigation and interactions with keyboard | Checks focus and practical keyboard usability | Manual check recommended |
| View with major browsers and actual mobile devices | Checks cross-platform compatibility | Manual check recommended |
| Run Lighthouse or PageSpeed Insights | Provides measured performance/accessibility scores | Not measured |
| Test invalid/empty input and theme persistence in deployed context | Confirms behavior outside the mocked environment | Manual check recommended |

Do not report the entries above as completed until they have actually been checked.

## 7. Limitations and conclusion

All static and scripted Chromium tests passed for this documented source. The automated browser checks deliberately replace network and storage behavior with controlled responses, so **19/19 passed does not mean the live GitHub API or a deployed website was tested**. No Lighthouse score, complete accessibility audit, or cross-browser certification is claimed.

The site uses a demonstration contact form: the expected successful result is a local confirmation, **not delivery of an email**. The site's navigation links go to page sections; they do not represent a push-notification feature.
