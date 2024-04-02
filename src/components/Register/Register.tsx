import { createUserWithEmailAndPassword } from "firebase/auth";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { firebaseAuth } from "../../App";
import { AppContext } from "../Providers/Providers";
import classes from "./Register.module.css";

export function Register(): JSX.Element {
  const { setIsLogged } = useContext(AppContext);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [repeatPassword, setRepeatPassword] = useState<string>("");
  const [isUsernameError, setIsUsernameError] = useState<boolean>(false);
  const [isPasswordError, setIsPasswordError] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (username === "") {
      setError("Pls enter your email");
      setIsUsernameError(true);
      return;
    }
    if (password !== repeatPassword) {
      setError("Password is not repeated correctly");
      setIsPasswordError(true);
      return;
    }
    if (password.length < 6) {
      setError("Password must have min 6 symbols");
      setIsPasswordError(true);
      return;
    }
    try {
      await createUserWithEmailAndPassword(firebaseAuth, username, password);
      setIsLogged(true);
      navigate("/MyPets");
    } catch ({ code, message, password, repeatPassword }) {
      if (code === "auth/email-already-in-use") {
        setIsUsernameError(true);
        setError("There is already account with that email");
      }
      if (code === "auth/invalid-email") {
        setIsUsernameError(true);
        setError("Your email is invalid. Please type a correct email address.");
      }
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <div className={classes.login}>
      <div className={classes.PolaBackgr}></div>
      <div className={classes.inputContainer}>
        <h2>Please Register</h2>
        <form>
          <input
            name="login"
            type="email"
            id="email"
            value={username}
            placeholder="Email"
            required
            onChange={(e) => {
              setUsername(e.target.value);
              setIsUsernameError(false);
            }}
          />
          <input
            name="password"
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            placeholder="Password"
            required
            onChange={(e) => {
              setPassword(e.target.value);
              setIsPasswordError(false);
            }}
          />
          <input
            name="repeat"
            type="password"
            value={repeatPassword}
            placeholder="Repeat password"
            required
            onChange={(e) => {
              setRepeatPassword(e.target.value);
              setIsPasswordError(false);
            }}
          />
          <button
            type="button"
            className={classes.passwordToggle}
            onClick={togglePasswordVisibility}
          >
            {showPassword ? "Hide psw" : "Show psw"}
          </button>
          <p>{error}</p>
          <button className={classes.button} onClick={handleSubmit}>
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
