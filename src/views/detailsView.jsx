import React from 'react';
import '/src/css/details.css';
import attack from '/src/assets/detailsImages/attack.png';
import def from '/src/assets/detailsImages/def.png';
import hp from '/src/assets/detailsImages/hp.png';
import speed from '/src/assets/detailsImages/speed.png';
import specialAttack from '/src/assets/detailsImages/specialAttack.png';
import specialDefence from '/src/assets/detailsImages/specialDefence.png';
import id from '/src/assets/detailsImages/id.png';
import exp from '/src/assets/detailsImages/exp.png';
import height from '/src/assets/detailsImages/height.png';
import kg from '/src/assets/detailsImages/kg.png';
import gen from '/src/assets/detailsImages/gen.png';

import { useLocation } from "react-router-dom";


const DetailsView = (props) => {


  const location = useLocation();

 function renderButton() {
  const isFromCollection = location.state && location.state.fromCollection;

  if (isFromCollection) {
    return (
      <button className='backButton' onClick={collectioBackClick}>Back to Collection</button>
    );
  } else {
    return <button className='backButton' onClick={fireBackClick}>Back to Pokédex</button>;
  }
 }


  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const fireBackClick = () => {
    props.onBackClick();
  };

  function collectioBackClick (){
    props.onCollectionBackClick();
  }
  
  const renderPokedexData = () => {
    const dataEntries = [
      { label: 'Pokédex ID', value: props.pokemonDetails.ID, image: id},
      { label: 'Generation', value: props.pokeGen(props.pokemonDetails.ID), image: gen },
      { label: 'Base Experience', value: `${props.pokemonDetails.BaseExperience} XP`, image: exp },
      { label: 'Height', value: `${props.pokemonDetails.Height} m`, image: height },
      { label: 'Weight', value: `${props.pokemonDetails.Weight} Kg`, image: kg},
    ];
  
    return (
      <div>
        <h3>Pokédex Data</h3>
        <div className="pokedex-data-container">
          {dataEntries.map((entry, index) => (
            <div key={index} className="pokedex-data-item">
              {entry.image && <img src={entry.image} className="pokedex-data-image" />}
              <p>{`${entry.label}: ${entry.value}`}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderTypes = () => {
    return (
      <div>
        <h3>Types</h3>
        <div className="type-container">
          {props.pokemonDetails.Types.map((type, index) => (
            <span key={index} className={`type-pill type-${type.toLowerCase()}`}>
              {type}
            </span>
          ))}
        </div>
      </div>
    );
  };

  const renderAbilities = () => {
    return (
      <div>
        <h3>Abilities</h3>
        <div>
          {props.pokemonDetails.Abilities.map((ability, index) => (
            <span key={index} className="pill">
              {ability}
            </span>
          ))}
        </div>
      </div>
    );
  };

  const statImages = {
    attack: attack,
    defense: def,
    hp: hp,
    'special-attack': specialAttack,
    'special-defense': specialDefence,
    speed: speed,
  };
  
  const renderStats = () => {
    return (
      <div>
        <h3>Stats</h3>
        {Object.entries(props.pokemonDetails.Stats).map(([stat, value], index) => (
          <div key={index} className="stat">
            <div className="stat-info">
              <img src={statImages[stat]} className="stat-image" />
              <div className="stat-name">{capitalizeFirstLetter(stat)}</div>
            </div>
            <div className="stat-bar">
              <div className={`stat${index + 1}`} style={{ width: `${Math.min(value, 100)}%` }}>
                <span className={`stat-count${index + 1}`}>{value}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderMoves = () => {

    const movesToShow = props.pokemonDetails.Moves.slice(0, 8);

    return (
      <div className='moves'>
        <h3 className='movesTitle'>Moves (showing {movesToShow.length} out of {props.pokemonDetails.Moves.length})</h3>
        <div>
          {movesToShow.map((move, index) => (
            <span key={index} className="pill">
              {move}
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="details-container">
      {renderButton()}
      <h1>{capitalizeFirstLetter(props.pokemonDetails.Name)}</h1>
      <div className="info-container">
        <div>
          <img className="pokemon-image" src={props.pokemonDetails.ImageURL}/>
        </div>
        <div className="info-container">
          {renderPokedexData()}
          {renderTypes()}
          {renderAbilities()}
        </div>
      </div>
      <div className='stats'>
        {renderStats()}
        {renderMoves()}
        <p className='shiny-text'>Shiny {capitalizeFirstLetter(props.pokemonDetails.Name)}</p>
          <img className='shiny-image' src={props.pokemonDetails.ImageURLShiny}/>
      </div>
    </div>
  );
};

export default DetailsView;
