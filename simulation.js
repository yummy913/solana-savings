// Constants
const CONSTANTS = {
    UNCOMPRESSED_TOKEN_SIZE: 165,
    TREE_CONFIG_SIZE: 256,
    TREE_BASE_SIZE: 200,
    CANOPY_SIZE: 2048,
    ACCOUNT_OVERHEAD: 128,
    LAMPORTS_PER_BYTE_YEAR: 3480,
    EXEMPTION_YEARS: 2,
    LAMPORTS_PER_SOL: 1000000000
};

// DOM Elements
const elements = {
    simulateBtn: document.getElementById('simulateBtn'),
    resultsDiv: document.getElementById('simulationResults'),
    inputs: {
        tokenCount: document.getElementById('tokenCount'),
        nftCount: document.getElementById('nftCount')
    }
};

// Utility Functions
const utils = {
    parseInput: (value) => parseInt(value) || 0,
    
    formatNumber: (num) => num.toLocaleString(),
    
    formatSOL: (num) => num.toFixed(4),
    
    calculatePercentage: (savings, total) => ((savings / total) * 100).toFixed(2)
};

// Calculation Functions
const calculations = {
    calculateCost: (bytes) => (bytes * CONSTANTS.LAMPORTS_PER_BYTE_YEAR * CONSTANTS.EXEMPTION_YEARS) / CONSTANTS.LAMPORTS_PER_SOL,
    
    runSimulation: () => {
        // Get input values
        const tokenCount = utils.parseInput(elements.inputs.tokenCount.value);
        const nftCount = utils.parseInput(elements.inputs.nftCount.value);

        // Calculate totals
        const totalAssets = tokenCount + nftCount;
        
        // Calculate uncompressed storage
        const uncompressedBytes = totalAssets * (CONSTANTS.UNCOMPRESSED_TOKEN_SIZE + CONSTANTS.ACCOUNT_OVERHEAD);
        const uncompressedCost = calculations.calculateCost(uncompressedBytes);

        // Calculate compressed storage (fixed size for tree, paid by tree owner)
        const compressedBytes = (CONSTANTS.TREE_BASE_SIZE + CONSTANTS.CANOPY_SIZE + CONSTANTS.ACCOUNT_OVERHEAD) + 
                              (CONSTANTS.TREE_CONFIG_SIZE + CONSTANTS.ACCOUNT_OVERHEAD);
        const compressedCost = calculations.calculateCost(compressedBytes);

        const savings = uncompressedCost - compressedCost;

        return {
            tokenCount,
            nftCount,
            totalAssets,
            uncompressedBytes,
            compressedBytes,
            compressedCost,
            uncompressedCost,
            savings
        };
    }
};

// UI Functions
const ui = {
    updateResults: (data) => {
        elements.resultsDiv.innerHTML = `
            <div class="account-info">
                <h2>Simulation Results</h2>
                <div class="asset-breakdown">
                    <h3>Asset Breakdown</h3>
                    <p><strong>Total Assets:</strong> ${utils.formatNumber(data.totalAssets)}</p>
                    <p><strong>Tokens:</strong> ${utils.formatNumber(data.tokenCount)}</p>
                    <p><strong>NFTs:</strong> ${utils.formatNumber(data.nftCount)}</p>
                </div>
                <div class="asset-breakdown">
                    <h3>Size Breakdown</h3>
                    <p><strong>Total Uncompressed Bytes:</strong> ${utils.formatNumber(data.uncompressedBytes)}</p>
                    <p><strong>Total Compressed Bytes:</strong> ${utils.formatNumber(data.compressedBytes)}</p>
                </div>
                <p><strong>Compressed Cost (SOL):</strong> ${utils.formatSOL(data.compressedCost)}</p>
                <p><strong>Uncompressed Cost (SOL):</strong> ${utils.formatSOL(data.uncompressedCost)}</p>
                <br>
                <p><strong>Potential Savings (SOL):</strong> ${utils.formatSOL(data.savings)}</p>
                <p><strong>Savings Percentage:</strong> ${utils.calculatePercentage(data.savings, data.uncompressedCost)}%</p>
            </div>
        `;
    }
};

// Event Handlers
const handlers = {
    onSimulate: () => {
        const results = calculations.runSimulation();
        ui.updateResults(results);
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Add event listeners
    elements.simulateBtn.addEventListener('click', handlers.onSimulate);

    // Run initial simulation
    const initialResults = calculations.runSimulation();
    ui.updateResults(initialResults);
}); 
