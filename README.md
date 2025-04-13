# Binance P2P Tracker

A web application for tracking Binance P2P trading data, including buy/sell orders and arbitrage opportunities.

## Features

- Real-time P2P price tracking
- Buy/Sell order comparison
- Arbitrage opportunity detection
- Multiple currency support (USD, CAD, MYR)
- Multiple cryptocurrency support (USDT, USDC, BTC, ETH)
- Payment method filtering
- Responsive design

## Setup Instructions

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/yourusername/binance-p2p-tracker.git
cd binance-p2p-tracker
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
# On Windows
venv\Scripts\activate
# On macOS/Linux
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file in the root directory with the following content:
```env
# Environment
ENVIRONMENT=development

# Server Configuration
PORT=8080
HOST=127.0.0.1
DEBUG=True
FLASK_ENV=development

# API Configuration
DEV_API_URL=http://127.0.0.1:8080/api/p2p-data
PROD_API_URL=https://your-azure-app.azurewebsites.net/api/p2p-data
API_BASE_URL=${DEV_API_URL}

# Default Values
DEFAULT_TRADE_TYPE=BUY
DEFAULT_FIAT=USD
DEFAULT_CRYPTO=USDT

# CORS Configuration
CORS_ORIGINS=*

# Static Files
STATIC_FOLDER=static
TEMPLATE_FOLDER=.
```

5. Run the application:
```bash
python app.py
```

The application will be available at `http://127.0.0.1:8080`

### Azure Deployment

1. Create an Azure App Service
2. Configure the following Application Settings in Azure Portal:
   - Go to your App Service > Configuration > Application settings
   - Add the following settings:
     ```
     ENVIRONMENT=production
     PORT=8080
     HOST=0.0.0.0
     DEBUG=False
     FLASK_ENV=production
     API_BASE_URL=https://your-azure-app.azurewebsites.net/api/p2p-data
     DEFAULT_TRADE_TYPE=BUY
     DEFAULT_FIAT=USD
     DEFAULT_CRYPTO=USDT
     CORS_ORIGINS=*
     STATIC_FOLDER=static
     TEMPLATE_FOLDER=.
     ```

3. Deploy your application to Azure App Service

## Environment Variables Explanation

- `ENVIRONMENT`: Set to 'development' for local development or 'production' for Azure
- `PORT`: The port number the application will run on
- `HOST`: The host address (use 127.0.0.1 for local, 0.0.0.0 for Azure)
- `DEBUG`: Enable/disable debug mode
- `FLASK_ENV`: Flask environment setting
- `API_BASE_URL`: The base URL for API endpoints
- `DEFAULT_TRADE_TYPE`: Default trade type (BUY/SELL)
- `DEFAULT_FIAT`: Default fiat currency
- `DEFAULT_CRYPTO`: Default cryptocurrency
- `CORS_ORIGINS`: CORS allowed origins
- `STATIC_FOLDER`: Folder containing static files
- `TEMPLATE_FOLDER`: Folder containing HTML templates

## Security Note

Never commit your `.env` file to version control. The `.env` file is included in `.gitignore` for security reasons. Instead:
1. Keep your local `.env` file secure
2. Use Azure Application Settings for production deployment
3. Share necessary configuration through `.env.example` (without sensitive values)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Binance P2P Trading Platform
- Flask Framework
- Azure Web Services
