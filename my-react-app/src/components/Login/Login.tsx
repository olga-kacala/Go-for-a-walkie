import classes from "./Login.module.css";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth } from "../../App";
import { Link } from "react-router-dom";

export function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [isinputError, setIsInputError] = useState(false);

  const signIn = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(firebaseAuth, username, password);
      navigate("*");
    } catch ({ message }) {
      console.log(message);
      setIsInputError(true);
      setError("Sorry, wrong password or login. Pls try again");
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  return (
    <div>
      <div className={classes.login}>
        <h2>Please Log in</h2>
        <form>
          <input
            name="login"
            type="email"
            id="email"
            value={username}
            placeholder="Email"
            required
            onChange={(e)=>{
              setUsername(e.target.value);
              setIsInputError(false);
            }}
          />
          <input 
          name="password"
          id="password"
          type="password" 
          value={password}
          placeholder="Password" 
          required
          onChange={(e)=>{
            setPassword(e.target.value);
            setIsInputError(false);
          }} />
          <p>{error}</p>
          <button className={classes.button} onClick={signIn}>
            Go
          </button>
        </form>
        <p>
          Don't have an account?{" "}
          <Link className={classes.button} to="/Register">
            Create an Walkie Account
          </Link>
        </p>
      </div>
    </div>
  );
}
