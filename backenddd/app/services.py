from models import db, Restaurant, Promotion, Order, Payment, Menu, Driver, Customer, DeliveryLocation
from sqlalchemy.exc import SQLAlchemyError


# Create a new restaurant
def create_restaurant(name, address, contact_number, opening_hours):
    try:
        new_restaurant = Restaurant(
            name=name,
            address=address,
            contact_number=contact_number,
            opening_hours=opening_hours
        )
        db.session.add(new_restaurant)
        db.session.commit()
        return new_restaurant
    except SQLAlchemyError as e:
        db.session.rollback()
        return str(e)

# Get restaurant by ID
def get_restaurant_by_id(restaurant_id):
    try:
        restaurant = Restaurant.query.get(restaurant_id)
        if restaurant:
            return restaurant
        else:
            return None
    except SQLAlchemyError as e:
        return str(e)

# Create a new promotion
def create_promotion(promo_code, discount_value, start_date, end_date, applicable_restaurants, usage_limit, description):
    try:
        new_promotion = Promotion(
            promo_code=promo_code,
            discount_value=discount_value,
            start_date=start_date,
            end_date=end_date,
            applicable_restaurants=applicable_restaurants,
            usage_limit=usage_limit,
            description=description
        )
        db.session.add(new_promotion)
        db.session.commit()
        return new_promotion
    except SQLAlchemyError as e:
        db.session.rollback()
        return str(e)

# Get promotion by promo_code
def get_promotion_by_code(promo_code):
    try:
        promotion = Promotion.query.filter_by(promo_code=promo_code).first()
        return promotion
    except SQLAlchemyError as e:
        return str(e)


# Create a new order
def create_order(restaurant_id, customer_id, order_details, order_status, menu_data):
    try:
        new_order = Order(
            restaurant_id=restaurant_id,
            customer_id=customer_id,
            order_details=order_details,
            order_status=order_status,
            menu_data=menu_data
        )
        db.session.add(new_order)
        db.session.commit()
        return new_order
    except SQLAlchemyError as e:
        db.session.rollback()
        return str(e)

# Update order status
def update_order_status(order_id, new_status):
    try:
        order = Order.query.get(order_id)
        if order:
            order.order_status = new_status
            db.session.commit()
            return order
        else:
            return None
    except SQLAlchemyError as e:
        db.session.rollback()
        return str(e)

# Get all orders by customer ID
def get_orders_by_customer(customer_id):
    try:
        orders = Order.query.filter_by(customer_id=customer_id).all()
        return orders
    except SQLAlchemyError as e:
        return str(e)


# Create a new payment
def create_payment(order_id, amount, payment_method, customer_id):
    try:
        new_payment = Payment(
            order_id=order_id,
            amount=amount,
            payment_method=payment_method,
            customer_id=customer_id
        )
        db.session.add(new_payment)
        db.session.commit()
        return new_payment
    except SQLAlchemyError as e:
        db.session.rollback()
        return str(e)

# Get payment by order ID
def get_payment_by_order(order_id):
    try:
        payment = Payment.query.filter_by(order_id=order_id).first()
        return payment
    except SQLAlchemyError as e:
        return str(e)


# Update driver availability status
def update_driver_status(driver_id, status):
    try:
        driver = Driver.query.get(driver_id)
        if driver:
            driver.availability_status = status
            db.session.commit()
            return driver
        else:
            return None
    except SQLAlchemyError as e:
        db.session.rollback()
        return str(e)


# Create a new customer
def create_customer(name, address, email, phone):
    try:
        new_customer = Customer(
            name=name,
            address=address,
            email=email,
            phone=phone
        )
        db.session.add(new_customer)
        db.session.commit()
        return new_customer
    except SQLAlchemyError as e:
        db.session.rollback()
        return str(e)

# Get customer by ID
def get_customer_by_id(customer_id):
    try:
        customer = Customer.query.get(customer_id)
        return customer
    except SQLAlchemyError as e:
        return str(e)


# Create a new delivery location
def create_delivery_location(order_id, location, estimated_delivery_time):
    try:
        new_location = DeliveryLocation(
            order_id=order_id,
            delivery_location=location,
            estimated_delivery_time=estimated_delivery_time
        )
        db.session.add(new_location)
        db.session.commit()
        return new_location
    except SQLAlchemyError as e:
        db.session.rollback()
        return str(e)
