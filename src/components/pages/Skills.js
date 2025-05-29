import React from "react";
import { EditorInstance } from "../Editor";
import Scope from "../Editor/Features/Scope";
import NewLine from "../Editor/Elements/Line";
import Bracket from "../Editor/Elements/Bracket";
import { Space } from "../Editor/Elements";
import { JS, Require } from "../Editor/JS";
import { List, Tag } from "../Editor/HTML";

// import "../../styles/skills.css";
const map = {
	"CORE SKILLS": ["JavaScript", "HTML", "CSS", "Python", "Git"],
	"FRONTEND TECHNOLOGIES": [
		"React",
		"Redux",
		"Context",
		"MaterialUI",
		"Bootstrap & Reactstrap",
		"Styled-Components",
	],
	"BACKEND TECHNOLOGIES": [
		"Node.js",
		"Express",
		"Knex",
		"Flask",
		"SQLAlchemy",
		"Beautiful Soup",
		"PostgreSQL",
		"SQLite",
		"Postman",
	],
	TESTING: ["Cypress.io", "Jest"],
};

function Skills() {
	return (
		<EditorInstance>
			<JS>
				<Require>
					<Require.Item>React</Require.Item>
					<Require.Package>react</Require.Package>
				</Require>
				<Require>
					<Require.Item>SoftwareEngineer</Require.Item>
					<Require.Package>william-jensen</Require.Package>
				</Require>
				<NewLine />

				<Scope>
					<NewLine>
						<span className="js-variable-declaration">const</span>
						&nbsp;
						<span className="js-variable-name">Skills</span>
						&nbsp;
						<span className="js-equals">=</span>
						&nbsp;
						<Bracket character="(" />
						<Bracket character=")" />
						&nbsp;
						<span className="js-function-arrow">{"=>"}</span>
						&nbsp;
						<span className="js-class-name">SoftwareEngineer</span>
						<span className="js-period">{"."}</span>
						<span className="js-class-method">Create</span>
						<Bracket character="(" />
						<Bracket character="(" />
						<Bracket character=")" />
						&nbsp;
						<span className="js-function-arrow">{"=>"}</span>
						&nbsp;
						<Bracket character="{" />
					</NewLine>

					<Scope>
						<NewLine>
							<span className="js-function-return">return</span>
							&nbsp;
							<Bracket character="(" />
						</NewLine>
						<Scope>
							<NewLine>
								<Tag>main</Tag>
							</NewLine>
							{Object.keys(map).map((key, idx) => {
								return (
									<React.Fragment key={`map-h2:${idx}`}>
										<NewLine>
											<Tag>h2</Tag>
											<Space />
											<span className="html-text">
												{key}
											</span>
											<Space />
											<Tag closing>h2</Tag>
										</NewLine>
										<List unordered key={key}>
											{map[key].map((item, itemIdx) => (
												<List.Item
													key={`map-list-item: ${key}.${itemIdx}`}
												>
													{item}
												</List.Item>
											))}
										</List>
										<NewLine />
									</React.Fragment>
								);
							})}

							<NewLine>
								<Tag closing>main</Tag>
							</NewLine>
						</Scope>

						<NewLine>
							<Bracket character=")" />
						</NewLine>
					</Scope>

					<NewLine>
						<Bracket character="}" />
						<Bracket character=")" />
					</NewLine>
				</Scope>
			</JS>
		</EditorInstance>
	);
}

export default Skills;
