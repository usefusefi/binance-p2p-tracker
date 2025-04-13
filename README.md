# Binance P2P Price Tracker

A web application that tracks Binance P2P prices and finds arbitrage opportunities. Built with Flask and vanilla JavaScript.

## Features

- Real-time P2P price tracking for Buy and Sell orders
- Automatic arbitrage opportunity detection
- Support for multiple currencies (USD, CAD, MYR)
- Support for multiple cryptocurrencies (USDT, USDC, BTC, ETH)
- Payment method filtering
- Clean and responsive UI

## Tech Stack

- Backend: Python/Flask
- Frontend: HTML, CSS, JavaScript (Vanilla)
- API: Binance P2P API

## Setup

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/binance-p2p-tracker.git
cd binance-p2p-tracker
```

2. Create and activate a virtual environment:
```bash
# Windows
python -m venv venv
.\venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the application:
```bash
python app.py
```

5. Open your browser and navigate to:
```
http://localhost:8080
```

## Usage

- Select your preferred currency and cryptocurrency from the dropdown menus
- Use the tabs to switch between Buy Orders, Sell Orders, and Arbitrage views
- Filter payment methods using the search box
- Click the refresh button to fetch latest data
- The arbitrage tab automatically calculates and displays profitable opportunities

## Screenshots

[Add screenshots here]

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
