import React from 'react';
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


const firebaseApp = initializeApp(firebaseConfig);
// const analytics = getAnalytics(firebaseApp);
export const firebaseAuth = getAuth(firebaseApp);
export const firebaseDb = getFirestore(firebaseApp)


function App() {
  return (
    <div className={classes.main}>
      <Header/>
      <Routes>
        <Route path="*" element={<Home/>}/>
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register/>}/>
      </Routes>
      <Footer/>
    </div>
  );
}
export default App;

