-- (I'm putting this here as we go just for convenience - Andrew)

CREATE TABLE IF NOT EXISTS `Employees` (
  emp_id int(11) NOT NULL UNIQUE AUTO_INCREMENT PRIMARY KEY,
  last_name varchar(255) NOT NULL,
  first_name varchar(255) NOT NULL,
  phone_number int(10) NOT NULL,
  job_title varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `Yards` (
  yard_id int(11) NOT NULL UNIQUE AUTO_INCREMENT PRIMARY KEY,
  dog_limit int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- reference to yard_id can't be added as FK to Employees until Yards table is created
ALTER TABLE Employees ADD COLUMN assigned_yard INT(11), ADD FOREIGN KEY (assigned_yard) references Yards(yard_id);

CREATE TABLE IF NOT EXISTS `Dogs` (
  dog_id int(11) NOT NULL UNIQUE AUTO_INCREMENT PRIMARY KEY,
  dog_name varchar(255) NOT NULL,
  size int(1) NOT NULL,
  assigned_yard int(11) NOT NULL,
  assigned_kennel int(11) NOT NULL,
  FOREIGN KEY (`assigned_yard`) REFERENCES `Yards` (`yard_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `Kennels` (
  kennel_id int(11) NOT NULL UNIQUE AUTO_INCREMENT PRIMARY KEY,
  size_limit int(1) NOT NULL,
  current_tennant int(11),
  FOREIGN KEY (`current_tennant`) REFERENCES `Dogs` (`dog_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- reference to kennel_id can't be added to Dogs as FK until Kennels table is created
ALTER TABLE Dogs ADD FOREIGN KEY (assigned_kennel) references Kennels(kennel_id);

CREATE TABLE IF NOT EXISTS `Dog_Employee_Relations` (
  `dog_id` int(11),
  `emp_id` int(11),
  `get_along` int(1),
  PRIMARY KEY (`dog_id`, `emp_id`),
  FOREIGN KEY (`dog_id`) REFERENCES `Dogs` (`dog_id`),
  FOREIGN KEY (`emp_id`) REFERENCES `Employees` (`emp_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
