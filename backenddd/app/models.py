from flask_sqlalchemy import SQLAlchemy
from geoalchemy2 import Geometry
import json
from app.database import db

#db = SQLAlchemy()

# Restaurants Table
class Restaurants(db.Model):
    __tablename__ = 'restaurants'

    restaurant_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    delivery_area = db.Column(Geometry('POLYGON'), nullable=False)
    address = db.Column(db.Text, nullable=False)
    #restaurant_id = db.Column(db.Integer, unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    opening_hours = db.Column(db.String(50), nullable=False)
    contact_number = db.Column(db.String(20), nullable=False)
    #email = db.Column(db.String(100), nullable=False)
    menus = db.relationship('Menus', backref='restaurant', lazy=True)
    promotions = db.relationship('Promotions', backref='restaurant', lazy=True)
    orders = db.relationship('Orders', backref='restaurant', lazy=True)

# Menus Table
class Menus(db.Model):
    __tablename__ = 'menus'

    menu_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    restaurant_id = db.Column(db.Integer, db.ForeignKey('restaurants.restaurant_id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    contact = db.Column(db.String(20), nullable=False)
    menu_data = db.Column(db.JSON, nullable=False)  # JSON data for menu items

# Promotions Table
class Promotions(db.Model):
    __tablename__ = 'promotions'

    promotion_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    restaurant_id = db.Column(db.Integer, db.ForeignKey('restaurants.restaurant_id'), nullable=False)
    usage_limit = db.Column(db.Integer, nullable=True)
    promo_code = db.Column(db.String(20), nullable=False)
    discount_value = db.Column(db.Numeric(10, 2), nullable=False)
    description = db.Column(db.Text, nullable=True)
    promotion_end_date = db.Column(db.Date, nullable=True)
    applicable_restaurants = db.Column(db.JSON, nullable=True)  # JSON array for applicable restaurants

# Payments Table
class Payments(db.Model):
    __tablename__ = 'payments'

    payment_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.customer_id'), nullable=False)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.order_id'), nullable=False)
    timestamp = db.Column(db.DateTime, default=db.func.current_timestamp(), nullable=False)
    payment_method = db.Column(db.Enum('Credit Card', 'Cash', name='payment_methods'), nullable=False)
    payment_status = db.Column(db.Enum('Paid', 'Pending', name='payment_status'), default='Pending', nullable=False)

# Orders Table
class Orders(db.Model):
    __tablename__ = 'orders'

    order_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    restaurant_id = db.Column(db.Integer, db.ForeignKey('restaurants.restaurant_id'), nullable=False)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.customer_id'), nullable=False)
    order_details = db.Column(db.JSON, nullable=False)  # JSON data for order items
    order_status = db.Column(db.Enum('Preparing', 'Pending', 'Completed', 'Cancelled', name='order_status'), nullable=False)
    timestamps = db.Column(db.DateTime, default=db.func.current_timestamp(), nullable=False)
    menu_data = db.Column(db.JSON, nullable=False)  # Menu items for the order
    availability_status = db.Column(db.Enum('Available', 'Unavailable', name='availability_status'), default='Available')

# Delivery Locations Table
class DeliveryLocations(db.Model):
    __tablename__ = 'delivery_locations'

    delivery_location_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.order_id'), nullable=False)
    driver_id = db.Column(db.Integer, db.ForeignKey('drivers.driver_id'), nullable=False)
    delivery_address = db.Column(db.String(200), nullable=False)
    location = db.Column(Geometry('POINT'), nullable=False)
    delivery_status = db.Column(db.Enum('In Progress', 'Delivered', 'Pending', name='delivery_status'), nullable=False)

# Drivers Table
class Drivers(db.Model):
    __tablename__ = 'drivers'

    driver_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    vehicle_number = db.Column(db.String(50), nullable=False)
    availability_status = db.Column(db.Enum('Available', 'Unavailable', name='availability_status'), default='Available')
    vehicle_details = db.Column(db.Text, nullable=True)
    delivery_locations = db.relationship('DeliveryLocations', backref='driver', lazy=True)

# Customers Table
class Customers(db.Model):
    __tablename__ = 'customers'

    customer_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    address = db.Column(db.String(200), nullable=False)
    location = db.Column(Geometry('POINT'), nullable=False)
    password = db.Column(db.String(255), nullable=False)
    orders = db.relationship('Orders', backref='customer', lazy=True)

