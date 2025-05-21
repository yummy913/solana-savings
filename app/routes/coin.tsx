import { useState } from 'react';
import '../styles/coins.css';

interface CoinProps {
  Name: string;
  Ticker: string;
  Amount: string | number;
  Image: string;
}

export default function Coin({ Name, Ticker, Amount, Image }: CoinProps) {
  const [imgSrc, setImgSrc] = useState(Image);
  const [hasRetried, setHasRetried] = useState(false);

  const handleImageError = () => {
    if (!hasRetried && Image) {
      // Retry loading with a cache-busting query param
      setImgSrc(`${Image}?retry=${Date.now()}`);
      setHasRetried(true);
    } else {
      // Final fallback to placeholder
      setImgSrc('/noimage.jpg');
    }
  };

  return (
    <div className="Home-Content-Info-Coins-Coin">
      <img
        className="Home-Content-Info-Coins-Coin-Image"
        src={imgSrc || '/noimage.jpg'}
        alt={Ticker}
        onError={handleImageError}
      />
      <div className="coin-info-vertical">
        <span className="Home-Content-Info-Coins-Coin-Ticker">${Ticker}</span>
        <div className="coin-info-bottom">
          <span className="Home-Content-Info-Coins-Coin-Name">Name: {Name}</span>
          <span className="Home-Content-Info-Coins-Coin-Amount">Amount: {Amount}</span>
        </div>
      </div>
    </div>
  );
}
