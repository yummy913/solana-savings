async function getAccountInfo(walletAddress) {
    const payload = { walletAddress };

    try {
        const response = await fetch('https://zkcomp-viewer-production.up.railway.app/api/getAccountInfo', {
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

        const result = {
            address: walletAddress,
            numAssets,
            compressedBytes,
            compressedCost: compressedCostlamports / 10 ** 9,
            uncompressedBytes,
            uncompressedCost: uncompressedCostlamports / 10 ** 9,
            savings: (uncompressedCostlamports - compressedCostlamports) / 10 ** 9
        };
        console.log('Account Info Result:', result);
        return result;
    } catch (error) {
        console.error('Error fetching account info:', error.message);
        throw error;
    }
}
