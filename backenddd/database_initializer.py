import pymysql
import random
from faker import Faker
from datetime import date, timedelta
import json

# Establish a connection to the MySQL database
connection = pymysql.connect(
    host="localhost",          # Assuming MySQL is hosted locally
    user="root",               # User shown in your connection
    password="arda",               # Replace with the actual password (if empty, keep it as "")
    database="onlinefoodordering"     # Database name from your connection
)
cursor = connection.cursor()
faker = Faker()

# Function to print the entries from each table
def print_entries(table_name):
    cursor.execute(f"SELECT * FROM {table_name}")
    rows = cursor.fetchall()
    for row in rows:
        print(row)

# Populate Restaurants
def populate_restaurants():
    for _ in range(50):  # Add 50 restaurants
        name = faker.company()
        address = faker.address().replace("\n", ", ")
        contact_number = faker.phone_number()
        contact_number = contact_number[:20] 
        rating = round(random.uniform(3.0, 5.0), 1)
        opening_hours = "10:00-22:00"
        delivery_area = "POLYGON((0 0, 10 0, 10 10, 0 10, 0 0))"  # Simple polygon for all
        cursor.execute(
            """
            INSERT INTO Restaurants (name, address, contact_number, rating, opening_hours, delivery_area)
            VALUES (%s, %s, %s, %s, %s, ST_GeomFromText(%s))
            """,
            (name, address, contact_number, rating, opening_hours, delivery_area)
        )
    connection.commit()
    print_entries("Restaurants")

# Populate Menus
def populate_menus():
    for restaurant_id in range(1, 51):  # Assuming restaurant IDs start at 1
        menu_items = []
        for _ in range(random.randint(5, 15)):  # 5-15 menu items per restaurant
            item_name = faker.word().capitalize() + " Dish"
            description = faker.sentence()
            price = round(random.uniform(5.0, 30.0), 2)
            menu_items.append({"item_name": item_name, "description": description, "price": price})
        menu_data = str(menu_items).replace("'", '"')  # Convert to JSON string
        availability_status = random.choice(["Available", "Not Available"])
        cursor.execute(
            """
            INSERT INTO Menus (restaurant_id, menu_data, availability_status)
            VALUES (%s, %s, %s)
            """,
            (restaurant_id, menu_data, availability_status)
        )
    connection.commit()
    print_entries("Menus")

# Populate Customers
def populate_customers():
    for _ in range(101):  # Add 100 customers
        name = faker.name()
        email = faker.email()
        phone = faker.phone_number()
        phone = phone[:20]
        address = faker.address().replace("\n", ", ")
        location = f"POINT({random.uniform(0, 10)} {random.uniform(0, 10)})"
        password = faker.password()

        cursor.execute(
            """
            INSERT INTO Customers (name, email, phone, address, location, password)
            VALUES (%s, %s, %s, %s, ST_GeomFromText(%s), %s)
            """,
            (name, email, phone, address, location, password)  # Insert password
        )
    
    connection.commit()
    print_entries("Customers")

# Populate Orders
def populate_orders():
    for _ in range(200):  # Add 200 orders
        customer_id = random.randint(1, 100)
        restaurant_id = random.randint(1, 50)
        order_details = [{"item": faker.word(), "quantity": random.randint(1, 5)}]
        order_details_json = str(order_details).replace("'", '"')  # Convert to JSON
        order_status = random.choice(["Preparing", "On the Way", "Delivered"])
        timestamp = faker.date_time_this_year()
        cursor.execute(
            """
            INSERT INTO Orders (customer_id, restaurant_id, order_details, order_status, timestamps)
            VALUES (%s, %s, %s, %s, %s)
            """,
            (customer_id, restaurant_id, order_details_json, order_status, timestamp)
        )
    connection.commit()
    print_entries("Orders")

# Populate Delivery Locations
def populate_delivery_locations():
    for order_id in range(1, 201):  # Assuming order IDs start at 1
        customer_location = f"POINT({random.uniform(0, 10)} {random.uniform(0, 10)})"
        estimated_delivery_time = faker.date_time_this_year()
        cursor.execute(
            """
            INSERT INTO Delivery_Locations (order_id, customer_location, estimated_delivery_time)
            VALUES (%s, ST_GeomFromText(%s), %s)
            """,
            (order_id, customer_location, estimated_delivery_time)
        )
    connection.commit()
    print_entries("Delivery_Locations")

# Populate Drivers
def populate_drivers():
    for _ in range(30):  # Add 30 drivers
        name = faker.name()
        contact = faker.phone_number()
        contact = contact[:20]
        current_location = f"POINT({random.uniform(0, 10)} {random.uniform(0, 10)})"
        availability_status = random.choice(["Available", "Unavailable"])
        vehicle_details = f"{random.choice(['Car', 'Bike', 'Scooter'])} - {faker.license_plate()}"
        cursor.execute(
            """
            INSERT INTO Drivers (name, contact, current_location, availability_status, vehicle_details)
            VALUES (%s, %s, ST_GeomFromText(%s), %s, %s)
            """,
            (name, contact, current_location, availability_status, vehicle_details)
        )
    connection.commit()
    print_entries("Drivers")

# Populate Payments
def populate_payments():
    for order_id in range(1, 201):  # Assuming 1 payment per order
        customer_id = random.randint(1, 100)
        amount = round(random.uniform(20.0, 150.0), 2)
        payment_method = random.choice(["Credit Card", "Cash"])
        payment_status = random.choice(["Paid", "Pending", "Failed"])
        timestamp = faker.date_time_this_year()
        cursor.execute(
            """
            INSERT INTO Payments (order_id, customer_id, amount, payment_method, payment_status, timestamp)
            VALUES (%s, %s, %s, %s, %s, %s)
            """,
            (order_id, customer_id, amount, payment_method, payment_status, timestamp)
        )
    connection.commit()
    print_entries("Payments")

# Populate Promotions
def populate_promotions():
    for _ in range(20):  # Add 20 promotions
        promo_code = faker.word().upper() + str(random.randint(10, 99))  # Random promo code (length should not exceed 20 chars)
        description = faker.sentence()  # Random description
        discount_type = random.choice(["Percentage", "Fixed Amount"])  # Random discount type
        discount_value = round(random.uniform(5.0, 50.0), 2)  # Discount value (range 5 to 50 for Percentage or Fixed Amount)
        start_date = date.today()  # Start from today's date
        end_date = start_date + timedelta(days=30)  # 30 days from `start_date`
        
        # Generate a list of restaurant IDs (random integers between 1 and 50), and store as JSON
        applicable_restaurants = json.dumps([random.randint(1, 50) for _ in range(5)])  # List of 5 restaurant IDs as JSON
        
        min_order_value = round(random.uniform(20.0, 100.0), 2)  # Min order value (between 20 and 100)
        usage_limit = random.randint(10, 100)  # Usage limit (between 10 and 100)
        current_usage = random.randint(0, usage_limit)  # Random current usage (between 0 and usage_limit)
        
        # Insert the promotion data into the database
        cursor.execute(
            """
            INSERT INTO Promotions (promo_code, description, discount_type, discount_value, start_date, end_date, applicable_restaurants, min_order_value, usage_limit, current_usage)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """,
            (promo_code, description, discount_type, discount_value, start_date, end_date, applicable_restaurants, min_order_value, usage_limit, current_usage)
        )
    connection.commit()
    print_entries("Promotions")

# Execute All
populate_restaurants()
populate_menus()
populate_customers()
populate_orders()
populate_delivery_locations()
populate_drivers()
populate_payments()
populate_promotions()

connection.close()
