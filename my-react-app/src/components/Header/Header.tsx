import classes from "./Header.module.css";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { AppContext } from "../Providers/Providers";

export function Header():JSX.Element {

  const {isLogged, setIsLogged, username, myPets} = useContext(AppContext);

const contentIsLogged = (
  <header className={classes.header}>
      <Link className={classes.link} to="*">
        <h1>Walkie</h1>
      </Link>
      <p>Find a Dog Walking Buddy </p>
    <Link className={classes.link} to="/MyPets">My Pets</Link>
    <span>Hello, {username}!</span>
    </header>

)
  return (
    <div>
    {!isLogged}
    <header className={classes.header}>
      <Link className={classes.link} to="*">
        <h1>Walkie</h1>
      </Link>
      <p>Find a Dog Walking Buddy </p>
    </header>

    {isLogged && contentIsLogged}
      <header className={classes.header}>
      <Link className={classes.link} to="*">
        <h1>Walkie</h1>
      </Link>
      <p>Find a Dog Walking Buddy </p>
    <Link className={classes.link} to="/MyPets">My Pets</Link>
    </header>
   </div> 
  );
}
