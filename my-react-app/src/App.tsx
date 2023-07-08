import React, { useContext, useEffect } from 'react';
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
import {Logout} from './components/Logout/Logout';


const firebaseApp = initializeApp(firebaseConfig);
// const analytics = getAnalytics(firebaseApp);
export const firebaseAuth = getAuth(firebaseApp);
export const firebaseDb = getFirestore(firebaseApp)


function App() {
  const {setUsername, myPets, setMyPets, setIsLogged, pets}=useContext(AppContext);

  useEffect(():void=> {
onAuthStateChanged(firebaseAuth, async (user)=> {
  // console.log('Auth state changed:', user);
  if (user){
    const userEmail = user.email;
    console.log('user email:',userEmail)
    setUsername(userEmail);
    setIsLogged(true);
    const docRef = doc(firebaseDb, "MyPets", `${user.email}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      setMyPets(data.pets);
    }
  } else {
    setUsername("");
    setMyPets([]);
   
  }
});
  },[setMyPets, setUsername, setIsLogged, pets]);

  return (
    <div className={classes.main}>
      <Header/>
      <Routes>
        <Route path="*" element={<Home/>}/>
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register/>}/>
        <Route path="/MyPets" element={<MyPets myPets={myPets}/>}/>
        <Route path ="/Logout" element={<Logout/>}/>
      </Routes>
      <Footer/>
    </div>
  );
}
export default App;

