const axios = require("axios");
const cheerio = require("cheerio");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

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
      // Use the scraped Unsplash URL directly, or a default placeholder if missing
      const imageUrl = prod.imageUrl || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=80";

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
            image: imageUrl,
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
            image: imageUrl,
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
