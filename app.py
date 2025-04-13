from flask import Flask, jsonify, request, send_file, send_from_directory, render_template
from flask_cors import CORS
import os
from dotenv import load_dotenv
from binance_scraper import BinanceScraper

# Load environment variables from .env file
load_dotenv()

# Set API URL based on environment
ENVIRONMENT = os.environ.get('ENVIRONMENT', 'development')
if ENVIRONMENT == 'production':
    API_BASE_URL = os.environ.get('PROD_API_URL', 'https://p2p-tracker.azurewebsites.net/api/p2p-data')
    DEBUG = False
else:
    API_BASE_URL = os.environ.get('DEV_API_URL', 'http://localhost:8080/api/p2p-data')
    DEBUG = os.environ.get('DEBUG', 'True').lower() == 'true'

# Get configuration from environment variables
STATIC_FOLDER = os.environ.get('STATIC_FOLDER', 'static')
TEMPLATE_FOLDER = os.environ.get('TEMPLATE_FOLDER', '.')
CORS_ORIGINS = os.environ.get('CORS_ORIGINS', '*')
DEFAULT_TRADE_TYPE = os.environ.get('DEFAULT_TRADE_TYPE', 'BUY')
DEFAULT_FIAT = os.environ.get('DEFAULT_FIAT', 'USD')
DEFAULT_CRYPTO = os.environ.get('DEFAULT_CRYPTO', 'USDT')

app = Flask(__name__, static_folder=STATIC_FOLDER, template_folder=TEMPLATE_FOLDER)
CORS(app, resources={r"/*": {"origins": CORS_ORIGINS}})

scraper = BinanceScraper()

@app.route('/')
def index():
    return render_template('index.html', api_url=API_BASE_URL)

@app.route('/api/p2p-data', methods=['GET'])
def get_p2p_data():
    print(f"API endpoint hit! Environment: {ENVIRONMENT}")
    # Get query parameters with defaults from environment
    trade_type = request.args.get('tradeType', DEFAULT_TRADE_TYPE)
    fiat = request.args.get('fiat', DEFAULT_FIAT)
    crypto = request.args.get('crypto', DEFAULT_CRYPTO)
    payment_method = request.args.get('paymentMethod', '')
    
    print(f"Received parameters: trade_type={trade_type}, fiat={fiat}, crypto={crypto}, payment_method={payment_method}")
    
    # Get data from scraper
    try:
        data = scraper.get_p2p_data(trade_type, fiat, crypto, payment_method)
        print(f"Data received from scraper: {data[:2] if data else 'No data'}")
        response = jsonify(data)
        response.headers.add('Access-Control-Allow-Origin', CORS_ORIGINS)
        return response
    except Exception as e:
        print(f"Error in scraper: {e}")
        response = jsonify({"error": str(e)})
        response.headers.add('Access-Control-Allow-Origin', CORS_ORIGINS)
        return response, 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "environment": ENVIRONMENT})

# Add Azure's required wsgi.py functionality
wsgi_app = app.wsgi_app

if __name__ == '__main__':
    try:
        host = os.environ.get('HOST', '0.0.0.0')
        port = int(os.environ.get('PORT', 8080))
        app.run(host=host, port=port, debug=DEBUG)
    except Exception as e:
        print(f"Error starting the server: {e}")
        raise
