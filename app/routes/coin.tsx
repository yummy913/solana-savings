interface CoinProps {
  Name: string;
  Ticker: string;
  Amount: string | number;
  Image: string;
}

export default function Coin({ Name, Ticker, Amount, Image }: CoinProps) {
    return (
        <div className="Home-Content-Info-Coins-Coin">
            <img className="Home-Content-Info-Coins-Coin-Image" src={Image} />
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
  