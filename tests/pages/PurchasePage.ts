import { Page, expect } from "@playwright/test";

export class PurchasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async fillFormAndPurchase() {
    const fakeName = `User${Math.floor(Math.random() * 1000)}`;
    const fakeAddress = "123 Test Road";
    const fakeCity = "TestCity";
    const fakeState = "TestState";
    const fakeZip = (Math.floor(Math.random() * 90000) + 10000).toString();
    const fakeCard = (Math.floor(Math.random() * 1e14)).toString();

    await this.page.locator("#inputName").fill(fakeName);
    await this.page.locator("#address").fill(fakeAddress);
    await this.page.locator("#city").fill(fakeCity);
    await this.page.locator("#state").fill(fakeState);
    await this.page.locator("#zipCode").fill(fakeZip);
    await this.page.locator("#cardType").selectOption("amex");
    await this.page.locator("#creditCardNumber").fill(fakeCard);
    await this.page.locator("#creditCardMonth").fill("12");
    await this.page.locator("#creditCardYear").fill("2025");
    await this.page.locator("#nameOnCard").fill(fakeName);

    await this.page.getByLabel("Remember me").check();
    await this.page.getByRole("button", { name: "Purchase Flight" }).click();
  }

  async validatePurchase() {
    await expect(this.page.getByRole("heading", { name: "Thank you for your purchase" })).toBeVisible();

    const statusCell = this.page.getByRole("cell", { name: "PendingCapture" });
    await expect(statusCell).toHaveText("PendingCapture");

    const priceCell = this.page.locator("table tr").nth(3).locator("td").nth(1);
    const priceText = await priceCell.textContent();
    const price = parseFloat(priceText?.replace(/[^0-9.]/g, "") || "0");

    if (isNaN(price)) throw new Error("Price could not be parsed.");
    if (price <= 100) throw new Error(`Price is too low: $${price}`);
  }
}
