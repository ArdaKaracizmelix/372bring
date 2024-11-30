from flask import Flask, request, jsonify, Blueprint
from app.models import db, Restaurants, Menus, Promotions, Orders, Payments, DeliveryLocations, Drivers, Customers
from sqlalchemy.exc import SQLAlchemyError
from geoalchemy2.elements import WKBElement
from geoalchemy2.functions import ST_AsText, ST_SetSRID
from shapely.wkt import loads
from flask import Blueprint
from flask_cors import CORS


#app = Flask(__name__)
#routes = Blueprint('routes', __name__)
routes = Blueprint('routes', __name__)
#CORS(routes, resources={r"/customers": {"origins": "http://localhost:3000"}})
CORS(routes, resources={r"/*": {"origins": "http://localhost:3000"}})


# Initialize the database
#app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'  # Adjust to your database URI
#app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
#db.init_app(app)


# Add a new restaurant
@routes.route('/restaurants', methods=['POST'])
def add_restaurant():
    try:
        data = request.get_json()
        new_restaurant = Restaurants(
            restaurant_id=data['restaurant_id'],
            name=data['name'],
            address=data['address'],
            opening_hours=data['opening_hours'],
            contact_number=data['contact_number'],
            email=data['email'],
            delivery_area=data['delivery_area']
        )
        db.session.add(new_restaurant)
        db.session.commit()
        return jsonify({"message": "Restaurant added successfully"}), 201
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@routes.route('/customers/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    # Kullanıcıyı email ile bul
    user = Customers.query.filter_by(email=email).first()
    
    if user and user.password == password:
        print(f"Login successful for user: {user.email}")
        return jsonify({'message': 'Login successful', 'user_id': user.customer_id}), 200
    else:
        print("Login failed. Invalid email or password.")
        return jsonify({'message': 'Invalid email or password'}), 401

# Add a new customer
@routes.route('/customers/login', methods=['POST'])
def add_customerL():
    try:
        data = request.get_json()
        new_customer = Customers(
            customer_id=data['customer_id'],
            name=data['name'],
            email=data.get('email'),  # Optional
            phone=data.get('phone'),  # Optional
            address=data.get('address'),  # Optional
            #location=data['location'],  # Ensure this is in the correct format (e.g., POINT(x y))
            password=data['password']  # Password should ideally be hashed
        )
        db.session.add(new_customer)
        db.session.commit()
        return jsonify({"message": "Customer added successfully"}), 201
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# Get all customers
@routes.route('/customers/login', methods=['GET'])
def get_customersL():
    try:
        customers = Customers.query.all()
        return jsonify([{
            'customer_id': c.customer_id,
            'name': c.name,
            'email': c.email,
            'phone': c.phone,
            'address': c.address,
            # Convert location to a readable format (e.g., "POINT(lat lon)")
            #'location': {
            #    'longitude': loads(db.session.scalar(ST_AsText(ST_SetSRID(c.location, 4326)))).x,
            #    'latitude': loads(db.session.scalar(ST_AsText(ST_SetSRID(c.location, 4326)))).y
            #},
            'password': c.password
        } for c in customers]), 200
    except SQLAlchemyError as e:
        return jsonify({"error": str(e)}), 500





#SIGN UP BURAYA GELECE
@routes.route('/customers/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        print("Received data:", data)  

      
        if not data:
            return jsonify({'message': 'No data received'}), 400

        # Giriş verilerini al
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        phone = data.get('phone')
        address = data.get('address')
        location = data.get('location', 'POINT(0 0)')  

        print(f"Parsed data - Name: {name}, Email: {email}, Password: {password}, Phone: {phone}, Address: {address}, Location: {location}")

        if not all([name, email, password, phone, address]):
            return jsonify({'message': 'All fields are required'}), 400

     
        existing_customer = Customers.query.filter_by(email=email).first()
        if existing_customer:
            return jsonify({'message': 'Email is already in use'}), 409

     
        last_customer = Customers.query.order_by(Customers.customer_id.desc()).first()
        new_customer_id = last_customer.customer_id + 1 if last_customer else 1

    
        new_customer = Customers(
            customer_id=new_customer_id,
            name=name,
            email=email,
            password=password,
            phone=phone,
            address=address,
            location=location,  
        )
        db.session.add(new_customer)
        db.session.commit()

        print("Customer added successfully")
        return jsonify({'message': 'Account created successfully!', 'customer_id': new_customer_id}), 201

    except Exception as e:
        print("Error during signup:", str(e))  # Hata mesajını yazdırın
        return jsonify({'message': 'Error creating account.', 'error': str(e)}), 500
@routes.route('/customers/signup', methods=['POST'])
def add_customerS():
    try:
        data = request.get_json()
        new_customer = Customers(
            customer_id=data['customer_id'],
            name=data['name'],
            email=data.get('email'),  # Optional
            phone=data.get('phone'),  # Optional
            address=data.get('address'),  # Optional
            #location=data['location'],  # Ensure this is in the correct format (e.g., POINT(x y))
            password=data['password']  # Password should ideally be hashed
        )
        db.session.add(new_customer)
        db.session.commit()
        return jsonify({"message": "Customer added successfully"}), 201
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# Get all customers
@routes.route('/customers/signup', methods=['GET'])
def get_customersS():
    try:
        customers = Customers.query.all()
        return jsonify([{
            'customer_id': c.customer_id,
            'name': c.name,
            'email': c.email,
            'phone': c.phone,
            'address': c.address,
            # Convert location to a readable format (e.g., "POINT(lat lon)")
            #'location': {
            #    'longitude': loads(db.session.scalar(ST_AsText(ST_SetSRID(c.location, 4326)))).x,
            #    'latitude': loads(db.session.scalar(ST_AsText(ST_SetSRID(c.location, 4326)))).y
            #},
            'password': c.password
        } for c in customers]), 200
    except SQLAlchemyError as e:
        return jsonify({"error": str(e)}), 500



# Get all restaurants
@routes.route('/restaurants', methods=['GET'])
def get_restaurants():
    try:
        restaurants = Restaurants.query.all()
        return jsonify([{
            #'id': r.id,
            'restaurant_id': r.restaurant_id,
            'name': r.name,
            'address': r.address,
            'opening_hours': r.opening_hours,
            'contact_number': r.contact_number,
            #'email': r.email
        } for r in restaurants]), 200
    except SQLAlchemyError as e:
        return jsonify({"error": str(e)}), 500

# Get a specific restaurant by ID
@routes.route('/restaurants/<int:id>', methods=['GET'])
def get_restaurant(id):
    try:
        restaurant = Restaurants.query.get_or_404(id)
        return jsonify({
            #'id': restaurant.id,
            'restaurant_id': restaurant.restaurant_id,
            'name': restaurant.name,
            'address': restaurant.address,
            'opening_hours': restaurant.opening_hours,
            'contact_number': restaurant.contact_number,
            #'email': restaurant.email
        }), 200
    except SQLAlchemyError as e:
        return jsonify({"error": str(e)}), 500

# Add a new customer
@routes.route('/customers', methods=['POST'])
def add_customer():
    try:
        data = request.get_json()
        new_customer = Customers(
            customer_id=data['customer_id'],
            name=data['name'],
            email=data.get('email'),  # Optional
            phone=data.get('phone'),  # Optional
            address=data.get('address'),  # Optional
            #location=data['location'],  # Ensure this is in the correct format (e.g., POINT(x y))
            password=data['password']  # Password should ideally be hashed
        )
        db.session.add(new_customer)
        db.session.commit()
        return jsonify({"message": "Customer added successfully"}), 201
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# Get all customers
@routes.route('/customers', methods=['GET'])
def get_customers():
    try:
        customers = Customers.query.all()
        return jsonify([{
            'customer_id': c.customer_id,
            'name': c.name,
            'email': c.email,
            'phone': c.phone,
            'address': c.address,
            # Convert location to a readable format (e.g., "POINT(lat lon)")
            #'location': {
            #    'longitude': loads(db.session.scalar(ST_AsText(ST_SetSRID(c.location, 4326)))).x,
            #    'latitude': loads(db.session.scalar(ST_AsText(ST_SetSRID(c.location, 4326)))).y
            #},
            'password': c.password
        } for c in customers]), 200
    except SQLAlchemyError as e:
        return jsonify({"error": str(e)}), 500

# Get a specific customer by ID
# @routes.route('/customers/<int:id>', methods=['GET'])
# def get_customer(id):
#     try:
#         customer = Customers.query.get_or_404(id)
#         return jsonify({
#             #'id': customer.id,
#             'customer_id': customer.customer_id,
#             'name': customer.name,
#             'email': customer.email,
#             'phone': customer.phone,
#             'address': customer.address,
#             #'location': customer.location,  # Convert to a readable format if necessary
#             'password': customer.password  # Do not expose passwords in the response
#         }), 200
#     except SQLAlchemyError as e:
#         return jsonify({"error": str(e)}), 500


@routes.route('/customers/<int:customer_id>', methods=['GET'])
def get_customer(customer_id):
    try:
        customer = Customers.query.filter_by(customer_id=customer_id).first()
        if not customer:
            return jsonify({"message": "Customer not found"}), 404

        return jsonify({
            'customer_id': customer.customer_id,
            'name': customer.name,
            'email': customer.email,
            'phone': customer.phone,
            'address': customer.address,
            # Uncomment if location handling is required
            #'location': {
            #    'longitude': loads(db.session.scalar(ST_AsText(ST_SetSRID(customer.location, 4326)))).x,
            #    'latitude': loads(db.session.scalar(ST_AsText(ST_SetSRID(customer.location, 4326)))).y
            #},
        }), 200
    except SQLAlchemyError as e:
        return jsonify({"error": str(e)}), 500

# Add a new menu
@routes.route('/menus', methods=['POST'])
def add_menu():
    try:
        data = request.get_json()
        new_menu = Menus(
            restaurant_id=data['restaurant_id'],
            name=data['name'],
            contact=data['contact'],
            menu_data=data['menu_data']
        )
        db.session.add(new_menu)
        db.session.commit()
        return jsonify({"message": "Menu added successfully"}), 201
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# Get all menus for a specific restaurant
@routes.route('/restaurants/<int:restaurant_id>/menus', methods=['GET'])
def get_menus(restaurant_id):
    try:
        menus = Menus.query.filter_by(restaurant_id=restaurant_id).all()
        return jsonify([{
            'menu_id': m.menu_id,
            'name': m.name,
            'contact': m.contact,
            'menu_data': m.menu_data
        } for m in menus]), 200
    except SQLAlchemyError as e:
        return jsonify({"error": str(e)}), 500

# Add a new promotion
@routes.route('/promotions', methods=['POST'])
def add_promotion():
    try:
        data = request.get_json()
        new_promotion = Promotions(
            restaurant_id=data['restaurant_id'],
            promo_code=data['promo_code'],
            discount_value=data['discount_value'],
            description=data.get('description'),
            promotion_end_date=data.get('promotion_end_date'),
            applicable_restaurants=data.get('applicable_restaurants', [])
        )
        db.session.add(new_promotion)
        db.session.commit()
        return jsonify({"message": "Promotion added successfully"}), 201
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# Get all promotions for a specific restaurant
@routes.route('/restaurants/<int:restaurant_id>/promotions', methods=['GET'])
def get_promotions(restaurant_id):
    try:
        promotions = Promotions.query.filter_by(restaurant_id=restaurant_id).all()
        return jsonify([{
            'promotion_id': p.promotion_id,
            'promo_code': p.promo_code,
            'discount_value': p.discount_value,
            'description': p.description,
            'promotion_end_date': p.promotion_end_date,
            'applicable_restaurants': p.applicable_restaurants
        } for p in promotions]), 200
    except SQLAlchemyError as e:
        return jsonify({"error": str(e)}), 500

# Add a new order
@routes.route('/orders', methods=['POST'])
def add_order():
    try:
        data = request.get_json()
        new_order = Orders(
            restaurant_id=data['restaurant_id'],
            customer_id=data['customer_id'],
            order_details=data['order_details'],
            order_status=data['order_status'],
            menu_data=data['menu_data']
        )
        db.session.add(new_order)
        db.session.commit()
        return jsonify({"message": "Order added successfully"}), 201
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# Get all orders for a specific customer
@routes.route('/customers/<int:customer_id>/orders', methods=['GET'])
def get_orders(customer_id):
    try:
        orders = Orders.query.filter_by(customer_id=customer_id).all()
        return jsonify([{
            'order_id': o.order_id,
            'restaurant_id': o.restaurant_id,
            'order_details': o.order_details,
            'order_status': o.order_status,
            'timestamps': o.timestamps
        } for o in orders]), 200
    except SQLAlchemyError as e:
        return jsonify({"error": str(e)}), 500

# Add a new payment
@routes.route('/payments', methods=['POST'])
def add_payment():
    try:
        data = request.get_json()
        new_payment = Payments(
            amount=data['amount'],
            customer_id=data['customer_id'],
            order_id=data['order_id'],
            payment_method=data['payment_method'],
            payment_status=data['payment_status']
        )
        db.session.add(new_payment)
        db.session.commit()
        return jsonify({"message": "Payment added successfully"}), 201
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# Get payment history for a customer
@routes.route('/customers/<int:customer_id>/payments', methods=['GET'])
def get_payments(customer_id):
    try:
        payments = Payments.query.filter_by(customer_id=customer_id).all()
        return jsonify([{
            'id': p.id,
            'amount': p.amount,
            'order_id': p.order_id,
            'payment_method': p.payment_method,
            'payment_status': p.payment_status,
            'timestamp': p.timestamp
        } for p in payments]), 200
    except SQLAlchemyError as e:
        return jsonify({"error": str(e)}), 500

# Driver location and delivery status
@routes.route('/drivers/<int:driver_id>/locations', methods=['GET'])
def get_driver_location(driver_id):
    try:
        driver = Drivers.query.get_or_404(driver_id)
        return jsonify({
            'driver_id': driver.driver_id,
            'name': driver.name,
            'vehicle_number': driver.vehicle_number,
            'availability_status': driver.availability_status,
            'vehicle_details': driver.vehicle_details
        }), 200
    except SQLAlchemyError as e:
        return jsonify({"error": str(e)}), 500