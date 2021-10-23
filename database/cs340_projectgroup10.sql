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

ALTER TABLE Employees ADD COLUMN assigned_yard INT(11), ADD FOREIGN KEY (assigned_yard) references Yards(yard_id);

