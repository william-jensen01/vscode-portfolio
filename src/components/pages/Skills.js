import Codebar from "../Codebar";
import SkillsList from "./SkillsList";

import "../../styles/skills.css";

function Skills() {
  return (
    <div className="skills-container">
      <Codebar amount={41} type="sk" />
      <div className="skills">
        <p>
          <span className="sk-purp">import</span>{" "}
          <span className="sk-red">React </span>{" "}
          <span className="sk-purp">from</span>{" "}
          <span className="sk-file">"react"</span>
          <span className="sk-semicolon">;</span>
        </p>
        <p>
          <span className="sk-purp">import</span>{" "}
          <span className="sk-red">SoftwareEngineer</span>{" "}
          <span className="sk-purp">from</span>{" "}
          <span className="sk-file">"william-jensen"</span>
          <span className="sk-semicolon">;</span>
        </p>
        <br />
        <p>
          <span className="sk-purp">const</span>{" "}
          <span className="sk-blue">Skills</span>{" "}
          <span className="sk-lightblue">=</span>{" "}
          <span className="sk-orange">()</span>{" "}
          <span className="sk-purp">{"=>"}</span>{" "}
          <span className="sk-orange">SoftwareEngineer.Create()</span>{" "}
          <span className="sk-orange">{"{"}</span>
        </p>
        <div style={{ paddingLeft: "5%" }}>
          <p>
            <span className="sk-purp">return (</span>
          </p>

          <SkillsList
            name="CORE SKILLS"
            list={["JavaScript", "HTML", "CSS", "Python", "Git"]}
          />
          <br />
          <SkillsList
            name="FRONTEND TECHNOLOGIES"
            list={[
              "React",
              "Redux",
              "Context",
              "MaterialUI",
              "Bookstrap & Reactstrap",
              "Styled-Components",
            ]}
          />
          <br />
          <SkillsList
            name="BACKEND TECHNOLOGIES"
            list={[
              "Node.js",
              "Express",
              "Knex",
              "PostgreSQL",
              "SQLite",
              "MySQL",
              "Postman",
            ]}
          />
          <br />
          <SkillsList name="Testing" list={["Cypress.io", "Jest"]} />
          <p>
            <span className="sk-purp">)</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Skills;
