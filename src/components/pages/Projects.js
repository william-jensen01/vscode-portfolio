import sfr from "../assets/secret-family-recipes.png";
import sam from "../assets/sauti-african-marketplace.png";

import "../../styles/projects.css";

function Projects() {
  return (
    <div className="projects-container">
      <h1>Projects</h1>
      <div className="pjs-project">
        <h2>Secret Family Recipes</h2>
        <h4>Role: Full Stack Developer</h4>
        <img src={sfr} alt="Secret Family Recipes" />
        <h3>Overview</h3>
        <hr />
        <p>
          Secret Family Recipes is a safe place to store treasured, beloved
          recipes that have been passed down by generations.
        </p>
        <h3>Technologies</h3>
        <hr />
        <p>React, Redux, Node, Express, Sqlite3</p>
        <div className="pj-links">
          <a
            href="https://github.com/william-jensen01/sfr-frontend"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <a
            href="https://sfr-frontend.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Check it out
          </a>
        </div>
      </div>
      <div className="pjs-project">
        <h2>Sauti African Marketplace</h2>
        <h4>Role: Backend Developer</h4>
        <img src={sam} alt="Sauti African Marketplace" />
        <h3>Overview</h3>
        <hr />
        <p>
          Sauti African Marketplace is a application that empowers small local
          business leaders.
        </p>
        <h3>Technologies</h3>
        <hr />
        <p>Node, Express, Knex, Postgres</p>
        <div className="pj-links">
          <a
            href="https://github.com/Build-Week-African-Marketplace-tt174/back-end"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <a
            href="https://front-end-git-main-alan-and-mark.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Check it out
          </a>
        </div>
      </div>
    </div>
  );
}

export default Projects;
