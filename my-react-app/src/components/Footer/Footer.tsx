import classes from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={classes.footer}>
      <p>&copy; 2023 Walkie. All rights reserved.</p>
      <div className={classes.logos}>
        <p>Author:</p>
        <a href="https://github.com/olga-kacala" target="_blank">
          <img title="My GH" alt="GitHub" src={"../../Img/github-logo.png"} />
        </a>
        <a href="https://www.linkedin.com/in/olga-kacala/" target="_blank">
          <img
            title="My LinkedIn"
            alt="LinkedIn"
            src={"../../Img/LI-logo.png"}
          />
        </a>
      </div>
    </footer>
  );
}
