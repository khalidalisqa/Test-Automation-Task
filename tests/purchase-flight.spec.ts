import { test, expect, Page } from "@playwright/test";
import { HomePage } from "./pages/HomePage";
import { FlightsPage } from "./pages/FlightsPage";
import { PurchasePage } from "./pages/PurchasePage";
import { validDepartureCities, flightsMap, randomFrom } from "./utils/dataUtils";

/**
 * purchaseEndToEnd - Main workflow using POM
 * Validates input first, then runs full purchase flow
 */
async function purchaseEndToEnd(
  page: Page,
  deptCity?: string,
  destCity?: string,
  flightSeq?: number
): Promise<void> {
  // =====================
  // VALIDATE INPUT FIRST
  // =====================
  if (deptCity && !validDepartureCities.includes(deptCity)) {
    throw new Error(`Invalid Departure City: ${deptCity}`);
  }

  if (deptCity && destCity && flightsMap[deptCity] && !flightsMap[deptCity].includes(destCity)) {
    throw new Error(`Invalid Destination City for ${deptCity}: ${destCity}`);
  }

  if (deptCity && destCity && deptCity === destCity) {
    throw new Error("Departure and destination cannot be the same!");
  }

  // =====================
  // ASSIGN RANDOM IF MISSING
  // =====================
  deptCity = deptCity || randomFrom(validDepartureCities);
  destCity = destCity || randomFrom(flightsMap[deptCity]);

  const home = new HomePage(page);
  const flights = new FlightsPage(page);
  const purchase = new PurchasePage(page);

  // =====================
  // POM WORKFLOW
  // =====================
  await home.goto();
  await home.selectCities(deptCity, destCity);
  await flights.selectFlight(flightSeq || 1);
  await purchase.fillFormAndPurchase();
  await purchase.validatePurchase();

  console.log(`✔ Completed: ${deptCity} → ${destCity}`);
}

// ------------------
// TEST CASES
// ------------------

test("Valid Flight Purchase — Boston → Berlin", async ({ page }) => {
  await purchaseEndToEnd(page, "Boston", "Berlin", 1);
});

test("Random Flight Purchase — all parameters random", async ({ page }) => {
  await purchaseEndToEnd(page);
});

// =====================
// NEGATIVE TESTS
// =====================

test("Negative — Same Cities", async ({ page }) => {
  await expect(async () => await purchaseEndToEnd(page, "Paris", "Paris", 1)).rejects.toThrow();
});

test("Negative — Invalid Departure City", async ({ page }) => {
  await expect(async () => await purchaseEndToEnd(page, "London", "Berlin", 1)).rejects.toThrow();
});

test("Negative — Invalid Destination City", async ({ page }) => {
  await expect(async () => await purchaseEndToEnd(page, "Boston", "Tokyo", 1)).rejects.toThrow();
});