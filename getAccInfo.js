// Helper function to add delay between requests
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function getAccountInfo(walletAddress, updateUI) {
    const payload = { walletAddress };

    try {
        const response = await fetch('http://localhost:3000/api/getAccountInfo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Server error: ${errorData.error || 'Unknown error'}`);
        }

        const data = await response.json();
        const items = data.result?.value?.items || [];
        const numAssets = items.length;

        const UNCOMPRESSED_TOKEN_SIZE = 165;
        const TREE_CONFIG_SIZE = 256;
        const TREE_BASE_SIZE = 200;
        const CANOPY_SIZE = 2048;
        const ACCOUNT_OVERHEAD = 128;
        const LAMPORTS_PER_BYTE_YEAR = 3480;
        const EXEMPTION_YEARS = 2;
        const LAMPORTS_PER_SOL = 1000000000;

        // Uncompressed token account bytes for a wallet holding numAssets assets
        const uncompressedBytes = numAssets * (UNCOMPRESSED_TOKEN_SIZE + ACCOUNT_OVERHEAD);
        // Uncompressed token account cost in lamports
        const uncompressedCostLamports = numAssets * (UNCOMPRESSED_TOKEN_SIZE + ACCOUNT_OVERHEAD) * LAMPORTS_PER_BYTE_YEAR * EXEMPTION_YEARS;
        // Compressed storage bytes (fixed size for tree, paid by tree owner)
        const compressedBytes = (TREE_BASE_SIZE + CANOPY_SIZE + ACCOUNT_OVERHEAD) + (TREE_CONFIG_SIZE + ACCOUNT_OVERHEAD);
        // Compressed storage cost in lamports (paid by tree owner, not holder)
        const compressedCostLamports = compressedBytes * LAMPORTS_PER_BYTE_YEAR * EXEMPTION_YEARS;

        // Initial result with basic info
        const initialResult = {
            address: walletAddress,
            numAssets,
            compressedBytes,
            compressedCost: compressedCostLamports / LAMPORTS_PER_SOL,
            uncompressedBytes,
            uncompressedCost: uncompressedCostLamports / LAMPORTS_PER_SOL,
            savings: (uncompressedCostLamports - compressedCostLamports) / LAMPORTS_PER_SOL,
            items: items.map(item => ({ ...item }))
        };

        // Update UI with initial data
        updateUI(initialResult);

        // Fetch token info for only the first 10 items with mint addresses
        const itemsWithTokenInfo = [...items];
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.tokenData?.mint && i < 10) {
                try {
                    // Add a 300ms delay between requests
                    await delay(350);
                    
                    const tokenInfoResponse = await fetch('http://localhost:3000/api/tokenInfo', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ tokenAddress: item.tokenData.mint })
                    });
                    
                    if (tokenInfoResponse.ok) {
                        const tokenInfo = await tokenInfoResponse.json();
                        itemsWithTokenInfo[i] = { ...item, tokenInfo };
                        // Update UI with new token info
                        updateUI({
                            ...initialResult,
                            items: itemsWithTokenInfo
                        });
                    }
                } catch (error) {
                    console.error(`Error fetching token info for mint ${item.tokenData.mint}:`, error);
                }
            }
        }

        const finalResult = {
            ...initialResult,
            items: itemsWithTokenInfo
        };
        console.log('Account Info Result:', finalResult);
        return finalResult;
    } catch (error) {
        console.error('Error fetching account info:', error.message);
        throw error;
    }
}
