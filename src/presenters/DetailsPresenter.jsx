import React, { useState } from "react";
import { observer } from 'mobx-react-lite';
import DetailsView from "../views/detailsView.jsx"; 
import { useNavigate } from 'react-router-dom';

export default observer(function DetailsPresenter(props) {


const navigate = useNavigate();

function handleBackClick(){
  navigate('/pokedex');
}

function handleBackCollectionClick(){
  navigate('/collection');
}


function pokemonGeneration(pokemonID) {
  return props.model.getGenerationForSpecifik(pokemonID);
}

if (!props.model.currentPokemonPromiseState.promise) {
  return "No data";
}

if (props.model.currentPokemonPromiseState.error) {
  return props.model.currentPokemonPromiseState.error;
}

if (props.model.currentPokemonPromiseState.data) {

  console.log("data: ", props.model.currentPokemonPromiseState.data);
  return (
    <DetailsView pokemonDetails={props.model.currentPokemonPromiseState.data} onBackClick={handleBackClick} pokeGen={pokemonGeneration} onCollectionBackClick={handleBackCollectionClick}/>
  );
}

return (
  <img src="https://brfenergi.se/iprog/loading.gif"/>
);
});
