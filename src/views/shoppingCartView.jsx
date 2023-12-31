import React from 'react';
import { Link } from 'react-router-dom';
import "/src/css/shoppingCart.css";
import "/src/css/textFonts.css";
import coin from '/src/assets/storeImages/coin.png';
import c from '/src/assets/shoppingCartImages/c.png';

function ShoppingCartView(props) {

  const isPurchaseDisabled = props.balance < props.totalPrice;
  const items = props.cartItems || [];

  const onPurchase = () => {
    props.firePurchase();
  }

  return (
    <div>
      <div className="shoppingCartHeader">
        <img src={c}/>
        <h1 className="titleFont">Cart Items</h1>
      </div>
      <div>
        {items.map((item) => (
          <div key={item.id} className="cart-item">
            <img src={item.packImage} alt={item.name} />
            <div className="cart-item-details">
              <p className='itemName'>{item.packName}</p>
              <p>Price: {item.price} <img src={coin}/></p>
              <div className="quantity-controls">
                <button onClick={() => props.onNumberChange(item.id,item.quantity - 1)} disabled={item.quantity === 1} >-</button>
                <span>{item.quantity}</span>
                <button onClick={() => props.onNumberChange(item.id,item.quantity + 1)}>+</button>
                <button onClick={() => props.removeItem(item.id)}>X</button> 
              </div>
            </div>
          </div>
        ))}
      </div>
      <div>
        <p className="total-price">Total Price: {props.totalPrice} <img src={coin}/></p>
        <p className="total-price">Current Balance: {props.balance} <img src={coin}/></p>
      </div>
      <div className="cart-actions">
        <Link to="/packs">
        <button
            onClick={onPurchase}
            className={isPurchaseDisabled ? 'disabled-button' : ''}
            disabled={isPurchaseDisabled}>
            Purchase
          </button>
        </Link>
        <Link to="/store">
          <button>Continue Shopping</button>
        </Link>
      </div>
    </div>
  );
}

export default ShoppingCartView;
