from flask import Flask, jsonify, request, send_file, send_from_directory
from flask_cors import CORS
import os
from binance_scraper import BinanceScraper

app = Flask(__name__, static_folder='static')
CORS(app, resources={r"/*": {"origins": "*"}})

scraper = BinanceScraper()

@app.route('/')
def index():
    return send_file('index.html')

@app.route('/api/p2p-data', methods=['GET'])
def get_p2p_data():
    print("API endpoint hit!")
    # Get query parameters
    trade_type = request.args.get('tradeType', 'BUY')
    fiat = request.args.get('fiat', 'USD')
    crypto = request.args.get('crypto', 'USDT')
    payment_method = request.args.get('paymentMethod', '')
    
    print(f"Received parameters: trade_type={trade_type}, fiat={fiat}, crypto={crypto}, payment_method={payment_method}")
    
    # Get data from scraper
    try:
        data = scraper.get_p2p_data(trade_type, fiat, crypto, payment_method)
        print(f"Data received from scraper: {data[:2] if data else 'No data'}")
        response = jsonify(data)
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
    except Exception as e:
        print(f"Error in scraper: {e}")
        response = jsonify({"error": str(e)})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"})

if __name__ == '__main__':
    try:
        port = 8080
        print(f"Starting server on port {port}...")
        app.run(host='127.0.0.1', port=port, debug=True)
    except Exception as e:
        print(f"Error starting the server: {e}")
        raise
