CREATE DATABASE OnlineFoodOrdering;

USE OnlineFoodOrdering;

CREATE TABLE Restaurants (
    restaurant_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    contact_number VARCHAR(20),
    rating DECIMAL(3, 2),
    opening_hours VARCHAR(50),
    delivery_area GEOMETRY NOT NULL
);

CREATE TABLE Menus (
    menu_id INT AUTO_INCREMENT PRIMARY KEY,
    restaurant_id INT NOT NULL,
    menu_data JSON NOT NULL,
    availability_status ENUM('Available', 'Not Available') DEFAULT 'Available',
    FOREIGN KEY (restaurant_id) REFERENCES Restaurants(restaurant_id)
);

CREATE TABLE Customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    location POINT NOT NULL,
    password VARCHAR(255) NOT NULL -- To store a hashed password
);

CREATE TABLE Orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    restaurant_id INT NOT NULL,
    order_details JSON NOT NULL,
    order_status ENUM('Preparing', 'On the Way', 'Delivered') DEFAULT 'Preparing',
    timestamps DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id),
    FOREIGN KEY (restaurant_id) REFERENCES Restaurants(restaurant_id)
);

CREATE TABLE Delivery_Locations (
    delivery_location_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    customer_location POINT NOT NULL,
    estimated_delivery_time DATETIME,
    FOREIGN KEY (order_id) REFERENCES Orders(order_id)
);

CREATE TABLE Drivers (
    driver_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    contact VARCHAR(20),
    current_location POINT,
    availability_status ENUM('Available', 'Unavailable') DEFAULT 'Available',
    vehicle_details TEXT
);

CREATE TABLE Payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    customer_id INT NOT NULL,
    amount DECIMAL(10, 2),
    payment_method ENUM('Credit Card', 'Cash') NOT NULL,
    payment_status ENUM('Paid', 'Pending', 'Failed') DEFAULT 'Pending',
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES Orders(order_id),
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
);

CREATE TABLE Promotions (
    promotion_id INT AUTO_INCREMENT PRIMARY KEY,
    promo_code VARCHAR(20) UNIQUE,
    description TEXT,
    discount_type ENUM('Percentage', 'Fixed Amount'),
    discount_value DECIMAL(10, 2),
    start_date DATE,
    end_date DATE,
    applicable_restaurants JSON,
    min_order_value DECIMAL(10, 2),
    usage_limit INT,
    current_usage INT DEFAULT 0
);
