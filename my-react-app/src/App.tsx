import React from 'react';
import classes from './App.module.css';
import { Routes, Route} from "react-router-dom";
import {Home} from './components/Home/Home';
import { Footer } from './components/Footer/Footer';
import { Login } from './components/Login/Login';
import { Header } from './components/Header/Header';

function App() {
  return (
    <div className={classes.main}>
      <Header/>
      <Routes>
        <Route path="*" element={<Home/>}/>
        <Route path="/Login" element={<Login />} />
      </Routes>
      <Footer/>
    </div>
  );
}
export default App;

