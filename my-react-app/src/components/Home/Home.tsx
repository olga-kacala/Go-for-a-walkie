import classes from './Home.module.css';
import { Login } from '../Login/Login';
import { Link } from 'react-router-dom';

export function Home() {

    return (
  <div>
  <header>
    <h1>Walkie</h1>
    <p>Find a Dog Walking Buddy</p>
  </header>
  <section>
    <div className={classes.content}>
      <h2>Connect with fellow dog owners for dog walking adventures!</h2>
      <p>Join our community and find the perfect walking buddy for your furry friend.</p>

      <Link
									className={classes.button}
									to='/Login'
									>
									Get Started
								</Link>
    </div>
  </section>


  </div>
    )
}