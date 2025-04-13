import requests
import json
import time
from bs4 import BeautifulSoup

class BinanceScraper:
    def __init__(self):
        self.base_url = "https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search"
        self.headers = {
            "Accept": "*/*",
            "Accept-Language": "en-US,en;q=0.9",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Content-Type": "application/json",
            "Origin": "https://p2p.binance.com",
            "Pragma": "no-cache",
            "Referer": "https://p2p.binance.com/",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
    
    def get_p2p_data(self, trade_type="BUY", fiat="USD", crypto="USDT", payment_method=""):
        """
        Fetch P2P trading data from Binance
        
        Args:
            trade_type (str): "BUY" or "SELL"
            fiat (str): Fiat currency code (e.g., "USD")
            crypto (str): Cryptocurrency code (e.g., "USDT", "BTC")
            payment_method (str): Payment method filter (can be wildcard)
            
        Returns:
            list: List of P2P trading data
        """
        try:
            data = self._fetch_data(trade_type, fiat, crypto)
            return self._filter_by_payment_method(data, payment_method)
        except Exception as e:
            print(f"Error fetching P2P data: {e}")
            # Return empty list in case of error
            return []
    
    def _fetch_data(self, trade_type, fiat, crypto):
        """
        Make the actual API request to Binance P2P
        """
        payload = {
            "fiat": fiat,
            "page": 1,
            "rows": 20,
            "tradeType": trade_type,
            "asset": crypto,
            "countries": [],
            "proMerchantAds": False,
            "publisherType": None,
            "payTypes": []
        }
        
        try:
            response = requests.post(
                self.base_url,
                headers=self.headers,
                json=payload
            )
            
            if response.status_code == 200:
                data = response.json()
                return self._parse_response(data)
            else:
                print(f"Error: Received status code {response.status_code}")
                return []
        except Exception as e:
            print(f"Request error: {e}")
            return []
    
    def _parse_response(self, response_data):
        """
        Parse the response from Binance API
        """
        result = []
        
        try:
            ads = response_data.get("data", [])
            
            for ad in ads:
                advertiser = ad.get("advertiser", {}).get("nickName", "Unknown")
                price = ad.get("adv", {}).get("price", "0")
                available = ad.get("adv", {}).get("surplusAmount", "0")
                min_limit = ad.get("adv", {}).get("minSingleTransAmount", "0")
                max_limit = ad.get("adv", {}).get("maxSingleTransAmount", "0")
                
                # Log the raw price data
                print(f"Raw price from API: {price}")
                
                # Get payment methods
                payment_methods = []
                for payment in ad.get("adv", {}).get("tradeMethods", []):
                    payment_methods.append(payment.get("tradeMethodName", "Unknown"))
                
                result.append({
                    "advertiser": advertiser,
                    "price": price,
                    "available": available,
                    "minLimit": min_limit,
                    "maxLimit": max_limit,
                    "paymentMethods": payment_methods
                })
            
            return result
        except Exception as e:
            print(f"Error parsing response: {e}")
            return []
    
    def _filter_by_payment_method(self, data, payment_method):
        """
        Filter data by payment method
        """
        if not payment_method:
            return data
        
        filtered_data = []
        search_term = payment_method.lower().strip()
        
        for item in data:
            # Check if any payment method contains the search term
            payment_methods = [method.lower() for method in item["paymentMethods"]]
            if any(search_term in method for method in payment_methods):
                filtered_data.append(item)
        
        return filtered_data


# For testing
if __name__ == "__main__":
    scraper = BinanceScraper()
    data = scraper.get_p2p_data("BUY", "USD", "USDT")
    print(json.dumps(data, indent=2))
