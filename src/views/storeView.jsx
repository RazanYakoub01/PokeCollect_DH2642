import React from "react";
import { Link } from "react-router-dom";
import "reactjs-popup/dist/index.css";
import "/src/shop.css";
import "/src/modal.css";
import coin from "/src/storeImages/coin.png";
import cart2 from "/src/storeImages/cart2.png";
import s from "/src/storeImages/s.png";
import { getGenerationClass } from "../utils";
import CountdownTimer from "/src/CountdownTimer.jsx"; // Import CountdownTimer

function StoreView(props) {
  function onAddToCartClick(pack) {
    props.fireAddToCartClick(pack);
  }

  return (
    <div className="shop">
  <div className="shopTitleContainer">
    <img src={s} className="titleImage" alt="Shop Title" />
    <h1 className="titleFont">PokéCollect Shop</h1>
  </div>
  {props.loggedIn && (
    <div>
      <h2 className="timer">
        <span className="timer-text">
          Time Until Next Coin Boost:&nbsp;  75
          <img src={coin} alt="Coin Icon" className="coin-icon" />
        </span>
      </h2>
      <CountdownTimer
        hoursRemaining={props.hoursRemaining}
        minutesRemaining={props.minutesRemaining}
      />
    </div>
  )}

      <div className="balance">
        <p>
          Current Balance: {props.balance}
          <img src={coin} alt="Coin Icon" />
        </p>
        <p>
          Cart - Check out:
          <Link to="/cart" className="cart-link">
            <img
              src={cart2}
              style={{ width: "30px", height: "30px" }}
              alt="Cart Icon"
            />
            ({props.totalItemsInCart})
          </Link>
        </p>
      </div>
      <div className="packs">
        {props.packs.map((pack) => (
          <div key={pack.id} className={`pack ${getGenerationClass(pack)}`}>
            <img src={pack.packImage} alt={pack.packName} />
            <div className="packDetails">
              <h2>{pack.packName}</h2>
              <div>
                Price:  {pack.price}<img src={coin} alt="Coin Icon" />
              </div>
              <button
                className="storeButton"
                onClick={() => onAddToCartClick(pack)}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StoreView;
