import "../../styles/skills.css";

function SkillsList({ name, list }) {
  return (
    <div className="skills-list">
      <div style={{ paddingLeft: "5%" }}>
        <p>
          {"<"}
          <span className="sk-red">{"h2"}</span>
          {">"} {name} {"</"}
          <span className="sk-red">{"h2"}</span>
          {">"}
        </p>
        <p>
          {"<"}
          <span className="sk-red">{"ul"}</span>
          {">"}
        </p>
        <div style={{ paddingLeft: "5%" }}>
          {list.map((item) => (
            <div key={item}>
              <p>
                {"<"}
                <span className="sk-red">{"li"}</span>
                {">"} {item} {"</"}
                <span className="sk-red">{"li"}</span>
                {">"}
              </p>
            </div>
          ))}
        </div>
        <p>
          {"</"}
          <span className="sk-red">{"ul"}</span>
          {">"}
        </p>
      </div>
    </div>
  );
}

export default SkillsList;
