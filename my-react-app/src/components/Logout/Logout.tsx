import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import classes from "./Logout.module.css";

export function Logout(): JSX.Element {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate("*");
    }, 3000);
  }, []);

  return (
    <div className={classes.logoutContainer}>
      <div className={classes.logout}>
        <h2>Thank you for a Walk!</h2>
        <img
          src="/Img/Perek.jpg"
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
