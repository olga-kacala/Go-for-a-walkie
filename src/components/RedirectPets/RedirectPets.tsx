import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import classes from "./RedirectPets.module.css";

export function RedirectPets(): JSX.Element {
  const navigate = useNavigate();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      navigate("/MyPets");
    }, 100);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className={classes.logoutContainer}>
     <h2>Loading...</h2>
    </div>
  );
}
