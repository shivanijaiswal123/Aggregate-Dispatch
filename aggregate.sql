-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: Aug 26, 2020 at 04:40 AM
-- Server version: 5.7.23
-- PHP Version: 7.2.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `AggregateDispatcher`
--

-- --------------------------------------------------------

--
-- Table structure for table `aggregate_company`
--

CREATE TABLE `aggregate_company` (
  `aggregate_company_id` int(11) NOT NULL,
  `company_name` varchar(255) NOT NULL,
  `address_line_1` varchar(255) NOT NULL,
  `address_line_2` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `pincode` varchar(255) NOT NULL,
  `state` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `aggregate_company`
--

INSERT INTO `aggregate_company` (`aggregate_company_id`, `company_name`, `address_line_1`, `address_line_2`, `city`, `pincode`, `state`) VALUES
(2, 'Iron Productions', 'Plot 78-79', 'Genesis Industrial Complex', 'Thane', '401014', 'Maha'),
(3, 'Iron Productions', 'Plot 78-79', 'Genesis Industrial Complex', 'Thane', '401014', 'Maha'),
(4, 'EdunoMics', '6th Road', '30 Avenue Building', 'Mumbai', '4901901', 'Maharashtra'),
(5, 'EdunoMics', '6th Road', '30 Avenue Building', 'Mumbai', '4901901', 'Maharashtra');

-- --------------------------------------------------------

--
-- Table structure for table `aggregate_user`
--

CREATE TABLE `aggregate_user` (
  `aggregate_user_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone_no` varchar(255) NOT NULL,
  `aggregate_company_id` int(11) DEFAULT NULL,
  `role` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `aggregate_user`
--

INSERT INTO `aggregate_user` (`aggregate_user_id`, `name`, `email`, `password`, `phone_no`, `aggregate_company_id`, `role`) VALUES
(1, 'Niket', 'niket@gmail.com', '$2a$10$lRedd9scEb30CKteCBTIS.S0M/1Y8zOAkROoiUE7Tqu9tEmXYx5EK', '3151918361993', 2, 'Admin'),
(2, 'Tanuj', 'tanuj@gmail.com', '$2a$10$d5zM6uLe0dwVzRdJs9MTDugvuUcSJEc3nOOvrRC7bglatiDdohzSm', '1971810389', 2, 'Sales Manager'),
(3, 'Deep', 'deep@gmail.com', '$2a$10$xWw7uS.HR93GNg5tAthsuOgFPAow2qtC65cn.a26.0nCA8I.mouXy', '1971810389', 2, 'Quarry Manager'),
(4, 'Niket', 'niket2@gmail.com', '$2a$10$vxAt7fNi9g4fPRVGmtW8Oe307br7UADoWAAeEXUCC0QlgFN4k2sOS', '3151918361993', 3, 'Admin'),
(5, 'Bhavya', 'bhavya@gmail.com', '$2a$10$KqmzWSXKKfw26EVCussHy.cCYl9qUV5R6tJ5ynW7Ww6e5M5IoAa3.', '38173100131', 2, 'Dispatcher'),
(6, 'Edunomics', 'edunomics1@gmail.com', '$2a$10$oWNwY1KoiE1IeR21zbYYxOIz2K/yNIu68spnMpr1OxouOLJQxO6t2', '4718310103', 4, 'Admin'),
(7, 'Edunomics', 'edunomics2@gmail.com', '$2a$10$cmlSXoL4HmxjJgewBHKhz.3MoN32XUPr7r7NSxAsnVaSXHjucQIJu', '4718310103', 5, 'Admin'),
(8, 'Adam', 'adam@gmail.com', '$2a$10$.Xnz9ClhADhh35nVOwaiXORbxhhdrki3ej3fHYePDgOxHp2edjnaa', '7130981031', 5, 'Dispatcher'),
(9, 'Ricky', 'ricky@gmail.com', '$2a$10$pY83nspBIrJ2E9uszMzBbe/S5tsS74QKlfnlwPhZlEdge5ywOStV.', '1913013113', 5, 'Quarry Manager');

-- --------------------------------------------------------

--
-- Table structure for table `customer`
--

CREATE TABLE `customer` (
  `customer_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone_no` varchar(255) NOT NULL,
  `address_line_1` varchar(255) NOT NULL,
  `address_line_2` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `pincode` varchar(255) NOT NULL,
  `state` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `customer`
--

INSERT INTO `customer` (`customer_id`, `name`, `email`, `password`, `phone_no`, `address_line_1`, `address_line_2`, `city`, `pincode`, `state`) VALUES
(1, 'Jayesh', 'jayesh@gmail.com', '$2a$10$5ZUt/phv9KhmnZ2on/bBGuhXwePzhD5mdyxjc79sPc.9KRYr.ki7S', '149173011', '9th road', 'Santacruz', 'Mumbai', '39131413', 'Maha');

-- --------------------------------------------------------

--
-- Table structure for table `customer_site`
--

CREATE TABLE `customer_site` (
  `customer_site_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `address_line_1` varchar(255) NOT NULL,
  `address_line_2` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `pincode` varchar(255) NOT NULL,
  `state` varchar(255) NOT NULL,
  `customer_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `customer_site`
--

INSERT INTO `customer_site` (`customer_site_id`, `name`, `address_line_1`, `address_line_2`, `city`, `pincode`, `state`, `customer_id`) VALUES
(1, 'Halo Project', '123', 'nadl', 'mumbai', '405413', 'Maha', 1),
(2, 'Drik Project', '1314', 'ms,adlam', 'mumbai', '491031', 'Maha', 1),
(3, 'XYZ', '51 Road', '4190 Building', 'Pune', '1940131', 'Maha', 1);

-- --------------------------------------------------------

--
-- Table structure for table `item`
--

CREATE TABLE `item` (
  `item_id` int(11) NOT NULL,
  `item_name` varchar(255) NOT NULL,
  `item_code` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `item`
--

INSERT INTO `item` (`item_id`, `item_name`, `item_code`) VALUES
(1, 'Iron 30', 'Fe-30');

-- --------------------------------------------------------

--
-- Table structure for table `job`
--

CREATE TABLE `job` (
  `job_id` int(11) NOT NULL,
  `job_name` varchar(255) NOT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `aggregate_company_id` int(11) DEFAULT NULL,
  `dispatcher_id` int(11) DEFAULT NULL,
  `customer_site_id` int(11) DEFAULT NULL,
  `item_id` int(11) DEFAULT NULL,
  `total_quantity` int(11) DEFAULT NULL,
  `daily_minimum` int(11) DEFAULT NULL,
  `interval_between_delivery` time DEFAULT NULL,
  `price_criteria` varchar(255) DEFAULT NULL,
  `from_date` date DEFAULT NULL,
  `to_date` date DEFAULT NULL,
  `job_status` varchar(255) DEFAULT NULL,
  `additional_notes` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `job`
--

INSERT INTO `job` (`job_id`, `job_name`, `customer_id`, `aggregate_company_id`, `dispatcher_id`, `customer_site_id`, `item_id`, `total_quantity`, `daily_minimum`, `interval_between_delivery`, `price_criteria`, `from_date`, `to_date`, `job_status`, `additional_notes`) VALUES
(1, 'Water Advents', 1, 2, NULL, 2, 1, 100, 20, '02:00:00', 'weight', '2020-12-25', '2020-12-27', 'PENDING_APPROVAL', 'River Surfing'),
(2, 'DeFarm Advents', 1, 2, 5, 2, 1, 100, 20, '02:00:00', 'weight', '2020-12-25', '2020-12-27', 'APPROVED', 'River Surfing'),
(3, 'DeFarm Advents', 1, 2, NULL, 2, 1, 100, 20, '02:00:00', 'weight', '2020-12-25', '2020-12-27', 'PENDING_APPROVAL', 'River Surfing');

-- --------------------------------------------------------

--
-- Table structure for table `quarry`
--

CREATE TABLE `quarry` (
  `quarry_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `aggregate_company_id` int(11) DEFAULT NULL,
  `site_incharge_id` int(11) DEFAULT NULL,
  `address_line_1` varchar(255) NOT NULL,
  `address_line_2` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `pincode` varchar(255) NOT NULL,
  `state` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `quarry`
--

INSERT INTO `quarry` (`quarry_id`, `name`, `aggregate_company_id`, `site_incharge_id`, `address_line_1`, `address_line_2`, `city`, `pincode`, `state`) VALUES
(1, 'Iron Ore', 2, 3, '5th', '6th', 'telangana', '391047', 'AP'),
(2, 'Manganse Ore', 2, 3, '5th', '6th', 'telangana', '391047', 'AP'),
(3, 'Silver Ore', 5, 9, '103 Lane', '891 Building 4', 'Mumbai', '1389131', 'Maharashtra');

-- --------------------------------------------------------

--
-- Table structure for table `shift`
--

CREATE TABLE `shift` (
  `shift_id` int(11) NOT NULL,
  `shift_start` time DEFAULT NULL,
  `shift_end` time DEFAULT NULL,
  `job_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `shift`
--

INSERT INTO `shift` (`shift_id`, `shift_start`, `shift_end`, `job_id`) VALUES
(1, '05:00:00', '10:00:00', 1),
(2, '12:00:00', '15:00:00', 1),
(3, '05:00:00', '10:00:00', 2),
(4, '12:00:00', '15:00:00', 2),
(5, '05:00:00', '10:00:00', 3),
(6, '12:00:00', '15:00:00', 3);

-- --------------------------------------------------------

--
-- Table structure for table `sub_job`
--

CREATE TABLE `sub_job` (
  `sub_job_id` int(11) NOT NULL,
  `job_id` int(11) DEFAULT NULL,
  `quarry_id` int(11) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `sub_job_status` varchar(255) DEFAULT NULL,
  `no_of_trucks` int(11) DEFAULT NULL,
  `sub_job_quantity` int(11) DEFAULT NULL,
  `sub_job_created` datetime DEFAULT NULL,
  `sub_job_completed` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `sub_job`
--

INSERT INTO `sub_job` (`sub_job_id`, `job_id`, `quarry_id`, `date`, `sub_job_status`, `no_of_trucks`, `sub_job_quantity`, `sub_job_created`, `sub_job_completed`) VALUES
(1, 1, 1, '2020-12-25', 'CREATED', 2, 60, '2020-08-10 13:04:14', NULL),
(2, 1, 1, '2020-12-25', 'CREATED', 2, 60, '2020-08-11 07:35:24', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `sub_job_truck`
--

CREATE TABLE `sub_job_truck` (
  `sub_job_truck_id` int(11) NOT NULL,
  `driver_id` int(11) DEFAULT NULL,
  `truck_id` int(11) DEFAULT NULL,
  `sub_job_id` int(11) DEFAULT NULL,
  `required_quantity` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `sub_job_truck`
--

INSERT INTO `sub_job_truck` (`sub_job_truck_id`, `driver_id`, `truck_id`, `sub_job_id`, `required_quantity`) VALUES
(1, NULL, NULL, 1, 40),
(5, 2, 3, 1, 20),
(6, NULL, NULL, 1, 20);

-- --------------------------------------------------------

--
-- Table structure for table `sub_job_truck_execution`
--

CREATE TABLE `sub_job_truck_execution` (
  `sub_job_truck_execution_id` int(11) NOT NULL,
  `sub_job_truck_id` int(11) DEFAULT NULL,
  `actual_quantity` int(11) DEFAULT NULL,
  `enroute_loading` datetime DEFAULT NULL,
  `loaded` datetime DEFAULT NULL,
  `enroute_unloading` datetime DEFAULT NULL,
  `completed` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `truck`
--

CREATE TABLE `truck` (
  `truck_id` int(11) NOT NULL,
  `vehicle_no` varchar(255) NOT NULL,
  `number_plate` varchar(255) NOT NULL,
  `truck_company_id` int(11) DEFAULT NULL,
  `truck_type_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `truck`
--

INSERT INTO `truck` (`truck_id`, `vehicle_no`, `number_plate`, `truck_company_id`, `truck_type_id`) VALUES
(1, 'A01', 'MH-04', 1, 3),
(2, 'A02', 'MH-02', 1, 2),
(3, 'A-09', 'MH-01', 1, 1),
(4, 'A-08', 'MH-07', 1, 2);

-- --------------------------------------------------------

--
-- Table structure for table `truck_company`
--

CREATE TABLE `truck_company` (
  `truck_company_id` int(11) NOT NULL,
  `company_name` varchar(255) NOT NULL,
  `address_line_1` varchar(255) NOT NULL,
  `address_line_2` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `pincode` varchar(255) NOT NULL,
  `state` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `truck_company`
--

INSERT INTO `truck_company` (`truck_company_id`, `company_name`, `address_line_1`, `address_line_2`, `city`, `pincode`, `state`) VALUES
(1, 'Bidit Truckstars', '9th road', 'Santacruz', 'Mumbai', '39131413', 'Maha');

-- --------------------------------------------------------

--
-- Table structure for table `truck_company_user`
--

CREATE TABLE `truck_company_user` (
  `truck_company_user_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone_no` varchar(255) NOT NULL,
  `truck_company_id` int(11) DEFAULT NULL,
  `role` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `truck_company_user`
--

INSERT INTO `truck_company_user` (`truck_company_user_id`, `name`, `email`, `password`, `phone_no`, `truck_company_id`, `role`) VALUES
(1, 'Bidit', 'bidit@gmail.com', '$2a$10$iIL/aWcv.VexxKVhu7epAuK/pvYUtLUHsBi1oQbABUM1TYd44hcu6', '149173011', 1, 'Admin'),
(2, 'Mahesh', 'mahesh@gmail.com', '$2a$10$xM1PJHjsv7yE9uYkyhaJq./tIqEV9SZZh4p1qRnpnLIwH1y0zv.pS', '12313131', 1, 'Driver'),
(3, 'Himesh', 'himesh@gmail.com', '$2a$10$m.CEql280C1EgiljotQzSuJLz8A.MjsJeZDQXQf/B/ItbPHSXCV/S', '018-31013010', 1, 'Driver'),
(4, 'Devang', 'devang@gmail.com', '$2a$10$PWjFiiB8XaGCjpX1tnHEr.A/e2FM6/LVo2nPtoQQhoMM4Mre81MoS', '018-32013010', 1, 'Driver');

-- --------------------------------------------------------

--
-- Table structure for table `truck_driver`
--

CREATE TABLE `truck_driver` (
  `truck_driver_id` int(11) NOT NULL,
  `truck_company_id` int(11) DEFAULT NULL,
  `truck_id` int(11) DEFAULT NULL,
  `driver_id` int(11) DEFAULT NULL,
  `status` varchar(255) DEFAULT 'AVAILABLE'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `truck_driver`
--

INSERT INTO `truck_driver` (`truck_driver_id`, `truck_company_id`, `truck_id`, `driver_id`, `status`) VALUES
(1, 1, 3, 2, 'AVAILABLE'),
(2, 1, 4, 4, 'AVAILABLE'),
(3, 1, 1, 3, 'BUSY');

-- --------------------------------------------------------

--
-- Table structure for table `truck_type`
--

CREATE TABLE `truck_type` (
  `truck_type_id` int(11) NOT NULL,
  `type` varchar(255) DEFAULT NULL,
  `capacity` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `truck_type`
--

INSERT INTO `truck_type` (`truck_type_id`, `type`, `capacity`) VALUES
(1, 'Heavy Cargo', 2000),
(2, 'Medium Cargo', 1000),
(3, 'Light Cargo', 500);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `aggregate_company`
--
ALTER TABLE `aggregate_company`
  ADD PRIMARY KEY (`aggregate_company_id`);

--
-- Indexes for table `aggregate_user`
--
ALTER TABLE `aggregate_user`
  ADD PRIMARY KEY (`aggregate_user_id`),
  ADD KEY `aggregate_company_id` (`aggregate_company_id`);

--
-- Indexes for table `customer`
--
ALTER TABLE `customer`
  ADD PRIMARY KEY (`customer_id`);

--
-- Indexes for table `customer_site`
--
ALTER TABLE `customer_site`
  ADD PRIMARY KEY (`customer_site_id`),
  ADD KEY `customer_id` (`customer_id`);

--
-- Indexes for table `item`
--
ALTER TABLE `item`
  ADD PRIMARY KEY (`item_id`);

--
-- Indexes for table `job`
--
ALTER TABLE `job`
  ADD PRIMARY KEY (`job_id`),
  ADD KEY `customer_id` (`customer_id`),
  ADD KEY `aggregate_company_id` (`aggregate_company_id`),
  ADD KEY `dispatcher_id` (`dispatcher_id`),
  ADD KEY `customer_site_id` (`customer_site_id`),
  ADD KEY `item_id` (`item_id`);

--
-- Indexes for table `quarry`
--
ALTER TABLE `quarry`
  ADD PRIMARY KEY (`quarry_id`),
  ADD KEY `aggregate_company_id` (`aggregate_company_id`),
  ADD KEY `site_incharge_id` (`site_incharge_id`);

--
-- Indexes for table `shift`
--
ALTER TABLE `shift`
  ADD PRIMARY KEY (`shift_id`),
  ADD KEY `job_id` (`job_id`);

--
-- Indexes for table `sub_job`
--
ALTER TABLE `sub_job`
  ADD PRIMARY KEY (`sub_job_id`),
  ADD KEY `job_id` (`job_id`),
  ADD KEY `quarry_id` (`quarry_id`);

--
-- Indexes for table `sub_job_truck`
--
ALTER TABLE `sub_job_truck`
  ADD PRIMARY KEY (`sub_job_truck_id`),
  ADD KEY `driver_id` (`driver_id`),
  ADD KEY `truck_id` (`truck_id`),
  ADD KEY `sub_job_id` (`sub_job_id`);

--
-- Indexes for table `sub_job_truck_execution`
--
ALTER TABLE `sub_job_truck_execution`
  ADD PRIMARY KEY (`sub_job_truck_execution_id`),
  ADD KEY `sub_job_truck_id` (`sub_job_truck_id`);

--
-- Indexes for table `truck`
--
ALTER TABLE `truck`
  ADD PRIMARY KEY (`truck_id`),
  ADD KEY `truck_company_id` (`truck_company_id`),
  ADD KEY `truck_type_id` (`truck_type_id`);

--
-- Indexes for table `truck_company`
--
ALTER TABLE `truck_company`
  ADD PRIMARY KEY (`truck_company_id`);

--
-- Indexes for table `truck_company_user`
--
ALTER TABLE `truck_company_user`
  ADD PRIMARY KEY (`truck_company_user_id`),
  ADD KEY `truck_company_id` (`truck_company_id`);

--
-- Indexes for table `truck_driver`
--
ALTER TABLE `truck_driver`
  ADD PRIMARY KEY (`truck_driver_id`),
  ADD KEY `truck_company_id` (`truck_company_id`),
  ADD KEY `truck_id` (`truck_id`),
  ADD KEY `driver_id` (`driver_id`);

--
-- Indexes for table `truck_type`
--
ALTER TABLE `truck_type`
  ADD PRIMARY KEY (`truck_type_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `aggregate_company`
--
ALTER TABLE `aggregate_company`
  MODIFY `aggregate_company_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `aggregate_user`
--
ALTER TABLE `aggregate_user`
  MODIFY `aggregate_user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `customer`
--
ALTER TABLE `customer`
  MODIFY `customer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `customer_site`
--
ALTER TABLE `customer_site`
  MODIFY `customer_site_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `item`
--
ALTER TABLE `item`
  MODIFY `item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `job`
--
ALTER TABLE `job`
  MODIFY `job_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `quarry`
--
ALTER TABLE `quarry`
  MODIFY `quarry_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `shift`
--
ALTER TABLE `shift`
  MODIFY `shift_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `sub_job`
--
ALTER TABLE `sub_job`
  MODIFY `sub_job_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `sub_job_truck`
--
ALTER TABLE `sub_job_truck`
  MODIFY `sub_job_truck_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `sub_job_truck_execution`
--
ALTER TABLE `sub_job_truck_execution`
  MODIFY `sub_job_truck_execution_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `truck`
--
ALTER TABLE `truck`
  MODIFY `truck_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `truck_company`
--
ALTER TABLE `truck_company`
  MODIFY `truck_company_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `truck_company_user`
--
ALTER TABLE `truck_company_user`
  MODIFY `truck_company_user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `truck_driver`
--
ALTER TABLE `truck_driver`
  MODIFY `truck_driver_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `truck_type`
--
ALTER TABLE `truck_type`
  MODIFY `truck_type_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `aggregate_user`
--
ALTER TABLE `aggregate_user`
  ADD CONSTRAINT `aggregate_user_ibfk_1` FOREIGN KEY (`aggregate_company_id`) REFERENCES `aggregate_company` (`aggregate_company_id`);

--
-- Constraints for table `customer_site`
--
ALTER TABLE `customer_site`
  ADD CONSTRAINT `customer_site_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`customer_id`);

--
-- Constraints for table `job`
--
ALTER TABLE `job`
  ADD CONSTRAINT `job_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`customer_id`),
  ADD CONSTRAINT `job_ibfk_2` FOREIGN KEY (`aggregate_company_id`) REFERENCES `aggregate_company` (`aggregate_company_id`),
  ADD CONSTRAINT `job_ibfk_3` FOREIGN KEY (`dispatcher_id`) REFERENCES `aggregate_user` (`aggregate_user_id`),
  ADD CONSTRAINT `job_ibfk_4` FOREIGN KEY (`customer_site_id`) REFERENCES `customer_site` (`customer_site_id`),
  ADD CONSTRAINT `job_ibfk_5` FOREIGN KEY (`item_id`) REFERENCES `item` (`item_id`);

--
-- Constraints for table `quarry`
--
ALTER TABLE `quarry`
  ADD CONSTRAINT `quarry_ibfk_1` FOREIGN KEY (`aggregate_company_id`) REFERENCES `aggregate_company` (`aggregate_company_id`),
  ADD CONSTRAINT `quarry_ibfk_2` FOREIGN KEY (`site_incharge_id`) REFERENCES `aggregate_user` (`aggregate_user_id`);

--
-- Constraints for table `shift`
--
ALTER TABLE `shift`
  ADD CONSTRAINT `shift_ibfk_1` FOREIGN KEY (`job_id`) REFERENCES `job` (`job_id`);

--
-- Constraints for table `sub_job`
--
ALTER TABLE `sub_job`
  ADD CONSTRAINT `sub_job_ibfk_1` FOREIGN KEY (`job_id`) REFERENCES `job` (`job_id`),
  ADD CONSTRAINT `sub_job_ibfk_2` FOREIGN KEY (`quarry_id`) REFERENCES `quarry` (`quarry_id`);

--
-- Constraints for table `sub_job_truck`
--
ALTER TABLE `sub_job_truck`
  ADD CONSTRAINT `sub_job_truck_ibfk_1` FOREIGN KEY (`driver_id`) REFERENCES `truck_company_user` (`truck_company_user_id`),
  ADD CONSTRAINT `sub_job_truck_ibfk_2` FOREIGN KEY (`truck_id`) REFERENCES `truck` (`truck_id`),
  ADD CONSTRAINT `sub_job_truck_ibfk_3` FOREIGN KEY (`sub_job_id`) REFERENCES `sub_job` (`sub_job_id`);

--
-- Constraints for table `sub_job_truck_execution`
--
ALTER TABLE `sub_job_truck_execution`
  ADD CONSTRAINT `sub_job_truck_execution_ibfk_1` FOREIGN KEY (`sub_job_truck_id`) REFERENCES `sub_job_truck` (`sub_job_truck_id`);

--
-- Constraints for table `truck`
--
ALTER TABLE `truck`
  ADD CONSTRAINT `truck_ibfk_1` FOREIGN KEY (`truck_company_id`) REFERENCES `truck_company` (`truck_company_id`),
  ADD CONSTRAINT `truck_ibfk_2` FOREIGN KEY (`truck_type_id`) REFERENCES `truck_type` (`truck_type_id`);

--
-- Constraints for table `truck_company_user`
--
ALTER TABLE `truck_company_user`
  ADD CONSTRAINT `truck_company_user_ibfk_1` FOREIGN KEY (`truck_company_id`) REFERENCES `truck_company` (`truck_company_id`);

--
-- Constraints for table `truck_driver`
--
ALTER TABLE `truck_driver`
  ADD CONSTRAINT `truck_driver_ibfk_1` FOREIGN KEY (`truck_company_id`) REFERENCES `truck_company` (`truck_company_id`),
  ADD CONSTRAINT `truck_driver_ibfk_2` FOREIGN KEY (`truck_id`) REFERENCES `truck` (`truck_id`),
  ADD CONSTRAINT `truck_driver_ibfk_3` FOREIGN KEY (`driver_id`) REFERENCES `truck_company_user` (`truck_company_user_id`);
