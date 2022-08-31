import pottyTraining from "../../assets/3-day-potty-training.png";
import keytonomy from "../../assets/keytonomy.png";
import portfolio from "../../assets/portfolio.png";
import sfr from "../../assets/secret-family-recipes.png";

import "../../styles/projects.css";

function Projects() {
	return (
		<div className="projects-container">
			<h1>Projects</h1>
			<div className="pjs-project">
				<h2>3 Day Potty Training</h2>
				<h4>Role: Full Stack Developer</h4>
				<img src={pottyTraining} alt="Keytonomy" />
				<h3>Overview</h3>
				<hr />
				<p>
					3 Day Potty Training is a focused program in which parents spend 3
					consecutive days working to potty train their child. This is roughly
					99% complete as the client needs to provide some further information.
				</p>
				<h3>Technologies</h3>
				<hr />
				<p>
					React, Node, Firebase, Google OAuth, Facebook, Stripe, Paypal, PDF-LIB
				</p>
				<div className="pj-links">
					<a href="https://potty-training-3-day.web.app">Check it out</a>
				</div>
			</div>
			<div className="pjs-project">
				<h2>Keytonomy</h2>
				<h4>Role: Full Stack Developer</h4>
				<img src={keytonomy} alt="Keytonomy" />
				<h3>Overview</h3>
				<hr />
				<p>
					Keytonomy is the cleanest way for keyboard enthusiasts to browse
					interest check and group buy posts on Geekhack. Featuring a fast and
					autonomous web-scrapping backend, Keytonomy is constantly up to date.
				</p>
				<h3>Technologies</h3>
				<hr />
				<p>React, Flask, SQLAlchemy, BeautifulSoup, Postgres</p>
				<div className="pj-links">
					<a
						href="https://github.com/users/william-jensen01/projects/1"
						target="_blank"
						rel="noopener noreferrer"
					>
						Github
					</a>
					<a href="https://keytonomy.vercel.app">Check it out</a>
				</div>
			</div>
			<div className="pjs-project">
				<h2>VSCode Portfolio</h2>
				<h4>Role: Frontend Developer</h4>
				<img src={portfolio} alt="VSCode Portfolio" />
				<h3>Overview</h3>
				<hr />
				<p>
					The website you're currently on! This is a place where I can show my
					projects and skillset. The design is meant to mimic the popular code
					editor VSCode but with a few additional twists. Icons are contained in
					an svg-sprite
				</p>
				<h3>Technologies</h3>
				<hr />
				<p>React, Context</p>
				<div className="pj-links">
					<a
						href="https://github.com/william-jensen01/vscode-portfolio"
						target="_blank"
						rel="noopener noreferrer"
					>
						Github
					</a>
					<a href="https://williambjensen.com">Check it out</a>
				</div>
			</div>
			<div className="pjs-project">
				<h2>Secret Family Recipes</h2>
				<h4>Role: Full Stack Developer</h4>
				<img src={sfr} alt="Secret Family Recipes" />
				<h3>Overview</h3>
				<hr />
				<p>
					Secret Family Recipes is a safe place to store treasured, beloved
					recipes that have been passed down by generations. This was my first
					attempt at a full stack project. Although it is very buggy and
					ultimately unfinished, this project taught me a great deal.
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
		</div>
	);
}

export default Projects;
