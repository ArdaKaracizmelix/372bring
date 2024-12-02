from flask import Flask
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:berkay1234_@localhost/onlinefoodordering'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)  # Initialize SQLAlchemy with the app

    with app.app_context():
        # Import models here to avoid circular import
        from app.models import Restaurants  # Adjust for your model names
        from app.models import Menus    
        db.create_all()

    return app