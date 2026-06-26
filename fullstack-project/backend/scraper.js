const fs = require("fs");
const path = require("path");
const axios = require("axios");
const cheerio = require("cheerio");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Directory to save images in the frontend public folder
const UPLOAD_DIR = path.join(__dirname, "../frontend/public/uploads/products");

// Base64 for a gray placeholder PNG (100x100) if image download fails after retries
const PLACEHOLDER_BASE64 = "iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAALklEQVR42u3BAQ0AAADCoPdPbQ43oAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABvDgz4AAHz7sADAAAAAElFTkSuQmCC";

/**
 * Downloads an image from a URL and saves it locally.
 * Retries up to 3 times on failure.
 * Falls back to a local placeholder if all retries fail.
 */
async function downloadImage(url, filename, retries = 3) {
  // Ensure upload directory exists
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }

  const destPath = path.join(UPLOAD_DIR, filename);

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`[Scraper] Downloading image (Attempt ${attempt}/${retries}): ${url}`);
      
      const response = await axios({
        url,
        method: "GET",
        responseType: "stream",
        timeout: 10000, // 10s timeout
      });

      return new Promise((resolve, reject) => {
        const writer = fs.createWriteStream(destPath);
        response.data.pipe(writer);
        writer.on("finish", () => {
          console.log(`[Scraper] Image downloaded successfully to ${destPath}`);
          resolve(`/uploads/products/${filename}`);
        });
        writer.on("error", (err) => {
          fs.unlink(destPath, () => {}); // Clean up file stream
          reject(err);
        });
      });
    } catch (error) {
      console.error(`[Scraper] Attempt ${attempt} failed to download image from ${url}: ${error.message}`);
      if (attempt === retries) {
        console.warn(`[Scraper] All ${retries} attempts failed. Saving default placeholder.`);
        // Write the placeholder image
        fs.writeFileSync(destPath, Buffer.from(PLACEHOLDER_BASE64, "base64"));
        return `/uploads/products/${filename}`;
      }
      // Wait 1 second before retrying
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}

/**
 * Scrapes products from the local mock-source HTML page
 * and stores/updates them in the database.
 */
async function scrapeAndSaveProducts() {
  try {
    console.log("[Scraper] Starting product scraping process...");
    
    // We scrape the mock source page hosted by our backend
    const mockSourceUrl = "http://localhost:5000/mock-source.html";
    const response = await axios.get(mockSourceUrl);
    const html = response.data;
    
    // Load HTML using cheerio
    const $ = cheerio.load(html);
    const products = [];

    $(".product-card").each((index, element) => {
      const brand = $(element).find(".brand").text().trim();
      const name = $(element).find(".title").text().trim();
      const category = $(element).find(".category").text().trim();
      const description = $(element).find(".description").text().trim();
      const price = parseInt($(element).find(".price").text().trim(), 10) || 0;
      
      const discountPriceText = $(element).find(".discount-price").text().trim();
      const discount_price = discountPriceText ? parseInt(discountPriceText, 10) : null;
      
      const rating = parseFloat($(element).find(".rating").text().trim()) || 0;
      const reviews = parseInt($(element).find(".reviews").text().trim(), 10) || 0;
      const imageUrl = $(element).find(".product-image").attr("src");
      const product_url = $(element).find(".product-url").text().trim() || null;
      const stock_status = $(element).find(".stock-status").text().trim() || "In Stock";

      products.push({
        brand,
        name,
        category,
        description,
        price,
        discount_price,
        rating,
        reviews,
        imageUrl,
        product_url,
        stock_status
      });
    });

    console.log(`[Scraper] Parsed ${products.length} products from HTML source.`);

    for (const prod of products) {
      // Generate a unique filename for each image
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 8);
      const filename = `product_${timestamp}_${randomStr}.jpg`;

      // Download the image and get the local relative path
      let localImagePath = "/uploads/products/placeholder.jpg"; // fallback
      if (prod.imageUrl) {
        localImagePath = await downloadImage(prod.imageUrl, filename);
      }

      // Upsert product in database based on name to avoid duplicate entries
      const existingProduct = await prisma.product.findFirst({
        where: { name: prod.name }
      });

      if (existingProduct) {
        // Update existing product
        await prisma.product.update({
          where: { id: existingProduct.id },
          data: {
            brand: prod.brand,
            category: prod.category,
            description: prod.description,
            price: prod.price,
            discount_price: prod.discount_price,
            rating: prod.rating,
            reviews: prod.reviews,
            image: localImagePath,
            product_url: prod.product_url,
            stock_status: prod.stock_status
          }
        });
        console.log(`[Scraper] Updated product in database: ${prod.name}`);
      } else {
        // Create new product
        await prisma.product.create({
          data: {
            name: prod.name,
            brand: prod.brand,
            category: prod.category,
            description: prod.description,
            price: prod.price,
            discount_price: prod.discount_price,
            rating: prod.rating,
            reviews: prod.reviews,
            image: localImagePath,
            product_url: prod.product_url,
            stock_status: prod.stock_status
          }
        });
        console.log(`[Scraper] Saved new product to database: ${prod.name}`);
      }
    }

    console.log("[Scraper] Scraping and database synchronization completed successfully!");
  } catch (error) {
    console.error("[Scraper] Error running scraper:", error.message);
  }
}

module.exports = {
  scrapeAndSaveProducts
};
