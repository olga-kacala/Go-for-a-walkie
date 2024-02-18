import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import classes from "./RedirectMaps.module.css";

export function RedirectMaps(): JSX.Element {
  const navigate = useNavigate();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      navigate("/Maps");
    }, 100);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className={classes.logoutContainer}>
     <h2>Loading...</h2>
    </div>
  );
}
