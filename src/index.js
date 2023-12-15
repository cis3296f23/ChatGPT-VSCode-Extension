// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDngSVwGEvneOHrp0nCmXc8kFQXopFC4Ic",
  authDomain: "chatgpt-vscode-database.firebaseapp.com",
  projectId: "chatgpt-vscode-database",
  storageBucket: "chatgpt-vscode-database.appspot.com",
  messagingSenderId: "493153122581",
  appId: "1:493153122581:web:59b6a5d7283d3e3605d11c",
  measurementId: "G-JQL7GDCGH2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

const specialDay = doc(firestore, 'dailySpecial/2023-12-10');
function writeDaily() {
  const docData = {
    description: 'A delicious latte',
    price: 5.00,
    milk: 'Whole',
    vegan: 'false',
  };

  setDoc (specialDay, docData);
}

console.log('Testing first function!');  
writeDaily();


// Get a list of cities from your database
{/*async function getCities(db) {
  const citiesCol = collection(db, 'cities');
  const citySnapshot = await getDocs(citiesCol);
  const cityList = citySnapshot.docs.map(doc => doc.data());
  return cityList;
}*/}