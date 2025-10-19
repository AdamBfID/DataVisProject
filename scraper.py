from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
import csv
import re
import time

def parse_product_name(name):
    """
    Parse product name to extract components.
    Example: "Lenovo LOQ 15IAX9 15.6\" FHD IPS | i5-12450HX | RTX 2050 | 24GB Ram | 512GB NVMe | Windows 11 Home"
    """
    parts = name.split('|')
    
    # Initialize variables
    brand = ""
    series = ""
    model = ""
    screen_size = ""
    screen_res = ""
    screen_type = ""
    cpu = ""
    gpu = ""
    ram = ""
    ssd = ""
    windows = ""
    
    # First part contains brand, series, model, and screen info
    if len(parts) > 0:
        first_part = parts[0].strip()
        
        # Extract screen size (e.g., "15.6\"")
        screen_match = re.search(r'(\d+\.?\d*)["\']', first_part)
        if screen_match:
            screen_size = screen_match.group(1) + '"'
        
        # Extract screen resolution and type (e.g., "FHD IPS")
        screen_info = re.findall(r'(FHD|HD|QHD|4K|UHD)\s*(IPS|TN|VA|OLED)?', first_part, re.IGNORECASE)
        if screen_info:
            screen_res = screen_info[0][0]
            screen_type = screen_info[0][1] if screen_info[0][1] else ""
        
        # Extract brand, series, and model (everything before screen size)
        before_screen = first_part.split(screen_size)[0].strip() if screen_size else first_part
        words = before_screen.split()
        
        if len(words) > 0:
            brand = words[0]
        if len(words) > 1:
            series = words[1] if len(words) > 1 else ""
            model = ' '.join(words[2:]) if len(words) > 2 else ""
    
    # Parse remaining parts
    for i, part in enumerate(parts[1:], 1):
        part = part.strip()
        
        # CPU detection
        if re.search(r'i\d-\d+[A-Z]*|Ryzen|AMD|Intel Core', part, re.IGNORECASE):
            cpu = part
        # GPU detection
        elif re.search(r'RTX|GTX|Radeon|Intel (Iris|UHD|HD)', part, re.IGNORECASE):
            gpu = part
        # RAM detection
        elif re.search(r'\d+\s*GB\s*(RAM|Ram)?', part, re.IGNORECASE) and not 'SSD' in part.upper() and not 'NVME' in part.upper():
            ram = part
        # Storage detection
        elif re.search(r'\d+\s*(GB|TB)\s*(SSD|NVMe|HDD)', part, re.IGNORECASE):
            ssd = part
        # Windows detection
        elif re.search(r'Windows', part, re.IGNORECASE):
            windows = part
    
    return {
        'brand': brand,
        'series': series,
        'model': model,
        'screen_size': screen_size,
        'screen_resolution': screen_res,
        'screen_type': screen_type,
        'cpu': cpu,
        'gpu': gpu,
        'ram': ram,
        'storage': ssd,
        'os': windows
    }

