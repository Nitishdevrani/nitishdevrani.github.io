import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('http://localhost:5173');
    await page.waitForTimeout(1000);

    // NATIVE scroll
    await page.evaluate(() => window.scrollBy(0, 1500));
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'portfolio_mid.png', fullPage: false });

    // NATIVE Scroll deep enough to hit education
    await page.evaluate(() => window.scrollBy(0, 3000));

    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'portfolio_bus.png', fullPage: false });

    await browser.close();
})();
