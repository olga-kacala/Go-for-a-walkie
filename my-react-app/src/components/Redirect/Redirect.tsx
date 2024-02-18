import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import classes from "./Redirect.module.css";

export function Redirect(): JSX.Element {
  const navigate = useNavigate();

    useEffect(() => {

    const timeoutId = setTimeout(() => {
      navigate("/Maps");
    }, 500); 
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className={classes.logoutContainer}>
      <div className={classes.logout}>
        <img
          src={process.env.PUBLIC_URL + "/Img/Perek.jpg"}
          title="See you soon"
          alt="Bird picture"
          className={classes.Perek}
        />
      </div>
    </div>
  );
}
