import { test, expect } from "@playwright/test";
import { OmniSearchProvider } from "../utils/omni-search";

test.describe.configure({ mode: "serial" });

let providerSearch: OmniSearchProvider;
let provider;

test.beforeAll(async () => {
  providerSearch = new OmniSearchProvider("ssm", "prod", {
    HasUrl: 1,
  });
  await providerSearch.init();
  provider = providerSearch.provider;
});

test("displays provider card", async ({ page }) => {
  const omniSearchUrl = `https://www.getcare.ssmhealth.com/find-a-doctor?search=${encodeURIComponent(
    provider.Name
  )}`;
  await page.goto(omniSearchUrl);

  const provCard = page.locator(`[data-npi='${provider.Npi}']`);
  // Expect a title "to contain" a substring.
  await expect(provCard).toBeDefined();
});
