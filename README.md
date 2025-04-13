# Binance P2P Tracker

A web application that tracks and displays Binance P2P trading data, allowing users to monitor buy/sell prices and find arbitrage opportunities.

## Features

- Real-time P2P price tracking for Binance
- Support for multiple fiat currencies and cryptocurrencies
- Filter by payment methods
- Clean and responsive UI
- Auto-refresh functionality
- Arbitrage opportunity detection

## Prerequisites

- Python 3.6 or higher
- pip (Python package manager)
- Git

## Installation

1. Clone the repository:
```bash
git clone https://github.com/usefusefi/binance-p2p-tracker.git
cd binance-p2p-tracker
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

4. Create a `.env` file in the root directory with the following variables:
```
ENVIRONMENT=development
DEBUG=True
STATIC_FOLDER=static
TEMPLATE_FOLDER=.
CORS_ORIGINS=*
DEFAULT_TRADE_TYPE=BUY
DEFAULT_FIAT=USD
DEFAULT_CRYPTO=USDT
```

## Running the Application

1. Start the Flask development server:
```bash
python app.py
```

2. Open your browser and navigate to:
```
http://127.0.0.1:8080
```

## Deployment

The application is configured for deployment on Azure App Service. The deployment is automated through GitHub Actions.

### Azure Configuration

- The application runs on port 8080
- Uses Gunicorn as the WSGI server
- Static files are served from the `static` directory
- Environment variables are managed through Azure App Service configuration

## Project Structure

```
binance-p2p-tracker/
├── app.py              # Main Flask application
├── binance_scraper.py  # Binance P2P data scraper
├── static/             # Static files (CSS, JS)
│   ├── styles.css
│   └── script.js
├── index.html          # Main HTML template
├── requirements.txt    # Python dependencies
├── web.config          # Azure configuration
└── startup.sh          # Azure startup script for Gunicorn
```

The `startup.sh` script is used by Azure App Service to start the Gunicorn server with the correct configuration for production deployment.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Binance API for providing P2P trading data
- Flask for the web framework
- Azure for hosting infrastructure
