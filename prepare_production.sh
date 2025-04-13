#!/bin/bash

# This script prepares the Binance P2P Scraper for production deployment

# Create a production directory
mkdir -p /home/ubuntu/binance-p2p-scraper-prod

# Copy frontend files
cp -r /home/ubuntu/binance-p2p-scraper/css /home/ubuntu/binance-p2p-scraper-prod/
cp -r /home/ubuntu/binance-p2p-scraper/js /home/ubuntu/binance-p2p-scraper-prod/
cp -r /home/ubuntu/binance-p2p-scraper/img /home/ubuntu/binance-p2p-scraper-prod/
cp /home/ubuntu/binance-p2p-scraper/index.html /home/ubuntu/binance-p2p-scraper-prod/

# Create backend directory
mkdir -p /home/ubuntu/binance-p2p-scraper-prod/backend

# Copy backend files
cp /home/ubuntu/binance-p2p-scraper/backend/app.py /home/ubuntu/binance-p2p-scraper-prod/backend/
cp /home/ubuntu/binance-p2p-scraper/backend/binance_scraper.py /home/ubuntu/binance-p2p-scraper-prod/backend/
cp /home/ubuntu/binance-p2p-scraper/backend/requirements.txt /home/ubuntu/binance-p2p-scraper-prod/backend/

# Create a production-ready server file
cat > /home/ubuntu/binance-p2p-scraper-prod/backend/server.py << 'EOF'
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import os
from binance_scraper import BinanceScraper

app = Flask(__name__, static_folder='../')
CORS(app)

scraper = BinanceScraper()

@app.route('/api/p2p-data', methods=['GET'])
def get_p2p_data():
    # Get query parameters
    trade_type = request.args.get('tradeType', 'BUY')
    fiat = request.args.get('fiat', 'USD')
    crypto = request.args.get('crypto', 'USDT')
    payment_method = request.args.get('paymentMethod', '')
    
    # Get data from scraper
    data = scraper.get_p2p_data(trade_type, fiat, crypto, payment_method)
    
    return jsonify(data)

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"})

# Serve static files
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path == "" or path == "/":
        return send_from_directory('../', 'index.html')
    try:
        return send_from_directory('../', path)
    except:
        return send_from_directory('../', 'index.html')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port)
EOF

# Create a production-ready start script
cat > /home/ubuntu/binance-p2p-scraper-prod/start.sh << 'EOF'
#!/bin/bash
cd /home/ubuntu/binance-p2p-scraper-prod/backend
python server.py
EOF

# Make the start script executable
chmod +x /home/ubuntu/binance-p2p-scraper-prod/start.sh

# Update the frontend API URL for production
sed -i 's|http://localhost:5000/api/p2p-data|/api/p2p-data|g' /home/ubuntu/binance-p2p-scraper-prod/js/script.js

echo "Production build prepared successfully!"
