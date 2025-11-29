# Test-Automation-Task — Playwright + TypeScript (POM)

This project automates the **end-to-end flight purchase workflow** on [BlazeDemo](https://blazedemo.com) using **Playwright**, **TypeScript**, and a clean **Page Object Model (POM)** structure.

It covers:

* ✔ Positive flow (valid flight purchase)
* ✔ Negative validations
* ✔ Random routes & dynamic inputs
* ✔ Full assertions at each step
* ✔ Screenshots and traces on failure
* ✔ HTML reporting

---

## Tech Stack

| Component      | Choice                          |
| -------------- | ------------------------------- |
| Language       | TypeScript                      |
| Framework      | Playwright                      |
| Design Pattern | Page Object Model (POM)         |
| Assertions     | Playwright’s built-in `expect`  |
| Reporting      | Playwright HTML Reporter        |
| Debugging      | Traces + Screenshots on Failure |

---

## Project Structure

```
/tests
│── purchase-flight.spec.ts        → Main test suite (positive + negative tests)

/pages/
│── HomePage.ts                     → City selection, navigation
│── FlightsPage.ts                  → Flight list & selection
│── PurchasePage.ts                 → Purchase form + confirmation checks

/utils/
└── dataUtils.ts                    → City lists, allowed routes, random helpers
```

---

## Installation

Install dependencies:

```bash
npm install
npx playwright install
```

(Optional) Install system dependencies:

```bash
npx playwright install --with-deps
```

---

## Run Tests

Run all tests:

```bash
npx playwright test
```

Run with browser UI:

```bash
npx playwright test --headed
```

Run a specific test:

```bash
npx playwright test tests/purchase-flight.spec.ts
```

Interactive UI mode:

```bash
npx playwright test --ui
```

---

## View Test Report

After execution:

```bash
npx playwright show-report
```

---

## Test Coverage Summary

### **Positive Tests**

1. **Valid Flight Purchase — Boston → Berlin**
2. **Random Flight Purchase — random departure, destination, and flight**

### **Negative Validation Tests**

1. **Same Departure & Destination** → throws error
2. **Invalid Departure City** → throws error
3. **Invalid Destination City** → throws error

Each negative test uses:

```ts
await expect(...).rejects.toThrow("specific error message")
```

---

## Core Workflow (`purchaseEndToEnd()`)

### Input Validation

* Ensures departure city is allowed
* Ensures destination belongs to that route
* Prevents using the same city for both fields

### Randomization Logic

If parameters are missing:

* Random valid departure city
* Random valid destination city
* Random flight index

### Assertions Added in Workflow

* Home page URL loads correctly
* Selected cities are reflected in dropdowns
* Flight table is visible
* Purchase form appears
* Purchase confirmation contains:

  * Correct header text
  * Price greater than zero

### Flight Selection

* Waits for flight table
* Clicks row by index

### Purchase Form

* Auto-generates random user data
* Fills all mandatory fields
* Validates purchase summary page

---

## Debugging Features

Every failing test automatically stores:

* **Screenshot** → `screenshots/testName.png`
* **Trace file** → `traces/testName.zip`

This allows detailed debugging in Playwright Trace Viewer.

---

## How POM Architecture Works

### **HomePage**

* Visit BlazeDemo homepage
* Select departure & destination
* Submit flight search

### **FlightsPage**

* Wait for flights table
* Select flight row based on index

### **PurchasePage**

* Fill full purchase form
* Submit order
* Assert purchase confirmation

---

## Assumptions

* BlazeDemo site is stable
* All allowed cities are defined in `dataUtils.ts`
* Route mapping (`flightsMap`) controls valid combinations
* Flight prices may vary, so only basic validation is applied

---

## Author

**Automation Engineer:** Khalid Ali
**Framework:** Playwright + TypeScript
**Architecture:** Page Object Model (POM)
**Task:** Flight Purchase Automation Framework