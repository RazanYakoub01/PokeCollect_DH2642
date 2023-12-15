// firebaseModel.js
import { ref, get } from 'firebase/database';
import { database } from './firebaseConfig.js';
import { auth } from '/src/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import model from './models/pokeModel.js';

const readFromFirebase = async (userId) => {
  try {
    const userCartRef = ref(database, `users/${userId}/cart`);
    const snapshot = await get(userCartRef);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log('No data available for this user.');
      return null;
    }
  } catch (error) {
    console.error('Error retrieving data from Firebase:', error);
    return null;
  }
};

const initializeFirebase = async () => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      // If the user is logged in, fetch the necessary data
      const data = await readFromFirebase(user.uid);
      console.log("logging");
      console.log(data);
      model.setCartItems(data.cartItems);
      // Update your MobX model or React state with this data
    }
  });
};

export default {initializeFirebase,
};