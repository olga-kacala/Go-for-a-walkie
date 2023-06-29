import React from 'react';
import './App.css';
import { Routes, Route} from "react-router-dom";
import {Home} from './components/Home/Home';
import { Footer } from './components/Footer/Footer';


function App() {
  return (
    <div>
      <Routes>
        <Route path="*" element={<Home/>}/>
      </Routes>
      <Footer/>
    </div>
  );
}

export default App;

