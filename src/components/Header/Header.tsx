import classes from "./Header.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../Providers/Providers";
import { signOut } from "firebase/auth";
import { firebaseAuth } from "../../App";
import { Weather } from "../Weather/Weather";

export function Header(): JSX.Element {
  const { isLogged, setIsLogged, username, logoPop } = useContext(AppContext);
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
        <Link className={classes.link} to="/Home">
          <h1 className={classes.title}>Walkie</h1>
        </Link>
        <p className={classes.secondTitle}>Find a Dog Walking Buddy </p>

        {isLogged ? (
          <nav className={classes.nav}>
            <Weather />
            <span className={classes.helloUser}>
              Hello, {username && username.split("@")[0]}!
            </span>
            <div className={classes.loggedLinks}>
              <Link className={classes.link} to="/Maps">
                Maps
              </Link>
              <Link className={bumpClasses} to="/MyPets">
                My Pets
              </Link>
              <Link className={classes.link} to="/Home" onClick={handleLogout}>
                Log out
              </Link>
            </div>
          </nav>
        ) : (
          <nav className={`${classes.nav} ${classes.flexContainer}`}>
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
