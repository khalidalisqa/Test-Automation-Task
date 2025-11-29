import { test, expect, Page } from "@playwright/test";
import { HomePage } from "./pages/HomePage";
import { FlightsPage } from "./pages/FlightsPage";
import { PurchasePage } from "./pages/PurchasePage";
import { validDepartureCities, flightsMap, randomFrom } from "./utils/dataUtils";


// =============================
// GLOBAL HOOKS
// =============================

test.beforeAll(async () => {
  console.log("BEFORE ALL: Test execution started");
});

test.beforeEach(async ({ page }, testInfo) => {
  console.log(`STARTING TEST → ${testInfo.title}`);

  // Enable trace & screenshot at test start
  await page.context().tracing.start({
    screenshots: true,
    snapshots: true
  });
});

test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    console.log(`TEST FAILED → ${testInfo.title}`);

    // Screenshot on failure
    await page.screenshot({
      path: `screenshots/${testInfo.title.replace(/\s+/g, "_")}.png`,
    });

    // Save trace on failure
    await page.context().tracing.stop({
      path: `traces/${testInfo.title.replace(/\s+/g, "_")}.zip`,
    });
  } else {
    // Stop trace for passed test without saving
    await page.context().tracing.stop();
  }

  console.log(`FINISHED TEST → ${testInfo.title}`);
});

test.afterAll(async () => {
  console.log("AFTER ALL: All tests finished!");
});


// =============================
// MAIN WORKFLOW FUNCTION
// =============================

async function purchaseEndToEnd(
  page: Page,
  deptCity?: string,
  destCity?: string,
  flightSeq?: number
): Promise<void> {

  // VALIDATION
  if (deptCity && !validDepartureCities.includes(deptCity)) {
    throw new Error(`Invalid Departure City: ${deptCity}`);
  }

  if (deptCity && destCity && flightsMap[deptCity] && !flightsMap[deptCity].includes(destCity)) {
    throw new Error(`Invalid Destination City for ${deptCity}: ${destCity}`);
  }

  if (deptCity && destCity && deptCity === destCity) {
    throw new Error("Departure and destination cannot be the same!");
  }

  // ASSIGN RANDOM IF NEEDED
  deptCity = deptCity || randomFrom(validDepartureCities);
  destCity = destCity || randomFrom(flightsMap[deptCity]);

  // POM INSTANCES
  const home = new HomePage(page);
  const flights = new FlightsPage(page);
  const purchase = new PurchasePage(page);

  // WORKFLOW
  await home.goto();
  await home.selectCities(deptCity, destCity);
  await flights.selectFlight(flightSeq || 1);
  await purchase.fillFormAndPurchase();
  await purchase.validatePurchase();

  console.log(`Completed Flight: ${deptCity} → ${destCity}`);
}


// =============================
// POSITIVE TESTS
// =============================

test("Valid Flight Purchase — Boston → Berlin", async ({ page }) => {
  await purchaseEndToEnd(page, "Boston", "Berlin", 1);
});

test("Random Flight Purchase — All parameters random", async ({ page }) => {
  await purchaseEndToEnd(page);
});


// =============================
// NEGATIVE TESTS
// =============================

test("Negative — Same Cities", async ({ page }) => {
  await expect(async () =>
    purchaseEndToEnd(page, "Paris", "Paris", 1)
  ).rejects.toThrow();
});

test("Negative — Invalid Departure City", async ({ page }) => {
  await expect(async () =>
    purchaseEndToEnd(page, "London", "Berlin", 1)
  ).rejects.toThrow();
});

test("Negative — Invalid Destination City", async ({ page }) => {
  await expect(async () =>
    purchaseEndToEnd(page, "Boston", "Tokyo", 1)
  ).rejects.toThrow();
});
