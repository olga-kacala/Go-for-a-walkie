import classes from "./Home.module.css";
import { Link } from "react-router-dom";

export function Home() {
  return (
    <div>
      <section>
        <div className={classes.content}>
          <div className={classes.text}>
          <h2>Connect with fellow dog owners for dog walking adventures!</h2>
          <p>
            Join our community and find the perfect walking buddy for your furry
            friend.
          </p>
          </div>
          <div>
          <Link className={classes.button} to="/Login">
            Get Started {'\uD83D\uDC36'}
          </Link>
        </div>
        </div>
      </section>
    </div>
  );
}