def scrape_megapc_selenium(url, max_pages=4):
    """
    Scrape product data from MegaPC website using Selenium.
    """
    all_products = []
    
    # Setup Chrome options
    chrome_options = Options()
    # chrome_options.add_argument('--headless')  # Uncomment to run without opening browser
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    chrome_options.add_argument('--disable-blink-features=AutomationControlled')
    chrome_options.add_argument('user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
    
    # Initialize the driver
    print("Initializing browser...")
    driver = webdriver.Chrome(options=chrome_options)
    
    try:
        # Navigate to the page
        print(f"Loading page: {url}")
        driver.get(url)
        
        # Wait for products to load
        print("Waiting for products to load...")
        wait = WebDriverWait(driver, 20)
        wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "article.product-card")))
        
        # Additional wait to ensure all content is loaded
        time.sleep(3)
        
        # Loop through pages
        for page_num in range(max_pages):
            print(f"\n--- Scraping page {page_num + 1} ---")
            
            # Find all product cards
            products = driver.find_elements(By.CSS_SELECTOR, "article.product-card")
            print(f"Found {len(products)} products on page {page_num + 1}")
            
            for idx, product in enumerate(products, 1):
                try:
                    # Extract product name
                    name_elem = product.find_element(By.CSS_SELECTOR, "p.text-skin-base")
                    product_name = name_elem.text.strip()
                    
                    if not product_name:
                        continue
                    
                    # Parse product name
                    parsed_data = parse_product_name(product_name)
                    
                    # Extract price
                    try:
                        price_elem = product.find_element(By.CSS_SELECTOR, "span.text-skin-primary")
                        price = price_elem.text.strip()
                    except:
                        price = "N/A"
                    
                    # Extract image URL
                    image_url = ""
                    try:
                        img_elem = product.find_element(By.TAG_NAME, "img")
                        image_url = img_elem.get_attribute("src")
                        
                        # Extract actual image URL from Next.js image
                        if image_url and 'url=' in image_url:
                            from urllib.parse import unquote
                            actual_url = image_url.split('url=')[1].split('&')[0]
                            image_url = unquote(actual_url)
                    except:
                        pass
                    
                    # Extract product URL
                    product_url = ""
                    try:
                        link_elem = product.find_element(By.TAG_NAME, "a")
                        product_url = link_elem.get_attribute("href")
                    except:
                        pass
                    
                    # Compile all data
                    product_data = {
                        'product_name': product_name,
                        'brand': parsed_data['brand'],
                        'series': parsed_data['series'],
                        'model': parsed_data['model'],
                        'screen_size': parsed_data['screen_size'],
                        'screen_resolution': parsed_data['screen_resolution'],
                        'screen_type': parsed_data['screen_type'],
                        'cpu': parsed_data['cpu'],
                        'gpu': parsed_data['gpu'],
                        'ram': parsed_data['ram'],
                        'storage': parsed_data['storage'],
                        'os': parsed_data['os'],
                        'price': price,
                        'image_url': image_url,
                        'product_url': product_url
                    }
                    
                    all_products.append(product_data)
                    print(f"  {idx}. Scraped: {product_name[:60]}...")
                    
                except Exception as e:
                    print(f"  Error parsing product {idx}: {e}")
                    continue
            
            # Try to go to next page
            if page_num < max_pages - 1:
                try:
                    # Find and click next page button
                    next_buttons = driver.find_elements(By.CSS_SELECTOR, "button[data-page]")
                    
                    # Find the button for the next page
                    next_page_num = page_num + 1
                    clicked = False
                    
                    for btn in next_buttons:
                        if btn.get_attribute("data-page") == str(next_page_num):
                            driver.execute_script("arguments[0].scrollIntoView();", btn)
                            time.sleep(1)
                            driver.execute_script("arguments[0].click();", btn)
                            clicked = True
                            print(f"Clicked page {next_page_num + 1} button")
                            time.sleep(3)  # Wait for new content to load
                            break
                    
                    if not clicked:
                        print("No more pages available")
                        break
                        
                except Exception as e:
                    print(f"Could not navigate to next page: {e}")
                    break
        
        print(f"\n✓ Successfully scraped {len(all_products)} products total")
        
    except Exception as e:
        print(f"Error during scraping: {e}")
    
    finally:
        # Close the browser
        driver.quit()
        print("Browser closed")
    
    return all_products

def save_to_csv(products, filename='megapc_products.csv'):
    """
    Save scraped products to CSV file.
    """
    if not products:
        print("No products to save!")
        return
    
    fieldnames = [
        'product_name', 'brand', 'series', 'model', 
        'screen_size', 'screen_resolution', 'screen_type',
        'cpu', 'gpu', 'ram', 'storage', 'os',
        'price', 'image_url', 'product_url'
    ]
    
    with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(products)
    
    print(f"✓ Data saved to {filename}")

# Main execution
if __name__ == "__main__":
    url = "https://megapc.tn/shop/PC%20PORTABLE/PC%20PORTABLE%20GAMER"
    
    print("="*60)
    print("MegaPC Product Scraper")
    print("="*60)
    
    products = scrape_megapc_selenium(url, max_pages=4)
    
    if products:
        save_to_csv(products)
        print(f"\n{'='*60}")
        print(f"✓ Total products scraped: {len(products)}")
        print(f"{'='*60}")
    else:
        print("\n⚠ No products were scraped. Please check:")
        print("  - Your internet connection")
        print("  - ChromeDriver is installed")
        print("  - The website structure hasn't changed")