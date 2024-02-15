import classes from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={classes.footer}>
      <p>&copy; 2023 Walkie. All rights reserved.</p>
      <div className={classes.logos}>
        <p>Created by:</p>
        <div>
        <a href="https://github.com/olga-kacala" target="_blank">
          <img
            title="My GH"
            alt="GitHub"
            src={process.env.PUBLIC_URL + "/Img/github-logo.png"}
          />
        </a>
        <a href="https://www.linkedin.com/in/olga-kacala/" target="_blank">
          <img
            title="My LinkedIn"
            alt="LinkedIn"
            src={process.env.PUBLIC_URL + "/Img/LI-logo.png"}
          />
        </a>
        </div>
        
      </div>
    </footer>
  );
}
