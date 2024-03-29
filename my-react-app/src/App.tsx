import classes from "./App.module.css";
import { Routes, Route } from "react-router-dom";
import { Home } from "./components/Home/Home";
import { Footer } from "./components/Footer/Footer";
import { Login } from "./components/Login/Login";
import { Header } from "./components/Header/Header";
import { Register } from "./components/Register/Register";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { firebaseConfig } from "./firebase";
import { MyPets } from "./components/MyPets/MyPets";
import { Logout } from "./components/Logout/Logout";
import { Maps } from "./components/Maps/Maps";
import { RedirectMaps } from "./components/RedirectMaps/RedirectMaps";
import { RedirectPets } from "./components/RedirectPets/RedirectPets";

export const firebaseApp = initializeApp(firebaseConfig);
// const analytics = getAnalytics(firebaseApp);
export const firebaseAuth = getAuth(firebaseApp);
export const firebaseDb = getFirestore(firebaseApp);

function App() {
  return (
    <div className={classes.main}>
      <Header />
      <Routes>
  <Route path="/Home" element={<Home />} />
  <Route path="/Login" element={<Login />} />
  <Route path="/Register" element={<Register />} />
  <Route path="/MyPets" element={<MyPets />} />
  <Route path="/Logout" element={<Logout />} />
  <Route path="/RedirectMaps" element={<RedirectMaps />} />
  <Route path="/RedirectPets" element={<RedirectPets />} />
  <Route path="/*" element={<Maps />} />
</Routes>

      <Footer />
    </div>
  );
}
export default App;
