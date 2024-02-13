import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import classes from "./Logout.module.css";

export function Logout(): JSX.Element {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate("*");
    }, 2000);
  }, []);

  return (
    <div className={classes.logoutContainer}>
      <div className={classes.logout}>
        <h2>Thank you for a Walk!</h2>
        <img
          src={process.env.PUBLIC_URL + "/Img/Perek.jpg"}
          title="See you soon"
          alt="Bird picture"
          className={classes.Perek}
        />
        <div className={classes.bottomH2}>
          <h2>Come again soon!</h2>
        </div>
      </div>
    </div>
  );
}
