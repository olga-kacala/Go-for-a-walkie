import './Home.module.css';

export function Home() {
    return (
  <div>
  <header>
    <h1>Walkie</h1>
    <p>Find a Dog Walking Buddy</p>
  </header>
  
  <section className={classes.hero}>
    <div className={classes.hero-content}>
      <h2>Connect with fellow dog owners for dog walking adventures!</h2>
      <p>Join our community and find the perfect walking buddy for your furry friend.</p>
      <a href="#" className={classes.cta-button}>Get Started</a>
    </div>
  </section>


  </div>
    )
}