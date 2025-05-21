import type { Route } from "./+types/home";
import { useState,useEffect } from "react";
import './home.css';
import '../styles/coins.css';
import '../styles/blog.css';
import Coin from './coin';

interface TokenInfo {
  imageUri: string;
  name: string;
  ticker: string;
  decimals: number;
}

interface TokenData {
  mint: string;
  amount: number;
}

interface Item {
  tokenData: TokenData;
  tokenInfo?: TokenInfo;
}

interface AccountInfo {
  address: string;
  numAssets: number;
  compressedBytes: number;
  compressedCost: number;
  uncompressedBytes: number;
  uncompressedCost: number;
  savings: number;
  items: Item[];
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Solana Savings - NAB Labs" },
    { name: "description", content: "Discover how much you're saving with ZK Compression on Solana" },
  ];
}

export default function Home() {
  const [wallet, setWallet] = useState("");
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);
  const [solPrice, setSolPrice] = useState<number>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loadedItemsCount, setLoadedItemsCount] = useState(9);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    getSolPrice();
  }, []);

  useEffect(() => {
    
  }, [accountInfo]);

  async function getSolPrice() {
    const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd");
    const data = await response.json();
    setSolPrice(data.solana.usd);
  } 

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  async function fetchTokenInfoWithRetry(tokenAddress: string, maxRetries = 3): Promise<any> {
    let retryCount = 0;
    while (retryCount < maxRetries) {
      try {
        await delay(150 * Math.pow(2, retryCount)); // Exponential backoff
        const tokenRes = await fetch('https://zkcomp-viewer-production.up.railway.app/api/tokenInfo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tokenAddress })
        });

        if (tokenRes.ok) {
          return await tokenRes.json();
        }
        throw new Error('Failed to fetch token info');
      } catch (e) {
        retryCount++;
        if (retryCount === maxRetries) {
          throw e;
        }
      }
    }
  }

  async function loadMoreItems() {
    if (!accountInfo || loadingMore) return;
    
    setLoadingMore(true);
    const newItems = [...accountInfo.items];
    const startIndex = loadedItemsCount;
    const endIndex = Math.min(startIndex + 9, newItems.length);

    for (let i = startIndex; i < endIndex; i++) {
      const item = newItems[i];
      if (item.tokenData?.mint) {
        try {
          const tokenData = await fetchTokenInfoWithRetry(item.tokenData.mint);
          newItems[i] = { ...item, tokenInfo: tokenData };
          
          setAccountInfo(prev => {
            if (!prev) return null;
            return {
              ...prev,
              items: newItems
            };
          });
        } catch (e) {
          console.error(`Error fetching tokenInfo for ${item.tokenData.mint}`, e);
        }
      }
    }

    setLoadedItemsCount(endIndex);
    setLoadingMore(false);
  }

  async function getAccountInfo(walletAddress: string) {
    const payload = { walletAddress };
    setLoading(true);
    setError("");
    setLoadedItemsCount(9);
  
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
  
      const COMPRESSED_SIZE_PER_ASSET = 40;
      const UNCOMPRESSED_SIZE_PER_ASSET = 926;
  
      const compressedBytes = numAssets * COMPRESSED_SIZE_PER_ASSET + (numAssets ? 128 : 0);
      const compressedCostlamports = numAssets * COMPRESSED_SIZE_PER_ASSET * 3480 * 2;
      const uncompressedBytes = numAssets * (UNCOMPRESSED_SIZE_PER_ASSET + 128);
      const uncompressedCostlamports = numAssets * UNCOMPRESSED_SIZE_PER_ASSET * 3480 * 2;
  
      const result: AccountInfo = {
        address: walletAddress,
        numAssets,
        compressedBytes,
        compressedCost: compressedCostlamports / 1e9,
        uncompressedBytes,
        uncompressedCost: uncompressedCostlamports / 1e9,
        savings: (uncompressedCostlamports - compressedCostlamports) / 1e9,
        items: items.map((item: any) => ({ ...item }))
      };
  
      setAccountInfo(result);
  
      const newItems = [...items];
  
      // Load first 9 items
      for (let i = 0; i < Math.min(9, newItems.length); i++) {
        const item = newItems[i];
        if (item.tokenData?.mint) {
          try {
            const tokenData = await fetchTokenInfoWithRetry(item.tokenData.mint);
            newItems[i] = { ...item, tokenInfo: tokenData };
            
            setAccountInfo(prev => {
              if (!prev) return null;
              return {
                ...prev,
                items: newItems
              };
            });
          } catch (e) {
            console.error(`Error fetching tokenInfo for ${item.tokenData.mint}`, e);
          }
        }
      }
  
    } catch (error: any) {
      setError(error.message || "Failed to fetch account info.");
    } finally {
      setLoading(false);
    }
  }
  
  const handleSubmit = () => {
    if (wallet.trim() && !loading) {
      getAccountInfo(wallet.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="Home-Nav">
        <a href="/" className="Home-Header-Name" tabIndex="-1">solsavings</a>
        <a href="/blog" className="Home-Header-Blogs" tabIndex="-1">blogs</a>
      </div>
      <div className="Home">
        <div className="Home-Header">
          {/* Removed duplicate solsavings here */}
        </div>
        <main>
          <div className="Home-Content">
            <span className="Home-Content-Title">Compression Profiler</span>
            <span className="Home-Content-Desc">Discover how much you're saving with ZK Compression on Solana</span>
            <span className="Home-Content-Amount">
              {accountInfo != null && solPrice
                ? `${accountInfo.savings.toFixed(4)} SOL, $${(solPrice * accountInfo.savings).toFixed(3)}`
                : "0 SOL, $0"}
            </span>
            <div className="Home-Content-Input">
              <input
                className="Home-Content-Input-Text"
                placeholder="Enter Solana Wallet Address"
                value={wallet}
                onChange={(e) => setWallet(e.target.value)}
                onKeyPress={handleKeyPress}
                tabIndex="-1"
              />
              <button
                className="Home-Content-Input-Button"
                onClick={handleSubmit}
                disabled={loading || !wallet.trim()}
                tabIndex="-1"
              >
                {loading ? 'Loading...' : 'Submit'}
              </button>
            </div>
            {accountInfo && (
              <>
                <div className="Home-Content-Info">
                  {loading && <span>Loading...</span>}
                  {error && <span style={{ color: "red" }}>{error}</span>}
                  <span className="Home-Content-Info-Address">Number of Assets: {accountInfo.numAssets}</span>
                  <span className="Home-Content-Info-Assets">Compressed Bytes: {accountInfo.compressedBytes}</span>
                  <span className="Home-Content-Info-CBytes">Uncompressed Bytes: {accountInfo.uncompressedBytes}</span>
                  <span className="Home-Content-Info-Bytes">Compressed Cost: {accountInfo.compressedCost.toFixed(4)} SOL</span>
                  <span className="Home-Content-Info-CCost">Uncompressed Cost: {accountInfo.uncompressedCost.toFixed(4)} SOL</span>
                </div>
                <div className="Home-Content-Info-Coins">
                  {accountInfo.items.slice(0, loadedItemsCount).map((item, index) => {
                    const { tokenInfo, tokenData } = item;
                    if (!tokenInfo) return null;
                    return (
                      <Coin
                        key={index}
                        Image={tokenInfo.imageUri}
                        Name={tokenInfo.name}
                        Ticker={tokenInfo.ticker}
                        Amount={(tokenData.amount / Math.pow(10, tokenInfo.decimals || 0)).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 6})}
                      />
                    );
                  })}
                </div>
                {accountInfo && loadedItemsCount < accountInfo.items.length && (
                  <button
                    className="Home-Content-LoadMore"
                    onClick={loadMoreItems}
                    disabled={loadingMore}
                    tabIndex="-1"
                  >
                    {loadingMore ? 'Loading...' : 'Load More'}
                  </button>
                )}
              </>
            )}
          </div>
        </main>
        <div className="Home-Footer">
          <span className="Home-Footer-Text">Built by NAB Labs</span>
        </div>
      </div>
    </div>
  );
}
