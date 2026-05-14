-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 13, 2026 at 09:12 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `lsms_sql`
--

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` int(11) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`id`, `full_name`, `phone`, `email`, `address`, `created_at`) VALUES
(1, 'RUDASINGWA NSHUTI Bonheur', '0788888888', 'bonheur@gmail.com', 'Kigali', '2026-04-28 11:53:58'),
(2, 'Rusaganwa', '078456789', 'bokzoslamb@gmail.com', 'kagugu', '2026-04-29 13:43:37'),
(3, 'rwema', '0789213354', 'beni@gmail.com', 'kagondo', '2026-04-29 13:49:03'),
(4, 'rwema', '0789213354', 'beni@gmail.com', 'kagondo', '2026-04-29 13:49:30'),
(5, 'rwema', '0789213354', 'beni@gmail.com', 'kagondo', '2026-04-29 13:49:46');

-- --------------------------------------------------------

--
-- Table structure for table `deliveries`
--

CREATE TABLE `deliveries` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `driver_id` int(11) DEFAULT NULL,
  `status` enum('pending','on_route','delivered') DEFAULT 'pending',
  `delivery_date` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `deliveries`
--

INSERT INTO `deliveries` (`id`, `order_id`, `driver_id`, `status`, `delivery_date`) VALUES
(1, 1, NULL, 'delivered', '2026-04-29 13:56:04');

-- --------------------------------------------------------

--
-- Table structure for table `garments`
--

CREATE TABLE `garments` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `garment_type` varchar(100) DEFAULT NULL,
  `service_type` enum('wash','iron','dry_clean') NOT NULL,
  `status` enum('pending','processing','done') DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `inventory`
--

CREATE TABLE `inventory` (
  `id` int(11) NOT NULL,
  `item_name` varchar(100) NOT NULL,
  `quantity` int(11) DEFAULT 0,
  `reorder_level` int(11) DEFAULT 5,
  `last_updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `order_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('received','sorting','washing','drying','ironing','ready','delivered') DEFAULT 'received',
  `total_amount` decimal(10,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `customer_id`, `order_date`, `status`, `total_amount`) VALUES
(1, 1, '2026-04-28 11:56:48', 'washing', 5000.00),
(2, 1, '2026-04-28 11:58:53', 'ready', 5000.00),
(3, 1, '2026-04-28 12:09:53', 'received', 5000.00),
(4, 1, '2026-04-28 12:14:05', 'drying', 5000.00),
(5, 1, '2026-04-28 12:22:01', 'delivered', 5000.00),
(8, 1, '2026-04-29 13:43:54', 'ironing', 2500.00),
(9, 2, '2026-04-29 13:48:59', 'delivered', 2700.00),
(10, 2, '2026-04-29 13:49:32', 'washing', 2700.00),
(11, 3, '2026-04-29 13:49:48', 'drying', 2700.00);

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_method` enum('cash','mobile_money','card') NOT NULL,
  `payment_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `order_id`, `amount`, `payment_method`, `payment_date`) VALUES
(1, 1, 5000.00, 'cash', '2026-04-28 12:04:03'),
(2, 2, 5000.00, 'mobile_money', '2026-04-28 22:18:38'),
(3, 2, 2500.00, 'cash', '2026-04-29 13:50:37'),
(4, 3, 2700.00, 'cash', '2026-04-29 13:50:51'),
(5, 11, 2700.00, 'cash', '2026-04-29 13:57:34');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `role` enum('admin','counter','technician','driver') NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `full_name`, `phone`, `role`, `password`, `created_at`) VALUES
(1, 'Admin ', '0787921151', 'admin', '$2b$10$142LT6PE.4lXKnNypndBCO3Ch0e0bRD/VoLiiaGoSFqkN9CjCkUVa', '2026-04-28 15:14:30'),
(2, 'admin', '0787921151', 'admin', '4321', '2026-04-28 22:10:56'),
(3, 'Olivier', '0781111111', 'driver', '$2b$10$wVI9HmZbzdNx/s0QeifsoOdF8TFphoGFANIMqzc6MB.xoCNMZsT8a', '2026-04-29 13:28:24'),
(4, 'Jimmy', '078222222', 'counter', '$2b$10$vUo53VMC1hrqSqMO3Ksb1uNWtJe/nQAy4bruSpVO.P9qBB0IsFBAO', '2026-04-29 13:41:39');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
