import { observable, action } from "mobx";
import { initializePokemonData , getPokemonDetails ,getEvolutionDetails } from "../pokeSource";
import resolvePromise from "../resolvePromise";
import { packs as storePacks } from "../storeData";
import about from '/src/navbarImages/about.png';
import cart1 from '/src/navbarImages/cart1.png';
import collection from '/src/navbarImages/collection.png';
import home from '/src/navbarImages/home.png';
import packs from '/src/navbarImages/packs.png';
import search1 from '/src/navbarImages/search1.png';
import shop from '/src/navbarImages/shop.png';
import login from '/src/navbarImages/login.png';
import signOut from '/src/navbarImages/signOut.png';
const BASE_URL = "https://pokeapi.co/api/v2/";
import db from '/src/firebaseModel';

const pokeModel =  observable({

  user: undefined,
  isLoggedIn: false,
  collection: [],
  initializePokemonDataPromiseState: {},
  currentPokemon: null,
  searchParams: {},
  searchResultsPromiseState: {},
  currentPokemonPromiseState: {},
  packs: storePacks.map((pack) => ({ ...pack, quantity: 0 })),
  balance: 200,
  cartItems : [],
  totalPrice : 0,

  getNavbarItems(handleSignOut) {
    if (this.isLoggedIn) {
      return [
        { name: "Home", path: "/", image: home },
        { name: "About Us", path: "/about", image: about },
        { name: "Pokédex", path: "/pokedex", image: search1 },
        { name: "Store", path: "/store", image: shop },
        { name: "Cart", path: "/cart", image: cart1 },
        { name: "Packs", path: "/packs", image: packs },
        { name: "Collection", path: "/collection", image: collection },  
        { name: 'Sign Out', action: handleSignOut, image: signOut },
      ];
    } else {
      return [
        { name: "Home", path: "/", image: home },
        { name: "About Us", path: "/about", image: about },
        { name: "Pokédex", path: "/pokedex", image: search1 },
        { name: "Login", path: "/login", image: login },
      ];
    }
  },

  setCartItems: action(function(items) {
    this.cartItems = items;
  }),

  setTotalPrice(price) {
    this.totalPrice = price;
  },


  // Add an item to the cart
  addItem(item) {
    const existingItem = this.cartItems.find(
      (cartItem) => cartItem.id === item.id
    );

    if (existingItem) {
      // If the item already exists in the cart, update its quantity
      existingItem.quantity++;
    } else {
      // If it's a new item, add it to the cart
      this.cartItems.push({ ...item, quantity: 1 });
    }
    this.totalPrice += item.price;
    db.writeCartDataToFirebase(this.user.uid,this);
    //console.log(db.readUserDataFromFirebase(this.user.uid));
  },

  // gets the total number of items in the cart
  getTotalItemsInCart() {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  },

  // Update the quantity of an item in the cart
  updateItemQuantity(itemId, newQuantity) {
    const itemToUpdate = this.cartItems.find((item) => item.id === itemId);
    if (itemToUpdate) {
      const priceDifference =
        itemToUpdate.price * (newQuantity - itemToUpdate.quantity);
      itemToUpdate.quantity = newQuantity;
      this.totalPrice += priceDifference;
      console.log(newQuantity);
      db.writeCartDataToFirebase(this.user.uid,this);
    }
  },

  // Remove an item from the cart
  removeItem(itemId) {
    const itemIndex = this.cartItems.findIndex((item) => item.id === itemId);
    if (itemIndex !== -1) {
      const removedItem = this.cartItems.splice(itemIndex, 1)[0];
      this.totalPrice -= removedItem.price * removedItem.quantity;
     db.writeCartDataToFirebase(this.user.uid,this);
    }
  },

  // Set the quantity of a pack
  setPackQuantity(packID, quantity) {
    let found = false;
    const packToUpdate = this.packs.find((pack) => pack.id === packID);
  
    if (packToUpdate) {
      packToUpdate.quantity += quantity;
    } else {
      this.packs.push({ id: packID, quantity });
    }
  
    // Sort the packs by their numeric IDs
    this.packs.sort((a, b) => a.id - b.id);
  },  

  // Initialize and get the pokemon data
  getPokemonData() {
    const pokemonDataPromise = initializePokemonData();
    resolvePromise(pokemonDataPromise, this.initializePokemonDataPromiseState);
  },

  // Add a pack to the cart
  addToCart(packToAdd) {
    this.cart.items.push(packToAdd);
    this.cart.total += packToAdd.price;
  },

  // Purchase the items in the cart
  purchaseItems() {
    // we need this temporary until firebase is fixed, then we can use this.totalPrice I think
    const totalCost = this.cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  
    // Check if the user has enough balance
    if (totalCost <= this.balance) {
      // Move items from the cart to the packs array
      this.cartItems.forEach((item) => {
        this.setPackQuantity(item.id, item.quantity);
      });
  
      // update balance
      this.balance -= totalCost;
  
      // Clear the cart
      this.cartItems = [];
      this.totalPrice = 0;
  
      console.log("Purchase successful. Packs array: ", this.packs);
    } else {
      console.log("Insufficient balance. Unable to purchase.");
    }
  },  


  // Set the search query text
  setSearchQuery(queryText) {
    this.searchParams.query = queryText;
  },
  
  pokemonSearch(searchParams) {
    const allPokemons = this.initializePokemonDataPromiseState.data;

    // Filter based on search query and selected types
    const filteredPokemons = allPokemons.filter((pokemon) => {
      // Check if the pokemon type matches the selected types
      let typeMatch =
        !searchParams.selectedTypes.length ||
        pokemon.Types.some((type) => searchParams.selectedTypes.includes(type));

        // If there are two selected types, check if they both match
        if(searchParams.selectedTypes.length == 2){
          typeMatch = searchParams.selectedTypes.every(selectedType => 
            pokemon.Types.map(type => type.name).includes(selectedType));
        }
        // Check if the pokemon name matches the search query
      const searchMatch =
        !searchParams.query ||
        pokemon.Name.toLowerCase().includes(searchParams.query.toLowerCase());

        // Return pokemon that match both type and search inputs.
      return typeMatch && searchMatch;
    });

    // Update searchResultsPromiseState with filtered results
    resolvePromise(
      Promise.resolve(filteredPokemons),
      this.searchResultsPromiseState
    );
  },

  // Sets current pokemon based on pokemonID and fetches details about it.
  setCurrentPokemon(pokemonID) {
    const url = BASE_URL + "pokemon/" + pokemonID;
    if (pokemonID) {
        if (this.currentPokemon !== pokemonID) {
            this.currentPokemon = pokemonID;
            const promise = getPokemonDetails(url);
            resolvePromise(promise, this.currentPokemonPromiseState);
        }
    } else {
        this.currentPokemon = null;
        this.currentPokemonPromiseState = {};
    }
  },

  // Function to get the user's collection
  getUserPokemonCollection() {
    return this.collection;
  },

  // Function to add Pokemon to the user's collection
  addPokemonToCollection(pokemon) {
    this.collection.push(pokemon);
  },

  //func to open packs, depandant on packID
  openPack(packId) {
    
    const pokemonCollection = this.getUserPokemonCollection();

    // The range for pokemon id:s for each generation
    const packRanges = {
      1: { start: 1, end: 151 },
      2: { start: 152, end: 251 },
      3: { start: 252, end: 386 },
      4: { start: 387, end: 495 },
      5: { start: 496, end: 649 },
      6: { start: 650, end: 721 },
      7: { start: 722, end: 809 },
      8: { start: 810, end: 905 },
      9: { start: 906, end: 1017 },
      // Add legendary pack later
    };

    // Check if the pack ID is valid
    if (packRanges.hasOwnProperty(packId)) {
      const range = packRanges[packId];
      const randomPokemon = this.generateRandomPokemon(range.start, range.end, 10);

      // Add the random Pokemon to the user's collection
      this.addPokemonToCollection(randomPokemon, pokemonCollection);
      console.log("added pokemon to collection: ", this.collection);

      // You can also return the list of random Pokemon if needed
      return randomPokemon;
    } else {
      console.error(`Invalid pack ID: ${packId}`);
      return null;
    }
  },

  // needed to generate 10 random pokemon for the pack opening
  generateRandomPokemon(start, end, count) {
    const randomPokemon = [];
    while (randomPokemon.length < count) {
      const randomId = Math.floor(Math.random() * (end - start + 1)) + start;
      if (!randomPokemon.includes(randomId)) {
        randomPokemon.push(randomId);
      }
    }
    console.log("pokemon from pack: ", randomPokemon);
    return randomPokemon;
  },


  setUser(user) {
    if(user == undefined){
      this.isLoggedIn = false;
    }
    else {
      this.user = user;
      this.isLoggedIn = true;
    }
  },



});

export default observable(pokeModel);



