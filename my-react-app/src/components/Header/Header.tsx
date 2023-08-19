import classes from "./Header.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../Providers/Providers";
import { signOut } from "firebase/auth";
import { firebaseAuth } from "../../App";

export function Header(): JSX.Element {
  const { isLogged, setIsLogged, username, logoPop } =
    useContext(AppContext);
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

  const bumpClasses = `${classes["link"]} ${logoPop ? classes.bump : ""}`;

  return (
    <div>
      <header className={classes.header}>
        <Link className={classes.link} to="*">
          <h1>Walkie</h1>
        </Link>
        <p>Find a Dog Walking Buddy </p>

        {isLogged ? (
          <nav className={classes.nav}>
            <span>Hello, {username && username.split("@")[0]}!</span>
            <Link className={bumpClasses} to="/Maps">
              Maps
            </Link>
            <Link className={bumpClasses} to="/Weather">
              Weather
            </Link>
            <Link className={bumpClasses} to="/MyPets">
              My Pets
            </Link>
            <Link className={classes.link} to="*" onClick={handleLogout}>
              Log out
            </Link>
          </nav>
        ) : (
          <nav className={classes.nav}>
            <Link className={classes.link} to="/Login">
              Log in
            </Link>
            <Link className={classes.link} to="/Register">
              Register
            </Link>
          </nav>
        )}
      </header>
    </div>
  );
}
