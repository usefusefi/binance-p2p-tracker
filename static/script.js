// Constants and Configuration
const API_BASE_URL = window.API_BASE_URL || 'https://p2p-tracker.azurewebsites.net/api/p2p-data';

// DOM Elements
const tradeTypeButtons = document.querySelectorAll('.trade-type-btn');
const currencySelect = document.getElementById('currencySelect');
const cryptoSelect = document.getElementById('cryptoSelect');
const paymentMethodInput = document.getElementById('paymentMethodInput');
const refreshBtn = document.getElementById('refreshBtn');
const lastUpdated = document.getElementById('lastUpdated');
const dataTable = document.getElementById('dataTable');

// State Management
const currentFilters = {
    tradeType: 'BUY',
    fiat: 'USD',
    crypto: 'USDT',
    paymentMethod: ''
};

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    fetchData();
    setInterval(fetchData, 30000); // Refresh every 30 seconds
});

// Set up event listeners
function initEventListeners() {
    tradeTypeButtons.forEach(button => {
        button.addEventListener('click', () => {
            tradeTypeButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentFilters.tradeType = button.getAttribute('data-type');
            fetchData();
        });
    });

    currencySelect.addEventListener('change', (e) => {
        currentFilters.fiat = e.target.value;
        fetchData();
    });

    cryptoSelect.addEventListener('change', (e) => {
        currentFilters.crypto = e.target.value;
        fetchData();
    });

    let debounceTimeout;
    paymentMethodInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            currentFilters.paymentMethod = e.target.value;
            fetchData();
        }, 300);
    });

    refreshBtn.addEventListener('click', fetchData);
}

// Fetch data
async function fetchData() {
    try {
        const params = new URLSearchParams({
            tradeType: currentFilters.tradeType,
            fiat: currentFilters.fiat,
            asset: currentFilters.crypto,
            paymentMethod: currentFilters.paymentMethod
        });

        const response = await fetch(`${API_BASE_URL}?${params}`);
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        if (!data || !Array.isArray(data)) throw new Error('Invalid data format');

        updateTable(data);
        lastUpdated.textContent = new Date().toLocaleTimeString();
    } catch (error) {
        console.error('Error fetching data:', error);
        dataTable.innerHTML = '<tr><td colspan="4">Error loading data. Please try again.</td></tr>';
    }
}

// Update table with fetched data
function updateTable(data) {
    if (!data.length) {
        dataTable.innerHTML = '<tr><td colspan="4">No data available</td></tr>';
        return;
    }

    const tableContent = data.map(item => `
        <tr>
            <td>${item.merchant_name || 'N/A'}</td>
            <td>${item.price.toFixed(4)}</td>
            <td>${item.available_amount || 'N/A'}</td>
            <td>${item.payment_method || 'N/A'}</td>
        </tr>
    `).join('');

    dataTable.innerHTML = tableContent;
}

// Calculate and display arbitrage opportunities
function calculateArbitrage() {
    if (!buyData.length || !sellData.length) {
        showArbitrageMessage('Insufficient data for arbitrage calculation');
        return;
    }

    const opportunities = [];
    
    buyData.forEach(buy => {
        sellData.forEach(sell => {
            const buyPrice = parseFloat(buy.price);
            const sellPrice = parseFloat(sell.price);
            
            if (buyPrice < sellPrice) {
                const profit = ((sellPrice - buyPrice) / buyPrice) * 100;
                opportunities.push({
                    buyFrom: buy.advertiser,
                    buyPrice: buyPrice,
                    sellTo: sell.advertiser,
                    sellPrice: sellPrice,
                    profit: profit
                });
            }
        });
    });

    // Sort opportunities by profit percentage
    opportunities.sort((a, b) => b.profit - a.profit);

    // Update arbitrage table
    const tbody = arbitrageTable.querySelector('tbody');
    if (!tbody) return;

    if (opportunities.length === 0) {
        showArbitrageMessage('No profitable arbitrage opportunities found');
        return;
    }

    tbody.innerHTML = '';
    opportunities.forEach(opp => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${opp.buyFrom || '-'}</td>
            <td>${formatPrice(opp.buyPrice)}</td>
            <td>${opp.sellTo || '-'}</td>
            <td>${formatPrice(opp.sellPrice)}</td>
            <td>${formatPrice(opp.profit)}%</td>
        `;
        tbody.appendChild(row);
    });
}

// Show arbitrage message
function showArbitrageMessage(message) {
    const tbody = arbitrageTable.querySelector('tbody');
    if (!tbody) return;
    tbody.innerHTML = `<tr><td colspan="5" class="no-data">${message}</td></tr>`;
}

// Format price with 4 decimal places
function formatPrice(value) {
    if (value === null || value === undefined) {
        return '0.0000';
    }
    if (typeof value !== 'number') {
        value = Number(value);
    }
    if (isNaN(value)) {
        return '0.0000';
    }
    return value.toFixed(4);
}

// Show error message
function showError(message) {
    console.error('Error:', message);
    const activeTable = document.querySelector('.tab-content.active table tbody');
    if (activeTable) {
        activeTable.innerHTML = `<tr><td colspan="5" class="no-data">${message}</td></tr>`;
    }
}
