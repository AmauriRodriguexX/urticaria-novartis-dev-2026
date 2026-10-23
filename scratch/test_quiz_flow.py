import time
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(channel="msedge", headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    page.goto("http://localhost:4173/", wait_until="networkidle")
    
    # Click on the quiz CTA
    btn = page.locator("button:has-text('Hacer Test')").first
    btn.click()
    page.wait_for_selector(".modal-inner")
    time.sleep(0.5)
    
    title = page.locator(".modal-inner h2").text_content()
    print("Modal opened! First question title:", title)
    
    browser.close()
