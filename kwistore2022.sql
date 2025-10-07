/*
 Navicat Premium Data Transfer

 Source Server         : MySQl Local
 Source Server Type    : MySQL
 Source Server Version : 100417 (10.4.17-MariaDB)
 Source Host           : localhost:3307
 Source Schema         : kwistore2022

 Target Server Type    : MySQL
 Target Server Version : 100417 (10.4.17-MariaDB)
 File Encoding         : 65001

 Date: 03/10/2025 13:04:57
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for addresses
-- ----------------------------
DROP TABLE IF EXISTS `addresses`;
CREATE TABLE `addresses` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `label` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT 'Home',
  `type` enum('SHIPPING','BILLING','CURRENT') COLLATE utf8mb4_unicode_ci DEFAULT 'SHIPPING',
  `country_code` char(2) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address_line1` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address_line2` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ward_code` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `district_code` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `province_code` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `postal_code` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `formatted_address` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `place_id` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  `is_default` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `addresses_ibfk_1` (`user_id`),
  CONSTRAINT `addresses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `chk_addr_country` CHECK (`country_code` in ('VN','KH'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of addresses
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for auth_otp_codes
-- ----------------------------
DROP TABLE IF EXISTS `auth_otp_codes`;
CREATE TABLE `auth_otp_codes` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) DEFAULT NULL,
  `channel` enum('email','phone') COLLATE utf8mb4_unicode_ci NOT NULL,
  `target` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code_hash` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `purpose` enum('signup','signin','verify','reset') COLLATE utf8mb4_unicode_ci NOT NULL,
  `expires_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `consumed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_otp_target` (`channel`,`target`),
  KEY `auth_otp_codes_ibfk_1` (`user_id`),
  CONSTRAINT `auth_otp_codes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of auth_otp_codes
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for auth_sessions
-- ----------------------------
DROP TABLE IF EXISTS `auth_sessions`;
CREATE TABLE `auth_sessions` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `session_token_hash` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_agent` varchar(300) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ip_address` varbinary(16) DEFAULT NULL,
  `issued_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `expires_at` timestamp NULL DEFAULT NULL,
  `revoked_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_session_token` (`session_token_hash`),
  KEY `idx_session_user_exp` (`user_id`,`expires_at`),
  CONSTRAINT `auth_sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of auth_sessions
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for brands
-- ----------------------------
DROP TABLE IF EXISTS `brands`;
CREATE TABLE `brands` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of brands
-- ----------------------------
BEGIN;
INSERT INTO `brands` (`id`, `name`, `slug`, `created_at`) VALUES (1, 'Keychron', 'keychron', '2025-09-07 19:47:31');
INSERT INTO `brands` (`id`, `name`, `slug`, `created_at`) VALUES (2, 'Akko', 'akko', '2025-09-07 19:47:31');
INSERT INTO `brands` (`id`, `name`, `slug`, `created_at`) VALUES (3, 'Meletrix', 'meletrix', '2025-09-07 19:47:31');
INSERT INTO `brands` (`id`, `name`, `slug`, `created_at`) VALUES (4, 'Daring Run', 'daring run', '2025-09-07 19:47:31');
COMMIT;

-- ----------------------------
-- Table structure for cart_items
-- ----------------------------
DROP TABLE IF EXISTS `cart_items`;
CREATE TABLE `cart_items` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `cart_id` bigint(20) NOT NULL,
  `variant_id` bigint(20) NOT NULL,
  `quantity` int(11) NOT NULL CHECK (`quantity` > 0),
  `unit_price` decimal(18,2) NOT NULL,
  `currency` char(3) COLLATE utf8mb4_unicode_ci NOT NULL,
  `added_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_cart_variant` (`cart_id`,`variant_id`),
  KEY `variant_id` (`variant_id`),
  CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`),
  CONSTRAINT `chk_ci_ccy` CHECK (`currency` in ('VND','KHR'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of cart_items
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for carts
-- ----------------------------
DROP TABLE IF EXISTS `carts`;
CREATE TABLE `carts` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) DEFAULT NULL,
  `cart_token` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `currency` char(3) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `cart_token` (`cart_token`),
  KEY `carts_ibfk_1` (`user_id`),
  CONSTRAINT `carts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `chk_cart_ccy` CHECK (`currency` in ('VND','USD'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of carts
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for categories
-- ----------------------------
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `parent_id` bigint(20) DEFAULT NULL,
  `name` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `parent_id` (`parent_id`),
  CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of categories
-- ----------------------------
BEGIN;
INSERT INTO `categories` (`id`, `parent_id`, `name`, `slug`, `created_at`) VALUES (1, NULL, 'Keyboards', 'keyboards', '2025-09-07 19:48:35');
INSERT INTO `categories` (`id`, `parent_id`, `name`, `slug`, `created_at`) VALUES (2, NULL, 'Keycaps', 'keycaps', '2025-09-07 19:48:35');
INSERT INTO `categories` (`id`, `parent_id`, `name`, `slug`, `created_at`) VALUES (3, NULL, 'Switches', 'switches', '2025-09-07 19:48:35');
INSERT INTO `categories` (`id`, `parent_id`, `name`, `slug`, `created_at`) VALUES (4, NULL, 'Cables', 'cables', '2025-09-07 19:48:35');
INSERT INTO `categories` (`id`, `parent_id`, `name`, `slug`, `created_at`) VALUES (5, NULL, 'Accessories', 'accessories', '2025-09-07 19:48:35');
COMMIT;

-- ----------------------------
-- Table structure for coupons
-- ----------------------------
DROP TABLE IF EXISTS `coupons`;
CREATE TABLE `coupons` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `code` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('PERCENT','FIXED') COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(18,2) NOT NULL,
  `currency` char(3) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `country_code` char(2) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `min_order_total` decimal(18,2) DEFAULT 0.00,
  `usage_limit` int(11) DEFAULT NULL,
  `used_count` int(11) DEFAULT 0,
  `start_at` timestamp NULL DEFAULT NULL,
  `end_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  CONSTRAINT `chk_coupon_ccy` CHECK (`currency` is null or `currency` in ('VND','USD')),
  CONSTRAINT `chk_coupon_cc` CHECK (`country_code` is null or `country_code` in ('VN','KH'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of coupons
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for fx_rates
-- ----------------------------
DROP TABLE IF EXISTS `fx_rates`;
CREATE TABLE `fx_rates` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `base_currency` char(3) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quote_currency` char(3) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rate` decimal(18,6) NOT NULL,
  `fetched_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_fx_pair` (`base_currency`,`quote_currency`),
  CONSTRAINT `chk_fx_base` CHECK (`base_currency` in ('VND','USD')),
  CONSTRAINT `chk_fx_quote` CHECK (`quote_currency` in ('VND','USD'))
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of fx_rates
-- ----------------------------
BEGIN;
INSERT INTO `fx_rates` (`id`, `base_currency`, `quote_currency`, `rate`, `fetched_at`) VALUES (1, 'VND', 'USD', 25000.000000, '2025-09-07 19:42:07');
INSERT INTO `fx_rates` (`id`, `base_currency`, `quote_currency`, `rate`, `fetched_at`) VALUES (2, 'USD', 'VND', 25000.000000, '2025-09-07 19:42:07');
COMMIT;

-- ----------------------------
-- Table structure for inventory
-- ----------------------------
DROP TABLE IF EXISTS `inventory`;
CREATE TABLE `inventory` (
  `variant_id` bigint(20) NOT NULL,
  `warehouse_id` bigint(20) NOT NULL,
  `qty_on_hand` int(11) NOT NULL DEFAULT 0,
  `qty_reserved` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`variant_id`,`warehouse_id`),
  KEY `warehouse_id` (`warehouse_id`),
  CONSTRAINT `inventory_ibfk_1` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE,
  CONSTRAINT `inventory_ibfk_2` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of inventory
-- ----------------------------
BEGIN;
INSERT INTO `inventory` (`variant_id`, `warehouse_id`, `qty_on_hand`, `qty_reserved`) VALUES (1, 1, 50, 0);
INSERT INTO `inventory` (`variant_id`, `warehouse_id`, `qty_on_hand`, `qty_reserved`) VALUES (1, 2, 50, 0);
INSERT INTO `inventory` (`variant_id`, `warehouse_id`, `qty_on_hand`, `qty_reserved`) VALUES (2, 1, 50, 0);
INSERT INTO `inventory` (`variant_id`, `warehouse_id`, `qty_on_hand`, `qty_reserved`) VALUES (2, 2, 50, 0);
COMMIT;

-- ----------------------------
-- Table structure for order_items
-- ----------------------------
DROP TABLE IF EXISTS `order_items`;
CREATE TABLE `order_items` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `order_id` bigint(20) NOT NULL,
  `variant_id` bigint(20) NOT NULL,
  `product_name_snapshot` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sku_snapshot` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `option_values_snapshot` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`option_values_snapshot`)),
  `unit_price` decimal(18,2) NOT NULL,
  `currency` char(3) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity` int(11) NOT NULL CHECK (`quantity` > 0),
  `tax_rate_percent` decimal(5,2) NOT NULL DEFAULT 0.00,
  `line_subtotal` decimal(18,2) NOT NULL,
  `line_tax` decimal(18,2) NOT NULL DEFAULT 0.00,
  `line_total` decimal(18,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `variant_id` (`variant_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`),
  CONSTRAINT `chk_oi_ccy` CHECK (`currency` in ('VND','USD'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of order_items
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for orders
-- ----------------------------
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `order_code` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `country_code` char(2) COLLATE utf8mb4_unicode_ci NOT NULL,
  `currency` char(3) COLLATE utf8mb4_unicode_ci NOT NULL,
  `billing_address_id` bigint(20) DEFAULT NULL,
  `shipping_address_id` bigint(20) DEFAULT NULL,
  `subtotal` decimal(18,2) NOT NULL DEFAULT 0.00,
  `discount_total` decimal(18,2) NOT NULL DEFAULT 0.00,
  `shipping_fee` decimal(18,2) NOT NULL DEFAULT 0.00,
  `tax_total` decimal(18,2) NOT NULL DEFAULT 0.00,
  `grand_total` decimal(18,2) NOT NULL DEFAULT 0.00,
  `order_status` enum('PENDING','CONFIRMED','CANCELLED','FULFILLED','COMPLETED','REFUNDED') COLLATE utf8mb4_unicode_ci DEFAULT 'PENDING',
  `payment_status` enum('UNPAID','PAID','REFUNDED','FAILED') COLLATE utf8mb4_unicode_ci DEFAULT 'UNPAID',
  `fulfillment_status` enum('UNFULFILLED','PARTIAL','FULFILLED') COLLATE utf8mb4_unicode_ci DEFAULT 'UNFULFILLED',
  `placed_at` timestamp NULL DEFAULT NULL,
  `confirmed_at` timestamp NULL DEFAULT NULL,
  `cancelled_at` timestamp NULL DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `order_code` (`order_code`),
  KEY `billing_address_id` (`billing_address_id`),
  KEY `shipping_address_id` (`shipping_address_id`),
  KEY `orders_ibfk_1` (`user_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`billing_address_id`) REFERENCES `addresses` (`id`),
  CONSTRAINT `orders_ibfk_3` FOREIGN KEY (`shipping_address_id`) REFERENCES `addresses` (`id`),
  CONSTRAINT `chk_order_cc` CHECK (`country_code` in ('VN','KH')),
  CONSTRAINT `chk_order_ccy` CHECK (`currency` in ('VND','USD'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of orders
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for password_resets
-- ----------------------------
DROP TABLE IF EXISTS `password_resets`;
CREATE TABLE `password_resets` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `token_hash` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expires_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `used_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_reset_token` (`token_hash`),
  KEY `password_resets_ibfk_1` (`user_id`),
  CONSTRAINT `password_resets_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of password_resets
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for payment
-- ----------------------------
DROP TABLE IF EXISTS `payment`;
CREATE TABLE `payment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `amount` int(11) NOT NULL,
  `currency` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of payment
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for payments
-- ----------------------------
DROP TABLE IF EXISTS `payments`;
CREATE TABLE `payments` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `order_id` bigint(20) NOT NULL,
  `method` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(18,2) NOT NULL,
  `currency` char(3) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('PENDING','PAID','FAILED','REFUNDED') COLLATE utf8mb4_unicode_ci DEFAULT 'PENDING',
  `transaction_ref` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `paid_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `chk_pay_ccy` CHECK (`currency` in ('VND','USD'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of payments
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for product_images
-- ----------------------------
DROP TABLE IF EXISTS `product_images`;
CREATE TABLE `product_images` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `product_id` bigint(20) NOT NULL,
  `variant_id` bigint(20) DEFAULT NULL,
  `url` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `alt` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sort_order` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  KEY `variant_id` (`variant_id`),
  CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `product_images_ibfk_2` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of product_images
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for product_options
-- ----------------------------
DROP TABLE IF EXISTS `product_options`;
CREATE TABLE `product_options` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `product_id` bigint(20) NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `position` int(11) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `product_options_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of product_options
-- ----------------------------
BEGIN;
INSERT INTO `product_options` (`id`, `product_id`, `name`, `position`) VALUES (1, 1, 'Layout', 1);
INSERT INTO `product_options` (`id`, `product_id`, `name`, `position`) VALUES (2, 1, 'Switch', 2);
INSERT INTO `product_options` (`id`, `product_id`, `name`, `position`) VALUES (3, 1, 'Color', 3);
COMMIT;

-- ----------------------------
-- Table structure for product_reviews
-- ----------------------------
DROP TABLE IF EXISTS `product_reviews`;
CREATE TABLE `product_reviews` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `product_id` bigint(20) NOT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `rating` tinyint(4) NOT NULL CHECK (`rating` between 1 and 5),
  `title` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `body` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  KEY `product_reviews_ibfk_2` (`user_id`),
  CONSTRAINT `product_reviews_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `product_reviews_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of product_reviews
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for product_variants
-- ----------------------------
DROP TABLE IF EXISTS `product_variants`;
CREATE TABLE `product_variants` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `product_id` bigint(20) NOT NULL,
  `sku` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `barcode` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `option_values` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`option_values`)),
  `price` decimal(18,2) NOT NULL,
  `currency` char(3) COLLATE utf8mb4_unicode_ci NOT NULL,
  `compare_at_price` decimal(18,2) DEFAULT NULL,
  `cost` decimal(18,2) DEFAULT NULL,
  `status` enum('ACTIVE','INACTIVE') COLLATE utf8mb4_unicode_ci DEFAULT 'ACTIVE',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `sku` (`sku`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `product_variants_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `chk_variant_currency` CHECK (`currency` in ('VND','USD'))
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of product_variants
-- ----------------------------
BEGIN;
INSERT INTO `product_variants` (`id`, `product_id`, `sku`, `barcode`, `option_values`, `price`, `currency`, `compare_at_price`, `cost`, `status`, `created_at`, `updated_at`) VALUES (1, 1, 'K2-ANSI-BROWN-BLACK', NULL, '{\"Layout\": \"ANSI 75%\", \"Switch\": \"Gateron Brown\", \"Color\": \"Black\"}', 1900000.00, 'VND', 2100000.00, 1500000.00, 'ACTIVE', '2025-09-07 19:49:29', '2025-09-07 19:49:29');
INSERT INTO `product_variants` (`id`, `product_id`, `sku`, `barcode`, `option_values`, `price`, `currency`, `compare_at_price`, `cost`, `status`, `created_at`, `updated_at`) VALUES (2, 1, 'K2-ANSI-RED-WHITE', NULL, '{\"Layout\": \"ANSI 75%\", \"Switch\": \"Gateron Red\", \"Color\": \"White\"}', 15.00, 'USD', NULL, NULL, 'ACTIVE', '2025-09-07 19:49:29', '2025-09-07 19:49:29');
COMMIT;

-- ----------------------------
-- Table structure for products
-- ----------------------------
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` mediumtext COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `price` decimal(10,2) NOT NULL,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of products
-- ----------------------------
BEGIN;
INSERT INTO `products` (`id`, `name`, `description`, `created_at`, `updated_at`, `price`, `image`) VALUES (1, 'Keychron K2 (Hot-swap)', '75% wireless mechanical keyboard', '2025-09-07 19:48:50', '2025-09-07 19:48:50', 0.00, NULL);
COMMIT;

-- ----------------------------
-- Table structure for returns
-- ----------------------------
DROP TABLE IF EXISTS `returns`;
CREATE TABLE `returns` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `order_id` bigint(20) NOT NULL,
  `order_item_id` bigint(20) NOT NULL,
  `reason` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('REQUESTED','APPROVED','REJECTED','RECEIVED','REFUNDED') COLLATE utf8mb4_unicode_ci DEFAULT 'REQUESTED',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `order_item_id` (`order_item_id`),
  CONSTRAINT `returns_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `returns_ibfk_2` FOREIGN KEY (`order_item_id`) REFERENCES `order_items` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of returns
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for shipments
-- ----------------------------
DROP TABLE IF EXISTS `shipments`;
CREATE TABLE `shipments` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `order_id` bigint(20) NOT NULL,
  `warehouse_id` bigint(20) DEFAULT NULL,
  `carrier` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `service` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tracking_no` varchar(120) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('READY','PICKED','IN_TRANSIT','DELIVERED','FAILED','RETURNED') COLLATE utf8mb4_unicode_ci DEFAULT 'READY',
  `shipped_at` timestamp NULL DEFAULT NULL,
  `delivered_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `warehouse_id` (`warehouse_id`),
  CONSTRAINT `shipments_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `shipments_ibfk_2` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of shipments
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for taxes
-- ----------------------------
DROP TABLE IF EXISTS `taxes`;
CREATE TABLE `taxes` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `country_code` char(2) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rate_percent` decimal(5,2) NOT NULL,
  `effective_from` date NOT NULL,
  `effective_to` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `chk_tax_cc` CHECK (`country_code` in ('VN','KH'))
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of taxes
-- ----------------------------
BEGIN;
INSERT INTO `taxes` (`id`, `country_code`, `name`, `rate_percent`, `effective_from`, `effective_to`) VALUES (7, 'VN', 'VAT', 10.00, '2024-01-01', NULL);
INSERT INTO `taxes` (`id`, `country_code`, `name`, `rate_percent`, `effective_from`, `effective_to`) VALUES (8, 'KH', 'VAT', 10.00, '2024-01-01', NULL);
COMMIT;

-- ----------------------------
-- Table structure for user_identities
-- ----------------------------
DROP TABLE IF EXISTS `user_identities`;
CREATE TABLE `user_identities` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `provider` enum('email','phone','google') COLLATE utf8mb4_unicode_ci NOT NULL,
  `provider_user_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `provider_email` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `provider_picture` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `oauth_access_token` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `oauth_refresh_token` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `oauth_expires_at` timestamp NULL DEFAULT NULL,
  `linked_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_identity` (`provider`,`provider_user_id`),
  KEY `idx_identity_user` (`user_id`),
  CONSTRAINT `user_identities_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of user_identities
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` bigint(20) NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of users
-- ----------------------------
BEGIN;
INSERT INTO `users` (`id`, `email`, `password`) VALUES (1, 'newpwtest@example.com', '$2b$10$1Ul3vapxJhV5rfIfURTNYOP9TGYD6.Bp2vNxcsbWxTM//uJMBeQRm');
INSERT INTO `users` (`id`, `email`, `password`) VALUES (5, 'uyendev@example.com', '123456');
INSERT INTO `users` (`id`, `email`, `password`) VALUES (6, 'bob@example.com', 'password');
INSERT INTO `users` (`id`, `email`, `password`) VALUES (7, 'alice2@example.com', '12345678');
INSERT INTO `users` (`id`, `email`, `password`) VALUES (12, 'boby@example.com', '654321');
INSERT INTO `users` (`id`, `email`, `password`) VALUES (13, 'bobe@example.com', '654321');
INSERT INTO `users` (`id`, `email`, `password`) VALUES (14, 'boncto@example.com', '$2b$10$GDS3tIFjYzbvYHBq6bAKy.sXTjgaYcOL/axIx4MuwvbCmToAx.Qr2');
INSERT INTO `users` (`id`, `email`, `password`) VALUES (15, 'titeoteo123@example.com', '$2b$10$XUNqv6oQfrOHOx9EHUt02.IbF84tW1kO7sPTgXViMhFNj/d7x2g7W');
INSERT INTO `users` (`id`, `email`, `password`) VALUES (16, 'checkpw@example.com', '$2b$10$Aoln1v.1zjkXK8gUm/nS8ufwlBUunrsSKpQ0d04z22Kr72EqxylLS');
COMMIT;

-- ----------------------------
-- Table structure for warehouses
-- ----------------------------
DROP TABLE IF EXISTS `warehouses`;
CREATE TABLE `warehouses` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `country_code` char(2) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address_id` bigint(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `address_id` (`address_id`),
  CONSTRAINT `warehouses_ibfk_1` FOREIGN KEY (`address_id`) REFERENCES `addresses` (`id`),
  CONSTRAINT `chk_wh_cc` CHECK (`country_code` in ('VN','KH'))
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of warehouses
-- ----------------------------
BEGIN;
INSERT INTO `warehouses` (`id`, `name`, `country_code`, `address_id`, `created_at`) VALUES (1, 'HCM Main WH', 'VN', NULL, '2025-09-07 19:52:24');
INSERT INTO `warehouses` (`id`, `name`, `country_code`, `address_id`, `created_at`) VALUES (2, 'Phnom Penh WH', 'KH', NULL, '2025-09-07 19:52:24');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
