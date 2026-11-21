"""Optional Chromium DOM/interaction checks for Assignment 3.

Requirements: pip install playwright; python -m playwright install chromium
Run from the repository: python tests/browser_check.py

The page is loaded into an isolated browser document (no network).
The GitHub API and localStorage are mocked; the live API and hosted site
must still be checked manually before submitting.
"""

import json
import shutil
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
HTML = (ROOT / "index.html").read_text(encoding="utf-8")
CSS = (ROOT / "css/styles.css").read_text(encoding="utf-8")
SCRIPT = (ROOT / "js/script.js").read_text(encoding="utf-8")

REPOS = [
    {"name": "sample-repo", "html_url": "https://github.com/sweRakan/sample-repo",
     "description": "<img src=x onerror=alert('XSS')>", "updated_at": "2026-10-15T10:00:00Z",
     "language": "JavaScript", "private": False},
    {"name": "untrusted-link", "html_url": "https://example.com/not-github",
     "description": "The link is not from GitHub", "updated_at": "2026-11-02T10:00:00Z",
     "language": None, "private": False},
]


def main():
    checks = 0

    def check(condition, message):
        nonlocal checks
        assert condition, message
        checks += 1
        print("PASS", message)

    with sync_playwright() as playwright:
        chromium = shutil.which("chromium") or shutil.which("google-chrome")
        options = {"headless": True}
        if chromium:
            options.update({"executable_path": chromium, "args": ["--no-sandbox"]})
        browser = playwright.chromium.launch(**options)
        errors = []

        def open_page(saved=None, width=1280):
            page = browser.new_page(viewport={"width": width, "height": 800})
            page.on("pageerror", lambda error: errors.append(str(error)))
            # Use an about:blank document: the testing sandbox may block network.
            page.set_content(HTML.replace('<script src="js/script.js" defer></script>', '')
                                  .replace('<link rel="stylesheet" href="css/styles.css" />', ''),
                             wait_until="domcontentloaded")
            page.add_style_tag(content=CSS)
            page.evaluate("""({saved, repos}) => {
              window._testStorage = saved || {};
              Object.defineProperty(window, 'localStorage', {configurable: true,
                value: {getItem(k) {return window._testStorage[k] ?? null},
                  setItem(k,v) {window._testStorage[k] = String(v)}}});
              window._testFail = false;
              window.fetch = async () => window._testFail
                ? {ok: false, status: 500, json: async () => ({})}
                : {ok: true, status: 200, json: async () => repos};
            }""", {"saved": saved, "repos": REPOS})
            page.add_script_tag(content=SCRIPT)
            page.locator("#refresh-repos:not([disabled])").wait_for()
            return page

        page = open_page()
        check(page.locator(".project-card").count() == 3, "original three projects retained")
        check(page.locator("#project-count").inner_text() == "3 of 3 projects shown", "initial count")
        check(page.locator(".repo-card").count() == 2, "GitHub response rendered")
        check(page.locator(".repo-card img").count() == 0, "API description treated as plain text")
        check(page.locator(".repo-link").count() == 1, "external GitHub link validated")
        page.locator("#project-search").fill("CAMPUS")
        check(page.locator(".project-card:visible").count() == 1, "live case-insensitive search")
        page.locator("#project-category").select_option("website")
        check(page.locator("#project-empty").is_visible(), "combined filter empty state")
        page.locator("#reset-projects").click()
        check(page.locator(".project-card:visible").count() == 3, "reset button restores all projects")
        page.locator("#project-sort").select_option("title-desc")
        check(page.locator(".project-card h3").all_inner_texts() ==
              ["Personal Portfolio Website", "KFUPM Building Alert System", "Dormdry"],
              "descending alphabetical sort")
        saved = page.evaluate("({...window._testStorage})")
        page.close()
        page = open_page(saved)
        check(page.locator("#project-sort").input_value() == "title-desc", "sort persisted")
        page.locator("#theme-toggle").click()
        saved = page.evaluate("({...window._testStorage})")
        page.close()
        page = open_page(saved)
        check(page.locator("html").get_attribute("data-theme") == "dark", "theme persisted")

        page.locator("#name").fill("  ")
        page.locator("#email").fill("valid@example.com")
        page.locator("#message").fill("Hello this is a test message")
        page.locator("#contact-submit").click()
        check(page.locator("#name").evaluate("el => !el.validity.valid"), "blank names rejected")
        page.locator("#name").fill("Rakan")
        page.locator("#contact-submit").click()
        check("not sent or stored" in page.locator("#form-status").inner_text(),
              "contact confirmation is local-only")
        check(page.locator("#visit-timer").is_visible() and
              ":" in page.locator("#visit-duration").inner_text(), "visit timer active")

        page.evaluate("window._testFail = true")
        page.locator("#refresh-repos").click()
        page.locator("#refresh-repos:not([disabled])").wait_for()
        check(page.locator(".repo-card").count() == 0 and
              "unavailable" in page.locator("#repo-status").inner_text(), "API error handling")
        page.evaluate("window._testFail = false")
        page.locator("#refresh-repos").click()
        page.locator("#refresh-repos:not([disabled])").wait_for()
        check(page.locator(".repo-card").count() == 2, "refresh recovers from API error")
        page.set_viewport_size({"width": 375, "height": 812})
        check(page.evaluate("document.documentElement.scrollWidth <= innerWidth"),
              "responsive mobile width")
        check((ROOT / "assets/images/laundry-app.webp").stat().st_size < 100_000,
              "portfolio illustration optimized below 100 KB")
        check(not errors, f"no uncaught JavaScript errors: {errors}")
        browser.close()
    print(f"{checks} Chromium checks passed (API and localStorage mocked).")


if __name__ == "__main__":
    main()
