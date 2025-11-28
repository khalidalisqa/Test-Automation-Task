import { test, expect, Page } from "@playwright/test";

// ------------------------------
// VALID CITY DATA
// ------------------------------
const validDepartureCities: string[] = [
  "Paris",
  "Philadelphia",
  "Boston",
  "Portland",
  "San Diego",
  "Mexico City",
  "São Paolo",
];

// Map of departure → valid destinations
const flightsMap: Record<string, string[]> = {
  "Paris": ["Buenos Aires", "Rome", "Berlin"],
  "Philadelphia": ["Buenos Aires", "Rome", "Berlin"],
  "Boston": ["Buenos Aires", "Rome", "Berlin"],
  "Portland": ["Buenos Aires", "Rome", "Berlin"],
  "San Diego": ["Buenos Aires", "Rome"],
  "Mexico City": ["Buenos Aires", "Rome"],
  "São Paolo": ["Buenos Aires", "Rome"],
};

// Utility to pick random element from array
function randomFrom(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ------------------------------
// MAIN FUNCTION
// ------------------------------
async function purchaseEndToEnd(
  page: Page,
  deptCity?: string,
  desCity?: string,
  flightSeq?: number
): Promise<void> {
  console.log("\n===== Running purchaseEndToEnd() =====");

  // RANDOMIZE IF MISSING
  deptCity = deptCity || randomFrom(validDepartureCities);
  desCity = desCity || randomFrom(flightsMap[deptCity]);

  // VALIDATE INPUT
  if (!validDepartureCities.includes(deptCity)) {
    throw new Error(`❌ Invalid Departure City: ${deptCity}`);
  }

  if (!flightsMap[deptCity].includes(desCity)) {
    throw new Error(`❌ Invalid Destination City for ${deptCity}: ${desCity}`);
  }

  if (deptCity === desCity) {
    throw new Error(`❌ Departure and Destination cannot be the same: ${deptCity}`);
  }

  console.log(`Departure: ${deptCity}, Destination: ${desCity}`);

  // NAVIGATE & SELECT CITIES
  await page.goto("https://blazedemo.com");

  await page.locator('select[name="fromPort"]').selectOption(deptCity);
  await page.locator('select[name="toPort"]').selectOption(desCity);
  await page.getByRole("button", { name: "Find Flights" }).click();

  // SELECT FLIGHT WITH EXPLICIT WAIT
  const flights = page.locator("table tbody tr");
  await flights.first().waitFor({ state: "visible", timeout: 5000 });

  const totalFlights = await flights.count();
  if (totalFlights === 0) {
    throw new Error("No flights available.");
  }

  flightSeq = flightSeq || Math.floor(Math.random() * totalFlights) + 1;

  if (flightSeq < 1 || flightSeq > totalFlights) {
    throw new Error(`❌ Invalid flight sequence: ${flightSeq}. Total flights: ${totalFlights}`);
  }

  console.log(`Selecting flight #${flightSeq}`);
  await flights.nth(flightSeq - 1).getByRole("button").click();

  // FILL PURCHASE FORM
  const fakeName = `User${Math.floor(Math.random() * 1000)}`;
  const fakeAddress = "123 Test Road";
  const fakeCity = "TestCity";
  const fakeState = "TestState";
  const fakeZip = Math.floor(Math.random() * 90000 + 10000).toString();
  const fakeCard = Math.floor(Math.random() * 1e14).toString();

  await page.locator("#inputName").fill(fakeName);
  await page.locator("#address").fill(fakeAddress);
  await page.locator("#city").fill(fakeCity);
  await page.locator("#state").fill(fakeState);
  await page.locator("#zipCode").fill(fakeZip);
  await page.locator("#cardType").selectOption("amex");
  await page.locator("#creditCardNumber").fill(fakeCard);
  await page.locator("#creditCardMonth").fill("12");
  await page.locator("#creditCardYear").fill("2025");
  await page.locator("#nameOnCard").fill(fakeName);

  await page.getByLabel("Remember me").check();
  await page.getByRole("button", { name: "Purchase Flight" }).click();

  // ASSERTIONS
  await expect(page.getByRole("heading", { name: "Thank you for your purchase" })).toBeVisible();

  const statusCell = page.getByRole("cell", { name: "PendingCapture" });
  await expect(statusCell).toHaveText("PendingCapture");

  const priceCell = page.locator("table tr").nth(3).locator("td").nth(1);
  const priceText = await priceCell.textContent();
  const price = parseFloat(priceText?.replace(/[^0-9.]/g, "") || "0");

  if (isNaN(price)) {
    throw new Error("Price could not be parsed.");
  }

  expect(price).toBeGreaterThan(100);

  console.log(`✔ Purchase complete: ${deptCity} → ${desCity}, Flight #${flightSeq}, Price: $${price}`);
}

// ------------------------------
// TEST SUITE
// ------------------------------
test("Valid Flight Purchase — Boston → Berlin", async ({ page }) => {
  await purchaseEndToEnd(page, "Boston", "Berlin", 1);
});

test("Random Flight Purchase — all parameters random", async ({ page }) => {
  await purchaseEndToEnd(page);
});

test("Negative Test — Same Departure & Destination", async ({ page }) => {
  await expect(async () => {
    await purchaseEndToEnd(page, "Paris", "Paris", 1);
  }).rejects.toThrow();
});

test("Negative Test — Invalid Departure City", async ({ page }) => {
  await expect(async () => {
    await purchaseEndToEnd(page, "London", "Berlin", 1);
  }).rejects.toThrow();
});

test("Negative Test — Invalid Destination City", async ({ page }) => {
  await expect(async () => {
    await purchaseEndToEnd(page, "Boston", "Tokyo", 1);
  }).rejects.toThrow();
});
