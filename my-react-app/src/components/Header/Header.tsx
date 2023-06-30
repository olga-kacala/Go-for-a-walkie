import classes from "./Header.module.css";
import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className={classes.header}>
      <Link className={classes.link} to="*">
        <h1>Walkie</h1>
      </Link>
      <p>Find a Dog Walking Buddy</p>
    </header>
  );
}
