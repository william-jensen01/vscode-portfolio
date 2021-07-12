import Codebar from "../Codebar";
import SkillsList from "./SkillsList";

import "../../styles/skills.css";

function Skills() {
  return (
    <div className="skills-container">
      <Codebar amount={43} type="sk" />
      <div className="skills">
        <p>
          <span className="sk-keyword">import</span>{" "}
          <span className="sk-import-name">React </span>{" "}
          <span className="sk-keyword">from</span>{" "}
          <span className="sk-location">"react"</span>
          <span className="sk-semicolon">;</span>
        </p>
        <p>
          <span className="sk-keyword">import</span>{" "}
          <span className="sk-import-name">SoftwareEngineer</span>{" "}
          <span className="sk-keyword">from</span>{" "}
          <span className="sk-location">"william-jensen"</span>
          <span className="sk-semicolon">;</span>
        </p>
        <br />
        <p>
          <span className="sk-variable">const</span>{" "}
          <span className="sk-function">Skills</span>{" "}
          <span className="sk-equals">=</span>{" "}
          <span className="sk-bracket">()</span>{" "}
          <span className="sk-arrow">{"=>"}</span>{" "}
          <span className="sk-create">SoftwareEngineer.Create()</span>{" "}
          <span className="sk-bracket">{"{"}</span>
        </p>
        <div style={{ paddingLeft: "5%" }}>
          <p>
            <span className="sk-return">return (</span>
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
            <span className="sk-return">)</span>
          </p>
        </div>
        <span className="sk-bracket">{`}`}</span>
      </div>
    </div>
  );
}

export default Skills;
