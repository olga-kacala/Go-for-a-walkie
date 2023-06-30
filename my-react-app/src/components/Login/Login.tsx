import classes from './Login.module.css';
import { Footer } from '../Footer/Footer';

export function Login() {

    return (
  <div>
  <div className="registration-form">
        <h2>Create an Account</h2>
        <form>
          <input type="text" placeholder="Name" required />
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          <button type="submit">Sign Up</button>
        </form>
        <p>
          Already have an account? <a href="login.html">Log in</a>
        </p>
      </div>
  </div>
 
    )
}