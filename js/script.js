"use strict";

const themeToggle = document.querySelector("#theme-toggle");
const contactForm = document.querySelector("#contact-form");
const contactSubmit = document.querySelector("#contact-submit");
const formStatus = document.querySelector("#form-status");
const nameInput = document.querySelector("#name");
const messageInput = document.querySelector("#message");
const year = document.querySelector("#year");

const themeStorageKey = "rakan-portfolio-theme";

// Apply a theme and keep the button's accessible state in sync.
function applyTheme(theme) {
  const isDark = theme === "dark";

  document.documentElement.dataset.theme = theme;
  themeToggle.setAttribute("aria-pressed", String(isDark));
}

// Use a saved preference, or fall back to the device's preference.
let initialTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
  ? "dark"
  : "light";

try {
  const savedTheme = localStorage.getItem(themeStorageKey);

  if (savedTheme === "light" || savedTheme === "dark") {
    initialTheme = savedTheme;
  }
} catch {
  showStorageWarning();
}

applyTheme(initialTheme);
themeToggle.hidden = false;

themeToggle.addEventListener("click", function () {
  const currentTheme = document.documentElement.dataset.theme;
  const nextTheme = currentTheme === "dark" ? "light" : "dark";

  applyTheme(nextTheme);

  try {
    localStorage.setItem(themeStorageKey, nextTheme);
  } catch {
    showStorageWarning();
  }
});

// Show the current year automatically.
year.textContent = String(new Date().getFullYear());

// Clear previous feedback when the visitor changes an entry.
contactForm.addEventListener("input", function (event) {
  formStatus.textContent = "";

  if (event.target === nameInput || event.target === messageInput) {
    event.target.setCustomValidity("");
  }
});

// This is a local demonstration: no message is sent or stored.
contactForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = nameInput.value.trim();
  const message = messageInput.value.trim();

  nameInput.setCustomValidity(
    name.length === 0 ? "Please enter your name." : "",
  );

  messageInput.setCustomValidity(
    message.length < 10
      ? "Please enter at least 10 characters excluding outer spaces."
      : "",
  );

  if (!contactForm.reportValidity()) {
    return;
  }

  // textContent treats user input as text instead of HTML.
  formStatus.textContent =
    `Thanks, ${name}! Your entries passed validation. ` +
    "This is a demo, so your message was not sent or stored.";
});

// Enable the form only after its submit handler is ready.
contactSubmit.disabled = false;

// A blocked storage API must not prevent any of the page interactions.
function showStorageWarning() {
  document.querySelector("#storage-status").textContent =
    "Your choices work for this visit, but this browser could not save or restore them.";
}

const searchInput = document.querySelector("#project-search");
const categorySelect = document.querySelector("#project-category");
const sortSelect = document.querySelector("#project-sort");
const projectGrid = document.querySelector("#project-grid");
const projectCards = Array.from(document.querySelectorAll(".project-card"));
const projectCount = document.querySelector("#project-count");
const emptyState = document.querySelector("#project-empty");
const filterStorageKey = "rakan-portfolio-filters-v1";
const validCategories = ["all", "concept", "website"];
const validSorts = ["original", "title-asc", "title-desc"];

// Cache each card's searchable text and its original place in the HTML.
const searchableProjects = projectCards.map((card, index) => ({
  card,
  index,
  title: card.querySelector("h3").textContent.trim(),
  text: card.textContent.toLowerCase(),
  category: card.dataset.category,
}));

function restoreFilters() {
  try {
    const raw = localStorage.getItem(filterStorageKey);
    if (!raw) return;
    const saved = JSON.parse(raw);
    if (!saved || typeof saved !== "object" ||
        typeof saved.query !== "string" || saved.query.length > 120 ||
        !validCategories.includes(saved.category) ||
        (saved.sort !== undefined && !validSorts.includes(saved.sort))) {
      throw new Error("Invalid saved filters");
    }
    searchInput.value = saved.query;
    categorySelect.value = saved.category;
    sortSelect.value = saved.sort || "original"; // Assignment 2 preferences remain compatible.
  } catch {
    document.querySelector("#storage-status").textContent =
      "Saved filters could not be restored. All projects are shown; you can choose new filters.";
  }
}

function updateProjects(save = true) {
  const query = searchInput.value.trim().toLowerCase();
  const category = categorySelect.value;
  const sort = sortSelect.value;
  let visible = 0;

  const ordered = [...searchableProjects];
  if (sort === "title-asc" || sort === "title-desc") {
    const direction = sort === "title-asc" ? 1 : -1;
    ordered.sort((a, b) =>
      direction * a.title.localeCompare(b.title, "en") || a.index - b.index);
  }

  for (const project of ordered) {
    // Reorder existing nodes instead of recreating the cards (keeps <details> state).
    projectGrid.appendChild(project.card);
    const matches = project.text.includes(query) &&
      (category === "all" || project.category === category);
    project.card.hidden = !matches;
    if (matches) visible += 1;
  }

  projectCount.textContent = `${visible} of ${projectCards.length} projects shown`;
  emptyState.hidden = visible !== 0;
  if (save) {
    try {
      localStorage.setItem(filterStorageKey, JSON.stringify({
        query: searchInput.value,
        category,
        sort,
      }));
    } catch {
      showStorageWarning();
    }
  }
}

