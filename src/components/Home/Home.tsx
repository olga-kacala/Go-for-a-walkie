import classes from "./Home.module.css";
import { Link } from "react-router-dom";

export function Home() {
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") {
      document.title = "Walkie - come back to me!";
    } else {
      document.title = "Walkie";
    }
  });
  return (
    <div>
      <section>
        <div className={classes.contentLogIn}>
          <div className={classes.text}>
            <h2>Connect with fellow dog owners for dog walking adventures!</h2>
            <p>
              Join our community and find the perfect walking buddy for your
              furry friend.
            </p>
          </div>
          <div>
            <Link className={classes.button} to="/Login">
              Get Started {"\uD83D\uDC36"}
            </Link>
          </div>
        </div>
      </section>
      <section>
        <div className={classes.movieSection}>
          <div className={classes.descriptionWalkie}>
            <img
              src={process.env.PUBLIC_URL + "/Img/Walkie.png"}
              title="
              Walkie"
              alt="Walkie"
              className={classes.walkie}
            />
            <div className={classes.Apptext}>
              Walkie is your go-to app for planning and sharing pet-friendly
              walks! With Walkie Pal, you can easily map out routes, schedule
              walks, invite furry friends, and share your adventures with
              others. Enjoy features like customizable markers, distance
              tracking, and social sharing to make every walk memorable. Join
              our community of pet lovers and explore the world one paw at a
              time with Walkie!
            </div>
          </div>

          <video controls width="940px" height="788px" autoPlay muted>
            <source
              src={process.env.PUBLIC_URL + "/Movie/GoforaWalkie.mp4"}
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </div>
      </section>
      <section className={classes.instruction}>
        <div className={classes.movieSection}>
          <video controls width="940px" height="788px" autoPlay muted>
            <source
              src={process.env.PUBLIC_URL + "/Movie/point.mp4"}
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </div>
      </section>
    </div>
  );
}
