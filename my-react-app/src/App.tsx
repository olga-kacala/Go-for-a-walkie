import { useContext, useEffect, useState } from 'react';
import classes from './App.module.css';
import { Routes, Route} from "react-router-dom";
import {Home} from './components/Home/Home';
import { Footer } from './components/Footer/Footer';
import { Login } from './components/Login/Login';
import { Header } from './components/Header/Header';
import { Register } from './components/Register/Register';
import { onAuthStateChanged } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { firebaseConfig } from "./firebase";
import { MyPets } from './components/MyPets/MyPets';
import { AppContext } from './components/Providers/Providers';
import { Logout } from './components/Logout/Logout';
import { Pet } from "./components/Providers/Providers";

const firebaseApp = initializeApp(firebaseConfig);
// const analytics = getAnalytics(firebaseApp);
export const firebaseAuth = getAuth(firebaseApp);
export const firebaseDb = getFirestore(firebaseApp)

function App() {
  const {setUsername, myPets, setMyPets, setIsLogged, animals}=useContext(AppContext);
  const [myAnimalsList, setmyAnimalsList] = useState([] as Pet[]);

  useEffect(():void=> {
onAuthStateChanged(firebaseAuth, async (user)=> {
  if (user){
    const userEmail = user.email;
    setUsername(userEmail);
    setIsLogged(true);
    const docRef = doc(firebaseDb, 'MyPets', `${user.email}`);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      setmyAnimalsList(data.animals);
      console.log(data.animals)
    }
  } else {
    setUsername("");
    setmyAnimalsList([]);
   
  }
});
  },[setmyAnimalsList, setUsername, setIsLogged, animals]);

  return (
    <div className={classes.main}>
      <Header/>
      <Routes>
        <Route path="*" element={<Home/>}/>
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register/>}/>
        <Route path="/MyPets" element={<MyPets myPetsList={myPets}/>}/>
        <Route path ="/Logout" element={<Logout/>}/>
      </Routes>
      <Footer/>
    </div>
  );
}
export default App;

