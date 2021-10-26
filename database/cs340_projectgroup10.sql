DROP TABLE IF EXISTS `Yards`;
CREATE TABLE `Yards` (
  `yard_id` int(11) NOT NULL UNIQUE AUTO_INCREMENT PRIMARY KEY,
  `dog_limit` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
--
-- Setting default data for table `Yards`
--

LOCK TABLES `Yards` WRITE;
/*!40000 ALTER TABLE `Yards` DISABLE KEYS */;
INSERT INTO `Yards` VALUES (1, 5),(2, 8),(3,12);
/*!40000 ALTER TABLE `Yards` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Kennels`
--
DROP TABLE IF EXISTS `Kennels`;
CREATE TABLE `Kennels` (
  `kennel_id` int(11) NOT NULL UNIQUE AUTO_INCREMENT PRIMARY KEY,
  `size_limit` varchar(255) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

--
-- Setting default data for table `Kennels`
--

LOCK TABLES `Kennels` WRITE;
/*!40000 ALTER TABLE `Kennels` DISABLE KEYS */;
INSERT INTO `Kennels` VALUES (1, 1), (2, 2), (3, 3), (4, 3), (5, 1), (6, 3);
/*!40000 ALTER TABLE `Kennels` ENABLE KEYS */;
UNLOCK TABLES;
--
-- Table structure for table `Dogs`
--
DROP TABLE IF EXISTS `Dogs`;
CREATE TABLE `Dogs` (
  `dog_id` int(11) NOT NULL UNIQUE AUTO_INCREMENT PRIMARY KEY,
  `dog_name` varchar(255) NOT NULL,
  `dog_size` varchar(255) NOT NULL,
  `assigned_yard` varchar(255) NOT NULL,
  `assigned_kennel` varchar(255) NOT NULL,
  FOREIGN KEY (`assigned_yard`) REFERENCES `Yards` (`yard_id`),
  FOREIGN KEY (`assigned_kennel`) REFERENCES `Kennels` (`kennel_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

--
-- Setting default data for table `Dogs`
--

LOCK TABLES `Dogs` WRITE;
/*!40000 ALTER TABLE `Dogs` DISABLE KEYS */;
INSERT INTO `Dogs` VALUES (1, 'Sephi', 3, 1, 3),(2,'Kili', 2, 2, 2),(3,'Spot', 2, 2, 4),(4,'Rover', 1, 3, 1);
/*!40000 ALTER TABLE `Dogs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Add Foreign Key column to Kennels now that information is populated
--

ALTER TABLE Kennels ADD COLUMN current_tenant INT(11), ADD FOREIGN KEY (current_tenant) references Dogs(dog_id) ON DELETE SET NULL;
UPDATE `Kennels` SET `current_tenant` = 4 WHERE `kennel_id` = 1;
UPDATE `Kennels` SET `current_tenant` = 2 WHERE `kennel_id` = 2;
UPDATE `Kennels` SET `current_tenant` = 1 WHERE `kennel_id` = 3;
UPDATE `Kennels` SET `current_tenant` = 3 WHERE `kennel_id` = 4;

--
-- Table structure for table `Employees `
--

DROP TABLE IF EXISTS `Employees`;
CREATE TABLE `Employees` (
  `emp_id` int(11) NOT NULL UNIQUE AUTO_INCREMENT PRIMARY KEY,
  `last_name` varchar(255) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `phone_number` int(10) NOT NULL,
  `job_title` varchar(255) NOT NULL,
  `assigned_yard` int(11),
  FOREIGN KEY (`assigned_yard`) REFERENCES `Yards` (`yard_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

--
-- Setting data for table `Employees`
--

LOCK TABLES `Employees` WRITE;
/*!40000 ALTER TABLE `Employees` DISABLE KEYS */;
INSERT INTO `Employees` VALUES (1,'Howlett','James', 3333333333, 'Yard Lead', 3),(2,'Wayne','Bruce', 4444444444, 'Yard Lead', 2),(3,'Romanov','Natasha',1111111111,'Yard Lead',1),(4,'Banner','Bruce',2222222222,'Groomer', NULL),(5,'Stark','Tony',6666666666,'Reception',NULL),(6,'Parker','Peter',5555555555,'Intern',NULL);
/*!40000 ALTER TABLE `Employees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Dogs_Employees_Relations`
--

DROP TABLE IF EXISTS `Dogs_Employees_Relations`;
CREATE TABLE `Dogs_Employees_Relations` (
  `dog_id` int(11) NOT NULL,
  `emp_id` int(11) NOT NULL,
  `get_along` int(1),
  PRIMARY KEY (`dog_id`,`emp_id`),
  FOREIGN KEY (`dog_id`) REFERENCES `Dogs` (`dog_id`),
  FOREIGN KEY (`emp_id`) REFERENCES `bsg_people` (`emp_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Setting data for table `Dogs_Employees_Relations`
--

LOCK TABLES `Dogs_Employees_Relations` WRITE;
/*!40000 ALTER TABLE `Dogs_Employees_Relations` DISABLE KEYS */;
INSERT INTO `Dogs_Employees_Relations` VALUES (2,2,1),(2,1,0),(1,4,0),(1,3,1),(3,1,0),(3,6,1),(4,5,0),(4,6,0);
/*!40000 ALTER TABLE `Dogs_Employees_Relations` ENABLE KEYS */;
UNLOCK TABLES;
