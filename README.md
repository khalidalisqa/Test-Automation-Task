# 🚀 Test-Automation-Task — Playwright + TypeScript (POM)

This project automates the **end-to-end flight purchase workflow** on [BlazeDemo](https://blazedemo.com) using **Playwright**, **TypeScript**, and the **Page Object Model (POM)** pattern.

It includes:

* ✔ Full E2E workflow
* ✔ Assertions at each step
* ✔ Negative & positive test scenarios
* ✔ Random test data
* ✔ Screenshots & trace recording on failures
* ✔ GitHub CI Pipeline (Playwright tests executed on every push/PR)
* ✔ Automated HTML Report as pipeline artifact

---

## Tech Stack

| Component    | Choice                          |
| ------------ | ------------------------------- |
| Language     | TypeScript                      |
| Framework    | Playwright                      |
| Architecture | Page Object Model (POM)         |
| Test Runner  | Playwright Test Runner          |
| Reporting    | Playwright HTML Reporter        |
| CI Pipeline  | GitHub Actions                  |
| Debugging    | Traces + Screenshots on Failure |

---

## Project Structure

```
/tests
│── purchase-flight.spec.ts             → Main test suite

/pages
│── HomePage.ts                         → City selection
│── FlightsPage.ts                      → Flight list handling
│── PurchasePage.ts                     → Purchase form & validations

/utils
│── dataUtils.ts                        → City lists, valid routes, random functions

/.github/workflows
│── playwright.yml                      → GitHub CI pipeline for Playwright
```

---

# Installation

Install dependencies:

```bash
npm install
npx playwright install
```

(Optional) Install browser dependencies:

```bash
npx playwright install --with-deps
```

---

# Run Tests

Run everything:

```bash
npx playwright test
```

Run with visible browser:

```bash
npx playwright test --headed
```

Run in UI mode:

```bash
npx playwright test --ui
```

---

# View Report

```bash
npx playwright show-report
```

---

# Test Coverage Summary

### **Positive Scenarios**

✔ Valid purchase Boston → Berlin
✔ Fully random purchase (random departure, destination, flight)

### **Negative Scenarios**

❌ Same departure and destination → throws validation error
❌ Invalid departure city → throws error
❌ Invalid destination city → throws error

Uses:

```ts
await expect(...).rejects.toThrow();
```

---

# Core Workflow (`purchaseEndToEnd()`)

### **1. Input Validation**

* Checks if departure city is valid
* Ensures destination exists for selected route
* Prevents same city for both fields

### **2. Auto-Randomization (Optional)**

If parameters not provided:

✔ Random valid departure city
✔ Random valid destination based on route map
✔ Random flight row

### **3. Assertions**

* Home page loads
* Dropdown values match expected
* Flight table displays correctly
* Form fields exist
* Confirmation page contains:

  * Valid ID
  * Non-zero purchase amount

### **4. Debugging Tools**

On failure, pipeline and local run save:

* Screenshot
* Trace file (zip)

---

# GitHub Actions Pipeline (CI/CD)

This repository includes a **complete GitHub Actions pipeline** for Playwright.

Path:

```
.github/workflows/playwright.yml
```

## 🛠 What the GitHub Pipeline Does

### ✔ Runs automatically on:

* Every **push**
* Every **pull request**
* Manually via **workflow dispatch**

### ✔ Pipeline Steps:

1️⃣ **Checkout repository**

```yaml
- uses: actions/checkout@v3
```

2️⃣ **Setup Node.js environment**

```yaml
- uses: actions/setup-node@v3
  with:
    node-version: 18
```

3️⃣ **Install dependencies**

```yaml
- run: npm install
```

4️⃣ **Install Playwright browsers**

```yaml
- run: npx playwright install --with-deps
```

5️⃣ **Execute Playwright tests**

```yaml
- run: npx playwright test
```

6️⃣ **Upload HTML Report (Always saved even on failure)**

```yaml
- uses: actions/upload-artifact@v3
  if: always()
  with:
    name: playwright-report
    path: playwright-report
    retention-days: 10
```

# CI Benefits

✔ Tests run automatically in the cloud
✔ No local environment dependency
✔ Full logs, screenshots, and traces stored as artifacts
✔ Ensures code stability before merging
✔ Enables team-wide visibility on failures

---

# Author

**Automation Engineer:** Khalid Ali
**Framework:** Playwright + TypeScript + POM
**CI/CD:** GitHub Actions Pipeline
**Assignment:** Flight Purchase Automation

---

If you want, I can also add:

🔹 Badge at top of README (build passing)
🔹 Pipeline email notifications
🔹 BrowserStack integration in CI
🔹 Docker workflow

Just say the word!
