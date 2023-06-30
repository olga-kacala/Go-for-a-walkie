import classes from "./Home.module.css";
import { Link } from "react-router-dom";

export function Home() {
  return (
    <div>
      <section>
        <div className={classes.content}>
          <h2>Connect with fellow dog owners for dog walking adventures!</h2>
          <p>
            Join our community and find the perfect walking buddy for your furry
            friend.
          </p>
          <Link className={classes.button} to="/Login">
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
}
