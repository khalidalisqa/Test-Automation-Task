import { Page } from "@playwright/test";

export class HomePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto("https://blazedemo.com");
  }

  async selectCities(deptCity: string, destCity: string) {
    await this.page.locator('select[name="fromPort"]').selectOption(deptCity);
    await this.page.locator('select[name="toPort"]').selectOption(destCity);
    await this.page.getByRole("button", { name: "Find Flights" }).click();
  }
}
