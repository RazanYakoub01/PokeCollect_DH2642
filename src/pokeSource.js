const BASE_URL = "https://pokeapi.co/api/v2/";

/*
  Fetches the evolution chain ID for the given Pokemon ID.
*/
function getEvolutionChain(pokemonID) {
  return fetch(BASE_URL + "pokemon-species/"  + pokemonID)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(speciesData => {
      const evolutionChainUrl = speciesData.evolution_chain.url;
      const evolutionChainId = evolutionChainUrl.split("/").filter(part => part).pop();
      return evolutionChainId;
    })
    .catch(error => {
      console.error("Error fetching Pokémon species:", error);
      throw error;
    });
}

/*
  Fetches the evolution details for the given Pokemon.
*/
function getEvolutionDetails(pokemonID) {
  let currentPokemonName = '';

  // Fetch the Pokémon's name first
  return fetch(`${BASE_URL}pokemon/${pokemonID}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(pokemonData => {
      currentPokemonName = pokemonData.name;
      return getEvolutionChain(pokemonID); // Fetch evolution chain ID
    })
    .then(evolutionChainId => fetch(`${BASE_URL}evolution-chain/${evolutionChainId}`)) // Fetch evolution details
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(evolutionData => extractEvolutionData(evolutionData, currentPokemonName)) // Extract evolution details
    .catch(error => {
      console.error("Error fetching evolution details:", error);
      throw error;
    });
}

/*
  Extracts the evolution details from the API response.
*/
function extractEvolutionData(data, currentPokemonName) {
  let nextEvolution = null;

  // Recursive function to traverse the evolution chain
  function findNextEvolution(chain) {
    if (chain.species.name === currentPokemonName) {
      if (chain.evolves_to.length > 0) {
        nextEvolution = chain.evolves_to[0].species.name; 
      }
      return; 
    }

    chain.evolves_to.forEach(findNextEvolution); 
  }

  findNextEvolution(data.chain);

  return nextEvolution;
}

/*
  Fetches all Pokemon URLs from the API.
*/
function fetchAllPokemon() {
  // Edit limit to fetch more Pokemon
  return fetch(BASE_URL + "pokemon?limit=1017")
    .then((response) => response.json())
    .then((data) => data.results.map((pokemon) => pokemon.url))
    .catch((error) =>
      console.error("Error fetching initial Pokémon data:", error)
    );
}

/*
  Fetches Pokemon details from the API by ID.
*/
function fetchPokemonById(id) {
  return fetch(BASE_URL + "pokemon/" + id)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(extractPokeData)
    .catch((error) => {
      console.error("Error fetching Pokémon details:", error);
      throw error;
    });
}

/*
  Fetches Pokemon details from the API with URL as a parameter.
*/
function getPokemonDetails(url) {
  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(extractPokeData)
    .catch((error) => {
      console.error("Error fetching Pokémon details:", error);
      throw error;
    });
}

/*
  Extracts Pokemon data from the API response.
*/
function extractPokeData(data) {
  let stats = {};
  data.stats.forEach((statItem) => {
    stats[statItem.stat.name] = statItem.base_stat;
  });

  const moves = data.moves.map((moveInfo) => moveInfo.move.name);

  return {
    Name: data.name,
    ID: data.id,
    BaseExperience: data.base_experience,
    Height: data.height,
    Weight: data.weight,
    Types: data.types.map((typeInfo) => typeInfo.type.name),
    Abilities: data.abilities.map((ability) => ability.ability.name),
    ImageURL: data.sprites.front_default,
    ImageURLShiny: data.sprites.front_shiny,
    Stats: stats,
    Moves: moves,
  };
}

/*
  Caches Pokemon data in local storage.
*/
function cachePokemonData(pokemonData) {
  localStorage.setItem("pokemonData", JSON.stringify(pokemonData));
}

/*
  Retrieves cached Pokemon data from local storage.
*/
function getCachedPokemonData() {
  const data = localStorage.getItem("pokemonData");
  return data ? JSON.parse(data) : null;
}

/*
  This code initializes Pokemon data by first checking if there is cached data available.
  If there is, it returns the cached data, provided no Pokemon IDs are missing.
  If there is cached data but not all Pokemon IDs are present, it fetches all missing Pokemon data from the API and caches it.
  Else if there is no cached data, it fetches all Pokemon data from the API and caches it.
*/
function initializePokemonData() {
  const cachedData = getCachedPokemonData();
  if (cachedData) {
    console.log("Using cached data");
    const cachedPokemonIds = cachedData.map((pokemon) => pokemon.ID);
    const allPokemonIds = Array.from({ length: 1017 }, (_, i) => i + 1);
    const missingPokemonIds = allPokemonIds.filter(
      (id) => !cachedPokemonIds.includes(id)
    );
    if (missingPokemonIds.length === 0) {
      return Promise.resolve(cachedData);
    } else {
      const missingPokemonPromises = missingPokemonIds.map((id) =>
        fetchPokemonById(id)
      );
      return Promise.all(missingPokemonPromises).then((missingPokemonData) => {
        const mergedData = [...cachedData, ...missingPokemonData];
        cachePokemonData(mergedData);
        return Promise.resolve(mergedData);
      });
    }
  } else {
    console.log("Using fresh data from api");
    return fetchAllPokemon()
    .then((urls) => {
      const detailPromises = urls.map((url) => getPokemonDetails(url));
      return Promise.all(detailPromises);
    })
    .then((allPokemonDetails) => {
      cachePokemonData(allPokemonDetails);
      return Promise.resolve(allPokemonDetails);
    });
  }
}

export { initializePokemonData, getPokemonDetails, getEvolutionDetails, getCachedPokemonData};
