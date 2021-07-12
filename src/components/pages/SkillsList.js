import "../../styles/skills.css";

function SkillsList({ name, list }) {
  return (
    <div className="skills-list">
      <div style={{ paddingLeft: "5%" }}>
        <p>
          <span className="sk-element-bracket">{"<"}</span>
          <span className="sk-element">h2</span>
          <span className="sk-element-bracket">{">"}</span>
          {` ${name} `}
          <span className="sk-element-bracket">{"</"}</span>
          <span className="sk-element">h2</span>
          <span className="sk-element-bracket">{">"}</span>
        </p>
        <p>
          <span className="sk-element-bracket">{"<"}</span>
          <span className="sk-element">ul</span>
          <span className="sk-element-bracket">{">"}</span>
        </p>
        <div style={{ paddingLeft: "5%" }}>
          {list.map((item) => (
            <div key={item}>
              <p>
                <span className="sk-element-bracket">{"<"}</span>
                <span className="sk-element">li</span>
                <span className="sk-element-bracket">{">"}</span>
                {` ${item} `}
                <span className="sk-element-bracket">{"</"}</span>
                <span className="sk-element">li</span>
                <span className="sk-element-bracket">{">"}</span>
              </p>
            </div>
          ))}
        </div>
        <p>
          <span className="sk-element-bracket">{"</"}</span>
          <span className="sk-element">ul</span>
          <span className="sk-element-bracket">{">"}</span>
        </p>
      </div>
    </div>
  );
}

export default SkillsList;
