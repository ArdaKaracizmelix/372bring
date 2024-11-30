from app.database import create_app
from app.routes import routes
from flask_cors import CORS  # CORS kütüphanesini ekleyin

# Uygulamayı oluşturun
app = create_app()
print("App created!")  # Debug log

# CORS yapılandırması
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})  # CORS'u tüm rotalar için etkinleştirin
print("CORS configured!")  # Debug log

# Blueprint'i kaydedin
app.register_blueprint(routes)
print("Blueprint registered!")  # Debug log

# Kayıtlı rotaları kontrol edin
for rule in app.url_map.iter_rules():
    print(f"Registered route: {rule} -> {rule.endpoint}")

# Uygulamayı çalıştırın
if __name__ == "__main__":
    app.run(debug=True)
