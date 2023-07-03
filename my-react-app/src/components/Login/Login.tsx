import classes from './Login.module.css';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

export function Login() {

    return (
  <div>
  <div className={classes.registration}>
        <h2>Create an Account</h2>
        <form>
          <input type="text" placeholder="Name" required />
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          <button type="submit" className={classes.button}>Sign Up</button>
        </form>
        <p>
          Already have an account? <a href="login.html" className={classes.button}>Log in</a>
        </p>
      </div>
  </div>
 
    )
}