restoreFilters();
updateProjects(false);
document.querySelector("#project-controls").hidden = false;
searchInput.addEventListener("input", () => updateProjects());
categorySelect.addEventListener("change", () => updateProjects());
sortSelect.addEventListener("change", () => updateProjects());
document.querySelector("#reset-projects").addEventListener("click", () => {
  searchInput.value = "";
  categorySelect.value = "all";
  sortSelect.value = "original";
  updateProjects();
  searchInput.focus();
});

// Visitor session state: count real elapsed time instead of assuming each tick is exact.
const visitDuration = document.querySelector("#visit-duration");
const visitStart = Date.now();
function updateVisitDuration() {
  const totalSeconds = Math.floor((Date.now() - visitStart) / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  visitDuration.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
document.querySelector("#visit-timer").hidden = false;
updateVisitDuration();
window.setInterval(updateVisitDuration, 1000);

// Assignment 3 API integration: fetch recent public repositories from GitHub.
const githubUsername = "sweRakan";
const githubApiUrl = `https://api.github.com/users/${encodeURIComponent(githubUsername)}/repos?sort=updated&per_page=6&type=owner`;
const repoStatus = document.querySelector("#repo-status");
const repoGrid = document.querySelector("#repo-grid");
const refreshRepos = document.querySelector("#refresh-repos");
let requestNumber = 0;

// Only links to the actual GitHub repository origin are allowed.
function safeGithubRepoUrl(value) {
  try {
    const url = new URL(value);
    if (url.protocol === "https:" && url.hostname === "github.com" &&
        url.pathname.toLowerCase().startsWith(`/${githubUsername.toLowerCase()}/`)) {
      return url.href;
    }
  } catch {
    // An invalid or unexpected URL should not become a clickable link.
  }
  return null;
}

function makeRepoCard(repo) {
  const article = document.createElement("article");
  article.className = "repo-card";
  const heading = document.createElement("h3");
  heading.textContent = repo.name;
  const description = document.createElement("p");
  description.className = "repo-description";
  description.textContent = repo.description || "No description provided.";
  const meta = document.createElement("p");
  meta.className = "repo-meta";
  const language = document.createElement("span");
  language.textContent = repo.language || "Language not specified";
  const updated = document.createElement("span");
  const date = new Date(repo.updated_at);
  updated.textContent = Number.isNaN(date.getTime())
    ? "Update date unavailable"
    : `Updated ${new Intl.DateTimeFormat("en", {year: "numeric", month: "short", day: "numeric"}).format(date)}`;
  meta.append(language, updated);
  article.append(heading, description, meta);
  const href = safeGithubRepoUrl(repo.html_url);
  if (href) {
    const link = document.createElement("a");
    link.className = "repo-link";
    link.href = href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "View repository ↗";
    article.appendChild(link);
  }
  return article;
}

async function loadRepositories() {
  const currentRequest = ++requestNumber;
  refreshRepos.disabled = true;
  repoGrid.replaceChildren();
  repoStatus.textContent = "Loading GitHub repositories…";

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(githubApiUrl, {
      signal: controller.signal,
      headers: { Accept: "application/vnd.github+json" },
    });
    if (!response.ok) {
      if (response.status === 403 || response.status === 429) {
        throw new Error("GitHub's public API rate limit may have been reached. Please try later or open my GitHub profile.");
      }
      throw new Error("GitHub repositories are unavailable right now. Please try again or open my GitHub profile.");
    }
    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error("GitHub returned an unexpected response. Please try again later.");
    }
    // Validate the API shape before displaying external data.
    const repositories = data.filter(repo => repo && typeof repo.name === "string" &&
      typeof repo.html_url === "string" && !repo.private);
    if (currentRequest !== requestNumber) return;
    for (const repo of repositories) repoGrid.appendChild(makeRepoCard(repo));
    repoStatus.textContent = repositories.length
      ? `Showing ${repositories.length} recently updated public ${repositories.length === 1 ? "repository" : "repositories"}.`
      : "No public repositories to display right now. Visit my GitHub profile to explore more.";
  } catch (error) {
    if (currentRequest !== requestNumber) return;
    repoStatus.textContent = error.name === "AbortError"
      ? "GitHub took too long to respond. Try Refresh or open my GitHub profile."
      : error.message && error.message.startsWith("GitHub")
        ? error.message
        : "Cannot reach GitHub right now. Check your connection, then try Refresh.";
  } finally {
    window.clearTimeout(timeout);
    if (currentRequest === requestNumber) refreshRepos.disabled = false;
  }
}

refreshRepos.addEventListener("click", loadRepositories);
loadRepositories();
