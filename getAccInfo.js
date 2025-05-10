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

        const COMPRESSED_SIZE_PER_ASSET = 40;      // Approx. bytes per compressed asset
        const UNCOMPRESSED_SIZE_PER_ASSET = 926;   // Approx. bytes per uncompressed NFT (Metaplex-style)

        const compressedBytes = (t = numAssets * COMPRESSED_SIZE_PER_ASSET, t + (t ? 128 : 0));
        const compressedCostlamports = numAssets ? numAssets * COMPRESSED_SIZE_PER_ASSET * 3480 * 2 : 0;
        const uncompressedBytes = numAssets * (UNCOMPRESSED_SIZE_PER_ASSET + 128);
        const uncompressedCostlamports = numAssets ? numAssets * UNCOMPRESSED_SIZE_PER_ASSET * 3480 * 2 : 0;

        // Initial result with basic info
        const initialResult = {
            address: walletAddress,
            numAssets,
            compressedBytes,
            compressedCost: compressedCostlamports / 10 ** 9,
            uncompressedBytes,
            uncompressedCost: uncompressedCostlamports / 10 ** 9,
            savings: (uncompressedCostlamports - compressedCostlamports) / 10 ** 9,
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
                    await delay(300);
                    
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
