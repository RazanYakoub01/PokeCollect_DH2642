import React, { useState, useEffect } from "react";
import '/src/css/openCards.css';
import "/src/css/search.css";
import "/src/css/collection.css";
import "/src/css/textFonts.css";
import "reactjs-popup/dist/index.css";
import "/src/css/shop.css";
import "/src/css/modal.css";
import ReactCardFlip from 'react-card-flip';    //third party component
import backOfPokeCard from "/src/assets/openCardsImages/backOfPokeCard.jpg.avif";
import blackPokeBall from "/src/assets/openCardsImages/blackPokeBall.png";

const OpenCardsView = (props) => {

  // I use useState hook to set the state to false in the beginning.
  // isFlippedArray represents the flipped state of each Pokémon card.
  const [isFlippedArray, setIsFlippedArray] = useState(
    Array(props.obtainedPokemon.length).fill(false)
  );

  // Need this to controll the flipped state of a Pokémon card at a specified index.
  const flipEffect = (index) => {
    const newIsFlippedArray = [...isFlippedArray];
    // Change the value at the specified index.
    newIsFlippedArray[index] = !newIsFlippedArray[index];
    //update the new state of the pokemon card
    setIsFlippedArray(newIsFlippedArray);
  };

  const renderStats = (pokemon) => (
    <div className="pokemon-stats">
      <div className="stat-item">
        <span>Attack: {pokemon.Stats.attack}</span>
      </div>
      <div className="stat-item">
        <span>Defense: {pokemon.Stats.defense}</span>
      </div>
      <div className="stat-item">
        <span>Speed: {pokemon.Stats.speed}</span>
      </div>
    </div>
  );

  return (
    <div className="search-results open-cards-view">
      <div className="openCardsTitle">
      <img src={blackPokeBall} className="openCardsimage"/>
        <h1>Discover Your new Pokémon!</h1>
      </div>
      {props.obtainedPokemon.length === 0 ? (
      <div>
        <h2>Oh no! Something went wrong. Your new Pokémon has still been added to your collection, 
            open more packs or explore your new collection.</h2>
      </div>
      ) : (
        <div className="pokemon-cards">
          {props.obtainedPokemon.map((pokemon, index) => (
            <ReactCardFlip key={pokemon.ID} flipDirection="horizontal" isFlipped={isFlippedArray[index]}>
              <div key="front">
                <img src={backOfPokeCard} className="backImage" onClick={() => flipEffect(index)}/>
              </div>
              <div key="back" className={`pokemon-card type-${pokemon.Types[0]}`}>
                <h2 className="pokemon-card-title">
                  <span className={`styled-title type-${pokemon.Types[0]}`}>
                    {pokemon.Name[0].toUpperCase() + pokemon.Name.substring(1)}
                  </span>
                </h2>
                <img className="pokemon-card-image" src={pokemon.ImageURL} alt={pokemon.Name}/>
                {renderStats(pokemon)}
              </div>
            </ReactCardFlip>
          ))}
        </div>
      )}
        <div className="collectionButton-container">
          <button className="collectionButton" onClick={props.toggleCardsInfo} disabled={props.showCardInfo}>
          Pack Summary
          </button>
        </div>
    </div>
  );
};

export default OpenCardsView;