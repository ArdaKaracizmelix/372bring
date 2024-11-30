from app.database import create_app
from app.routes import routes
from flask_cors import CORS  

# Uygulamayı oluşturun
app = create_app()
print("App created!")  

# CORS yapılandırması
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})  
print("CORS configured!") 

# Blueprint'i kaydedin
app.register_blueprint(routes)
print("Blueprint registered!")  
# Kayıtlı rotaları kontrol edin
for rule in app.url_map.iter_rules():
    print(f"Registered route: {rule} -> {rule.endpoint}")

# Uygulamayı çalıştırın
if __name__ == "__main__":
    app.run(debug=True)
