import os
from flask_cors import CORS
from flask import Flask, request, jsonify, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from api.utils import APIException, generate_sitemap
from api.models import db
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
from flask_jwt_extended import JWTManager

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), '../public/')

app = Flask(__name__)

jwt = JWTManager(app)

# Enable CORS for specific frontend origin
CORS(app, resources={r"/api/*": {"origins": "https://literate-rotary-phone-5gv5xpv7q5grf7x95-3000.app.github.dev"}})
#CORS(app, origins=["https://literate-rotary-phone-5gv5xpv7q5grf7x95-3000.app.github.dev"])

app.url_map.strict_slashes = False

# Database configuration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace("postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# Add the admin interface
setup_admin(app)

# Add custom commands
setup_commands(app)

# Add all endpoints from the API with an "api" prefix
app.register_blueprint(api, url_prefix='/api')

# Handle/serialize errors as JSON
@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# Global error handler for 500 errors
@app.errorhandler(500)
def internal_error(error):
    response = jsonify({"error": "Internal server error"})
    response.status_code = 500
    # Add CORS headers to the response
    response.headers.add("Access-Control-Allow-Origin", "https://literate-rotary-phone-5gv5xpv7q5grf7x95-3000.app.github.dev")
    response.headers.add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization")
    return response

# Generate sitemap with all endpoints
@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# Serve static files for any other endpoint
@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # Avoid cache memory
    return response

# This only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
