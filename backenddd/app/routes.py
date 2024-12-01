from flask import Flask, request, jsonify, Blueprint
from app.models import db, Restaurants, Menus, Promotions, Orders, Payments, DeliveryLocations, Drivers, Customers
from sqlalchemy.exc import SQLAlchemyError
from geoalchemy2.elements import WKBElement
from geoalchemy2.functions import ST_AsText, ST_SetSRID
from shapely.wkt import loads
from flask import Blueprint
from flask_cors import CORS

import json
from flask import jsonify


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
            'rating': r.rating
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
            'rating': restaurant.rating
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
           
            #'location': {
            #    'longitude': loads(db.session.scalar(ST_AsText(ST_SetSRID(customer.location, 4326)))).x,
            #    'latitude': loads(db.session.scalar(ST_AsText(ST_SetSRID(customer.location, 4326)))).y
            #},
        }), 200
    except SQLAlchemyError as e:
        return jsonify({"error": str(e)}), 500


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
    
# Get all promotions
@routes.route('/promotions', methods=['GET'])
def get_promotions():
    try:
        promotions = Promotions.query.all()
        return jsonify([{
            'promotion_id': p.promotion_id,
                'promo_code': p.promo_code,
                'discount_value': p.discount_value,
                'description': p.description,
                'start_date': p.start_date,
                'end_date': p.end_date,
                'applicable_restaurants': p.applicable_restaurants
        } for p in promotions]), 200
    except SQLAlchemyError as e:
        return jsonify({"error": str(e)}), 500

@routes.route('/restaurants/<int:restaurant_id>/promotions', methods=['GET'])
def get_restaurant_promotions(restaurant_id):
    try:
        print(f"Fetching promotions for restaurant_id: {restaurant_id}")  # Debug log

        promotions = (
            Promotions.query.filter(
                Promotions.applicable_restaurants.like(f'%, {restaurant_id}, %') |
                Promotions.applicable_restaurants.like(f'{restaurant_id}, %') |
                Promotions.applicable_restaurants.like(f'%, {restaurant_id}') |
                (Promotions.applicable_restaurants == str(restaurant_id))
            ).all()
        )
        print(f"Promotions fetched: {promotions}")  # Debug log

        if not promotions:
            return jsonify({"message": "No promotions found for this restaurant."}), 404

        return jsonify([
            {
                'promotion_id': p.promotion_id,
                'promo_code': p.promo_code,
                'discount_value': p.discount_value,
                'description': p.description,
                'start_date': p.start_date,
                'end_date': p.end_date,
                'applicable_restaurants': p.applicable_restaurants
            } for p in promotions
        ]), 200
    except SQLAlchemyError as e:
        return jsonify({"error": str(e)}), 500



@routes.route('/orders', methods=['POST'])
def add_order():
    try:
        if not request.is_json:  # Gelen isteğin JSON formatında olup olmadığını kontrol et
            return jsonify({"error": "Unsupported Media Type. Content-Type must be application/json"}), 415

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
    

@routes.route('/orders', methods=['GET'])
def get_last_orders():
    try:

        query = db.session.query(
            Orders.order_details,
            Orders.timestamps,
            Orders.order_status,
            Restaurants.name.label('restaurant_name')
        ).join(Restaurants, Orders.restaurant_id == Restaurants.restaurant_id)

        orders = query.all()
        results = []

        for order in orders:
            
            if isinstance(order.order_details, str):
                try:
                    order_details_list = json.loads(order.order_details) 
                except json.JSONDecodeError:
                    order_details_list = []  
            else:
                order_details_list = order.order_details if isinstance(order.order_details, list) else []

        
            for detail in order_details_list:
                results.append({
                    'order_details': detail.get('item', 'Unknown Item'),
                    'quantity': detail.get('quantity', 0),
                    'timestamp': order.timestamps.strftime('%Y-%m-%d %H:%M:%S'),
                    'order_status': order.order_status,
                    'restaurant_name': order.restaurant_name,
                })

        return jsonify(results), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@routes.route('/orders/<int:customer_id>', methods=['GET'])
def get_customer_orders(customer_id):
    try:
        query = db.session.query(
            Orders.order_details,
            Orders.timestamps,
            Orders.order_status,
            Restaurants.name.label('restaurant_name')
        ).join(Restaurants, Orders.restaurant_id == Restaurants.restaurant_id).filter(
            Orders.customer_id == customer_id
        )

        orders = query.all()
        results = []

        for order in orders:
            order_details_list = []
            if isinstance(order.order_details, str):
                try:
                    order_details_list = json.loads(order.order_details)
                except json.JSONDecodeError:
                    pass  # Eğer JSON ayrıştırılamıyorsa, `order_details_list` boş kalır
            elif isinstance(order.order_details, list):
                order_details_list = order.order_details

            for detail in order_details_list:
                results.append({
                    'order_details': detail.get('item', 'Unknown Item'),
                    'quantity': detail.get('quantity', 0),
                    'timestamp': order.timestamps.strftime('%Y-%m-%d %H:%M:%S'),
                    'order_status': order.order_status,
                    'restaurant_name': order.restaurant_name,
                })

        return jsonify(results), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500



