import { Page } from "@playwright/test";

export class FlightsPage {
  constructor(private page: Page) {}

  async selectFlight(sequence: number): Promise<number> {
    const flights = this.page.locator("table tbody tr");
    await flights.first().waitFor({ state: "visible" });

    const totalFlights = await flights.count();
    if (totalFlights === 0) throw new Error("No flights available");

    if (sequence < 1 || sequence > totalFlights) {
      throw new Error(`Invalid flight #${sequence}. Total: ${totalFlights}`);
    }

    await flights.nth(sequence - 1).getByRole("button").click();
    return totalFlights;
  }
}
