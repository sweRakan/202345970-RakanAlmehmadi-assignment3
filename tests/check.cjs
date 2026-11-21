"use strict";
// Fast, dependency-free sanity checks. For behavioral tests, run browser_check.py.
const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const root = path.resolve(__dirname, "..");
const read = filename => fs.readFileSync(path.join(root, filename), "utf8");
const html = read("index.html");
const script = read("js/script.js");
const css = read("css/styles.css");
let checks = 0;
function check(name, fn) { fn(); console.log("PASS " + name); checks++; }

check("HTML has three project cards", () => {
  assert.equal((html.match(/<article class="project-card"/g) || []).length, 3);
});
check("IDs are unique", () => {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(ids.length, new Set(ids).size);
});
check("Local files referenced by the page exist", () => {
  for (const [, value] of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    if (value.startsWith("#") || /^https?:/.test(value)) continue;
    assert.ok(fs.existsSync(path.join(root, value)), `${value} not found`);
  }
});
check("Github integration and refresh are present", () => {
  assert.match(script, /api\.github\.com\/users\//);
  for (const id of ["repo-grid", "repo-status", "refresh-repos"]) {
    assert.ok(html.includes(`id="${id}"`));
  }
  assert.match(script, /AbortController/);
});
check("Search, filter, sort, timer, and theme elements exist", () => {
  for (const id of ["project-search", "project-category", "project-sort", "reset-projects", "visit-timer", "theme-toggle"]) {
    assert.ok(html.includes(`id="${id}"`));
  }
});
check("Optimized illustration is under 100 KB", () => {
  assert.ok(fs.statSync(path.join(root, "assets/images/laundry-app.webp")).size < 100000);
});
check("Responsive and reduced-motion CSS exist", () => {
  assert.match(css, /max-width: 600px/);
  assert.match(css, /prefers-reduced-motion/);
});
check("Required Assignment 3 documentation exists", () => {
  for (const file of ["README.md", "docs/ai-usage-report.md", "docs/technical-documentation.md", "docs/testing.md"]) {
    assert.ok(fs.existsSync(path.join(root, file)));
  }
});
console.log(`${checks} static checks passed. Run python tests/browser_check.py for behavioral checks.`);
