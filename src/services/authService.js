import { onAuthStateChanged, signInWithPopup, signInWithRedirect, signOut, GoogleAuthProvider } from 'firebase/auth';
import model from '/src/models/pokeModel.js';
import { auth } from '/src/firebaseConfig.js';
import db from '/src/firebaseModel';


const handleAuthStateChange = () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      model.setUser(user);
      db.readUserDataFromFirebase(user.uid).then(() => {
        model.initializeTotalPrice();
      });
    } else {
      model.setUser(undefined);
    }
  });
};

export const googleSignIn = (navigateCallback) => {
  const provider = new GoogleAuthProvider();
  
  provider.setCustomParameters({
    prompt: 'login',
  });

  signInWithPopup(auth, provider)
    .then(() => {
      handleAuthStateChange();
      navigateCallback('/'); // Navigating after successful sign-in
    })
    .catch((error) => {
      console.error('Google Sign-In Error:', error);
    });
};


export const logOut = (navigateCallback) => {
  signOut(auth)
    .then(() => {
      handleAuthStateChange();
      navigateCallback('/'); // Navigating after successful logout
    })
    .catch((error) => {
      console.error('Logout Error:', error);
    });
};

export default handleAuthStateChange;