import classes from "./Header.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AppContext } from "../Providers/Providers";
import { signOut } from "firebase/auth";
import { firebaseAuth } from "../../App";

export function Header(): JSX.Element {
  const { isLogged, setIsLogged, username, myPets } = useContext(AppContext);
  console.log("Header username:", username);

  const navigate = useNavigate();

  const handleLogout = async (): Promise<void> => {
    try {
      await signOut(firebaseAuth);
    } catch (error) {
      console.log(error);
    }
    setIsLogged(false);
    navigate("/Logout");
  };

  return (
    <div>
      {isLogged}
      <header className={classes.header}>
        <Link className={classes.link} to="*">
          <h1>Walkie</h1>
        </Link>
        <p>Find a Dog Walking Buddy </p>
        <span>Hello, {username}!</span>
        <Link className={classes.link} to="/MyPets">
          My Pets
        </Link>
        <Link className={classes.link} to="/Logout">
          Log out
        </Link>
      </header>
    </div>
  );
}
