-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema college_event_website
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema college_event_website
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `college_event_website` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `college_event_website` ;

-- -----------------------------------------------------
-- Table `college_event_website`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `college_event_website`.`users` (
  `user_id` BIGINT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(255) NOT NULL,
  `first_name` VARCHAR(255) NOT NULL,
  `last_name` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('ADMIN', 'SUPER_ADMIN', 'STUDENT') NOT NULL DEFAULT 'STUDENT',
  `college_id` BIGINT NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE INDEX `UK6dotkott2kjsp8vw4d0m25fb7` (`email` ASC) VISIBLE,
  UNIQUE INDEX `idx_users_email` (`email` ASC) VISIBLE,
  INDEX `idx_users_college_id` (`college_id` ASC) VISIBLE,
  CONSTRAINT `fk_users_college`
    FOREIGN KEY (`college_id`)
    REFERENCES `college_event_website`.`colleges` (`college_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 1
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `college_event_website`.`colleges`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `college_event_website`.`colleges` (
  `college_id` BIGINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `location` VARCHAR(45) NOT NULL,
  `description` MEDIUMTEXT NULL DEFAULT NULL,
  `created_by` BIGINT NOT NULL,
  PRIMARY KEY (`college_id`),
  INDEX `idx_colleges_created_by` (`created_by` ASC) VISIBLE,
  CONSTRAINT `fk_colleges_created_by`
    FOREIGN KEY (`created_by`)
    REFERENCES `college_event_website`.`users` (`user_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 1
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `college_event_website`.`locations`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `college_event_website`.`locations` (
  `location_id` BIGINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `latitude` DECIMAL(10,8) NOT NULL,
  `longitude` DECIMAL(11,8) NOT NULL,
  `address` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`location_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `college_event_website`.`events`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `college_event_website`.`events` (
  `event_id` BIGINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT NULL DEFAULT NULL,
  `time` TIME NOT NULL,
  `date` DATE NOT NULL,
  `location_id` BIGINT NOT NULL,
  `created_by` BIGINT NOT NULL,
  `college_id` BIGINT NOT NULL,
  `event_type` ENUM('PUBLIC', 'PRIVATE', 'RSO') NOT NULL,
  `contact_phone` VARCHAR(20) NULL DEFAULT NULL,
  `contact_email` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`event_id`),
  INDEX `idx_events_location_id` (`location_id` ASC) VISIBLE,
  INDEX `idx_events_created_by` (`created_by` ASC) VISIBLE,
  INDEX `idx_events_college_id` (`college_id` ASC) VISIBLE,
  INDEX `idx_events_date_time` (`date` ASC, `time` ASC) VISIBLE,
  CONSTRAINT `fk_events_college`
    FOREIGN KEY (`college_id`)
    REFERENCES `college_event_website`.`colleges` (`college_id`),
  CONSTRAINT `fk_events_created_by`
    FOREIGN KEY (`created_by`)
    REFERENCES `college_event_website`.`users` (`user_id`),
  CONSTRAINT `fk_events_location`
    FOREIGN KEY (`location_id`)
    REFERENCES `college_event_website`.`locations` (`location_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `college_event_website`.`comments`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `college_event_website`.`comments` (
  `comment_id` BIGINT NOT NULL AUTO_INCREMENT,
  `content` TEXT NOT NULL,
  `timestamp` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `event_id` BIGINT NOT NULL,
  `user_id` BIGINT NOT NULL,
  PRIMARY KEY (`comment_id`),
  INDEX `idx_comments_event_id` (`event_id` ASC) VISIBLE,
  INDEX `idx_comments_user_id` (`user_id` ASC) VISIBLE,
  CONSTRAINT `fk_comments_event`
    FOREIGN KEY (`event_id`)
    REFERENCES `college_event_website`.`events` (`event_id`),
  CONSTRAINT `fk_comments_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `college_event_website`.`users` (`user_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `college_event_website`.`private_events`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `college_event_website`.`private_events` (
  `event_id` BIGINT NOT NULL,
  `admin_id` BIGINT NOT NULL,
  PRIMARY KEY (`event_id`),
  INDEX `idx_private_events_admin` (`admin_id` ASC) VISIBLE,
  CONSTRAINT `fk_private_events_admin`
    FOREIGN KEY (`admin_id`)
    REFERENCES `college_event_website`.`users` (`user_id`),
  CONSTRAINT `fk_private_events_event`
    FOREIGN KEY (`event_id`)
    REFERENCES `college_event_website`.`events` (`event_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `college_event_website`.`public_events`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `college_event_website`.`public_events` (
  `event_id` BIGINT NOT NULL,
  `super_admin_id` BIGINT NOT NULL,
  `approved` TINYINT(1) NULL DEFAULT '0',
  PRIMARY KEY (`event_id`),
  INDEX `idx_public_events_super_admin` (`super_admin_id` ASC) VISIBLE,
  CONSTRAINT `fk_public_events_event`
    FOREIGN KEY (`event_id`)
    REFERENCES `college_event_website`.`events` (`event_id`),
  CONSTRAINT `fk_public_events_super_admin`
    FOREIGN KEY (`super_admin_id`)
    REFERENCES `college_event_website`.`users` (`user_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `college_event_website`.`ratings`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `college_event_website`.`ratings` (
  `user_id` BIGINT NOT NULL,
  `event_id` BIGINT NOT NULL,
  `rating_value` INT NOT NULL,
  PRIMARY KEY (`user_id`, `event_id`),
  INDEX `fk_ratings_event` (`event_id` ASC) VISIBLE,
  CONSTRAINT `fk_ratings_event`
    FOREIGN KEY (`event_id`)
    REFERENCES `college_event_website`.`events` (`event_id`),
  CONSTRAINT `fk_ratings_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `college_event_website`.`users` (`user_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `college_event_website`.`rsos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `college_event_website`.`rsos` (
  `rso_id` BIGINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT NULL DEFAULT NULL,
  `admin_id` BIGINT NOT NULL,
  `college_id` BIGINT NOT NULL,
  `status` ENUM('ACTIVE', 'INACTIVE') NULL DEFAULT 'ACTIVE',
  PRIMARY KEY (`rso_id`),
  UNIQUE INDEX `idx_rsos_name_college` (`name` ASC, `college_id` ASC) VISIBLE,
  INDEX `idx_rsos_admin_id` (`admin_id` ASC) VISIBLE,
  INDEX `idx_rsos_college_id` (`college_id` ASC) VISIBLE,
  CONSTRAINT `fk_rsos_admin`
    FOREIGN KEY (`admin_id`)
    REFERENCES `college_event_website`.`users` (`user_id`),
  CONSTRAINT `fk_rsos_college`
    FOREIGN KEY (`college_id`)
    REFERENCES `college_event_website`.`colleges` (`college_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `college_event_website`.`rso_events`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `college_event_website`.`rso_events` (
  `event_id` BIGINT NOT NULL,
  `rso_id` BIGINT NOT NULL,
  PRIMARY KEY (`event_id`),
  INDEX `idx_rso_events_rso` (`rso_id` ASC) VISIBLE,
  CONSTRAINT `fk_rso_events_event`
    FOREIGN KEY (`event_id`)
    REFERENCES `college_event_website`.`events` (`event_id`),
  CONSTRAINT `fk_rso_events_rso`
    FOREIGN KEY (`rso_id`)
    REFERENCES `college_event_website`.`rsos` (`rso_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `college_event_website`.`rso_memberships`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `college_event_website`.`rso_memberships` (
  `user_id` BIGINT NOT NULL,
  `rso_id` BIGINT NOT NULL,
  PRIMARY KEY (`user_id`, `rso_id`),
  INDEX `fk_rso_memberships_rso` (`rso_id` ASC) VISIBLE,
  CONSTRAINT `fk_rso_memberships_rso`
    FOREIGN KEY (`rso_id`)
    REFERENCES `college_event_website`.`rsos` (`rso_id`),
  CONSTRAINT `fk_rso_memberships_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `college_event_website`.`users` (`user_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
