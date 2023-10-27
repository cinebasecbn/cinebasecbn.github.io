const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Set the viewport size
  await page.setViewport({ width: 1200, height: 800 });

  // Navigate to a local HTML file that includes your JavaScript
  await page.goto('index.html'); // Replace with the actual file path

  // Wait for your script to execute or events to occur
  await page.waitFor(5000); // Adjust the time based on your script's needs

  // Capture a screenshot or perform other actions as needed

  await browser.close();
})();
