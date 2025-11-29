# Test-Automation-Task

This project automates the **end-to-end flight purchase flow** on [BlazeDemo](https://blazedemo.com) using **Playwright + TypeScript** with a **Page Object Model (POM)** architecture.

It includes **positive and negative tests**, randomization, validations, and simple reporting.

---

## Tech Stack

| Component      | Choice                            |
| -------------- | --------------------------------- |
| Language       | TypeScript                        |
| Framework      | Playwright                        |
| Design Pattern | Page Object Model (POM)           |
| Assertions     | Playwright Test built-in `expect` |
| Reporting      | Playwright HTML Reporter          |

---

## Project Structure

```
/tests
│── purchase-flight.spec.ts        → Main test suite

/pages/
│── HomePage.ts                     → Select cities, navigate
│── FlightsPage.ts                  → Flight list, choose flight
│── PurchasePage.ts                 → Form filling & validation

/utils/
└── dataUtils.ts                    → City lists, flight map, random utilities
```

---

## Installation

Install dependencies:

```bash
npm install
npx playwright install
```

(Optional) Install system dependencies for browsers:

```bash
npx playwright install --with-deps
```

---

## Run Tests

Run **all test suites**:

```bash
npx playwright test
```

Run **headed mode** (browser visible):

```bash
npx playwright test --headed
```

Run a **specific test file**:

```bash
npx playwright test tests/purchase-flight.spec.ts
```

Run tests **with UI mode**:

```bash
npx playwright test --ui
```

---

## View Test Report

After test execution, generate and view HTML report:

```bash
npx playwright show-report
```

---

## Test Execution Status

All tests included in the suite:

**Positive Tests**:

* Valid Flight Purchase — Boston → Berlin
* Random Flight Purchase — all parameters random

**Negative Tests**:

* Same Departure & Destination → throws validation error
* Invalid Departure City → throws error for unsupported city
* Invalid Destination City → throws error for unsupported route

---

## Core Functionality (`purchaseEndToEnd()`)

1. **City Validation**

   * Ensures departure/destination are valid
   * Prevents same-city inputs

2. **Randomization**

   * Random departure city if not provided
   * Random destination city if not provided
   * Random flight index if not provided

3. **Flight Selection**

   * Waits for flight table to load (explicit wait)
   * Selects specific or random flight

4. **Form Filling**

   * Generates random user data for each run
   * Fills all purchase form fields

5. **Assertions**

   * Purchase confirmation page visible
   * Status = `PendingCapture`
   * Price > $100

---

## Assumptions

* BlazeDemo website is stable and accessible.
* Flight prices may vary; only minimum price is validated.
* Only departure cities in `dataUtils.ts` are valid.
* Some cities have limited routes defined in `flightsMap`.

---

## How POM Works in This Framework

**HomePage**

* Navigates to BlazeDemo
* Selects departure & destination
* Submits search

**FlightsPage**

* Waits for flights table to load
* Selects flight by row index

**PurchasePage**

* Generates random user data
* Fills form
* Validates purchase summary

---

## Author

* Automation Engineer: Khalid Ali
* Framework: Playwright + TypeScript + POM
* Company Assignment: Flight Purchase Automation