@routes.route('/restaurants/<int:restaurant_id>/menus', methods=['GET'])
def get_menus_by_restaurant(restaurant_id):
    try:
     
        menus = Menus.query.filter_by(restaurant_id=restaurant_id).all()


        result = []

  
        for menu in menus:
      
            if isinstance(menu.menu_data, str):
                try:
                    menu_items = json.loads(menu.menu_data) 
                except json.JSONDecodeError:
                    menu_items = []  
            elif isinstance(menu.menu_data, list):
             
                menu_items = menu.menu_data
            else:
               
                menu_items = []

            for item in menu_items:
                result.append({
                    'menu_id': menu.menu_id,
                    'restaurant_id': menu.restaurant_id,
                    'availability_status': menu.availability_status,
                    'item_name': item.get('item_name', 'Unknown Item'),
                    'description': item.get('description', 'No Description'),
                    'price': item.get('price', 0.0),
                })

        # JSON formatında döndür
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
@routes.route('/drivers/available', methods=['GET'])
def get_available_drivers():
    try:
        # Veritabanında availability_status='Available' olan tüm sürücüleri al
        available_drivers = Drivers.query.filter_by(availability_status='Available').all()

        # Eğer uygun sürücü yoksa hata döndür
        if not available_drivers:
            return jsonify({"message": "No available drivers found."}), 404

        # Sürücülerin bilgilerini JSON formatında döndür
        return jsonify([
            {
                "driver_id": driver.driver_id,
                "name": driver.name,
                "contact": driver.contact,
                "current_location": str(driver.current_location),  # BLOB'dan stringe çevir
                "availability_status": driver.availability_status,
                "vehicle_details": driver.vehicle_details
            }
            for driver in available_drivers
        ]), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
from datetime import datetime
from flask import request, jsonify

@routes.route('/order-and-payment', methods=['POST'])
def add_order_and_payment():
    try:
        data = request.get_json()

        # Zorunlu alanları kontrol et
        required_fields = ["customer_id", "restaurant_id", "order_details", "payment"]
        for field in required_fields:
            if field not in data:
                raise ValueError(f"Missing required field: {field}")

        # Tip kontrolü
        try:
            customer_id = int(data["customer_id"])
            restaurant_id = int(data["restaurant_id"])
            order_details = data["order_details"]
            payment = data["payment"]
        except ValueError:
            raise ValueError("Invalid data type for numeric fields.")

        # Order details kontrolü
        if not isinstance(order_details, list) or not all(
            "item" in od and "quantity" in od for od in order_details
        ):
            raise ValueError("Invalid 'order_details' format. Must be a list of {item: ..., quantity: ...} objects.")

        # Payment kontrolü
        total_amount = float(payment.get("amount", 0))
        payment_method = payment.get("method")
        payment_status = payment.get("status", "Pending")

        if not payment_method or total_amount <= 0:
            raise ValueError("Invalid payment information. 'method' and positive 'amount' are required.")

        # Orders tablosuna yeni sipariş ekle
        new_order = Orders(
            customer_id=customer_id,
            restaurant_id=restaurant_id,
            order_details=json.dumps(order_details),
            order_status=data.get("order_status", "Preparing"),
            timestamps=datetime.now(),
        )
        db.session.add(new_order)
        db.session.commit()

        # Payments tablosuna yeni ödeme ekle
        new_payment = Payments(
            order_id=new_order.order_id,
            customer_id=customer_id,
            amount=total_amount,
            payment_method=payment_method,
            payment_status=payment_status,
            timestamp=datetime.now(),
        )
        db.session.add(new_payment)
        db.session.commit()

        return jsonify(
            {
                "message": "Order and payment added successfully",
                "order_id": new_order.order_id,
                "payment_id": new_payment.payment_id,
            }
        ), 201

    except ValueError as ve:
        db.session.rollback()
        return jsonify({"error": f"Validation Error: {str(ve)}"}), 400

    except Exception as e:
        db.session.rollback()
        print(f"Error in add_order_and_payment: {str(e)}")
        return jsonify({"error": "An error occurred while processing the request.", "details": str(e)}), 500

