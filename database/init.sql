-- Create your database schema here
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS qr_codes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    qr_data TEXT NOT NULL,
    dot_style VARCHAR(20) DEFAULT 'square',
    fill_color VARCHAR(20) DEFAULT 'black',
    back_color VARCHAR(20) DEFAULT 'white',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

ALTER TABLE qr_codes ADD COLUMN qr_image TEXT;

-- Add eye_style column to qr_codes table
ALTER TABLE qr_codes ADD COLUMN eye_style VARCHAR(20) DEFAULT 'square';

-- Remove or update the initial insert since we need a proper password hash
-- It's better to create users through the application interface