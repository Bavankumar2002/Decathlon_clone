-- Decathlon Clone Database Setup & Seed Script
-- Target Database: MySQL

-- 1. Create Database if not exists
CREATE DATABASE IF NOT EXISTS `decathlon_db`;
USE `decathlon_db`;

-- 2. Drop existing tables to start fresh
DROP TABLE IF EXISTS `products`;
DROP TABLE IF EXISTS `users`;

-- 3. Create 'users' table
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NULL UNIQUE,
  `phone` VARCHAR(191) NULL UNIQUE,
  `password` VARCHAR(191) NOT NULL,
  `profileImage` VARCHAR(191) NULL,
  `role` VARCHAR(191) NOT NULL DEFAULT 'USER',
  `status` BOOLEAN NOT NULL DEFAULT TRUE,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Create 'products' table
CREATE TABLE `products` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(191) NOT NULL,
  `brand` VARCHAR(191) NOT NULL,
  `category` VARCHAR(191) NOT NULL,
  `description` TEXT NOT NULL,
  `price` INT NOT NULL,
  `discount_price` INT NULL,
  `rating` DOUBLE NOT NULL,
  `reviews` INT NOT NULL,
  `image` VARCHAR(191) NOT NULL,
  `product_url` VARCHAR(191) NULL,
  `stock_status` VARCHAR(191) NOT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Seed Catalog Products (30 Products across 8 Sports categories)
