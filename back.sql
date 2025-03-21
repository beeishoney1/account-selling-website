-- MySQL dump 10.13  Distrib 8.0.39, for Win64 (x86_64)
--
-- Host: localhost    Database: account_selling
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `accounts`
--

DROP TABLE IF EXISTS `accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `accounts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `stock_id` int NOT NULL,
  `account_data` text NOT NULL,
  `is_sold` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('available','sold') DEFAULT 'available',
  PRIMARY KEY (`id`),
  KEY `stock_id` (`stock_id`),
  CONSTRAINT `accounts_ibfk_1` FOREIGN KEY (`stock_id`) REFERENCES `stocks` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounts`
--

LOCK TABLES `accounts` WRITE;
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
INSERT INTO `accounts` VALUES (13,1,'leopord',2,'2025-03-14 03:19:20','available'),(14,2,'yeituesre',2,'2025-03-14 03:23:15','available'),(15,1,'yetiuser',2,'2025-03-14 03:23:57','available'),(16,1,'yeti',2,'2025-03-14 03:24:10','available'),(17,1,'leopord',2,'2025-03-14 03:26:29','available'),(18,3,'kitsune',2,'2025-03-14 03:36:05','available'),(19,2,'yeti',2,'2025-03-14 04:24:11','available'),(20,1,'user',2,'2025-03-14 04:52:35','available'),(21,1,'accoun',2,'2025-03-14 07:40:40','available'),(22,3,'kitsune',2,'2025-03-14 15:32:34','available'),(23,1,'leopord',2,'2025-03-14 15:32:59','available'),(24,1,'leopord',2,'2025-03-14 15:33:03','available'),(25,2,'yeti',2,'2025-03-14 15:33:35','available'),(26,2,'yeti',2,'2025-03-14 15:33:38','available'),(27,2,'yeti',2,'2025-03-14 15:45:33','available'),(28,1,'leopord',2,'2025-03-14 16:35:42','available'),(29,1,'leoprd',2,'2025-03-14 16:41:10','available'),(30,1,'leopord',2,'2025-03-14 16:41:13','available'),(31,1,'leo 1',2,'2025-03-14 16:42:03','available'),(32,1,'leo 2',2,'2025-03-14 16:42:05','available'),(33,1,'leo3',2,'2025-03-14 16:44:49','available'),(34,1,'leo3',2,'2025-03-14 16:44:53','available'),(35,1,'leopord',2,'2025-03-14 17:22:20','available'),(36,1,'leopord',2,'2025-03-14 17:22:23','available'),(37,1,'leopord1',2,'2025-03-14 17:23:01','available'),(38,1,'leopord2',2,'2025-03-14 17:23:04','available'),(39,2,'yeti2',2,'2025-03-14 17:45:04','available'),(40,2,'yeti1',2,'2025-03-14 17:45:08','available'),(41,1,'leo1',2,'2025-03-14 17:50:00','available'),(42,1,'leo2',2,'2025-03-14 17:50:03','available'),(43,2,'yeti',1,'2025-03-14 21:00:22','available'),(44,1,'yeti',1,'2025-03-14 21:02:30','available'),(45,1,'leo1',1,'2025-03-14 21:02:48','available'),(46,1,'leo2',2,'2025-03-14 21:02:50','available'),(47,1,'leopord',1,'2025-03-15 12:54:39','available'),(48,1,'leopord',1,'2025-03-17 08:36:56','available');
/*!40000 ALTER TABLE `accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stocks`
--

DROP TABLE IF EXISTS `stocks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stocks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `price` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('available','sold') DEFAULT 'available',
  `buyer_id` int DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `image` varchar(255) NOT NULL DEFAULT 'default.jpg',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stocks`
--

LOCK TABLES `stocks` WRITE;
/*!40000 ALTER TABLE `stocks` DISABLE KEYS */;
INSERT INTO `stocks` VALUES (1,'Leopard',10,'2025-03-12 03:45:30','available',NULL,'/images/stock1.jpg','default.jpg'),(2,'Yeti',8,'2025-03-12 03:45:30','available',NULL,'/images/stock2.jpg','default.jpg'),(3,'Gas',12,'2025-03-12 03:45:30','available',NULL,'/images/stock4.jpg','default.jpg'),(4,'Dough',15,'2025-03-12 03:45:30','available',NULL,'/images/stock5.jpg','default.jpg'),(9,'GasOrKit',3,'2025-03-17 06:30:12','available',NULL,'/images/stock3.jpg','default.jpg');
/*!40000 ALTER TABLE `stocks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transactions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `stock_id` int NOT NULL,
  `account_id` int DEFAULT NULL,
  `price` int NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `amount` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `stock_id` (`stock_id`),
  KEY `account_id` (`account_id`),
  CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `transactions_ibfk_2` FOREIGN KEY (`stock_id`) REFERENCES `stocks` (`id`) ON DELETE CASCADE,
  CONSTRAINT `transactions_ibfk_3` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions`
--

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
INSERT INTO `transactions` VALUES (4,2,1,NULL,10,'2025-03-13 00:02:25',0.00),(12,2,1,13,10,'2025-03-14 11:26:09',0.00),(13,2,1,15,10,'2025-03-14 11:28:55',0.00),(14,2,1,16,10,'2025-03-14 14:23:39',0.00),(15,2,1,17,10,'2025-03-14 15:20:05',0.00),(16,1,2,19,8,'2025-03-14 15:24:29',0.00),(17,1,3,18,12,'2025-03-14 15:30:10',0.00),(18,2,3,22,12,'2025-03-14 22:02:44',0.00),(19,2,1,23,10,'2025-03-14 22:03:11',0.00),(20,2,2,25,8,'2025-03-14 22:03:52',0.00),(21,2,1,42,10,'2025-03-15 00:20:19',20.00),(22,2,1,41,10,'2025-03-15 00:20:19',20.00),(23,2,1,44,10,'2025-03-15 03:32:34',10.00),(24,2,1,46,10,'2025-03-15 03:33:02',20.00),(25,2,1,45,10,'2025-03-15 03:33:02',20.00),(26,2,1,47,10,'2025-03-15 19:24:53',10.00),(27,2,1,48,10,'2025-03-17 15:07:00',10.00);
/*!40000 ALTER TABLE `transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `coins` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `isAdmin` tinyint(1) DEFAULT '0',
  `token` text,
  `refresh_token` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'testuser','test@example.com','hello',7581,'2025-03-07 14:16:01',0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiaXNBZG1pbiI6MCwiaWF0IjoxNzQyMTg2ODI0LCJleHAiOjE3NDIyMzAwMjR9.2dZMAhaXiE6XX9BJT4xJHm3uBj6RXBwj88p6UVIcJFQ',NULL),(2,'beesama','kyawsuhein4379@gmail.com','beeishappy',766,'2025-03-08 04:35:22',1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJreWF3c3VoZWluNDM3OUBnbWFpbC5jb20iLCJpc0FkbWluIjoxLCJpYXQiOjE3NDIyOTM1MTIsImV4cCI6MTc0MjMzNjcxMn0.hokmfN9AsbYObCs9kHSfINjJj4-XpQAMLMYAwgIXbHc',NULL),(4,'admin','admin@example.com','adminpassword',100100,'2025-03-08 13:48:50',1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJhZG1pbkBleGFtcGxlLmNvbSIsImlzQWRtaW4iOjEsImlhdCI6MTc0MTg1Njg5NiwiZXhwIjoxNzQxOTAwMDk2fQ.nD4mYE-4eT1--iZCItPg6QCcMCuip2q2mFdI5b72w8Y',NULL),(6,'beesama2','beesama738@gmail.com','beeishappy',0,'2025-03-14 08:31:33',0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJiZWVzYW1hNzM4QGdtYWlsLmNvbSIsImlzQWRtaW4iOjAsImlhdCI6MTc0MTk0NDI3NiwiZXhwIjoxNzQxOTg3NDc2fQ.ySczcY_UKqDqb7MVWhbaUFLmXzvxCX22gUv5eatL23E',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-21 20:23:41
