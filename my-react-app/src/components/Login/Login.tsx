import classes from "./Login.module.css";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth } from "../../App";

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
      <div className={classes.registration}>
        <h2>Create an Account</h2>
        <form>
          <input type="text" placeholder="Name" required />
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          <button type="submit" className={classes.button}>
            Sign Up
          </button>
        </form>
        <p>
          Already have an account?{" "}
          <a href="login.html" className={classes.button}>
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
