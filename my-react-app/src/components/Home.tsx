import './Home.module.css';

function Home() {
    return (
        <div>
<body>
  <header>
    <h1>Walkie</h1>
    <p>Find a Dog Walking Buddy</p>
  </header>
  
  <section class="registration-form">
    <h2>Create an Account</h2>
    <form>
      <input type="text" placeholder="Name" required>
      <input type="email" placeholder="Email" required>
      <input type="password" placeholder="Password" required>
      <button type="submit">Sign Up</button>
    </form>
    <p>Already have an account? <a href="login.html">Log in</a></p>
  </section>
  
  <footer>
    <p>&copy; 2023 Walkie. All rights reserved.</p>
  </footer>
</body>
        </div>
    )
}

