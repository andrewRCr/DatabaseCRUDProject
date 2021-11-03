-- DATABASE CLI LOGIN:
-- mysql --host=x8autxobia7sgh74.cbetxkdyhwsb.us-east-1.rds.amazonaws.com --user=nt3gj8186ds60d3d --password=co67xuxa7wukbkv3 --reconnect wae9tszq9ltb6lbu
-- USE wae9tszq9ltb6lbu
-- source ./database/cs340_projectgroup10.sql;

-- dropping all tables at once to prevent FK conflicts
DROP TABLE IF EXISTS Yards, Kennels, Dogs, Employees, Dog_Employee_Relations;


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
CREATE TABLE `Kennels` (
  `kennel_id` int(11) NOT NULL UNIQUE AUTO_INCREMENT PRIMARY KEY,
  `size_limit` varchar(255) NOT NULL,
  `current_tenant` int(11) UNIQUE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

--
-- Setting default data for table `Kennels`
--

LOCK TABLES `Kennels` WRITE;
/*!40000 ALTER TABLE `Kennels` DISABLE KEYS */;
INSERT INTO `Kennels` (`kennel_id`, `size_limit`) VALUES (1, 1), (2, 2), (3, 3), (4, 3), (5, 1), (6, 3);
/*!40000 ALTER TABLE `Kennels` ENABLE KEYS */;
UNLOCK TABLES;
--
-- Table structure for table `Dogs`
--
CREATE TABLE `Dogs` (
  `dog_id` int(11) NOT NULL UNIQUE AUTO_INCREMENT PRIMARY KEY,
  `dog_name` varchar(255) NOT NULL,
  `dog_size` varchar(255) NOT NULL,
  `assigned_yard` int,
  `assigned_kennel` int UNIQUE,
  CONSTRAINT FK_YardsDogs FOREIGN KEY (`assigned_yard`) REFERENCES `Yards` (`yard_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT FK_KennelsDogs FOREIGN KEY (`assigned_kennel`) REFERENCES `Kennels` (`kennel_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

--
-- Setting default data for table `Dogs`
--

LOCK TABLES `Dogs` WRITE;
/*!40000 ALTER TABLE `Dogs` DISABLE KEYS */;
INSERT INTO `Dogs` VALUES (1, 'Sephi', 3, 1, 3),(2,'Kili', 2, 2, 2),(3,'Jana', 2, 2, 4),(4,'Bear', 1, 3, 1),(5,'Maya', 3, NULL, NULL),(6,'Nala',1,NULL,NULL),(7,'Skye',2,NULL,NULL),(8,'Alfred',3,NULL,NULL);
/*!40000 ALTER TABLE `Dogs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Add Foreign Key column to Kennels now that information is populated
--

ALTER TABLE `Kennels` ADD CONSTRAINT FK_DogsKennels FOREIGN KEY (`current_tenant`) REFERENCES `Dogs` (`dog_id`)
 ON DELETE SET NULL;
UPDATE `Kennels` SET `current_tenant` = 4 WHERE `kennel_id` = 1;
UPDATE `Kennels` SET `current_tenant` = 2 WHERE `kennel_id` = 2;
UPDATE `Kennels` SET `current_tenant` = 1 WHERE `kennel_id` = 3;
UPDATE `Kennels` SET `current_tenant` = 3 WHERE `kennel_id` = 4;

--
-- Table structure for table `Employees `
--

CREATE TABLE `Employees` (
  `emp_id` int(11) NOT NULL UNIQUE AUTO_INCREMENT PRIMARY KEY,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `phone_number` bigint(11) NOT NULL,
  `job_title` varchar(255) NOT NULL,
  `assigned_yard` int(11),
  CONSTRAINT FK_YardsEmployees FOREIGN KEY (`assigned_yard`) REFERENCES `Yards` (`yard_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

--
-- Setting data for table `Employees`
--

LOCK TABLES `Employees` WRITE;
/*!40000 ALTER TABLE `Employees` DISABLE KEYS */;
INSERT INTO `Employees` VALUES (1,'James', 'Howlett', 3333333333, 'YardLead', 3),
(2, 'Bruce', 'Wayne', 4444444444, 'YardLead', 2),
(3, 'Natasha', 'Romanov', 1111111111,'YardLead',1),
(4, 'Bruce','Banner',2222222222,'Groomer', NULL),
(5,'Tony', 'Stark',6666666666,'Reception',NULL),
(6,'Peter', 'Parker',5555555555,'Intern',NULL);
/*!40000 ALTER TABLE `Employees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Dogs_Employees_Relations`
--

CREATE TABLE `Dog_Employee_Relations` (
  `dog_id` int(11) NOT NULL,
  `emp_id` int(11) NOT NULL,
  `get_along` int(1),
  PRIMARY KEY (`dog_id`,`emp_id`),
  CONSTRAINT FK_DogsRelations FOREIGN KEY (`dog_id`) REFERENCES `Dogs` (`dog_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT FK_EmployeesRelations FOREIGN KEY (`emp_id`) REFERENCES `Employees` (`emp_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Setting data for table `Dogs_Employees_Relations`
--

LOCK TABLES `Dog_Employee_Relations` WRITE;
/*!40000 ALTER TABLE `Dog_Employee_Relations` DISABLE KEYS */;
INSERT INTO `Dog_Employee_Relations` VALUES (2,2,1),(2,1,0),(1,4,0),(1,3,1),(3,1,0),(3,6,1),(4,5,0),(4,6,0);
/*!40000 ALTER TABLE `Dog_Employee_Relations` ENABLE KEYS */;
UNLOCK TABLES;
