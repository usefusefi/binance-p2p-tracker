// Constants and Configuration
const API_BASE_URL = 'http://localhost:8080/api/p2p-data';

// DOM Elements
const currencySelect = document.getElementById('currency');
const cryptoSelect = document.getElementById('crypto');
const paymentInput = document.getElementById('payment');
const refreshBtn = document.getElementById('refreshBtn');
const lastUpdatedSpan = document.getElementById('lastUpdated');
const tabs = document.querySelectorAll('.tab');
const buyTable = document.getElementById('buyTable');
const sellTable = document.getElementById('sellTable');
const arbitrageTable = document.getElementById('arbitrageTable');

// State Management
const currentFilters = {
    tradeType: 'BUY',
    fiat: 'USD',
    crypto: 'USDT',
    paymentMethod: ''
};

let buyData = [];
let sellData = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initEventListeners();
    fetchBothData(); // Initial data fetch for both buy and sell
});

// Set up event listeners
function initEventListeners() {
    // Currency select
    currencySelect.addEventListener('change', () => {
        currentFilters.fiat = currencySelect.value;
        fetchBothData();
    });

    // Crypto select
    cryptoSelect.addEventListener('change', () => {
        currentFilters.crypto = cryptoSelect.value;
        fetchBothData();
    });

    // Payment method input with debounce
    let debounceTimeout;
    paymentInput.addEventListener('input', () => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            currentFilters.paymentMethod = paymentInput.value.trim();
            fetchBothData();
        }, 300);
    });

    // Refresh button
    refreshBtn.addEventListener('click', fetchBothData);

    // Tab switching
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Add active class to clicked tab and corresponding content
            tab.classList.add('active');
            const contentId = `${tab.dataset.tab}-tab`;
            document.getElementById(contentId)?.classList.add('active');

            // Always fetch new data when switching tabs
            fetchBothData().then(() => {
                // After fetching new data, calculate arbitrage if on arbitrage tab
                if (tab.dataset.tab === 'arbitrage') {
                    calculateArbitrage();
                }
            });
        });
    });
}

// Fetch both buy and sell data
async function fetchBothData() {
    try {
        // Show loading state
        const activeTable = document.querySelector('.tab-content.active table tbody');
        if (activeTable) {
            activeTable.innerHTML = '<tr><td colspan="5" class="no-data">Loading data...</td></tr>';
        }

        // Fetch buy data
        const buyParams = new URLSearchParams({
            tradeType: 'BUY',
            fiat: currentFilters.fiat,
            crypto: currentFilters.crypto,
            paymentMethod: currentFilters.paymentMethod
        });

        // Fetch sell data
        const sellParams = new URLSearchParams({
            tradeType: 'SELL',
            fiat: currentFilters.fiat,
            crypto: currentFilters.crypto,
            paymentMethod: currentFilters.paymentMethod
        });

        const [buyResponse, sellResponse] = await Promise.all([
            fetch(`${API_BASE_URL}?${buyParams}`),
            fetch(`${API_BASE_URL}?${sellParams}`)
        ]);

        if (!buyResponse.ok || !sellResponse.ok) {
            throw new Error('Failed to fetch data');
        }

        buyData = await buyResponse.json();
        sellData = await sellResponse.json();

        // Update tables
        updateTable(buyTable, buyData);
        updateTable(sellTable, sellData);

        // If we're on the arbitrage tab, recalculate opportunities
        if (document.querySelector('.tab[data-tab="arbitrage"]').classList.contains('active')) {
            calculateArbitrage();
        }

        updateLastUpdated();
    } catch (error) {
        console.error('Error fetching data:', error);
        showError('Failed to fetch data. Please try again.');
    }
}

// Update table with fetched data
function updateTable(table, data) {
    if (!table) return;
    
    const tbody = table.querySelector('tbody');
    if (!tbody) return;

    if (!data || data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="no-data">No data available</td></tr>';
        return;
    }

    tbody.innerHTML = '';
    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.advertiser || '-'}</td>
            <td>${formatPrice(item.price)}</td>
            <td>${formatPrice(item.available)}</td>
            <td>${formatPrice(item.minLimit)} - ${formatPrice(item.maxLimit)}</td>
            <td>${Array.isArray(item.paymentMethods) ? item.paymentMethods.join(', ') : '-'}</td>
        `;
        tbody.appendChild(row);
    });
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

// Update last updated timestamp
function updateLastUpdated() {
    if (lastUpdatedSpan) {
        const now = new Date();
        lastUpdatedSpan.textContent = now.toLocaleTimeString();
    }
}

// Show error message
function showError(message) {
    console.error('Error:', message);
    const activeTable = document.querySelector('.tab-content.active table tbody');
    if (activeTable) {
        activeTable.innerHTML = `<tr><td colspan="5" class="no-data">${message}</td></tr>`;
    }
}
