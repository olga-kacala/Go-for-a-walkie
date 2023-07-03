import { useState } from "react";
import classes from "./Register.module.css";

export function Register ():JSX.Element {
const [username, setUsername] = useState<string>('');
const  [password, setPassword] = useState<string>('');
const [error, setError] = useState<string>('');
const [repeatPassword, setRepeatPassword] = useState<string>('');
const [isUsernameError, setIsUsernameError] = useState<boolean>(false);
const [isPasswordError, setIsPasswordError] = useState<boolean>(false);
    return (
<div>
      <div className={classes.login}>
        <h2>Please Register</h2>
        <form>
          <input
            name="login"
            type="email"
            id="email"
            value={username}
            placeholder="Email"
            required
            
          />
          <input 
          name="password"
          id="password"
          type="password" 
          value={password}
          placeholder="Password" 
          required
           />
          <p>{error}</p>
          <button className={classes.button}>
            Register
          </button>
        </form>
        
      </div>
    </div>
  );
    
}