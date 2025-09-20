-- bank.sql
DROP DATABASE IF EXISTS Bank;
CREATE DATABASE Bank;
USE Bank;

-- Users: bankers and customers
CREATE TABLE Users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('customer','banker') NOT NULL DEFAULT 'customer',
  access_token VARCHAR(64) DEFAULT NULL,
  token_expiry DATETIME DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Accounts table logs deposits and withdrawals as transactions.
-- We'll store balance_after so it's easy for the frontend to show available balance.
CREATE TABLE Accounts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  type ENUM('deposit','withdraw') NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  balance_after DECIMAL(12,2) NOT NULL,
  note VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- Seed: one banker and two customers (passwords are plaintext here as hints; you'll hash them in backend)
-- Plain passwords: banker: Bank@123, cust1: Cust@123, cust2: Cust@123
INSERT INTO Users (name, email, password_hash, role)
VALUES
  ('Bank Manager','banker@bank.local','$2b$10$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA','banker'),
  ('Alice Customer','alice@example.com','$2b$10$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA','customer'),
  ('Bob Customer','bob@example.com','$2b$10$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA','customer');

-- Note: The inserted password_hash above is a placeholder. After you run node setup script (instructions below),
-- the actual bcrypt hashes will overwrite these (or you can update them manually using the seed script included).
