# P2P Tracker

A real-time web application for tracking Binance P2P trading data. This application allows users to monitor buy and sell orders for various cryptocurrencies and fiat currencies, with customizable filters for payment methods.

## Features

- Real-time P2P trading data from Binance
- Support for multiple cryptocurrencies (USDT, USDC, BTC, ETH)
- Support for multiple fiat currencies (USD, CAD, MYR)
- Payment method filtering
- Auto-refresh every 30 seconds
- Clean and responsive UI
- Price display with 4 decimal precision

## Technology Stack

- Backend: Python with Flask
- Frontend: HTML, CSS, JavaScript
- API: Custom Binance P2P data scraper
- Deployment: Azure Web App

## Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- Web browser with JavaScript enabled

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/p2p-tracker.git
cd p2p-tracker
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
# On Windows
venv\Scripts\activate
# On Unix or MacOS
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

## Configuration

The application can be configured using environment variables:

- `PORT`: The port number for the Flask server (default: 8080)
- `API_BASE_URL`: The base URL for the P2P data API (default: https://p2p-tracker.azurewebsites.net/api/p2p-data)

## Running the Application

1. Start the Flask server:
```bash
python app.py
```

2. Open your web browser and navigate to:
```
http://localhost:8080
```

## API Endpoints

### GET /api/p2p-data

Fetches P2P trading data with the following query parameters:

- `tradeType`: 'BUY' or 'SELL' (default: 'BUY')
- `fiat`: Fiat currency code (default: 'USD')
- `crypto`: Cryptocurrency code (default: 'USDT')
- `paymentMethod`: Payment method filter (optional)

Example:
```
GET /api/p2p-data?tradeType=BUY&fiat=USD&crypto=USDT&paymentMethod=Bank
```

### GET /api/health

Health check endpoint that returns the server status.

## Project Structure

```
p2p-tracker/
├── app.py              # Flask application
├── binance_scraper.py  # Binance P2P data scraper
├── requirements.txt    # Python dependencies
├── static/            # Static files
│   ├── styles.css     # CSS styles
│   └── script.js      # Frontend JavaScript
└── index.html         # Main HTML template
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Binance P2P Trading Platform
- Flask Framework
- Azure Web Services