INSERT INTO `products` (`id`, `name`, `brand`, `category`, `description`, `price`, `discount_price`, `rating`, `reviews`, `image`, `product_url`, `stock_status`) VALUES
-- Activewear
(1, 'Men Gym Trackpant Convertible, Jogger Pants for Workout', 'DOMYOS', 'Activewear', 'High quality convertible gym trackpant for active workouts and joggers.', 999, 999, 4.5, 8100, 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=500&auto=format&fit=crop&q=80', 'https://www.decathlon.in/p/8512345/men-gym-trackpant', 'In Stock'),
(2, 'Men Fitness Tracksuit Jacket with Front Zipper', 'DOMYOS', 'Activewear', 'Comfortable and warm fitness tracksuit jacket with a convenient front zipper.', 1499, 999, 4.5, 4500, 'https://images.unsplash.com/photo-1483721310020-03333e577078?w=500&auto=format&fit=crop&q=80', 'https://www.decathlon.in/p/8512346/tracksuit-jacket', 'In Stock'),
(3, 'Men Gym Shorts, Stretchable, Quick Dry and Breathable', 'DOMYOS', 'Activewear', 'Breathable gym shorts with excellent stretch for dynamic workouts.', 599, 399, 4.5, 17200, 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=500&auto=format&fit=crop&q=80', 'https://www.decathlon.in/p/8512347/gym-shorts', 'In Stock'),
(4, 'Men Gym Trackpants Slim Fit Joggers with Zip Pockets', 'DOMYOS', 'Activewear', 'Slim fit joggers with secure zippered pockets for essentials.', 1199, 899, 4.5, 5100, 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500&auto=format&fit=crop&q=80', 'https://www.decathlon.in/p/8512348/slim-joggers', 'In Stock'),

-- Monsoon Essentials
(5, 'Umbrella Unisex ProFilter Small Eco-Friendly Foldable', 'DECATHLON', 'Monsoon Essentials', 'Eco-friendly compact foldable umbrella offering high UV filter protection.', 1299, 799, 4.5, 2800, 'https://images.unsplash.com/photo-1527853787696-f7be74f2e39a?w=500&auto=format&fit=crop&q=80', 'https://www.decathlon.in/p/8512350/umbrella-small', 'In Stock'),
(6, 'Umbrella Unisex MICROPLUS Lightweight Windproof', 'INESIS', 'Monsoon Essentials', 'Ultra-lightweight wind-resistant micro umbrella for on-the-go rain safety.', 949, 699, 4.5, 114, 'https://images.unsplash.com/photo-1497250681960-ef046c08a56e?w=500&auto=format&fit=crop&q=80', 'https://www.decathlon.in/p/8512351/umbrella-micro', 'In Stock'),
(7, 'Umbrella Unisex ProFilter Medium Eco-Friendly Heavy Rain', 'INESIS', 'Monsoon Essentials', 'Reinforced heavy rain umbrella designed to withstand storm-force winds.', 1499, 999, 4.5, 2900, 'https://images.unsplash.com/photo-1620121692029-d088224ddc74?w=500&auto=format&fit=crop&q=80', 'https://www.decathlon.in/p/8512353/umbrella-heavy-rain', 'In Stock'),
(8, 'Rain Poncho Unisex Hiking Lightweight Waterproof', 'QUECHUA', 'Monsoon Essentials', 'Compact, highly packable waterproof poncho designed for outdoor mountain hiking.', 1499, 799, 4.5, 4200, 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=500&auto=format&fit=crop&q=80', 'https://www.decathlon.in/p/8512354/rain-poncho', 'In Stock'),

-- Shoes
(9, 'Men Walking Shoe, EVA Sole, Lightweight & Comfort', 'DECATHLON', 'Shoes', 'Lightweight active walking shoes featuring an EVA sole for optimal cushion.', 2999, 2299, 4.5, 2500, 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&auto=format&fit=crop&q=80', 'https://www.decathlon.in/p/8512349/walking-shoe', 'In Stock'),
(10, 'Men Waterproof Hiking Shoes - SH100 Warm Ultra-Durable', 'QUECHUA', 'Shoes', 'Warm, water-resistant, and high-traction shoes perfect for rugged terrains.', 3999, 2999, 4.5, 8900, 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=500&auto=format&fit=crop&q=80', 'https://www.decathlon.in/p/8512355/waterproof-hiking-shoes', 'In Stock'),
(11, 'Women Waterproof Hiking Boots - NH150 Cozy Mid', 'QUECHUA', 'Shoes', 'Comfortable and stylish mid-height waterproof hiking boots for women.', 3499, 2499, 4.5, 3100, 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&auto=format&fit=crop&q=80', 'https://www.decathlon.in/p/8512357/cozy-hiking-boots', 'Limited stock'),

-- Fitness Equipment
(12, 'Dumbbell Set 10kg Chrome with Premium Carry Case', 'DOMYOS', 'Fitness Equipment', 'Adjustable chrome dumbbells with solid collars and high-grip handles.', 2499, 1999, 4.8, 1200, 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=500&auto=format&fit=crop&q=80', 'https://www.decathlon.in/p/8512360/dumbbell-set', 'In Stock'),
(13, 'Yoga Mat 8mm Non-Slip Eco-Friendly Cushion', 'DOMYOS', 'Fitness Equipment', 'Ultra-comfortable TPE yoga mat with alignment lines and shoulder strap.', 1299, 999, 4.6, 850, 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&auto=format&fit=crop&q=80', 'https://www.decathlon.in/p/8512361/yoga-mat', 'In Stock'),
(14, 'Resistance Bands Set of 3 Workout Loops', 'DOMYOS', 'Fitness Equipment', 'Heavy duty fabric resistance loops for glute activation and home workouts.', 799, 599, 4.7, 1900, 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500&auto=format&fit=crop&q=80', 'https://www.decathlon.in/p/8512362/resistance-bands', 'In Stock'),

-- Cycling
(15, 'Rockrider ST100 Mountain Bike 27.5\"', 'ROCKRIDER', 'Cycling', 'Robust entry-level MTB with front suspension, V-brakes, and 21 speeds.', 16999, 14999, 4.4, 3400, 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=500&auto=format&fit=crop&q=80', 'https://www.decathlon.in/p/8512363/mountain-bike', 'In Stock'),
(16, 'Cycling Helmet Road Racing Aerodynamic', 'VAN RYSEL', 'Cycling', 'Highly ventilated racing helmet with aerodynamic design and dial fit adjustment.', 2999, 2499, 4.7, 530, 'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?w=500&auto=format&fit=crop&q=80', 'https://www.decathlon.in/p/8512364/cycling-helmet', 'In Stock'),
(17, 'Cycling Gloves Padded Gel Breathable', 'TRIBAN', 'Cycling', 'Padded cycle gloves with gel inserts to reduce road vibrations and hand fatigue.', 699, 499, 4.5, 610, 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=500&auto=format&fit=crop&q=80', 'https://www.decathlon.in/p/8512365/cycling-gloves', 'In Stock'),

-- Hiking & Trekking
(18, 'Quechua MH100 Camp Tent 2-Person', 'QUECHUA', 'Hiking & Trekking', 'Simple and easy to pitch 2-person tent with waterproof flysheet.', 2999, 2499, 4.6, 1500, 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=500&auto=format&fit=crop&q=80', 'https://www.decathlon.in/p/8512366/camp-tent', 'In Stock'),
(19, 'Trekking Poles Antishock Aluminium (Pair)', 'QUECHUA', 'Hiking & Trekking', 'Lightweight telescopic walking poles with shock-absorption system.', 1499, 1199, 4.5, 880, 'https://images.unsplash.com/photo-1533240332313-0db49b439ad3?w=500&auto=format&fit=crop&q=80', 'https://www.decathlon.in/p/8512367/trekking-poles', 'In Stock'),
(20, 'Sleeping Bag -10°C Extreme Warmth Comfort', 'FORCLAZ', 'Hiking & Trekking', 'High thermal insulation mummy sleeping bag built for high altitude treks.', 4999, 3999, 4.7, 450, 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=500&auto=format&fit=crop&q=80', 'https://www.decathlon.in/p/8512368/sleeping-bag', 'In Stock'),

-- Bags & Backpacks
(21, 'Quechua Arpenaz 10L Daypack Hiking Backpack', 'QUECHUA', 'Bags & Backpacks', 'Classic ultra-lightweight 10L backpack for daily walks and short trails.', 499, 399, 4.6, 25000, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=80', 'https://www.decathlon.in/p/8512369/arpenaz-backpack', 'In Stock'),
(22, 'Trekking Backpack Symbium 60+10L Rucksack', 'FORCLAZ', 'Bags & Backpacks', 'Heavy duty ergonomic rucksack with smart organization for multi-day treks.', 7999, 6999, 4.8, 320, 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=500&auto=format&fit=crop&q=80', 'https://www.decathlon.in/p/8512370/trekking-rucksack', 'In Stock'),
(23, 'Gym Duffle Bag 30L Lightweight Waterproof', 'KIPSTA', 'Bags & Backpacks', 'Waterproof gym duffle with smart shoe compartment and ventilation slots.', 1299, 899, 4.5, 1100, 'https://images.unsplash.com/photo-1574634534894-89d7576c8259?w=500&auto=format&fit=crop&q=80', 'https://www.decathlon.in/p/8512371/gym-duffle', 'In Stock'),

-- Sports Accessories
(24, 'Stainless Steel Insulated Water Bottle 1L', 'QUECHUA', 'Sports Accessories', 'Double-wall insulated bottle keeping beverages hot or cold for up to 24 hours.', 1299, 999, 4.7, 3100, 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format&fit=crop&q=80', 'https://www.decathlon.in/p/8512372/steel-bottle', 'In Stock'),
(25, 'Polarized Sunglasses Category 3 UV Protection', 'QUECHUA', 'Sports Accessories', 'High-contrast polarized sunglasses offering 100% UV protection and high durability.', 1499, 1199, 4.6, 1700, 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&auto=format&fit=crop&q=80', 'https://www.decathlon.in/p/8512373/sunglasses', 'In Stock'),
(26, 'Smart Sports Watch Heart Rate & GPS tracker', 'GEONAUTE', 'Sports Accessories', 'Waterproof activity tracker with GPS route recording and continuous heart rate monitor.', 4999, 3999, 4.3, 450, 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&auto=format&fit=crop&q=80', 'https://www.decathlon.in/p/8512374/sports-watch', 'In Stock');
