import { Link } from "react-router-dom";

export function Logout(): JSX.Element {
 
  return (
    <div>
      <h2>You have been logged out</h2>
      <h3>If you want to go for a Walkie</h3>
      <button>
        <Link to="/Login">Log in</Link>
      </button>
    </div>
  );
}
